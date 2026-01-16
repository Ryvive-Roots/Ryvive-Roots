import express from "express";
import Order from "../models/Order.js";
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
    const {membershipId, pauseStartDate, pauseDays } = req.body;

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

    // ✅ Initialize pause object if missing
    if (!order.subscription.pause) {
      order.subscription.pause = {
        used: 0,
        history: [],
      };
    }

    // 🚫 Enforce Pause Limit
    const maxAllowed = PAUSE_LIMIT[order.subscription.plan];

    if (order.subscription.pause.used >= maxAllowed) {
      return res.status(400).json({
        success: false,
        message: "Pause limit reached",
        remaining: 0,
      });
    }

const pauseStart = new Date(pauseStartDate);

// ✅ Calculate resume date
const resumeDate = new Date(pauseStart);
resumeDate.setDate(resumeDate.getDate() + Number(pauseDays));

// 🔥 Extend subscription end date
const newEndDate = new Date(order.subscription.endDate);
newEndDate.setDate(newEndDate.getDate() + Number(pauseDays));

// ✅ Update pause info (ONLY ONCE)
order.subscription.pause.used += 1;
order.subscription.pause.history.push({
  startDate: pauseStart,
  resumeDate,
  days: pauseDays,
});

// ❌ DO NOT SET STATUS HERE
order.subscription.endDate = newEndDate;

await order.save();

// ✅ Remaining pauses
const remaining = maxAllowed - order.subscription.pause.used;

    

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
     remainingPauses: remaining,
     usedPauses: order.subscription.pause.used,
   });
  } catch (error) {
    console.error("Pause Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



export default router;
