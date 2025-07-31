import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);   // ✅ Register
router.post('/login', loginUser);         // ✅ Login
router.post('/logout', logoutUser);       // ✅ Logout
router.get('/me', verifyToken, getMe);    // ✅ Protected Route

export default router;
