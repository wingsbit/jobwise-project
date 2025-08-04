// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = await bcrypt.hash(password, 10);

    if (req.file) {
      user.avatar = req.file.filename;
    }

    await user.save();

    res.status(200).json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
