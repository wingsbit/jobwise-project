// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 🔍 Debug logs
      console.log("Incoming Authorization header:", req.headers.authorization);
      console.log("Extracted token:", token);

      if (!token) {
        return res.status(401).json({ msg: "No token provided" });
      }

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      // ✅ Handle both { id } and { _id } payloads
      const userId = decoded.id || decoded._id;
      if (!userId) {
        return res.status(401).json({ msg: "Invalid token payload" });
      }

      // ✅ Find the user in DB
      req.user = await User.findById(userId).select("-password");
      if (!req.user) {
        return res.status(401).json({ msg: "User not found" });
      }

      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ msg: "Not authorized" });
    }
  } else {
    console.log("❌ No Authorization header provided");
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};

export default protect;
