import Order from "../models/Order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";



export const placeOrder = async (req, res) => {
  try {
    const { formData, plan } = req.body;

    console.log("📦 ORDER DATA:", formData, plan);

    console.log(req.body);

    // ❌ Validate input
    if (!formData || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    // ❌ Validate plan
    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // 1️⃣ FIND OR CREATE USER
    let user = await User.findOne({ phone: formData.phone });

    if (!user) {
      user = await User.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
    }

    // 3️⃣ CALCULATE DATES
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.duration);

    // 2️⃣ CREATE MEMBERSHIP ID
    const membershipId = await generateMembershipId(Order);
    // 🔢 Generate Receipt Number
    const receiptNumber = await generateReceiptNumber(Order);

    // 4️⃣ CREATE ORDER ✅
    const order = await Order.create({
      membershipId,
      receiptNumber,

      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: new Date(formData.dob), // ✅ IMPORTANT
      },

      address: {
        pincode: formData.pincode,
        house: formData.house,
        street: formData.street,
        landmark: formData.landmark || "",
        city: "Dombivli",
        state: "Maharashtra",
      },

      deliverySlot: formData.slot, // ✅ REQUIRED FIELD

      subscription: {
        plan,
        amount: selectedPlan.price,
        duration: selectedPlan.duration,
        startDate,
        endDate,
        status: "ACTIVE",
      },

      paymentStatus: "PAID", // DEV MODE
    });

    console.log("✅ ORDER SAVED:", order._id);

    // 7️⃣ Generate Invoice PDF
    const invoicePath = await generateInvoice(order);

    // 8️⃣ Send Welcome Email (Hostinger mail)
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

    return res.json({
      success: true,
      membershipId,
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
