import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) throw new Error("Mongo URI not found in env")

    mongoose.set("strictQuery", true)
    await mongoose.connect(uri)

    console.log("✅ MongoDB Connected")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

export default connectDB
