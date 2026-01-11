import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserOrders } from "../controllers/userController.js";

const router = express.Router();

router.get("/orders", authMiddleware, getUserOrders);

export default router;
