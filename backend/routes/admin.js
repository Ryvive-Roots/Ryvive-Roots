import express from "express";
import Order from "../models/Order.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import { PLANS } from "../utils/planConfig.js";


const router = express.Router();

/* ===========================
   GET ALL ORDERS (ADMIN)
=========================== */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Admin Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});

/* ===========================
   CREATE MANUAL CASH ORDER
=========================== */
router.post("/manual-order", async (req, res) => {
  try {
   const { user, plan, slot } = req.body;


    if (!user?.firstName || !user?.phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone required",
      });
    }

    // ✅ Validate plan
    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // ✅ Auto generate IDs
    const membershipId = await generateMembershipId(Order);
    const receiptNumber = "RCPT-" + Date.now();

    // ✅ Get plan details from config
    const { price, duration } = PLANS[plan];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration);

    const newOrder = new Order({
      membershipId,
      receiptNumber,

      user: {
        firstName: user.firstName,
        lastName: user.lastName || "",
        phone: user.phone,
        dob: user.dob || new Date("2000-01-01"),
      },

      address: {},

     deliverySlot: slot || "WALK-IN",

      subscription: {
        plan,
        amount: price,
        duration,
        startDate,
        endDate,
        status: "ACTIVE",
      },

      paymentStatus: "PAID",
    });

    await newOrder.save();

    res.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Manual order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create manual member",
    });
  }
});


export default router;
