import express from "express";
import Notification from "../models/Notification.js"; // You'll need to create this model

const router = express.Router();

// GET /notifications - Fetch all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ created_at: -1 }) // Sort by created_at descending
      .populate('recipient_id', 'name email') // Populate recipient details if needed
      .populate('sender_id', 'name email'); // Populate sender details if needed

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /notifications/:userId - Fetch notifications for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ recipient_id: userId })
      .sort({ created_at: -1 })
      .populate('sender_id', 'name email');

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST /notifications - Create a new notification
router.post("/", async (req, res) => {
  const { 
    message, 
    recipient_id, 
    sender_id, 
    type = 'general',
    title,
    data 
  } = req.body;

  // Validate required fields
  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  try {
    const newNotification = new Notification({
      message,
      recipient_id,
      sender_id,
      type,
      title,
      data,
    });

    const savedNotification = await newNotification.save();
    
    // Populate the saved notification with sender details
    const populatedNotification = await Notification.findById(savedNotification._id)
      .populate('sender_id', 'name email')
      .populate('recipient_id', 'name email');

    res.status(201).json({ 
      success: true, 
      notification: populatedNotification 
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// PUT /notifications/:notificationId/read - Mark notification as read
router.put("/:notificationId/read", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { 
        is_read: true,
        read_at: new Date()
      },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      notification: updatedNotification 
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// PUT /notifications/mark-all-read/:userId - Mark all notifications as read for a user
router.put("/mark-all-read/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Notification.updateMany(
      { recipient_id: userId, is_read: false },
      { 
        is_read: true,
        read_at: new Date()
      }
    );

    res.status(200).json({ 
      success: true, 
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// DELETE /notifications/:notificationId - Delete a notification
router.delete("/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Notification deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid notification ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /notifications/unread/:userId - Get unread notification count for a user
router.get("/unread/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadCount = await Notification.countDocuments({
      recipient_id: userId,
      is_read: false
    });

    res.status(200).json({ 
      success: true, 
      unreadCount 
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export { router as notificationRouter };