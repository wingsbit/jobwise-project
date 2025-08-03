// jobwise-backend/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../models/User.js";

// 🔑 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("💥 Register error:", error);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// 📌 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// 📌 LOGOUT
export const logoutUser = (req, res) => {
  res.json({ msg: "Logout successful. Remove token from client." });
};

// 📌 GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("💥 GetMe error:", error);
    res.status(500).json({ msg: "Server error fetching user data" });
  }
};

// 📌 UPLOAD AVATAR
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldPath = path.join(process.cwd(), "uploads", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new avatar filename
    user.avatar = req.file.filename;
    await user.save();

    res.json({
      msg: "Avatar uploaded successfully",
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("💥 Upload avatar error:", error);
    res.status(500).json({ msg: "Error uploading avatar" });
  }
};

// 📌 UPDATE PROFILE
export const updateUser = async (req, res) => {
  try {
    const { name, password, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(password, 10);
    }
    if (avatar) updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("💥 Update profile error:", error);
    res.status(500).json({ msg: "Error updating profile" });
  }
};
