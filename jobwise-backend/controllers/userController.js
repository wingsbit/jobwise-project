// jobwise-backend/controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ==========================
// Get user profile
// GET /api/users/profile
// ==========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// ==========================
// Update user profile
// PUT /api/users/update-profile
// ==========================
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name?.trim()) user.name = name.trim();
    if (email?.trim()) user.email = email.trim().toLowerCase();

    const allowedRoles = ["seeker", "employer"];
    if (role && allowedRoles.includes(role)) user.role = role;

    if (password?.trim()) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password.trim(), salt);
    }

    if (avatar) {
      user.avatar = avatar; // filename only, upload handled separately
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || "",
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// ==========================
// Save a job to favorites
// POST /api/users/save/:jobId
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
    console.error("Save job error:", error);
    res.status(500).json({ message: "Failed to save job", error: error.message });
  }
};

// ==========================
// Get saved jobs
// GET /api/users/saved
// ==========================
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.savedJobs);
  } catch (error) {
    console.error("Get saved jobs error:", error);
    res.status(500).json({ message: "Failed to get saved jobs", error: error.message });
  }
};

// ==========================
// Remove a saved job
// DELETE /api/users/saved/:jobId
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
    console.error("Remove saved job error:", error);
    res.status(500).json({ message: "Failed to remove saved job", error: error.message });
  }
};
