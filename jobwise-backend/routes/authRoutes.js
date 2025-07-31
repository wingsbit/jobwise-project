import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateUser
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyToken, getMe);
router.put('/update', verifyToken, updateUser); // ✅ Edit name/password

export default router;
