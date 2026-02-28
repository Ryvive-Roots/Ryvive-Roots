import express from "express";
import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import { PLANS } from "../utils/planConfig.js";
import User from "../models/User.js";
import { rebuildExcelFromMongo } from "../utils/excelHelper.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";




const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
} 


/* ===========================
   GET ALL ORDERS (ADMIN)
=========================== */
router.get("/orders", async (req, res) => {
  try {
    const now = new Date();

const pendingOrders = await Order.find({
  "subscription.status": "UNDER_PROCESS",
  "subscription.activationAt": { $lte: now },
});

for (const order of pendingOrders) {

  const start = new Date(order.subscription.activationAt);

  order.subscription.startDate = start;

  const months =
    order.subscription.renewal?.pending
      ? order.subscription.renewal.durationMonths
      : order.subscription.durationMonths;

  order.subscription.endDate = addMonthsSafe(start, months);

  if (order.subscription.renewal?.pending) {
    order.subscription.pause = { used: 0, history: [] };
    order.subscription.renewal.pending = false;
  }

  order.subscription.status = "ACTIVE";

  await order.save();
}

    const orders = await Order.find().sort({ createdAt: 1 });

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
   const { user, plan, slot, paymentMethod, healthInfo, remarks } = req.body;


    if (!user?.firstName || !user?.phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    if (!user?.address?.pincode) {
      return res.status(400).json({
        success: false,
        message: "Address pincode is required",
      });
    }

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "Delivery slot required",
      });
    }

    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // ✅ Generate IDs
    let existingUser = await User.findOne({
  $or: [
    { phone: user.phone },
    { email: user.email }
  ]
});

let membershipId;

if (existingUser && existingUser.membershipId) {
  // ♻️ reuse old membershipId
  membershipId = existingUser.membershipId;
} else {
  // 🆕 generate new membershipId
  membershipId = await generateMembershipId(Order);
}

// 🛑 Prevent accidental duplicate order (double click protection)
const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

const recentOrder = await Order.findOne({
  membershipId,
  createdAt: { $gte: tenSecondsAgo },
});

if (recentOrder) {
  return res.status(429).json({
    success: false,
    message: "Order already submitted. Please wait a few seconds.",
  });
}


    const receiptNumber = await generateReceiptNumber(Order);

    // ✅ Calculate Dates
  // 🕒 CURRENT TIME
const now = new Date();

// ✅ Always force valid activation date
const activationAt =
  new Date(Date.now() + 48 * 60 * 60 * 1000) || new Date();


// ✅ Clone date properly (important)
const startDate = new Date(activationAt);

// ✅ Ensure months is always a number
const months = Number(selectedPlan.durationMonths) || 1;

const endDate = new Date(startDate);
endDate.setMonth(endDate.getMonth() + months);

// 🧪 DEBUG (temporary – helps confirm)
console.log("🧪 activationAt:", activationAt);
console.log("🧪 startDate:", startDate);
console.log("🧪 endDate:", endDate);
console.log("🧪 months:", months);





    // ✅ Create Order
    const order = await Order.create({
      membershipId,
      receiptNumber,

      user: {
        firstName: user.firstName,
        lastName: user.lastName || "",
        phone: user.phone,
        email: user.email || "",
        dob: user.dob || new Date("2000-01-01"),
      },

      healthInfo: {
  allergies: healthInfo?.allergies || "N/A",
  medicalConditions: healthInfo?.medicalConditions || "N/A",
},

remarks: remarks || "",

      address: {
        pincode: user.address.pincode,
        house: user.address.house,
        street: user.address.street,
        landmark: user.address.landmark || "",
        city: user.address.city || "Dombivli",
        state: user.address.state || "Maharashtra",
      },

      deliverySlot: slot,

      subscription: {
  plan,
  amount: selectedPlan.price,
  durationMonths: months,
  activationAt,
  startDate,
  endDate,
  pause: { used: 0, history: [] },
  status: "UNDER_PROCESS",   // optional
},
      paymentStatus: "PAID",
     paymentMethod: paymentMethod || "CASH",
    });

    console.log("✅ MANUAL ORDER SAVED:", order.membershipId);

  
try {
  await rebuildExcelFromMongo();
  console.log("📊 Excel updated successfully");
} catch (err) {
  console.error("❌ Excel rebuild failed:", err.message);
}



    await User.findOneAndUpdate(
      { membershipId: order.membershipId },
      {
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
        phone: order.user.phone,
        membershipId: order.membershipId,
      },
      { upsert: true, new: true }
    );

    // 📄 Generate Invoice PDF
    const invoicePath = await generateInvoice(order);
          const excelPath = path.join(
  __dirname,
  "..",
  "exports",
  "members.xlsx"
);
    

    // 📩 SEND CUSTOMER EMAIL
    if (order.user.email) {


       await sendEmail({
         to: order.user.email,
         subject: "Thank You! Your Payment Has Been Received — Ryvive Roots",
         html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Hi ${order.user.firstName},</h2>

    <p>
      Thank you for making the payment and joining the
      <b>Ryvive Roots Subscription Program</b> 🌿
      We’re excited to have you with us on this healthy journey.
    </p>

    <p>Here are your subscription details for your reference:</p>

    <table style="border-collapse: collapse;">
     <tr>
  <td><b>Invoice Number</b></td>
  <td>: ${order.receiptNumber}</td>
</tr>

      <tr>
        <td><b>Plan Chosen</b></td>
        <td>: ${order.subscription.plan}</td>
      </tr>
      <tr>
        <td><b>Amount Paid</b></td>
        <td>: ₹${order.subscription.amount}</td>
      </tr>
      <tr>
        <td><b>Payment Date</b></td>
      <td>: ${order.createdAt.toLocaleDateString("en-IN")}</td>
      </tr>
    </table>

    <br />

    <p>
     Your payment is confirmed 🎉 and your subscription is recorded.
    </p>

    <p>
      You’ll receive another email shortly with your membership number and activation details.
    </p>

    <br />

    <p>
     If you ever need help, we’re always here — reach us at:<br />
      <b>customersupport@ryviveroots.com</b>
    </p>

    <br />

    <p>
      Stay healthy, stay vibrant 💚<br />
      <b>Team Ryvive Roots</b>
    </p>
  </div>
`,

         attachments: [
           {
             filename: `invoice-${order.receiptNumber}.pdf`,
             path: invoicePath,
           },
         ],
         
       });
    }

    // 📩 SEND COMPANY EMAIL
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🧾 Manual Membership Added - ${order.membershipId}`,
      html: `
        <h2>New Walk-in Member Added</h2>

        <p><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</p>
        <p><b>Phone:</b> ${order.user.phone}</p>
        <p><b>Email:</b> ${order.user.email || "N/A"}</p>
        <p><b> Allergies:</b> ${order.healthInfo?.allergies || "N/A"}</p>
<p><b> Medical Conditions:</b> ${order.healthInfo?.medicalConditions || "N/A"}</p>
<p><b>📝 Remarks:</b> ${order.remarks || "—"}</p>

        <p><b>Plan:</b> ${order.subscription.plan}</p>
        <p><b>Amount:</b> ₹${order.subscription.amount}</p>
        <p><b>Slot:</b> ${order.deliverySlot}</p>
        <p><b>Membership ID:</b> ${order.membershipId}</p>
        <p><b>Receipt:</b> ${order.receiptNumber}</p>

        <p><b>Address:</b><br/>
          ${order.address.house}, ${order.address.street}<br/>
          ${order.address.landmark}<br/>
          ${order.address.city} - ${order.address.pincode}
        </p>

        <p>🕒 Created: ${new Date().toLocaleString("en-IN")}</p>
      `,
     attachments: [
  {
    filename: "members.xlsx",
    path: excelPath,
  },
  {
    filename: `invoice-${order.receiptNumber}.pdf`,
    path: invoicePath,
  },
],

    });

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ MANUAL ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create manual order",
    });
  }
});

router.put("/order/:id/health", async (req, res) => {
  try {
    const { user, healthInfo, remarks } = req.body;

    // 1️⃣ Get old order (before update)
    const oldOrder = await Order.findById(req.params.id);

    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 2️⃣ Update order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "user.phone": user?.phone,
          "user.email": user?.email,
          healthInfo,
          remarks,
        },
      },
      { new: true }
    );

    // 3️⃣ Sync User collection
    if (user?.phone || user?.email) {
      await User.findOneAndUpdate(
        { membershipId: order.membershipId },
        {
          ...(user?.phone && { phone: user.phone }),
          ...(user?.email && { email: user.email }),
        }
      );
    }

    // 4️⃣ Detect changes
    const phoneChanged =
      user?.phone && user.phone !== oldOrder.user.phone;

    const emailChanged =
      user?.email && user.email !== oldOrder.user.email;

      const healthChanged =
  JSON.stringify(healthInfo || {}) !==
  JSON.stringify(oldOrder.healthInfo || {});

const remarksChanged =
  (remarks || "") !== (oldOrder.remarks || "");

    // 📩 SEND CUSTOMER EMAIL (only if email exists & changed)
   // 📩 SEND CUSTOMER EMAIL (only if email changed)
if (emailChanged && order.user.email) {
  await sendEmail({
    to: order.user.email,
    subject: "Your Email Address Has Been Updated – Ryvive Roots",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        <p>Hello,</p>

        <p>
          We would like to inform you that the email address linked to your
          <b>${order.subscription.plan}</b> subscription has been successfully
          updated in our system.
        </p>

        <table style="border-collapse: collapse;">
          <tr>
            <td><b>Membership Plan</b></td>
            <td>: ${order.subscription.plan}</td>
          </tr>
          <tr>
            <td><b>Updated Email ID</b></td>
            <td>: ${order.user.email}</td>
          </tr>
          <tr>
            <td><b>Date & Time</b></td>
            <td>: ${new Date().toLocaleString("en-IN")}</td>
          </tr>
        </table>

        <br/>

        <p>
          This update has been made to ensure smooth communication regarding
          your membership, including important updates, offers, and subscription details.
        </p>

        <p>
          If you believe this update was made in error or if you have any concerns,
          please reach out to us immediately and we’ll be happy to assist you.
        </p>

        <p>
          Thank you for being a valued member of <b>Ryvive Roots</b>.
        </p>

        <br/>

        <p>
          Warm regards,<br/>
          <b>Ryvive Roots</b><br/>
          customersupport@ryviveroots.com
        </p>
      </div>
    `,
  });
}


    // 📩 SEND COMPANY EMAIL
    if (phoneChanged || emailChanged || healthChanged || remarksChanged) {
  await sendEmail({
    to: process.env.COMPANY_EMAIL,
    subject: `✏️ Member Details Updated - ${order.membershipId}`,
    html: `
      <h3>Member Profile Updated</h3>

      <p><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</p>
      <p><b>Membership ID:</b> ${order.membershipId}</p>

      <p><b>Changes:</b></p>
      <ul>
        ${
          phoneChanged
            ? `<li>📞 Phone: ${oldOrder.user.phone} → ${order.user.phone}</li>`
            : ""
        }
        ${
          emailChanged
            ? `<li>📧 Email: ${oldOrder.user.email || "N/A"} → ${order.user.email}</li>`
            : ""
        }
        ${
          healthChanged
            ? `
              <li>🩺 Health Info Updated
                <ul>
                  <li>Allergies: ${order.healthInfo?.allergies || "N/A"}</li>
                  <li>Medical Conditions: ${order.healthInfo?.medicalConditions || "N/A"}</li>
                </ul>
              </li>
            `
            : ""
        }
        ${
          remarksChanged
            ? `<li>📝 Remarks Updated: ${order.remarks || "—"}</li>`
            : ""
        }
      </ul>

      <p>🕒 Updated on: ${new Date().toLocaleString("en-IN")}</p>
    `,
  });
}


    // 5️⃣ Rebuild Excel
    try {
      await rebuildExcelFromMongo();
      console.log("📊 Excel updated after edit");
    } catch (err) {
      console.error("❌ Excel rebuild failed:", err.message);
    }

    res.json({ success: true, order });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update member details",
    });
  }
});


router.get("/excel", (req, res) => {
  try {
    const excelPath = path.join(
      __dirname,
      "..",
      "exports",
      "members.xlsx"
    );

    // If file not exists
    if (!fs.existsSync(excelPath)) {
      return res.status(404).send("Excel file not found");
    }

    // Send Excel file
    res.download(excelPath, "members.xlsx");
  } catch (error) {
    console.error("Excel view error:", error);
    res.status(500).send("Unable to open Excel");
  }
});

/* =====================================
   ADMIN MANUAL RENEW (CASH USERS)
===================================== */
router.post("/renew", async (req, res) => {
  try {
   const { membershipId, durationMonths, paymentMethod } = req.body;

    if (!membershipId || !durationMonths) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const existingOrder = await Order.findOne({ membershipId });

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // ⭐ prevent double renewal
    if (existingOrder.subscription?.renewal?.pending) {
      return res.status(400).json({
        success: false,
        message: "Renewal already pending",
      });
    }

    /* ======================
       PLAN + AMOUNT
    ====================== */
   const basePlan = existingOrder.subscription.plan; 
// example: "PLATINUM"

const planKey = `${basePlan}_${durationMonths}M`;
// example: "PLATINUM_3M"

const selectedPlan = PLANS[planKey];

    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    // ⭐ amount based on duration (same logic you use frontend pricing)
    const amount =
      durationMonths === 3
        ? selectedPlan.price * 3 // or your discounted logic
        : selectedPlan.price;

    /* ======================
       RENEWAL MARK PENDING
    ====================== */
    const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    existingOrder.subscription.renewal = {
      pending: true,
      durationMonths,
    };

    existingOrder.subscription.durationMonths = durationMonths;
    existingOrder.subscription.activationAt = activationAt;
    existingOrder.subscription.status = "UNDER_PROCESS";

    existingOrder.paymentMethod = paymentMethod || "CASH";
  
    existingOrder.paymentStatus = "PAID";

    /* ======================
       RECEIPT + INVOICE
    ====================== */
    const receiptNumber = await generateReceiptNumber(Order, amount);

    const invoicePath = await generateInvoice({
      ...existingOrder.toObject(),
      receiptNumber,
      subscription: {
        ...existingOrder.subscription,
        amount,
      },
    });

    existingOrder.invoiceUrl = invoicePath;

    existingOrder.subscription.amount = amount;
existingOrder.receiptNumber = receiptNumber;
existingOrder.subscription.renewedAt = new Date();
existingOrder.subscription.renewalTriggeredBy = "ADMIN";
existingOrder.subscription.renewalHistory =
  existingOrder.subscription.renewalHistory || [];

existingOrder.subscription.renewalHistory.push({
  date: new Date(),
  durationMonths,
  amount,
  paymentMethod: paymentMethod || "CASH",
});

    await existingOrder.save();

    /* ======================
       TEMP PAYMENT TRICK (EMAIL SAME)
    ====================== */
    const tempPayment = {
      durationMonths,
      amount,
    };

    /* ======================
       CUSTOMER EMAIL (SAME TEMPLATE)
    ====================== */
    await sendEmail({
      to: existingOrder.user.email,
      subject: "You’re Back, And We’re Glad 🌿",
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

  <h2>Hi ${existingOrder.user.firstName},</h2>

  <p><b>Welcome back. We're glad you stayed.</b></p>

  <p>
    Your renewal is a reminder of the commitment we made when we started
    <b>Ryvive Roots</b> — to support your health with sincerity and consistency.
  </p>

  <p>
    Thank you for continuing your wellness journey with us.
    Here’s your renewal summary for your records:
  </p>

  <table style="border-collapse: collapse; margin-top: 10px;">
    <tr>
      <td style="padding: 6px 10px;"><b>Receipt Number</b></td>
      <td style="padding: 6px 10px;">: ${receiptNumber}</td>
    </tr>
    <tr>
      <td style="padding: 6px 10px;"><b>Plan Renewed</b></td>
      <td style="padding: 6px 10px;">: ${existingOrder.subscription.plan}</td>
    </tr>
    <tr>
      <td style="padding: 6px 10px;"><b>Renewal Duration</b></td>
      <td style="padding: 6px 10px;">: ${tempPayment.durationMonths} Month${tempPayment.durationMonths > 1 ? "s" : ""}</td>
    </tr>
    <tr>
      <td style="padding: 6px 10px;"><b>Amount Paid</b></td>
      <td style="padding: 6px 10px;">: ₹${tempPayment.amount}</td>
    </tr>
    <tr>
      <td style="padding: 6px 10px;"><b>Payment Date</b></td>
      <td style="padding: 6px 10px;">: ${new Date().toLocaleDateString("en-IN")}</td>
    </tr>
  </table>

  <br/>

  <p>
    Your subscription will be active within <b>48 hours</b>.
  </p>

</div>
`,
      attachments: [
        {
          filename: `invoice-${receiptNumber}.pdf`,
          path: invoicePath,
        },
      ],
    });

    /* ======================
       COMPANY EMAIL
    ====================== */
    const previewEnd = addMonthsSafe(
      existingOrder.subscription.endDate,
      tempPayment.durationMonths
    );

    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🔁 Subscription Renewed - ${existingOrder.membershipId}`,
      html: `
<h2>Subscription Renewal Received</h2>
<ul>
  <li><b>Name:</b> ${existingOrder.user.firstName} ${existingOrder.user.lastName}</li>
  <li><b>Phone:</b> ${existingOrder.user.phone}</li>
  <li><b>Email:</b> ${existingOrder.user.email}</li>
  <li><b>Plan:</b> ${existingOrder.subscription.plan}</li>
  <li><b>Amount:</b> ₹${tempPayment.amount}</li>
  <li><b>New Expiry:</b> ${previewEnd.toLocaleDateString("en-IN")}</li>
  <li><b>Membership ID:</b> ${existingOrder.membershipId}</li>
  <li><b>Receipt No:</b> ${receiptNumber}</li>
</ul>
`,
      attachments: [
        {
          filename: `invoice-${receiptNumber}.pdf`,
          path: invoicePath,
        },
      ],
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Admin renew error:", err);
    res.status(500).json({ success: false });
  }
});




export default router;
