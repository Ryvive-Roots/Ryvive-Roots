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
    const { status, txnid, hash, easepayid } = req.body;

    if (status !== "success") {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    // 1️⃣ Fetch temp payment FIRST
    const tempPayment = await TempPayment.findOne({ txnid });
    if (!tempPayment) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }

    // 2️⃣ Prevent duplicate processing
    if (tempPayment.status === "SUCCESS") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/subscription-success?membershipId=${tempPayment.membershipId}`
      );
    }

    // 3️⃣ Prepare hash values
    const easebuzzAmount = tempPayment.amount.toString();
    const productinfo = "Subscription Payment";
    const firstname = tempPayment.formData.firstName;
    const email = tempPayment.formData.email;

    const hashString = [
      process.env.EASEBUZZ_SALT,
      status,
      "", "", "", "", "",
      email,
      firstname,
      productinfo,
      easebuzzAmount,
      txnid,
      process.env.EASEBUZZ_MERCHANT_KEY,
    ].join("|");

    const expectedHash = crypto
      .createHash("sau212")
      .update(hashString)
      .digest("hex");

    if (expectedHash !== hash) {
      console.error("Easebuzz hash mismatch");
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
    }


    const { formData, plan } = tempPayment;
    const selectedPlan = PLANS[plan];

    // 3️⃣ USER + MEMBERSHIP
    let user = await User.findOne({
      $or: [{ phone: formData.phone }, { email: formData.email }],
    });

    const membershipId =
      user?.membershipId ||
      (await generateMembershipId(Order, tempPayment.amount));

    if (!user) {
      user = await User.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        membershipId,
      });
    }

    // 4️⃣ Subscription dates
    const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const startDate = new Date(activationAt);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + selectedPlan.durationMonths);

    // 5️⃣ Receipt
    const receiptNumber = await generateReceiptNumber(
      Order,
      tempPayment.amount
    );

    const existingOrder = await Order.findOne({
      "paymentDetails.txnid": txnid,
    });

    if (existingOrder) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/subscription-success?membershipId=${existingOrder.membershipId}`
      );
    }

    // 6️⃣ CREATE ORDER
    const order = await Order.create({
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
        plan,
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

    // 🔄 Update temp payment
    tempPayment.status = "SUCCESS";
    tempPayment.membershipId = membershipId;
    await tempPayment.save();

    await User.findByIdAndUpdate(user._id, {
      firstName: order.user.firstName,
      lastName: order.user.lastName,
      email: order.user.email,
      phone: order.user.phone,
    });

    // 7️⃣ Generate Invoice
    const invoicePath = await generateInvoice(order);
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
