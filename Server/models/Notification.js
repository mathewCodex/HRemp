import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: {
        values: [
          'general', 
          'task_assigned', 
          'task_updated', 
          'task_completed',
          'project_update',
          'system_alert',
          'reminder',
          'deadline_approaching'
        ],
        message: '{VALUE} is not a valid notification type'
      },
      default: 'general',
      lowercase: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "Recipient is required"],
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    read_at: {
      type: Date,
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
    // Additional data that can be stored as JSON (e.g., task_id, project_id, etc.)
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // URL to redirect when notification is clicked
    action_url: {
      type: String,
      trim: true,
    },
    // Expiration date for the notification
    expires_at: {
      type: Date,
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
NotificationSchema.index({ recipient_id: 1, is_read: 1 });
NotificationSchema.index({ created_at: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ expires_at: 1 });

// Index for cleaning up expired notifications
NotificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if notification is expired
NotificationSchema.virtual('isExpired').get(function() {
  return this.expires_at && this.expires_at < new Date();
});

// Static method to create a notification
NotificationSchema.statics.createNotification = async function(notificationData) {
  try {
    const notification = new this(notificationData);
    return await notification.save();
  } catch (error) {
    throw error;
  }
};

// Static method to mark notification as read
NotificationSchema.statics.markAsRead = async function(notificationId) {
  try {
    return await this.findByIdAndUpdate(
      notificationId,
      { 
        is_read: true,
        read_at: new Date()
      },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

// Static method to get unread count for a user
NotificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    return await this.countDocuments({
      recipient_id: userId,
      is_read: false
    });
  } catch (error) {
    throw error;
  }
};

// Instance method to mark this notification as read
NotificationSchema.methods.markRead = async function() {
  this.is_read = true;
  this.read_at = new Date();
  return await this.save();
};

// Pre-save middleware to set read_at when is_read becomes true
NotificationSchema.pre('save', function(next) {
  if (this.isModified('is_read') && this.is_read && !this.read_at) {
    this.read_at = new Date();
  }
  next();
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;