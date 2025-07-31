import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  avatar: { type: String, default: "" } // ✅ Added avatar field
}, {
  timestamps: true // Optional: adds createdAt & updatedAt
});

export default mongoose.model('User', userSchema);
