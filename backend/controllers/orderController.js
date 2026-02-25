import crypto from "crypto";
import Order from "../models/order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import TempPayment from "../models/TempPayment.js";

export const easebuzzSuccess = async (req, res) => {
   try {
    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash: receivedHash,
      easepayid,
      udf1 = "",
      udf2 = "",
      udf3 = "",
      udf4 = "",
      udf5 = "",
      udf6 = "",
      udf7 = "",
      udf8 = "",
      udf9 = "",
      udf10 = "",
    } = req.body;

    if (status !== "success") {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    const tempPayment = await TempPayment.findOne({ txnid });
    if (!tempPayment) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    if (tempPayment.status === "SUCCESS") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/subscription-success?membershipId=${tempPayment.membershipId}`
      );
    }

    // ✅ OFFICIAL EASEBUZZ SUCCESS HASH
    const hashString = [
      process.env.EASEBUZZ_SALT,
      status,
      udf10,
      udf9,
      udf8,
      udf7,
      udf6,
      udf5,
      udf4,
      udf3,
      udf2,
      udf1,
      email,
      firstname,
      productinfo,
      amount,
      txnid,
      process.env.EASEBUZZ_MERCHANT_KEY,
    ].join("|");

    const expectedHash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    if (expectedHash !== receivedHash) {
      console.error("Easebuzz SUCCESS hash mismatch", {
        expectedHash,
        receivedHash,
        txnid,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }






const { formData, plan } = tempPayment;

const normalizedPlan = String(plan || "")
  .trim()
  .replace(/[^\w_]/g, "")  // removes hidden characters
  .toUpperCase();

// Validate against enum from Order schema (stronger than PLANS)
if (!Order.schema.path("subscription.plan").enumValues.includes(normalizedPlan)) {
  console.error("❌ Invalid plan from TempPayment:", normalizedPlan);
  throw new Error("Invalid subscription plan: " + normalizedPlan);
}

const selectedPlan = PLANS[normalizedPlan];

if (!selectedPlan) {
  console.error("❌ Invalid plan from TempPayment:", normalizedPlan);
  throw new Error("Plan not found in planConfig: " + normalizedPlan);
}

    // =====================================================
// 🔁 RENEWAL LOGIC (ADDED ONLY)
// =====================================================
if (tempPayment.isRenewal) {

  const existingOrder = await Order.findOne({
    membershipId: tempPayment.membershipId,
  });

  if (!existingOrder) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }

 // DO NOT extend endDate immediately

const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

existingOrder.subscription.renewal = {
  pending: true,
  durationMonths: tempPayment.durationMonths,
};

existingOrder.subscription.activationAt = activationAt;
existingOrder.subscription.status = "UNDER_PROCESS";

await existingOrder.save();

  // Update temp payment
  tempPayment.status = "SUCCESS";
  tempPayment.membershipId = existingOrder.membershipId;
  await tempPayment.save();

  // ✅ Generate new receipt for renewal
const receiptNumber = await generateReceiptNumber(
  Order,
  tempPayment.amount
);

// Keep original plan exactly as stored
existingOrder.subscription.plan = String(
  existingOrder.subscription.plan
).trim().toUpperCase();

// ✅ Generate renewal invoice
const invoicePath = await generateInvoice({
  ...existingOrder.toObject(),
  receiptNumber,
  subscription: {
    ...existingOrder.subscription,
    amount: tempPayment.amount,
  },
});

existingOrder.invoiceUrl = invoicePath;
await existingOrder.save();


// ✅ Send Renewal Email WITH Invoice
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
    Your subscription will be active within <b>48 hours</b>,
    and your first parcel will be on its way to you within the same timeframe.
    Keep an eye out for it!
  </p>

  <p>
    If you ever have questions or need support, our team is always happy to help —
    reach us at <b>customersupport@ryviveroots.com</b>.
  </p>

  <br/>

  <p>
    Stay Healthy, Stay Vibrant,<br/>
    <b>The Ryvive Roots Team</b>
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

const previewEnd = new Date(existingOrder.subscription.endDate);
previewEnd.setMonth(
  previewEnd.getMonth() + tempPayment.durationMonths
);

  // ✅ Renewal Email to Company
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

  return res.redirect(
    `${process.env.FRONTEND_URL}/dashboard?renewal=success`
  );
}


  // 3️⃣ USER + MEMBERSHIP (SAFE VERSION)

// 🔹 Find existing user first
let user = await User.findOne({
  $or: [{ phone: formData.phone }, { email: formData.email }],
});

let membershipId;

if (user) {
  // ✅ User already exists → reuse membershipId
  membershipId = user.membershipId;
} else {
  // ❌ Create new user
  membershipId = await generateMembershipId(Order, tempPayment.amount);

  user = await User.create({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    membershipId,
  });
}

// 4️⃣ Prevent Duplicate Order (VERY IMPORTANT)
const existingOrder = await Order.findOne({
  "paymentDetails.txnid": txnid,
});

if (existingOrder) {
  return res.redirect(
    `${process.env.FRONTEND_URL}/subscription-success?membershipId=${existingOrder.membershipId}`
  );
}

// 5️⃣ Subscription dates
const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
const startDate = new Date(activationAt);
const endDate = new Date(startDate);
endDate.setMonth(endDate.getMonth() + selectedPlan.durationMonths);

// 6️⃣ Receipt
const receiptNumber = await generateReceiptNumber(
  Order,
  tempPayment.amount
);

// 7️⃣ CREATE ORDER
const order = new Order({
  membershipId,
  receiptNumber,

  user: {
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    email: formData.email,
    dob: new Date(formData.dob),
  },

  address: {
    pincode: formData.pincode,
    house: formData.house,
    street: formData.street,
    landmark: formData.landmark || "",
    city: "Dombivli",
    state: "Maharashtra",
  },

  deliverySlot: formData.slot,

  subscription: {
    plan: normalizedPlan,
    amount: tempPayment.amount,
    durationMonths: selectedPlan.durationMonths,
    activationAt,
    startDate,
    endDate,
    pause: { used: 0, history: [] },
    status: "UNDER_PROCESS",
  },

  paymentStatus: "PAID",
  paymentMethod: "ONLINE",

  paymentDetails: {
    gateway: "EASEBUZZ",
    txnid,
    easepayid,
  },
});

await order.save(); // ✅ Save first

// 🔹 Generate Invoice
const invoicePath = await generateInvoice(order);
order.invoiceUrl = invoicePath;
await order.save();

// 🔹 Update User (optional sync)
await User.findByIdAndUpdate(user._id, {
  firstName: order.user.firstName,
  lastName: order.user.lastName,
  email: order.user.email,
  phone: order.user.phone,
});




    // 7️⃣ SEND CUSTOMER EMAIL (AS-IT-IS)
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


    // 8️⃣ SEND COMPANY EMAIL (AS-IT-IS)
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🧾 New Subscription Order - ${order.membershipId}`,
      html: `
<h2>New Customer Subscription Received</h2>

<ul>
  <li><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</li>
  <li><b>Phone:</b> ${order.user.phone}</li>
  <li><b>Email:</b> ${order.user.email}</li>
  <li><b>Plan:</b> ${order.subscription.plan}</li>
  <li><b>Amount:</b> ₹${order.subscription.amount}</li>
  <li><b>Slot:</b> ${order.deliverySlot}</li>
  <li><b>Receipt No:</b> ${order.receiptNumber}</li>
  <li><b>Membership ID:</b> ${order.membershipId}</li>
</ul>
`,
      attachments: [
        {
          filename: `invoice-${order.receiptNumber}.pdf`,
          path: invoicePath,
        },
      ],
    });

    // 🔹 NOW mark TempPayment SUCCESS (AFTER everything works)
tempPayment.status = "SUCCESS";
tempPayment.membershipId = membershipId;
await tempPayment.save();

    // 9️⃣ Redirect to success page
    return res.redirect(
      `${process.env.FRONTEND_URL}/subscription-success?membershipId=${membershipId}`
    );
  } catch (error) {
    console.error("Easebuzz success error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

export const easebuzzFailure = async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
