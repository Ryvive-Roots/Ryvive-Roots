import express from "express";
import { getReceipt, getUserOrders } from "../controllers/userController.js";


const router = express.Router();

router.get("/orders",  getUserOrders);
router.get("/receipt", getReceipt);


export default router;
