import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";
import { io } from "../index.js";

const router = express.Router();

// Task Schema
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started',
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assigned_employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Employee Schema (if not already defined)
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
});

// Category Schema (for employee roles)
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create models with safe pattern to prevent OverwriteModelError
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

/**
 * PUT /tasks/:taskId
 * Update a task.
 */
router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { description, deadline, status, employee_ids, project_id } = req.body;

  // Validate required fields
  if (!description || !deadline || !status || !project_id) {
    return res.status(400).json({
      success: false,
      message: "Description, deadline, status, and project ID are required",
    });
  }

  try {
    await connectDB();

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }

    // Validate employee IDs
    if (employee_ids && employee_ids.length > 0) {
      const invalidIds = employee_ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID format"
        });
      }
    }

    // 1. Check if task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    // 2. Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        description,
        deadline: new Date(deadline),
        status,
        project_id: new mongoose.Types.ObjectId(project_id),
        assigned_employees: employee_ids ? employee_ids.map(id => new mongoose.Types.ObjectId(id)) : []
      },
      { new: true, runValidators: true }
    ).populate('assigned_employees', 'name')
     .populate('project_id', 'title');

    // 3. Real-time notifications after task update
    if (updatedTask.assigned_employees && updatedTask.assigned_employees.length > 0) {
      updatedTask.assigned_employees.forEach((employee) => {
        io.to(`user_${employee._id}`).emit("taskUpdated", {
          taskId,
          status,
          message: `Task #${taskId} has been updated`,
        });
      });
    }

    // 4. Format response to match original structure
    const responseTask = {
      ...updatedTask.toObject(),
      task_id: updatedTask._id,
      employee_ids: updatedTask.assigned_employees.map(emp => emp._id),
      employee_names: updatedTask.assigned_employees.map(emp => emp.name)
    };

    return res.status(200).json({ success: true, task: responseTask });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * POST /tasks
 * Create a new task.
 */
router.post("/", async (req, res) => {
  const { description, deadline, status, employee_ids, project_id } = req.body;

  // Validate required fields
  if (!description || !deadline || !status || !project_id) {
    return res.status(400).json({
      success: false,
      message: "Description, deadline, status, and project ID are required",
    });
  }

  try {
    await connectDB();

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }

    if (employee_ids && employee_ids.length > 0) {
      const invalidIds = employee_ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID format"
        });
      }
    }

    // 1. Create the new task
    const taskData = {
      description,
      deadline: new Date(deadline),
      status,
      project_id: new mongoose.Types.ObjectId(project_id),
      assigned_employees: employee_ids ? employee_ids.map(id => new mongoose.Types.ObjectId(id)) : []
    };

    const newTask = new Task(taskData);
    const savedTask = await newTask.save();

    // Populate the saved task
    await savedTask.populate('assigned_employees', 'name');
    await savedTask.populate('project_id', 'title');

    // 2. Real-time notifications after task creation
    if (savedTask.assigned_employees && savedTask.assigned_employees.length > 0) {
      savedTask.assigned_employees.forEach((employee) => {
        io.to(`user_${employee._id}`).emit("taskAssigned", {
          taskId: savedTask._id,
          status,
          message: `Task #${savedTask._id} has been assigned to you`,
        });
      });
    }

    // 3. Format response to match original structure
    const responseTask = {
      ...savedTask.toObject(),
      task_id: savedTask._id,
      employee_ids: savedTask.assigned_employees.map(emp => emp._id),
      employee_names: savedTask.assigned_employees.map(emp => emp.name)
    };

    return res.status(201).json({ success: true, task: responseTask });
  } catch (error) {
    console.error("Error creating task:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * DELETE /tasks/:taskId
 * Delete a task.
 */
router.delete("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }

    // Find and delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId)
      .populate('assigned_employees', 'name');

    if (!deletedTask) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    // Notify all assigned employees about task deletion
    if (deletedTask.assigned_employees && deletedTask.assigned_employees.length > 0) {
      deletedTask.assigned_employees.forEach((employee) => {
        io.to(`user_${employee._id}`).emit("taskDeleted", {
          taskId,
          message: `Task #${taskId} has been deleted`,
        });
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Task deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * PATCH /tasks/:taskId/reassign
 * Reassign a task to different employees.
 */
router.patch("/:taskId/reassign", async (req, res) => {
  const { taskId } = req.params;
  const { employee_ids } = req.body;

  if (!employee_ids || employee_ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Employee IDs are required for reassignment",
    });
  }

  try {
    await connectDB();

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }

    const invalidIds = employee_ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format"
      });
    }

    // Update task assignments
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        assigned_employees: employee_ids.map(id => new mongoose.Types.ObjectId(id))
      },
      { new: true }
    ).populate('assigned_employees', 'name');

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Real-time notifications after task reassignment
    if (updatedTask.assigned_employees && updatedTask.assigned_employees.length > 0) {
      updatedTask.assigned_employees.forEach((employee) => {
        io.to(`user_${employee._id}`).emit("taskReassigned", {
          taskId,
          message: `Task #${taskId} has been reassigned`,
        });
      });
    }

    const assignedEmployeeIds = updatedTask.assigned_employees.map(emp => emp._id);
    const assignedEmployeeNames = updatedTask.assigned_employees.map(emp => emp.name);

    return res.status(200).json({
      success: true,
      message: "Task reassigned successfully",
      employee_ids: assignedEmployeeIds,
      employee_names: assignedEmployeeNames,
    });
  } catch (error) {
    console.error("Error reassigning task:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /tasks/list
 * Route to fetch all employees with their roles
 */
router.get("/list", async (req, res) => {
  try {
    await connectDB();
    
    const employees = await Employee.find({})
      .populate('category_id', 'name')
      .sort({ _id: 1 })
      .select('_id name category_id');

    const formattedEmployees = employees.map(emp => ({
      id: emp._id,
      name: emp.name,
      role: emp.category_id ? emp.category_id.name : 'No Role'
    }));

    res.status(200).json({ success: true, employees: formattedEmployees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/**
 * GET /tasks
 * Retrieve all tasks, optionally filtered by project_id
 */
router.get("/", async (req, res) => {
  try {
    await connectDB();
    
    const { project_id } = req.query;
    let filter = {};

    if (project_id && mongoose.Types.ObjectId.isValid(project_id)) {
      filter.project_id = new mongoose.Types.ObjectId(project_id);
    }

    const tasks = await Task.find(filter)
      .populate('assigned_employees', 'name')
      .populate('project_id', 'title')
      .sort({ deadline: 1 });

    const formattedTasks = tasks.map(task => ({
      task_id: task._id,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      project_id: task.project_id._id,
      created_at: task.created_at,
      updated_at: task.updated_at,
      employee_ids: task.assigned_employees.map(emp => emp._id),
      employee_names: task.assigned_employees.map(emp => emp.name)
    }));

    return res.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /tasks/ongoing
 * Retrieve ongoing tasks with assigned user information.
 */
router.get("/ongoing", async (req, res) => {
  try {
    await connectDB();
    
    const tasks = await Task.find({ status: { $ne: 'Completed' } })
      .populate('assigned_employees', 'name')
      .populate('project_id', 'title')
      .sort({ deadline: 1 });

    const formattedTasks = tasks.map(task => ({
      task_id: task._id,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      project_id: task.project_id._id,
      created_at: task.created_at,
      updated_at: task.updated_at,
      employee_ids: task.assigned_employees.map(emp => emp._id),
      employee_names: task.assigned_employees.map(emp => emp.name)
    }));

    return res.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching ongoing tasks:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * PUT /tasks/:taskId/status
 * Update task status only (to avoid conflict with the full update route)
 */
router.put("/:taskId/status", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  // Validate required fields
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }

    // Check if task exists and update
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    ).populate('assigned_employees', 'name');

    if (!updatedTask) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    // Real-time notifications after task update
    if (updatedTask.assigned_employees && updatedTask.assigned_employees.length > 0) {
      updatedTask.assigned_employees.forEach((employee) => {
        io.to(`user_${employee._id}`).emit("taskUpdated", {
          taskId,
          status,
          message: `Task #${taskId} has been updated`,
        });
      });
    }

    const responseTask = {
      ...updatedTask.toObject(),
      task_id: updatedTask._id
    };

    return res.status(200).json({ success: true, task: responseTask });
  } catch (error) {
    console.error("Error updating task:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /tasks/employee/:employeeId
 * Retrieve tasks assigned to a specific employee.
 */
router.get("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    await connectDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format"
      });
    }

    const tasks = await Task.find({ 
      assigned_employees: new mongoose.Types.ObjectId(employeeId) 
    })
    .populate('project_id', 'title')
    .sort({ deadline: 1 });

    const formattedTasks = tasks.map(task => ({
      task_id: task._id,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
      project_id: task.project_id._id,
      project_title: task.project_id.title,
      created_at: task.created_at,
      updated_at: task.updated_at
    }));

    return res.json({ success: true, tasks: formattedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export { router as taskRouter, Task, Employee, Category };