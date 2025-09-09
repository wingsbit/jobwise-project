// seed.js
import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

import connectDB from "./config/db.js"
import User from "./models/User.js"
import Company from "./models/Company.js"
import Job from "./models/Job.js"

dotenv.config()

async function seed() {
  try {
    await connectDB()

    // Clear existing data (optional)
    await Promise.all([User.deleteMany(), Company.deleteMany(), Job.deleteMany()])

    // Create a recruiter user
    const passwordHash = await bcrypt.hash("password123", 10)
    const recruiter = await User.create({
      name: "Recruiter One",
      email: "recruiter@example.com",
      password: passwordHash,
      role: "recruiter",
    })

    // Create a company owned by that recruiter
    const company = await Company.create({
      name: "TechCorp",
      website: "https://techcorp.com",
      description: "A cutting-edge tech company",
      owner: recruiter._id,
    })

    // Create some jobs
    const jobs = await Job.insertMany([
      {
        title: "Frontend Developer",
        description: "Build amazing UIs with React.",
        location: "Berlin",
        salary: "4000",
        skills: ["React", "JavaScript", "CSS"],
        createdBy: recruiter._id,
        company: company._id,
      },
      {
        title: "Backend Engineer",
        description: "Design scalable APIs with Node.js.",
        location: "Remote",
        salary: "4500",
        skills: ["Node.js", "MongoDB", "Express"],
        createdBy: recruiter._id,
        company: company._id,
      },
      {
        title: "Full-stack Developer",
        description: "Work on both frontend and backend.",
        location: "New York",
        salary: "5000",
        skills: ["React", "Node.js", "GraphQL"],
        createdBy: recruiter._id,
        company: company._id,
      },
      {
        title: "DevOps Engineer",
        description: "Automate infrastructure & CI/CD.",
        location: "Remote",
        salary: "4800",
        skills: ["AWS", "Docker", "Kubernetes"],
        createdBy: recruiter._id,
        company: company._id,
      },
      {
        title: "AI Engineer",
        description: "Build ML models for production.",
        location: "San Francisco",
        salary: "6000",
        skills: ["Python", "TensorFlow", "ML"],
        createdBy: recruiter._id,
        company: company._id,
      },
    ])

    console.log("✅ Seed complete!")
    console.log("Recruiter:", recruiter.email)
    console.log("Company:", company.name)
    console.log("Jobs:", jobs.map((j) => j.title).join(", "))

    process.exit(0)
  } catch (err) {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  }
}

seed()
