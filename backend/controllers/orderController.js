import crypto from "crypto";
import Order from "../models/order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import TempPayment from "../models/TempPayment.js";


function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();

  d.setMonth(d.getMonth() + months);

  if (d.getDate() < day) {
    d.setDate(0); // clamp to last day
  }

  return d;
}

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

    if (String(status).toLowerCase() !== "success") {
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

console.log("==== DEBUG PLAN ====");
console.log("RAW PLAN:", JSON.stringify(plan));
console.log("RAW LENGTH:", plan.length);
console.log(
  "CHAR CODES:",
  [...plan].map(c => c.charCodeAt(0))
);
console.log(
  "ENUM:",
  Order.schema.path("subscription.plan").enumValues
);
console.log("====================");

const cleanPlan = (value) => {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")   // remove ALL zero-width characters
    .replace(/\s+/g, "")                   // remove whitespace
    .trim()
    .toUpperCase();
};

const normalizedPlan = cleanPlan(plan);

// Validate against enum from Order schema (stronger than PLANS)
const allowedPlans = Order.schema.path("subscription.plan").enumValues;

const exactPlan = allowedPlans.find(
  p => cleanPlan(p) === normalizedPlan
);

if (!exactPlan) {
  console.error("❌ Plan mismatch:", normalizedPlan);
  throw new Error("Invalid subscription plan");
}

const selectedPlan = PLANS[exactPlan];

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

// ⭐ IMPORTANT — dashboard depends on this
existingOrder.subscription.durationMonths = tempPayment.durationMonths;

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

const renewalPlan =
  "RYVIVE " + String(existingOrder.subscription.plan).split("_")[0];
  
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
    <td style="padding: 6px 10px;">: ${renewalPlan}</td>
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

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>

    <!-- LEFT SIDE -->
    <td style="width:35%; vertical-align:top;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">
        Ryvive Roots
      </h2>

      <p style="margin:3px 0 15px 0; color:#555;">
        Live | Relive | Believe
      </p>

      <!-- SOCIAL ICONS -->
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>

      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>

    <!-- CENTER LOGO -->
    <td style="width:30%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>

    <!-- RIGHT SIDE -->
    <td style="width:35%; vertical-align:top; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">
        Dombivli East, Maharashtra 421201, India
      </p>
    </td>

  </tr>
</table>
</div>
`,
  attachments: [
    {
      filename: `invoice-${receiptNumber}.pdf`,
      path: invoicePath,
    },
  ],
});

const previewEnd = addMonthsSafe(
  existingOrder.subscription.endDate,
  tempPayment.durationMonths
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
 <li><b>Plan:</b> ${renewalPlan}</li>
  <li><b>Amount:</b> ₹${tempPayment.amount}</li>
  <li><b>New Expiry:</b> ${previewEnd.toLocaleDateString("en-IN")}</li>
  <li><b>Membership ID:</b> ${existingOrder.membershipId}</li>
  <li><b>Receipt No:</b> ${receiptNumber}</li>
</ul>
<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>

    <!-- LEFT SIDE -->
    <td style="width:35%; vertical-align:top;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">
        Ryvive Roots
      </h2>

      <p style="margin:3px 0 15px 0; color:#555;">
        Live | Relive | Believe
      </p>

      <!-- SOCIAL ICONS -->
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>

      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>

    <!-- CENTER LOGO -->
    <td style="width:30%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>

    <!-- RIGHT SIDE -->
    <td style="width:35%; vertical-align:top; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">
        Dombivli East, Maharashtra 421201, India
      </p>
    </td>

  </tr>
</table>
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
membershipId = await generateMembershipId(User); 

// ensure unique membershipId
let exists = await User.findOne({ membershipId });

while (exists) {
 membershipId = await generateMembershipId(User); 
  exists = await User.findOne({ membershipId });
}

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
const endDate = addMonthsSafe(startDate, selectedPlan.durationMonths);

// 6️⃣ Receipt


// 7️⃣ CREATE ORDER
let orderSaved = false;
let order;
let receiptNumber;

while (!orderSaved) {
  try {
    receiptNumber = await generateReceiptNumber(Order, tempPayment.amount);

    order = new Order({
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
        plan: exactPlan,
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

    await order.save();

    orderSaved = true;

  } catch (err) {
    if (err.code === 11000) {
      console.log("Duplicate receipt detected — retrying...");
    } else {
      throw err;
    }
  }
}

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

const rawPlan = order.subscription?.plan || "";
const formattedPlan = `RYVIVE ${rawPlan.split("_")[0]}`;


    // 7️⃣ SEND CUSTOMER EMAIL (AS-IT-IS)
    await sendEmail({
      to: order.user.email,
      subject: "Thank You, You’re Now Part of the Ryvive Roots Family!",
      html:  `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">

<h2 style="font-family: Georgia, 'Times New Roman', serif;  font-size:16px; margin-bottom:10px;">
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

<table style="width:100%; background:#FFFFFF; padding:25px; font-family:Arial, sans-serif; text-align:left;">

<!-- LOGO -->
<tr>
<td style="padding-bottom:15px;">
  <img src="https://ryviveroots.com/Ryvive.png" width="160" alt="Ryvive Roots" style="display:block;">
</td>
</tr>



<!-- CONTACT DETAILS -->
<tr>
<td style="font-size:14px; color:#333; line-height:1.6;">
  +91 9076000468 /
  97656 00701 <br/>
  subscribe@ryviveroots.com<br/>
  www.ryviveroots.com, https://www.instagram.com/ryvive_roots/<br/>
  Dombivli East, Maharashtra 421201, India
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


    // 8️⃣ SEND COMPANY EMAIL (AS-IT-IS)
    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🧾 New Subscription Order - ${order.membershipId}`,
      html: `
<h2>New Customer Subscription Received</h2>

<ul>
  <li><b>Name:</b> <b>${order.user.firstName} ${order.user.lastName}</b></li>
  <li><b>Phone:</b> <b>${order.user.phone}</b></li>
  <li><b>Email:</b> <b>${order.user.email}</b></li>
  <li><b>Plan:</b> <b>${formattedPlan}</b></li>
  <li><b>Amount:</b> <b>₹${order.subscription.amount}</b></li>
  <li><b>Slot:</b> <b>${order.deliverySlot}</b></li>
  <li><b>Receipt No:</b> <b>${order.receiptNumber}</b></li>
  <li><b>Membership ID:</b> <b>${order.membershipId}</b></li>
</ul>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>

    <!-- LEFT SIDE -->
    <td style="width:33.33%; vertical-align:middle;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">
        Ryvive Roots
      </h2>

      <p style="margin:3px 0 15px 0; color:#555;">
        Live | Relive | Believe
      </p>

      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;">
        <img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/>
      </a>

      <a href="https://www.instagram.com/ryvive_roots/">
        <img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/>
      </a>
    </td>

    <!-- CENTER LOGO -->
    <td style="width:33.33%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>

    <!-- RIGHT SIDE -->
    <td style="width:33.33%; vertical-align:middle; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">
        Dombivli East, Maharashtra 421201, India
      </p>
    </td>

  </tr>
</table>
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
`${process.env.FRONTEND_URL}/payment-success?membershipId=${membershipId}&plan=${formattedPlan}`
);
  } catch (error) {
    console.error("Easebuzz success error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

export const easebuzzFailure = async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
