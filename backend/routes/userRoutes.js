import express from "express";
import { getReceipt, getUserOrders, updateProfile } from "../controllers/userController.js";
import Notification from "../models/Notification.js";
import Order from "../models/order.js";
import CustomerQuery from "../models/CustomerQuery.js";

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

/* ===========================
   CUSTOMER SUBMITS A TICKET / FEEDBACK
   Body: { membershipId, type, message, rating?, subject? }
=========================== */
router.post("/support", async (req, res) => {
  try {
    const { membershipId, type, message, rating, subject } = req.body;

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "membershipId is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // Pull customer name/phone/email from their latest order so the admin
    // panel can display it without an extra lookup.
    const order = await Order.findOne({ membershipId }).sort({ createdAt: -1 });

    const priority =
      type === "Complaint" ? "High" : type === "Feedback" ? "Low" : "Medium";

    const defaultSubject =
      type === "Feedback"
        ? "Customer Feedback"
        : type === "Complaint"
        ? "Customer Complaint"
        : "Customer Query";

    const ticket = await CustomerQuery.create({
      membershipId,
      customerName: order
        ? `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim()
        : "",
      customerPhone: order?.user?.phone || "",
      customerEmail: order?.user?.email || "",
      type: type || "Query",
      subject: subject || defaultSubject,
      message,
      rating: rating || 0,
      priority,
    });

    res.json({
      success: true,
      ticket,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

/* ===========================
   GET CUSTOMER'S OWN TICKETS
   Powers the "Your Tickets" list on the dashboard
=========================== */
router.get("/support", async (req, res) => {
  try {
    const { membershipId } = req.query;

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "membershipId is required",
      });
    }

    const tickets = await CustomerQuery.find({ membershipId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      tickets,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
});

export default router;