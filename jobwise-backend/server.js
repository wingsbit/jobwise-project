import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import helmet from "helmet"
import morgan from "morgan"
import compression from "compression"
import rateLimit from "express-rate-limit"

import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import advisorRoutes from "./routes/advisorRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"

// ---------- App & Paths ----------
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Behind a proxy on Render/Railway/etc.
app.set("trust proxy", 1)

// ---------- Security / DX Middlewares ----------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
)

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(compression())

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

// Global API rate limiter
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

// ---------- Static ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// ---------- Healthcheck ----------
app.get("/health", (_req, res) => res.status(200).json({ ok: true }))

// ---------- Routes ----------
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/advisor", advisorRoutes)

// ---------- Errors ----------
app.use(errorHandler)

// ---------- Start Server AFTER DB ----------
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || "127.0.0.1" // bind to IPv4 explicitly (Windows-friendly)

connectDB()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ DB connect failed:", err?.message || err)
    process.exit(1)
  })
