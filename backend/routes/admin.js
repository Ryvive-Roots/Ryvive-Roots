import express from "express";
import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import { PLANS } from "../utils/planConfig.js";
import User from "../models/User.js";


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
    const membershipId = await generateMembershipId(Order);
    const receiptNumber = await generateReceiptNumber(Order);

    // ✅ Calculate Dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.duration);

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
        duration: selectedPlan.duration,
        startDate,
        endDate,
        status: "ACTIVE",
      },

      paymentStatus: "PAID",
      paymentMethod: "CASH",
    });

    console.log("✅ MANUAL ORDER SAVED:", order.membershipId);
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





export default router;
