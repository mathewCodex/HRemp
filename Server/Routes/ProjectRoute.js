import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const router = express.Router();

// Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  completion_date: {
    type: Date
  },
  start_date: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: new mongoose.Types.ObjectId('000000000000000000000001') // Default admin ID
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create the model
const Project = mongoose.model('Project', projectSchema);

/**
 * GET /projects/ongoing
 * Retrieve projects created within the last week.
 */
router.get("/ongoing", async (req, res) => {
  try {
    await connectDB();
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const projects = await Project.find({
      created_at: { $gte: oneWeekAgo }
    })
    .sort({ start_date: 1 })
    .populate('client_id', 'name email')
    .populate('created_by', 'name email');
    
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching ongoing projects:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /projects
 * Retrieve all projects.
 */
router.get("/", async (req, res) => {
  try {
    await connectDB();
    
    const projects = await Project.find({})
    .sort({ _id: 1 })
    .populate('client_id', 'name email')
    .populate('created_by', 'name email');
    
    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * GET /projects/:id
 * Retrieve a single project by ID.
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    await connectDB();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid project ID format" 
      });
    }
    
    const project = await Project.findById(id)
    .populate('client_id', 'name email')
    .populate('created_by', 'name email');
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: "Project not found" 
      });
    }
    
    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * POST /projects
 * Create a new project.
 * Example body: { 
 *   "title": "New Project", 
 *   "description": "Some details", 
 *   "status": "Not Started", 
 *   "completion_date": "2025-12-31", 
 *   "start_date": "2025-01-01", 
 *   "priority": "Medium", 
 *   "client_id": "507f1f77bcf86cd799439011" 
 * }
 */
router.post("/", async (req, res) => {
  const {
    title,
    description,
    status,
    completion_date,
    start_date,
    priority,
    client_id,
    created_by
  } = req.body;

  try {
    await connectDB();
    
    // Validate required fields
    if (!title || !start_date || !client_id) {
      return res.status(400).json({
        success: false,
        message: "Title, start_date, and client_id are required"
      });
    }
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(client_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client_id format"
      });
    }
    
    if (created_by && !mongoose.Types.ObjectId.isValid(created_by)) {
      return res.status(400).json({
        success: false,
        message: "Invalid created_by format"
      });
    }
    
    const projectData = {
      title,
      description,
      status,
      completion_date: completion_date ? new Date(completion_date) : undefined,
      start_date: new Date(start_date),
      priority,
      client_id: new mongoose.Types.ObjectId(client_id),
      created_by: created_by ? new mongoose.Types.ObjectId(created_by) : undefined
    };
    
    const project = new Project(projectData);
    const savedProject = await project.save();
    
    // Populate the saved project before returning
    await savedProject.populate('client_id', 'name email');
    await savedProject.populate('created_by', 'name email');
    
    res.status(201).json({ success: true, project: savedProject });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * PUT /projects/:id
 * Update a project by ID.
 * Example body: { 
 *   "title": "Updated Project", 
 *   "description": "Updated details", 
 *   "status": "In Progress", 
 *   "completion_date": "2025-12-31", 
 *   "start_date": "2025-01-01", 
 *   "priority": "High", 
 *   "client_id": "507f1f77bcf86cd799439011" 
 * }
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    completion_date,
    start_date,
    priority,
    client_id
  } = req.body;

  try {
    await connectDB();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }
    
    // Validate client_id if provided
    if (client_id && !mongoose.Types.ObjectId.isValid(client_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client_id format"
      });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (completion_date !== undefined) updateData.completion_date = completion_date ? new Date(completion_date) : null;
    if (start_date !== undefined) updateData.start_date = new Date(start_date);
    if (priority !== undefined) updateData.priority = priority;
    if (client_id !== undefined) updateData.client_id = new mongoose.Types.ObjectId(client_id);
    
    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('client_id', 'name email')
    .populate('created_by', 'name email');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * DELETE /projects/:id
 * Delete a project by ID.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format"
      });
    }
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export { router as projectRouter, Project };