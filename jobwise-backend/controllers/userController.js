import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, skills } = req.body;

    const updates = {};

    // Name & Email
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();

    // Password
    if (password && password.length >= 6) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // Avatar
    if (req.file) {
      updates.avatar = req.file.filename;
    }

    // Skills (from JSON string in FormData)
    if (skills) {
      let parsedSkills = [];
      try {
        parsedSkills = Array.isArray(skills) ? skills : JSON.parse(skills);
      } catch {
        parsedSkills = [];
      }

      if (Array.isArray(parsedSkills)) {
        updates.skills = parsedSkills
          .map((s) => String(s).trim())
          .filter((s) => s.length > 0);
      }
    }

    // Never allow role changes here
    delete updates.role;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
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
