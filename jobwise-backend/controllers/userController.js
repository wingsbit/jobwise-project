// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, skills } = req.body;
    const updates = {};

    // Name
    if (name) updates.name = name.trim();

    // Email
    if (email) updates.email = email.toLowerCase().trim();

    // Password
    if (password && password.length >= 6) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // Avatar file
    if (req.file) {
      updates.avatar = req.file.filename;
    }

    // Skills (comes as JSON string from FormData)
    if (skills) {
      try {
        const parsedSkills = JSON.parse(skills)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        updates.skills = [...new Set(parsedSkills.map((s) => s.toLowerCase()))]; // unique + lowercase
      } catch (err) {
        console.warn("⚠️ Could not parse skills:", err);
      }
    }

    // ❌ Do NOT allow role change here
    // updates.role is never touched

    const user = await User.findByIdAndUpdate(
      req.userId, // set in verifyToken middleware
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
  }
};
