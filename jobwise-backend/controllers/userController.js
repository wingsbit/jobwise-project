// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ==========================
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// ==========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// ==========================
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ==========================
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name && name.trim()) user.name = name.trim();
    if (email && email.trim()) user.email = email.trim().toLowerCase();

    const allowedRoles = ["seeker", "employer"];
    if (role && allowedRoles.includes(role)) user.role = role;

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// ==========================
// @desc    Save a job to favorites
// @route   POST /api/users/save/:jobId
// @access  Private
// ==========================
export const saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const jobId = req.params.jobId;
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({ message: "Job saved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save job", error: error.message });
  }
};

// ==========================
// @desc    Get saved jobs
// @route   GET /api/users/saved
// @access  Private
// ==========================
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get saved jobs", error: error.message });
  }
};

// ==========================
// @desc    Remove a saved job
// @route   DELETE /api/users/saved/:jobId
// @access  Private
// ==========================
export const removeSavedJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const jobId = req.params.jobId;
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.json({ message: "Job removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove saved job", error: error.message });
  }
};
