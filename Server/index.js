// import express from "express";
// import cors from "cors";
// import { adminRouter } from "./Routes/AdminRoute.js";
// import { employeeRouter } from "./Routes/EmployeeRoute.js";
// import { projectRouter } from "./Routes/ProjectRoute.js";
// import { taskRouter } from "./Routes/TaskRoute.js";
// import { clientsRouter } from "./Routes/ClientsRoute.js";
// import { taskStatusRouter } from "./Routes/TaskStatusRoute.js";
// import { notificationRouter } from "./Routes/NotificationsRoute.js";
// import { attendanceRouter } from "./Routes/AttendanceRoute.js";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import http from "http";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
// import connectDB from './utils/db.js';

// // Load environment variables
// dotenv.config();

// const app = express();

// // Database connection
// connectDB();

// // Middleware setup
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static("Public"));

// // Middleware to verify user authentication
// const verifyUser = (req, res, next) => {
//   const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  
//   if (!token) {
//     return res.status(401).json({ Status: false, Error: "Not Authenticated" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ Status: false, Error: "Invalid Token" });
//     }

//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) {
//       return res.status(404).json({ Status: false, Error: "User not found" });
//     }

//     req.role = decoded.role;
//     req.id = decoded.id;
//     next();
//   });
// };

// // Routes setup
// app.use("/api/auth", adminRouter);
// app.use("/api/employee", employeeRouter);
// app.use("/api/projects", projectRouter);
// app.use("/api/tasks", taskRouter);
// app.use("/api/clients", clientsRouter);
// app.use("/api/taskstatus", taskStatusRouter);
// app.use("/api/notifications", notificationRouter);
// app.use("/api/attendance", attendanceRouter);

// // Verify route
// app.get("/verify", verifyUser, (req, res) => {
//   return res.json({ Status: true, role: req.role, id: req.id });
// });

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "healthy",
//     timestamp: new Date().toISOString()
//   });
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.io
// export const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   },
// });

// // Socket.io connection handler
// io.on("connection", (socket) => {
//   console.log(`User connected with socket ID: ${socket.id}`);

//   // Listen for a "join" event to place a user in a room
//   socket.on("join", (userId) => {
//     socket.join(`user_${userId}`);
//     console.log(`Socket ${socket.id} joined room user_${userId}`);
//   });

//   // Add error handling for Socket.io
//   socket.on("error", (err) => {
//     console.error("Socket Error:", err);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected with socket ID: ${socket.id}`);
//   });
// });

// // In server.js add:
// app.get('/api/debug/cookies', (req, res) => {
//   res.json({
//     cookies: req.cookies,
//     headers: req.headers
//   });
// });

// // Start server on port
// const port = process.env.PORT || 5000;
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
//   console.log(`CORS configured for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
// });

import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { employeeRouter } from "./Routes/EmployeeRoute.js";
import { projectRouter } from "./Routes/ProjectRoute.js";
import { taskRouter } from "./Routes/TaskRoute.js";
import { clientsRouter } from "./Routes/ClientsRoute.js";
import { taskStatusRouter } from "./Routes/TaskStatusRoute.js";
import { notificationRouter } from "./Routes/NotificationsRoute.js";
import { attendanceRouter } from "./Routes/AttendanceRoute.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from './utils/db.js';

// Load environment variables
dotenv.config();

const app = express();

// Database connection
connectDB();

// Import User model (you'll need to create this based on your schema)
// This is a placeholder - replace with your actual User model
import User from './models/User.js'; // Adjust path as needed

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
    
    // Find user by ID from token
    const user = await User.findById(decoded.id).select('-password');
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
app.use("/api/auth", adminRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/taskstatus", taskStatusRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/attendance", attendanceRouter);

// Verify route - Updated to match frontend expectations
app.get("/api/verify", verifyUser, (req, res) => {
  return res.json({ 
    Status: true, 
    success: true,
    role: req.role, 
    id: req.id,
    user: req.user
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// This goes in your backend routes file (e.g., routes/auth.js)

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
  console.log(`Server is running on port ${port}`);
  console.log(`CORS configured for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});