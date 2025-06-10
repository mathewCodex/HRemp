import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { employeeRouter } from "./Routes/EmployeeRoute.js";
import { projectRouter } from "./Routes/ProjectRoute.js";
import { taskRouter } from "./Routes/TaskRoute.js";
import { clientsRouter } from "./Routes/ClientsRoute.js";
import { taskStatusRouter } from "./Routes/TaskStatusRoute.js";
import { notificationRouter } from "./Routes/NotificationRoute.js";
import { attendanceRouter } from "./Routes/AttendanceRoute.js";
import { leaveRouter } from "./Routes/LeaveRouter.js";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB, getDB } from './utils/db.js'; // Changed this line
import { ObjectId } from 'mongodb';

// Load environment variables
dotenv.config();

const app = express();

// Initialize database connection
const initializeServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

// Initialize the database connection
await initializeServer();

// Middleware setup
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));

// Middleware to verify user authentication
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ Status: false, Error: "Not Authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get database instance
    const db = getDB();
    
    // Find user by ID from token using raw MongoDB
    const user = await db.collection("employees").findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return res.status(404).json({ Status: false, Error: "User not found", success: false });
    }

    req.user = user;
    req.role = decoded.role || user.role;
    req.id = decoded.id;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ Status: false, Error: "Invalid Token", success: false });
  }
};

// Routes setup
// Routes setup with verifyUser  middleware
app.use("/api/auth", adminRouter); // Assuming auth routes don't need verification
app.use("/api/employee", verifyUser , employeeRouter);
app.use("/api/projects", verifyUser , projectRouter);
app.use("/api/tasks", verifyUser , taskRouter);
app.use("/api/clients", verifyUser , clientsRouter);
app.use("/api/taskstatus", verifyUser , taskStatusRouter);
app.use("/api/notification", verifyUser , notificationRouter);
app.use("/api/attendance", verifyUser , attendanceRouter);
app.use("/api/leave", verifyUser , leaveRouter);

app.get('/api/verify', (req, res) => {
  try {
    // Check for token in cookies (since you're using withCredentials: true)
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.json({ 
        Status: false, 
        message: 'No token provided' 
      });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret', (err, decoded) => {
      if (err) {
        return res.json({ 
          Status: false, 
          message: 'Invalid token' 
        });
      }

      // Token is valid
      res.json({ 
        Status: true, 
        message: 'Authenticated',
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name
        },
        role: decoded.role
      });
    });

  } catch (error) {
    console.error('Verify endpoint error:', error);
    res.json({ 
      Status: false, 
      message: 'Server error' 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "connected"
  });
});

// Debug endpoint for cookies
app.get('/api/debug/cookies', (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });

  socket.on("error", (err) => {
    console.error("Socket Error:", err);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with socket ID: ${socket.id}`);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    Status: false,
    Error: 'Internal Server Error'
  });
});



// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌐 CORS configured for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  console.log(`📊 Health check available at: http://localhost:${port}/health`);
});

