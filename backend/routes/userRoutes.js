import express from "express";
import { getReceipt, getUserOrders, updateProfile } from "../controllers/userController.js";


const router = express.Router();

router.get("/orders",  getUserOrders);
router.get("/receipt", getReceipt);
router.put("/update-profile", updateProfile); 


export default router;
