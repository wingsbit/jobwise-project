import express from 'express';
import { loginUser, registerUser, logoutUser, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', verifyToken, getMe);

export default router;
