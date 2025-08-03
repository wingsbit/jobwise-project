import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

// ✅ Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register user
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

    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar || null,
      },
    });
  } catch (err) {
    console.error("💥 Signup error:", err);
    res.status(500).json({ msg: "Signup failed internally" });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ msg: "Login failed internally" });
  }
};

// ✅ Logout user
export const logoutUser = (req, res) => {
  res.json({ msg: "Logout successful (client should clear token)" });
};

// ✅ Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user" });
  }
};

// ✅ Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filename = req.file.filename;

    // Remove old avatar if exists
    const user = await User.findById(req.user.id);
    if (user?.avatar && user.avatar !== filename) {
      const oldPath = path.join("uploads", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new avatar in DB
    user.avatar = filename;
    await user.save();

    res.json({ filename });
  } catch (err) {
    console.error("💥 Avatar upload error:", err);
    res.status(500).json({ msg: "Failed to upload avatar" });
  }
};

// ✅ Update user (name, password, avatar)
export const updateUser = async (req, res) => {
  try {
    const { name, password, avatar } = req.body;

    if (!name && !password && !avatar) {
      return res.status(400).json({ msg: "Please provide a name, password, or avatar to update" });
    }

    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (password?.trim()) {
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(password, 10);
    }
    if (avatar?.trim()) updates.avatar = avatar.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("name email avatar");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("💥 Update error:", err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};
