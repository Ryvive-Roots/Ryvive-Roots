import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Order from "./models/order.js";
import sendEmail from "./utils/sendEmail.js";
import generateInvoice from "./utils/generateInvoice.js";

await mongoose.connect(process.env.MONGODB_URI);

const order = await Order.findOne({ membershipId: "RR20260201" });

if (!order) {
  console.log("❌ Order not found");
  process.exit();
}

// Generate invoice
const invoicePath = await generateInvoice(order);

// ===============================
// 1️⃣ CUSTOMER EMAIL
// ===============================
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
      <td><b>Membership ID</b></td>
      <td>: ${order.membershipId}</td>
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
      <td><b>Delivery Slot</b></td>
      <td>: ${order.deliverySlot}</td>
    </tr>
    <tr>
      <td><b>Start Date</b></td>
      <td>: ${order.subscription.startDate.toLocaleDateString("en-IN")}</td>
    </tr>
    <tr>
      <td><b>End Date</b></td>
      <td>: ${order.subscription.endDate.toLocaleDateString("en-IN")}</td>
    </tr>
  </table>

  <br />

  <p>Your payment is confirmed 🎉 and your subscription is recorded.</p>

  <p>
    If you ever need help, reach us at:<br />
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

// ===============================
// 2️⃣ COMPANY EMAIL
// ===============================
await sendEmail({
  to: process.env.COMPANY_EMAIL,
  subject: `🧾 New Subscription Order - ${order.membershipId}`,
  html: `
<h2>New Customer Subscription Received</h2>

<ul>
  <li><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</li>
  <li><b>Phone:</b> ${order.user.phone}</li>
  <li><b>Email:</b> ${order.user.email}</li>
  <li><b>Membership ID:</b> ${order.membershipId}</li>
  <li><b>Plan:</b> ${order.subscription.plan}</li>
  <li><b>Amount:</b> ₹${order.subscription.amount}</li>
  <li><b>Delivery Slot:</b> ${order.deliverySlot}</li>
  <li><b>Start Date:</b> ${order.subscription.startDate.toLocaleDateString("en-IN")}</li>
  <li><b>End Date:</b> ${order.subscription.endDate.toLocaleDateString("en-IN")}</li>
  <li><b>Receipt No:</b> ${order.receiptNumber}</li>
</ul>
`,
  attachments: [
    {
      filename: `invoice-${order.receiptNumber}.pdf`,
      path: invoicePath,
    },
  ],
});

console.log("✅ Emails sent successfully");
process.exit();