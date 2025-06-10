import mongoose from "mongoose";

const ClockRecordSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "Employee ID is required"],
    },
    clock_in: {
      type: Date,
      required: [true, "Clock in time is required"],
    },
    clock_out: {
      type: Date,
    },
    break_start: {
      type: Date,
    },
    break_end: {
      type: Date,
    },
    total_hours: {
      type: Number,
      min: [0, "Total hours cannot be negative"],
    },
    break_duration: {
      type: Number,
      min: [0, "Break duration cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['clocked_in', 'on_break', 'clocked_out'],
        message: '{VALUE} is not a valid status'
      },
      default: 'clocked_in',
    },
    work_type: {
      type: String,
      enum: {
        values: ['office', 'remote', 'hybrid', 'field_work'],
        message: '{VALUE} is not a valid work type'
      },
      default: 'office',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      }
    },
    ip_address: {
      type: String,
      trim: true,
    },
    device_info: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    overtime_hours: {
      type: Number,
      min: [0, "Overtime hours cannot be negative"],
      default: 0,
    },
    // For tracking late arrivals
    expected_clock_in: {
      type: Date,
    },
    is_late: {
      type: Boolean,
      default: false,
    },
    late_duration: {
      type: Number, // in minutes
      min: [0, "Late duration cannot be negative"],
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
ClockRecordSchema.index({ employee_id: 1, clock_in: -1 });
ClockRecordSchema.index({ clock_in: 1 });
ClockRecordSchema.index({ status: 1 });
ClockRecordSchema.index({ work_type: 1 });

// Geospatial index for location-based queries
ClockRecordSchema.index({ location: '2dsphere' });

// Compound index for date-based attendance queries
ClockRecordSchema.index({ 
  clock_in: 1, 
  employee_id: 1 
});

// Virtual for calculating work duration
ClockRecordSchema.virtual('workDuration').get(function() {
  if (this.clock_in && this.clock_out) {
    const duration = (this.clock_out - this.clock_in) / (1000 * 60 * 60); // in hours
    return Math.round(duration * 100) / 100; // Round to 2 decimal places
  }
  return 0;
});

// Virtual for checking if currently working
ClockRecordSchema.virtual('isCurrentlyWorking').get(function() {
  return this.clock_in && !this.clock_out;
});

// Static method to get today's attendance
ClockRecordSchema.statics.getTodayAttendance = async function() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return await this.find({
    clock_in: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).populate('employee_id', 'name email department');
};

// Static method to clock in an employee
ClockRecordSchema.statics.clockIn = async function(employeeId, data = {}) {
  try {
    // Check if employee is already clocked in today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existingRecord = await this.findOne({
      employee_id: employeeId,
      clock_in: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      clock_out: { $exists: false }
    });

    if (existingRecord) {
      throw new Error('Employee is already clocked in');
    }

    // Create new clock record
    const clockRecord = new this({
      employee_id: employeeId,
      clock_in: new Date(),
      status: 'clocked_in',
      ...data
    });

    return await clockRecord.save();
  } catch (error) {
    throw error;
  }
};

// Static method to clock out an employee
ClockRecordSchema.statics.clockOut = async function(employeeId) {
  try {
    // Find today's clock in record
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const clockRecord = await this.findOne({
      employee_id: employeeId,
      clock_in: { $gte: startOfDay },
      clock_out: { $exists: false }
    });

    if (!clockRecord) {
      throw new Error('No active clock record found');
    }

    // Update with clock out time
    clockRecord.clock_out = new Date();
    clockRecord.status = 'clocked_out';
    
    // Calculate total hours
    const workDuration = (clockRecord.clock_out - clockRecord.clock_in) / (1000 * 60 * 60);
    clockRecord.total_hours = Math.round(workDuration * 100) / 100;

    return await clockRecord.save();
  } catch (error) {
    throw error;
  }
};

// Pre-save middleware to calculate late arrival
ClockRecordSchema.pre('save', function(next) {
  if (this.expected_clock_in && this.clock_in) {
    const lateDuration = (this.clock_in - this.expected_clock_in) / (1000 * 60); // in minutes
    if (lateDuration > 0) {
      this.is_late = true;
      this.late_duration = Math.round(lateDuration);
    }
  }
  next();
});

const ClockRecord = mongoose.model("ClockRecord", ClockRecordSchema);

export default ClockRecord;