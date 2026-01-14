import express from "express";
import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";
import {
  goldPauseEmail,
  platinumPauseEmail,
} from "../utils/pauseEmailTemplates.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/pause", authMiddleware, async (req, res) => {
  try {
    const { pauseStartDate, pauseDays } = req.body;
    

   const order = await Order.findOne({
  "user.phone": req.user.phone,
});


    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.subscription.status === "PAUSED") {
      return res.json({ success: false, message: "Already paused" });
    }

    const pauseStart = new Date(pauseStartDate);
    const resumeDate = new Date(pauseStart);
    resumeDate.setDate(resumeDate.getDate() + pauseDays);

    // 🔥 Extend subscription end date
    const newEndDate = new Date(order.subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + pauseDays);

    order.subscription.status = "PAUSED";
    order.subscription.pause = {
      startDate: pauseStart,
      resumeDate,
      days: pauseDays,
    };
    order.subscription.endDate = newEndDate;

    await order.save();

    // 📌 Remaining pauses logic
    const maxPauses = order.subscription.plan === "GOLD" ? 2 : 3;
    const usedPauses = order.subscription.pauseCount || 0;
    const remainingPauses = maxPauses - (usedPauses + 1);

    order.subscription.pauseCount = usedPauses + 1;
    await order.save();

    const emailPayload = {
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      pauseStartDate: pauseStart.toLocaleDateString("en-IN"),
      pauseEndDate: resumeDate.toLocaleDateString("en-IN"),
      timeSlot: order.deliverySlot,
      remainingPauses,
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
      to: "customerservice@ryviveroots.com",
      subject: `Subscription Pause – ${order.subscription.plan} Member`,
      html: `
Dear Team,

A customer has successfully placed a **subscription pause request** via the dashboard.

**Member Details**
• Name: ${order.user.firstName} ${order.user.lastName}
• Membership ID: ${order.membershipId}
• Plan: ${order.subscription.plan}
• Phone: ${order.user.phone}
• Email: ${order.user.email}

**Pause Information**
• Pause Start Date: ${pauseStart.toLocaleDateString("en-IN")}
• Pause End Date: ${pauseEnd.toLocaleDateString("en-IN")}
• Resume Date: ${resumeDate.toLocaleDateString("en-IN")}
• Delivery Slot: ${order.deliverySlot}
• Pause Days: ${pauseDays}

Subscription status updated to **PAUSED**  
Expiry date extended accordingly.

Warm regards,  
**Ryvive Roots – System Notification**
`,
    });

    res.json({
      success: true,
      message: "Subscription paused successfully",
    });
  } catch (error) {
    console.error("Pause Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
