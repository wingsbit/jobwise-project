// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// CORS CONFIG
// =============================
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend dev server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allows JWT tokens
  })
);

// =============================
// Middlewares
// =============================
app.use(express.json());
app.use(cookieParser());

// Log incoming requests (dev helper)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files for uploaded avatars
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// API Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// =============================
// Fallback error handler
// =============================
app.use((err, req, res, next) => {
  console.error("💥 Server error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
});

// =============================
// Database connection
// =============================
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
