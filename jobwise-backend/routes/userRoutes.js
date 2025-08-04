// routes/userRoutes.js
import express from "express";
import { updateUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/update", verifyToken, upload.single("avatar"), updateUser);

export default router;
