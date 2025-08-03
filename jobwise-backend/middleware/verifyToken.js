// jobwise-backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Or get token from cookies (if you decide to store JWT there)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token provided" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user object (without password) to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user; // Now available to all routes
    next();
  } catch (error) {
    console.error("💥 Token verification error:", error.message);
    return res.status(401).json({ msg: "Not authorized, token failed" });
  }
};
