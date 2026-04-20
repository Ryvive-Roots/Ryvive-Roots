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

    // ✅ ACTIVATE PENDING ORDERS
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

    // ✅ FETCH ALL ORDERS
    const orders = await Order.find().sort({ createdAt: 1 });

    // 🔴 ADD THIS BLOCK (EXPIRED LOGIC)
   for (const order of orders) {
  if (
    order.subscription?.status === "ACTIVE" &&
    order.subscription?.endDate
  ) {
    const expiry = new Date(order.subscription.endDate);

    if (expiry < now) {
      order.subscription.status = "EXPIRED"; // ✅ only update in response
    }
  }
} 

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
   const { user, address, plan, slot, paymentMethod, healthInfo, remarks } = req.body;


    if (!user?.firstName || !user?.phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    if (!address?.pincode) {
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

let startDate;
let activationAt;
let status = "UNDER_PROCESS";

const today = new Date();
today.setHours(0,0,0,0);

if (req.body.startDate) {

  startDate = new Date(req.body.startDate);
  startDate.setHours(0,0,0,0);

  if (startDate < today) {
    // past start → active immediately
    activationAt = new Date(startDate);
    status = "ACTIVE";
  } else {
    // future or today → activate after 48 hours
    activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  }

} else {

  activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  startDate = new Date(activationAt);

}

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
  pincode: address.pincode,
  house: address.house,
  street: address.street,
  landmark: address.landmark || "",
  city: address.city || "Dombivli",
  state: address.state || "Maharashtra",
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
  status,   // optional
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
         subject: "Thank You, You’re Now Part of the Ryvive Roots Family!",
         html: `
 <div style="font-family: Arial, sans-serif; line-height: 1.6;">

<h2 style="font-family: Georgia, 'Times New Roman', serif;  font-size:16px; margin-bottom:2px;">
  Dear ${order.user.firstName},
</h2>

  <p font-family: Arial, 'Times New Roman', serif; font-weight: bold; font-size:22px; margin-bottom:10px;>
    We just wanted to say thank you so much! We’re genuinely thrilled to have you as part of the 
    <b>Ryvive Roots family</b>, and we can’t wait to walk alongside you on this wonderful wellness journey.
  </p>

  <p>
    Your payment has gone through successfully and everything is all set on our end. 
    Here’s a quick summary for your records:
  </p>

<table style="font-family: Arial, 'Times New Roman', serif;  font-size:15px; margin-bottom:10px;">
  <tr>
    <td><b>Receipt Number</b></td>
    <td>: <b>${order.receiptNumber}</b></td>
  </tr>
  <tr>
    <td><b>Your Plan</b></td>
    <td>: <b>${formattedPlan}</b></td>
  </tr>
  <tr>
    <td><b>Amount Paid</b></td>
    <td>: <b>₹${order.subscription.amount}</b></td>
  </tr>
  <tr>
    <td><b>Payment Date</b></td>
    <td>: <b>${order.createdAt.toLocaleDateString("en-IN")}</b></td>
  </tr>
</table>

  <br/>

  <p>
    Keep an eye on your inbox. You’ll be hearing from us shortly with your 
    <b>membership number</b> and all the details to get you started. 
    The good stuff is just around the corner 😊
  </p>

  <p>
  And hey, if you ever have a question, a concern, or just want to say hello, we’re always here for you. Reach out anytime at customersupport@ryviveroots.com and we’ll get back to you with a smile.
  </p>

  <p>
    Here’s to a healthier, happier you. We’re so glad you’re here!
  </p>

  <p>
    Warmly,<br/>
    <b>Team Ryvive Roots</b>
  </p>

<style>
@media only screen and (max-width:600px) {
  .footer-table td {
    display:block !important;
    width:100% !important;
    text-align:center !important;
    margin-bottom:15px;
  }

  .footer-icons img{
    margin:0 6px !important;
  }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">

<tr>
<td align="center">

<table style="text-align:center; border-spacing:0;">

<tr>
<td style="padding:6px 0;">
<img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td>
</tr>

<tr>
<td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
You're receiving this email because you recently activated a Ryvive Roots membership.<br>
If you have any concerns, please contact us at 
<a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">
customersupport@ryviveroots.com
</a>.
</td>
</tr>

<tr>
<td style="padding:8px 0; text-align:center;">
<a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
</a>

<a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
<img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
+91 9076000468 / 97656 00701
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
<a href="https://www.ryviveroots.com" style="text-decoration:none;">
www.ryviveroots.com
</a>
</td>
</tr>

<tr>
<td style="padding:6px 0; text-align:center;">
<a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">
Privacy Policy
</a>
</td>
</tr>

<tr>
<td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
Dombivli East, Maharashtra 421201, India
</td>
</tr>

<tr>
<td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">
© 2026 RYVIVE ROOTS All Rights Reserved.
</td>
</tr>

</table>

</td>
</tr>

</table>


</div>
`,

         attachments: [
           {
             filename: `invoice-${order.receiptNumber}.pdf`,
             path: invoicePath,
           },
         ],
         
       });

       order.subscription.thankYouEmailSentAt = new Date();
order.subscription.welcomeEmailSent = false;

await order.save();
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

let basePlan = existingOrder.subscription.plan?.toUpperCase()?.trim();

// If plan already contains _1M or _3M remove it
if (basePlan && basePlan.includes("_")) {
  basePlan = basePlan.split("_")[0];
}

const duration = Number(durationMonths);

const planKey = `${basePlan}_${duration}MONTH`;

const selectedPlan = PLANS[planKey];

if (!selectedPlan) {
  console.error("Invalid plan key:", planKey);
  return res.status(400).json({
    success: false,
    message: "Invalid plan configuration",
  });
}

existingOrder.subscription.plan = planKey;

    // ⭐ amount based on duration (same logic you use frontend pricing)
 const amount = selectedPlan.price;

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
   const receiptNumber = await generateReceiptNumber(Order);

existingOrder.receiptNumber = receiptNumber;
existingOrder.subscription.amount = amount;

await existingOrder.save();

const invoicePath = await generateInvoice(existingOrder);

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
    if (existingOrder.user.email) {
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

    }

    /* ======================
       COMPANY EMAIL
    ====================== */
   const baseEndDate = existingOrder.subscription.endDate
  ? new Date(existingOrder.subscription.endDate)
  : new Date();

const previewEnd = addMonthsSafe(
  baseEndDate,
  tempPayment.durationMonths
);
if (process.env.COMPANY_EMAIL) {
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
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Admin renew error:", err);
    res.status(500).json({ success: false });
  }
});




export default router;
