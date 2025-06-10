import express from "express";
import Task from "../models/Task.js"; // You'll need to create this model
import TaskAssignment from "../models/TaskAssignment.js"; // You'll need to create this model
import { io } from "../index.js";

const router = express.Router();

/**
 * PUT /taskstatus/:taskId
 * Update the status of a task.
 */
router.put("/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  // Validate required fields
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  // Validate status value (optional - add your valid statuses)
  const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    // 1. Check if task exists and fetch it
    const task = await Task.findById(taskId);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // 2. Update the task status
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { 
        status: status,
        updated_at: new Date()
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    // 3. Get all assigned employees for real-time notifications
    const taskAssignments = await TaskAssignment.find({ task_id: taskId });

    // Notify all assigned employees
    taskAssignments.forEach((assignment) => {
      io.to(`user_${assignment.employee_id}`).emit("taskUpdated", {
        taskId,
        status,
        message: `Task #${taskId} has been updated`,
        updatedTask: updatedTask
      });
    });

    return res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid task ID format" 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /taskstatus/:taskId
 * Get the current status of a task.
 */
router.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId).select('status updated_at');
    
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({ 
      success: true, 
      status: task.status,
      lastUpdated: task.updated_at
    });
  } catch (error) {
    console.error("Error fetching task status:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid task ID format" 
      });
    }
    
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export { router as taskStatusRouter };