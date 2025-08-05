import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Rejected", "Hired"],
      default: "Pending",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["seeker", "jobseeker", "recruiter"],
      default: "seeker",
    },
    skills: {
      type: [String],
      default: [],
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    appliedJobs: [appliedJobSchema],
    resume: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
