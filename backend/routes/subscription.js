import express from "express";
import Order from "../models/rder.js";
import sendEmail from "../utils/sendEmail.js";
import {
  goldPauseEmail,
  platinumPauseEmail,
} from "../utils/pauseEmailTemplates.js";


const router = express.Router();

// ✅ Pause limits per plan
const PAUSE_LIMIT = {
  GOLD: 2,
  PLATINUM: 3,
};

router.post("/pause",  async (req, res) => {
  try {
    const { membershipId, pauseStartDate, pauseToDate } = req.body;

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "Membership ID missing",
      });
    }

    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["GOLD", "PLATINUM"].includes(order.subscription.plan)) {
      return res.status(400).json({
        success: false,
        message: "Pause not allowed for this plan",
      });
    }

    // ✅ Initialize pause object
    if (!order.subscription.pause) {
      order.subscription.pause = {
        used: 0,
        history: [],
      };
    }

    // 🚫 Pause count limit
    const maxAllowed = PAUSE_LIMIT[order.subscription.plan];

    if (order.subscription.pause.used >= maxAllowed) {
      return res.status(400).json({
        success: false,
        message: "Pause limit reached",
      });
    }

    // ✅ Validate dates
    if (!pauseStartDate || isNaN(new Date(pauseStartDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid pause start date",
      });
    }

    if (!pauseToDate || isNaN(new Date(pauseToDate))) {
      return res.status(400).json({
        success: false,
        message: "Invalid pause end date",
      });
    }

    const pauseStart = new Date(pauseStartDate);
    const pauseEnd = new Date(pauseToDate);

    pauseStart.setHours(0, 0, 0, 0);
    pauseEnd.setHours(0, 0, 0, 0);

    if (pauseEnd < pauseStart) {
      return res.status(400).json({
        success: false,
        message: "Pause end date cannot be before start date",
      });
    }

    // 🚫 Prevent past date pause
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pauseStart < today) {
      return res.status(400).json({
        success: false,
        message: "Pause start date cannot be in the past",
      });
    }

    // 🚫 Prevent overlapping pause
    const pauseHistory = order.subscription.pause.history || [];
    if (pauseHistory.length > 0) {
      const lastPause = pauseHistory[pauseHistory.length - 1];
      const lastResume = new Date(lastPause.resumeDate);

      if (new Date() < lastResume) {
        return res.status(400).json({
          success: false,
          message: "Subscription is already paused",
        });
      }
    }

    // ✅ Calculate pause days from dates
    const diffTime = pauseEnd.getTime() - pauseStart.getTime();
    const pauseDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const MAX_PAUSE_DAYS = 15;

    if (pauseDays < 1 || pauseDays > MAX_PAUSE_DAYS) {
      return res.status(400).json({
        success: false,
        message: "Pause duration must be between 1 and 15 days",
      });
    }

    // ✅ Resume = next day after pause end
    const resumeDate = new Date(pauseEnd);
    resumeDate.setDate(resumeDate.getDate() + 1);

    // ✅ Extend subscription expiry by pauseDays
    const newEndDate = new Date(order.subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + pauseDays);

    // ✅ Update pause info
    order.subscription.pause.used += 1;
    order.subscription.pause.history.push({
      startDate: pauseStart,
      endDate: pauseEnd,
      resumeDate,
      days: pauseDays,
    });

    order.subscription.endDate = newEndDate;

    await order.save();

    // ✅ Remaining pauses AFTER increment
    const remaining = Math.max(maxAllowed - order.subscription.pause.used, 0);

    const emailPayload = {
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      pauseStartDate: pauseStart.toLocaleDateString("en-IN"),
      ResumeDate: resumeDate.toLocaleDateString("en-IN"),
      timeSlot: order.deliverySlot,
      remainingPauses: remaining, // ✅ FIXED
    };

    const emailTemplate =
      order.subscription.plan === "GOLD"
        ? goldPauseEmail(emailPayload)
        : platinumPauseEmail(emailPayload);

    // 📧 Send email to customer
    await sendEmail({
      to: order.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    await sendEmail({
      to: "customersupport@ryviveroots.com",
      subject: `Subscription Pause – ${order.subscription.plan} Member`,
      html: `
       <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
  <p>Dear <strong>Team</strong>,</p>

  <p>
    A customer has successfully placed a
    <strong>subscription pause request</strong> via the website user dashboard.
  </p>

  <p><strong>Member Details</strong></p>
  <ul style="padding-left: 18px; margin: 8px 0;">
    <li><strong>Name:</strong> ${order.user.firstName} ${
        order.user.lastName
      }</li>
    <li><strong>Membership ID:</strong> ${order.membershipId}</li>
    <li><strong>Plan:</strong> ${order.subscription.plan}</li>
    <li><strong>Phone:</strong> ${order.user.phone}</li>
    <li><strong>Email:</strong> ${order.user.email}</li>
   <li><strong>Address:</strong> 
  ${order.address.house}, ${order.address.street}, 
  ${order.address.landmark}, ${order.address.pincode}
</li>

  </ul>

  <p><strong>Pause Information</strong></p>
  <ul style="padding-left: 18px; margin: 8px 0;">
    <li><strong>Pause Start Date:</strong> ${pauseStart.toLocaleDateString(
      "en-IN"
    )}</li>
    <li><strong>Resume Date:</strong> ${resumeDate.toLocaleDateString(
      "en-IN"
    )}</li>
    <li><strong>Delivery Slot:</strong> ${order.deliverySlot}</li>
    <li><strong>Pause Days:</strong> ${pauseDays}</li>
  </ul>

  <p>
    Subscription status updated to <strong>PAUSED</strong>.<br />
    Expiry date extended accordingly.
  </p>

  <p style="margin-top: 16px;">
    Warm regards,<br />
    <strong>Ryvive Roots – System Notification</strong>
  </p>
</div>

`,
    });

    res.json({
      success: true,
      message: "Subscription paused successfully",
      remainingPauses: remaining,
      usedPauses: order.subscription.pause.used,
    });
  } catch (error) {
    console.error("Pause Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default router;
