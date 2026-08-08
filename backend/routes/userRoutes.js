import express from "express";
import { getReceipt, getUserOrders, updateProfile } from "../controllers/userController.js";
import Notification from "../models/Notification.js";
import Order from "../models/order.js";


const router = express.Router();

router.get("/orders", getUserOrders);
router.get("/receipt", getReceipt);
router.put("/update-profile", updateProfile);

/* ===========================
   GET USER NOTIFICATIONS
=========================== */
router.get("/notifications", async (req, res) => {
  try {
    const { membershipId } = req.query;

    const notifications = await Notification.find({
      membershipId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});



export default router;