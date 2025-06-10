import mongoose from "mongoose";

const TaskAssignmentSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, "Task ID is required"],
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "Employee ID is required"],
    },
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "Assigned by is required"],
    },
    role: {
      type: String,
      enum: {
        values: ['assignee', 'reviewer', 'collaborator', 'observer'],
        message: '{VALUE} is not a valid role'
      },
      default: 'assignee',
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'removed'],
        message: '{VALUE} is not a valid assignment status'
      },
      default: 'active',
      lowercase: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: { 
      createdAt: 'assigned_at', 
      updatedAt: 'updated_at' 
    }
  }
);

// Compound index to prevent duplicate assignments
TaskAssignmentSchema.index({ task_id: 1, employee_id: 1 }, { unique: true });

// Indexes for better query performance
TaskAssignmentSchema.index({ task_id: 1 });
TaskAssignmentSchema.index({ employee_id: 1 });
TaskAssignmentSchema.index({ assigned_by: 1 });
TaskAssignmentSchema.index({ status: 1 });

// Virtual to populate task details
TaskAssignmentSchema.virtual('task', {
  ref: 'Task',
  localField: 'task_id',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate employee details
TaskAssignmentSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employee_id',
  foreignField: '_id',
  justOne: true
});

const TaskAssignment = mongoose.model("TaskAssignment", TaskAssignmentSchema);

export default TaskAssignment;