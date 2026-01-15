import express from "express";
import { getUserOrders } from "../controllers/userController.js";

const router = express.Router();

router.get("/orders", getUserOrders);


export default router;
