import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ✅ Generate JWT helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ✅ Register user
export const registerUser = async (req, res) => {
  console.log("📥 Incoming signup request:", req.body);
  console.log("📥 REGISTER endpoint triggered:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("❌ Missing fields");
      return res.status(400).json({ msg: "All fields are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      console.warn("⚠️ Email already registered:", cleanEmail);
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("✅ User saved to DB:", newUser.email);
    const token = generateToken(newUser._id);

    res.status(201).json({ token });
  } catch (err) {
    console.error("💥 Signup error:", err);
    res.status(500).json({ msg: "Signup failed internally" });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  console.log("📥 Login request:", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      console.warn("❌ User not found:", cleanEmail);
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("❌ Invalid credentials for:", cleanEmail);
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log("✅ Login successful:", user.email);

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ msg: "Login failed internally" });
  }
};

// ✅ Logout
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

// ✅ Update user (improved)
export const updateUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Ensure at least one change is provided
    if (!name && !password) {
      return res.status(400).json({ msg: "Please provide a name or password to update" });
    }

    const updates = {};

    // Name validation
    if (name && name.trim() !== "") {
      updates.name = name.trim();
    }

    // Password validation
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("name email"); // only safe fields

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("✅ User updated:", updatedUser.email);
    res.json({ user: updatedUser });
  } catch (err) {
    console.error("💥 Update error:", err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};
