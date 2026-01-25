import Order from "../models/order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";



export const placeOrder = async (req, res) => {
  try {
    const { formData, plan, paymentMethod } = req.body;

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

    let user = await User.findOne({ phone: formData.phone });

    if (!user) {
      user = await User.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        membershipId: null, // ✅ safe initially
      });
    }

    // 🕒 CURRENT TIME
 // 🕒 CURRENT TIME
const now = new Date();

// ✅ Always generate activation date safely
const activationAt =
  new Date(Date.now() + 48 * 60 * 60 * 1000) || new Date();


// ✅ Clone date properly (important)
const startDate = new Date(activationAt);

// ✅ Force months as number
const months = Number(selectedPlan.durationMonths) || 1;

// ✅ Calculate end date safely
const endDate = new Date(startDate);
endDate.setMonth(endDate.getMonth() + months);

// 🧪 Debug (keep temporarily)
console.log("🧪 activationAt:", activationAt);
console.log("🧪 startDate:", startDate);
console.log("🧪 endDate:", endDate);
console.log("🧪 months:", months);


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
        durationMonths: months,

        activationAt, // ⏳ NEW
        startDate, // starts after 48 hrs
        endDate,

        pause: { used: 0, history: [] },

        status: "UNDER_PROCESS", // 🟠 default now
      },

      paymentStatus: "PAID",
      paymentMethod: paymentMethod || "RAZORPAY",
    });

    console.log("✅ ORDER SAVED:", order._id);

    await User.findByIdAndUpdate(
      user._id,
      {
        membershipId: membershipId,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
        phone: order.user.phone, // ✅ ADD THIS
      },
      { new: true },
    );

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

    // 📩 Send order details to company email
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🧾 New Subscription Order - ${order.membershipId}`,
      html: `
    <h2>New Customer Subscription Received</h2>

    <h3>Customer Details</h3>
    <ul>
      <li><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</li>
      <li><b>Phone:</b> ${order.user.phone}</li>
      <li><b>Email:</b> ${order.user.email}</li>
      <li><b>DOB:</b> ${order.user.dob.toLocaleDateString("en-IN")}</li>
    </ul>

    <h3>Subscription</h3>
    <ul>
      <li><b>Plan:</b> ${order.subscription.plan}</li>
      <li><b>Amount:</b> ₹${order.subscription.amount}</li>
      <li><b>Slot:</b> ${order.deliverySlot}</li>
      <li><b>Payment Method:</b> ${order.paymentMethod}</li>
      <li><b>Receipt No:</b> ${order.receiptNumber}</li>
      <li><b>Membership ID:</b> ${order.membershipId}</li>
    </ul>

    <h3>Address</h3>
    <p>
      ${order.address.house}, ${order.address.street}, <br/>
      ${order.address.landmark || ""} <br/>
      ${order.address.city}, ${order.address.state} - ${order.address.pincode}
    </p>

    <p>🕒 Order Time: ${order.createdAt.toLocaleString("en-IN")}</p>
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




