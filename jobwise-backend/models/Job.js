import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    skills: [String],
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // ✅ inside schema
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 🔎 Full-text search index for efficient queries
jobSchema.index(
  { title: "text", description: "text", skills: "text", location: "text" },
  { weights: { title: 5, skills: 3, description: 2, location: 1 } }
);

export default mongoose.model("Job", jobSchema);
