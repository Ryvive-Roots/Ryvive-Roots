import PendingPayment from "../models/PendingPayment.js";
import AuditLog from "../models/AuditLog.js";

import Order from "../models/Order.js";
import User from "../models/User.js";

import { generateMembershipId } from "../utils/generateMembershipId.js";
import { generateReceiptNumber } from "../utils/generateReceiptNumber.js";

import { generateInvoice } from "../utils/generateInvoice.js";
import { rebuildExcelFromMongo } from "../utils/excel.js";

import sendEmail from "../utils/sendEmail.js";

import { PLANS } from "../config/plans.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ✅ CREATE PENDING PAYMENT
export const createPendingPayment = async (req, res) => {
  try {
    const {
      user,
      address,
      healthInfo,
      remarks,

      deliverySlot,

      subscription,

      paymentMethod,

      createdBy,
    } = req.body;

    // ✅ BASIC VALIDATION
    if (
      !user?.firstName ||
      !user?.phone ||
      !subscription?.plan ||
      !subscription?.amount ||
      !deliverySlot
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ CREATE PENDING PAYMENT
    const pending = await PendingPayment.create({
      user,
      address,
      healthInfo,
      remarks,

      deliverySlot,

      subscription,

      paymentMethod,

      createdBy,

      paymentStatus: "PENDING",
    });

    await AuditLog.create({
  action: "PENDING_PAYMENT_CREATED",

  performedBy:
    createdBy || "Admin",

  customerName:
    `${user.firstName} ${user.lastName}`,

  details:
    `Pending payment created for ${subscription.plan}`,
});

    res.status(201).json({
      success: true,
      message: "Pending payment created",
      pending,
    });

  } catch (err) {
    console.error("CREATE PENDING PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create pending payment",
    });
  }
};




// ✅ GET ALL PENDING PAYMENTS
export const getPendingPayments = async (req, res) => {
  try {

    const pendingPayments = await PendingPayment.find({
      paymentStatus: "PENDING",
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: pendingPayments.length,
      pendingPayments,
    });

  } catch (err) {

    console.error("GET PENDING PAYMENTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments",
    });
  }
};



export const verifyPendingPayment = async (req, res) => {
  try {
    const pending = await PendingPayment.findById(
      req.params.id
    );

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Pending payment not found",
      });
    }

    const {
      paymentMethod,
      transactionId,
      amount,
      startDate,
    } = req.body;

    const selectedPlan =
      PLANS[pending.subscription.plan];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    let existingUser = await User.findOne({
      $or: [
        { phone: pending.user.phone },
        { email: pending.user.email },
      ],
    });

    let membershipId;

    if (existingUser?.membershipId) {
      membershipId =
        existingUser.membershipId;
    } else {
      membershipId =
        await generateMembershipId(Order);
    }

    const receiptNumber =
      await generateReceiptNumber(Order);

  const subscriptionStartDate =
  startDate
    ? new Date(startDate)
    : new Date();

subscriptionStartDate.setHours(
  0,
  0,
  0,
  0
);

    const months =
      Number(selectedPlan.durationMonths) || 1;

    const endDate = new Date(
  subscriptionStartDate
);

endDate.setMonth(
  endDate.getMonth() + months
);

const activationAt = new Date(
  subscriptionStartDate
);

const today = new Date();

today.setHours(0, 0, 0, 0);

const status =
  subscriptionStartDate <= today
    ? "ACTIVE"
    : "UNDER_PROCESS";

    const order = await Order.create({
      membershipId,
      receiptNumber,

      user: pending.user,

      address: pending.address,

      healthInfo:
        pending.healthInfo,

      remarks:
        pending.remarks,

      deliverySlot:
        pending.deliverySlot,

      subscription: {
        plan:
          pending.subscription.plan,

        amount:
          amount ||
          pending.subscription.amount,

        durationMonths:
          months,

        activationAt,

       startDate:
    subscriptionStartDate,
  endDate,

        pause: {
          used: 0,
          history: [],
        },

        status,
      },

      paymentStatus: "PAID",

      paymentMethod:
        paymentMethod || "CASH",

      transactionId,
    });

    await User.findOneAndUpdate(
      {
        membershipId:
          order.membershipId,
      },
      {
        firstName:
          order.user.firstName,

        lastName:
          order.user.lastName,

        email:
          order.user.email,

        phone:
          order.user.phone,

        membershipId:
          order.membershipId,
      },
      {
        upsert: true,
        new: true,
      }
    );

    const invoicePath =
      await generateInvoice(order);

    order.invoiceUrl =
      invoicePath;

    await order.save();

    await rebuildExcelFromMongo();
      // 📩 SEND CUSTOMER EMAIL
    if (order.user.email) {


     const rawPlan = order.subscription?.plan || "";
const formattedPlan = `RYVIVE ${rawPlan.split("_")[0]}`;


   
    await sendEmail({
      to: order.user.email,
      subject: "Payment successful for RYVIVE ROOTS LLP",
      html:  `
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
    The good stuff is just around the corner.
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

    const excelPath = path.join(
  __dirname,
  "..",
  "exports",
  "members.xlsx"
);

    // 📩 SEND COMPANY EMAIL
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
    subject: `🧾 Pending Payment Activated - ${order.membershipId}`,
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

    await AuditLog.create({
      action:
        "PENDING_PAYMENT_VERIFIED",

      performedBy:
        pending.createdBy ||
        "Admin",

      customerName:
        `${pending.user.firstName} ${pending.user.lastName}`,

      details:
        `Customer activated with Membership ID ${membershipId}`,
    });

    await PendingPayment.findByIdAndDelete(
      pending._id
    );

    return res.json({
      success: true,
      message:
        "Customer activated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "VERIFY PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};