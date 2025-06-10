import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status'
      },
      default: 'pending',
      lowercase: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium',
      lowercase: true,
    },
    due_date: {
      type: Date,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    estimated_hours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
    },
    actual_hours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
  }
);

// Indexes for better query performance
TaskSchema.index({ status: 1 });
TaskSchema.index({ due_date: 1 });
TaskSchema.index({ project_id: 1 });
TaskSchema.index({ client_id: 1 });
TaskSchema.index({ created_by: 1 });

// Virtual for task assignments
TaskSchema.virtual('assignments', {
  ref: 'TaskAssignment',
  localField: '_id',
  foreignField: 'task_id'
});

// Check if model already exists before creating it
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;