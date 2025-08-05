// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Prepare updates object
    const updates = {};

    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (password && password.length >= 6) {
      updates.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      updates.avatar = req.file.filename;
    }

    // ✅ Do not allow role change here
    // So we never touch req.body.role

    // Update only provided fields
    const user = await User.findByIdAndUpdate(
      req.userId, // set in verifyToken
      { $set: updates },
      { new: true, runValidators: true } // validate only updated fields
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    next(error);
  }
};
