// jobwise-backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import advisorRoutes from "./routes/advisorRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// CORS
// =============================
app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =============================
// Middlewares
// =============================
app.use(express.json());
app.use(cookieParser());

// =============================
// Serve uploaded images
// =============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// Debug requests
// =============================
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// =============================
// API Routes
// =============================
app.use("/api/auth", authRoutes); // login, register, logout, getMe
app.use("/api/users", userRoutes); // profile update, avatar upload, saved jobs
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/advisor", advisorRoutes);

// =============================
// Error handler
// =============================
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// =============================
// Start server
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
