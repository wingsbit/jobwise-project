import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

// ...existing login/signup routes

// GET /auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch user" });
  }
});
