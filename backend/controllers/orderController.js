import crypto from "crypto";
import Order from "../models/order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import generateChildMembershipId from "../utils/generateChildMembershipId.js";
import TempPayment from "../models/TempPayment.js";

function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
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

    const hashString = [
      process.env.EASEBUZZ_SALT,
      status,
      udf10, udf9, udf8, udf7, udf6, udf5, udf4, udf3, udf2, udf1,
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
    console.log("CHAR CODES:", [...plan].map(c => c.charCodeAt(0)));
    console.log("ENUM:", Order.schema.path("subscription.plan").enumValues);
    console.log("====================");

    const cleanPlan = (value) =>
      String(value || "")
        .normalize("NFKC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/\s+/g, "")
        .trim()
        .toUpperCase();

    const normalizedPlan = cleanPlan(plan);
    const allowedPlans = Order.schema.path("subscription.plan").enumValues;
    const exactPlan = allowedPlans.find(p => cleanPlan(p) === normalizedPlan);

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
    // 🔁 RENEWAL LOGIC
    // =====================================================
    if (tempPayment.isRenewal) {

      const existingOrder = await Order.findOne({
        membershipId: tempPayment.membershipId,
      });

      if (!existingOrder) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      existingOrder.subscription.renewal = {
        pending: true,
        durationMonths: tempPayment.durationMonths,
      };
      existingOrder.subscription.durationMonths = tempPayment.durationMonths;
      existingOrder.subscription.activationAt = activationAt;
      existingOrder.subscription.status = "UNDER_PROCESS";

      await existingOrder.save();

      tempPayment.status = "SUCCESS";
      tempPayment.membershipId = existingOrder.membershipId;
      await tempPayment.save();

      const receiptNumber = await generateReceiptNumber(Order, tempPayment.amount);

      existingOrder.subscription.plan = String(
        existingOrder.subscription.plan
      ).trim().toUpperCase();

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

      await sendEmail({
        to: existingOrder.user.email,
        subject: "You're Back, And We're Glad 🌿",
        html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2>Hi ${existingOrder.user.firstName},</h2>
  <p><b>Welcome back. We're glad you stayed.</b></p>
  <p>Your renewal is a reminder of the commitment we made when we started <b>Ryvive Roots</b> — to support your health with sincerity and consistency.</p>
  <p>Thank you for continuing your wellness journey with us. Here's your renewal summary for your records:</p>
  <table style="border-collapse: collapse; margin-top: 10px;">
    <tr><td style="padding: 6px 10px;"><b>Receipt Number</b></td><td style="padding: 6px 10px;">: ${receiptNumber}</td></tr>
    <tr><td style="padding: 6px 10px;"><b>Plan Renewed</b></td><td style="padding: 6px 10px;">: ${renewalPlan}</td></tr>
    <tr><td style="padding: 6px 10px;"><b>Renewal Duration</b></td><td style="padding: 6px 10px;">: ${tempPayment.durationMonths} Month${tempPayment.durationMonths > 1 ? "s" : ""}</td></tr>
    <tr><td style="padding: 6px 10px;"><b>Amount Paid</b></td><td style="padding: 6px 10px;">: ₹${tempPayment.amount}</td></tr>
    <tr><td style="padding: 6px 10px;"><b>Payment Date</b></td><td style="padding: 6px 10px;">: ${new Date().toLocaleDateString("en-IN")}</td></tr>
  </table>
  <br/>
  <p>Your subscription will be active within <b>48 hours</b>, and your first parcel will be on its way to you within the same timeframe. Keep an eye out for it!</p>
  <p>If you ever have questions or need support, our team is always happy to help — reach us at <b>customersupport@ryviveroots.com</b>.</p>
  <br/>
  <p>Stay Healthy, Stay Vibrant,<br/><b>The Ryvive Roots Team</b></p>
  <table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">
    <tr><td align="center">
      <table style="text-align:center; border-spacing:0;">
        <tr><td style="padding:6px 0;"><img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;"></td></tr>
        <tr><td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">You're receiving this email because you recently activated a Ryvive Roots membership.<br>If you have any concerns, please contact us at <a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">customersupport@ryviveroots.com</a>.</td></tr>
        <tr><td style="padding:8px 0; text-align:center;"><a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;"></a><a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;"></a></td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">+91 9076000468 / 97656 00701</td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;"><a href="https://www.ryviveroots.com" style="text-decoration:none;">www.ryviveroots.com</a></td></tr>
        <tr><td style="padding:6px 0; text-align:center;"><a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">Privacy Policy</a></td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">Dombivli East, Maharashtra 421201, India</td></tr>
        <tr><td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">© 2026 RYVIVE ROOTS All Rights Reserved.</td></tr>
      </table>
    </td></tr>
  </table>
</div>`,
        attachments: [{ filename: `invoice-${receiptNumber}.pdf`, path: invoicePath }],
      });

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
  <li><b>Plan:</b> ${renewalPlan}</li>
  <li><b>Amount:</b> ₹${tempPayment.amount}</li>
  <li><b>New Expiry:</b> ${previewEnd.toLocaleDateString("en-IN")}</li>
  <li><b>Membership ID:</b> ${existingOrder.membershipId}</li>
  <li><b>Receipt No:</b> ${receiptNumber}</li>
</ul>`,
        attachments: [{ filename: `invoice-${receiptNumber}.pdf`, path: invoicePath }],
      });

      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?renewal=success`);
    }

    // =====================================================
    // 🛒 EXISTING CUSTOMER — NEW PLAN PURCHASE
    // =====================================================
    if (tempPayment.isExistingCustomerPurchase) {

      const existingUser = await User.findOne({
        membershipId: tempPayment.membershipId,
      });

      if (!existingUser) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      // ✅ Fetch parent order to copy deliverySlot + address
      const parentOrder = await Order.findOne({
        membershipId: tempPayment.membershipId,
      }).sort({ createdAt: 1 });

      if (!parentOrder) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
      }

      // ✅ Generate child ID: RR202506001 → RR202506001-R1, R2, R3...
      const childMembershipId = await generateChildMembershipId(
        Order,
        existingUser.membershipId
      );

      const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const startDate = new Date(activationAt);
      const endDate = addMonthsSafe(startDate, selectedPlan.durationMonths);
      const receiptNumber = await generateReceiptNumber(Order, tempPayment.amount);

      const order = await Order.create({
        membershipId: childMembershipId,
        receiptNumber,
        user: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          phone: existingUser.phone,
        },
        // ✅ Copied from parent — required by schema
        address: parentOrder.address,
        deliverySlot: parentOrder.deliverySlot,
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
        paymentMethod: "EASEBUZZ",         // ✅ was "ONLINE"
        transactionId: easepayid || txnid || "",
        paymentDetails: {
          gateway: "EASEBUZZ",
          txnid,
          easepayid,
        },
      });

      const invoicePath = await generateInvoice(order);
      order.invoiceUrl = invoicePath;
      await order.save();

      const formattedPlan = `RYVIVE ${exactPlan.split("_")[0]}`;

      await sendEmail({
        to: existingUser.email,
        subject: "Payment successful for RYVIVE ROOTS LLP",
        html: `
<h2>Dear ${existingUser.firstName},</h2>
<p>Your new subscription purchase was successful.</p>
<ul>
  <li><b>Plan:</b> ${formattedPlan}</li>
  <li><b>Amount:</b> ₹${tempPayment.amount}</li>
  <li><b>Receipt Number:</b> ${receiptNumber}</li>
  <li><b>Membership ID:</b> ${childMembershipId}</li>
</ul>
<p>Thank you for choosing Ryvive Roots.</p>`,
        attachments: [{ filename: `invoice-${receiptNumber}.pdf`, path: invoicePath }],
      });

      await sendEmail({
        to: process.env.COMPANY_EMAIL,
        subject: `🧾 Existing Customer Purchased New Plan - ${existingUser.membershipId}`,
        html: `
<h2>Existing Customer Purchased New Subscription</h2>
<ul>
  <li><b>Name:</b> ${existingUser.firstName} ${existingUser.lastName}</li>
  <li><b>Email:</b> ${existingUser.email}</li>
  <li><b>Phone:</b> ${existingUser.phone}</li>
  <li><b>Plan:</b> ${formattedPlan}</li>
  <li><b>Amount:</b> ₹${tempPayment.amount}</li>
  <li><b>Receipt No:</b> ${receiptNumber}</li>
  <li><b>Parent Membership ID:</b> ${existingUser.membershipId}</li>
  <li><b>Child Membership ID:</b> ${childMembershipId}</li>
</ul>`,
        attachments: [{ filename: `invoice-${receiptNumber}.pdf`, path: invoicePath }],
      });

      tempPayment.status = "SUCCESS";
      tempPayment.membershipId = childMembershipId; // ✅ was existingUser.membershipId
      await tempPayment.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-success?membershipId=${childMembershipId}`
      );
    }

    // =====================================================
    // 🆕 NEW CUSTOMER — FRESH SUBSCRIPTION
    // =====================================================

    let user = await User.findOne({
      $or: [{ phone: formData.phone }, { email: formData.email }],
    });

    let membershipId;

    if (user) {
      membershipId = user.membershipId;
    } else {
      membershipId = await generateMembershipId(User);
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

    // ✅ Prevent duplicate order
    const existingOrder = await Order.findOne({
      "paymentDetails.txnid": txnid,
    });

    if (existingOrder) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/subscription-success?membershipId=${existingOrder.membershipId}`
      );
    }

    const activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const startDate = new Date(activationAt);
    const endDate = addMonthsSafe(startDate, selectedPlan.durationMonths);

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
            pincode:  formData.pincode,
            house:    formData.house,
            street:   formData.street,
            landmark: formData.landmark || "",
            city:     "Dombivli",
            state:    "Maharashtra",
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
          paymentMethod: "EASEBUZZ",       // ✅ was "ONLINE"
          transactionId: easepayid || txnid || "",
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

    const invoicePath = await generateInvoice(order);
    order.invoiceUrl = invoicePath;
    await order.save();

    await User.findByIdAndUpdate(user._id, {
      firstName: order.user.firstName,
      lastName:  order.user.lastName,
      email:     order.user.email,
      phone:     order.user.phone,
    });

    const rawPlan = order.subscription?.plan || "";
    const formattedPlan = `RYVIVE ${rawPlan.split("_")[0]}`;

    await sendEmail({
      to: order.user.email,
      subject: "Payment successful for RYVIVE ROOTS LLP",
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2 style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; margin-bottom:2px;">Dear ${order.user.firstName},</h2>
  <p style="font-weight: bold; font-size:22px; margin-bottom:10px;">We just wanted to say thank you so much! We're genuinely thrilled to have you as part of the <b>Ryvive Roots family</b>, and we can't wait to walk alongside you on this wonderful wellness journey.</p>
  <p>Your payment has gone through successfully and everything is all set on our end. Here's a quick summary for your records:</p>
  <table style="font-size:15px; margin-bottom:10px;">
    <tr><td><b>Receipt Number</b></td><td>: <b>${order.receiptNumber}</b></td></tr>
    <tr><td><b>Your Plan</b></td><td>: <b>${formattedPlan}</b></td></tr>
    <tr><td><b>Amount Paid</b></td><td>: <b>₹${order.subscription.amount}</b></td></tr>
    <tr><td><b>Payment Date</b></td><td>: <b>${order.createdAt.toLocaleDateString("en-IN")}</b></td></tr>
  </table>
  <br/>
  <p>Keep an eye on your inbox. You'll be hearing from us shortly with your <b>membership number</b> and all the details to get you started. The good stuff is just around the corner 😊</p>
  <p>And hey, if you ever have a question, a concern, or just want to say hello, we're always here for you. Reach out anytime at customersupport@ryviveroots.com and we'll get back to you with a smile.</p>
  <p>Here's to a healthier, happier you. We're so glad you're here!</p>
  <p>Warmly,<br/><b>Team Ryvive Roots</b></p>
  <table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">
    <tr><td align="center">
      <table style="text-align:center; border-spacing:0;">
        <tr><td style="padding:6px 0;"><img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;"></td></tr>
        <tr><td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">You're receiving this email because you recently activated a Ryvive Roots membership.<br>If you have any concerns, please contact us at <a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">customersupport@ryviveroots.com</a>.</td></tr>
        <tr><td style="padding:8px 0; text-align:center;"><a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;"></a><a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;"><img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;"></a></td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">+91 9076000468 / 97656 00701</td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;"><a href="https://www.ryviveroots.com" style="text-decoration:none;">www.ryviveroots.com</a></td></tr>
        <tr><td style="padding:6px 0; text-align:center;"><a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">Privacy Policy</a></td></tr>
        <tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">Dombivli East, Maharashtra 421201, India</td></tr>
        <tr><td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">© 2026 RYVIVE ROOTS All Rights Reserved.</td></tr>
      </table>
    </td></tr>
  </table>
</div>`,
      attachments: [{ filename: `invoice-${order.receiptNumber}.pdf`, path: invoicePath }],
    });

    order.subscription.thankYouEmailSentAt = new Date();
    order.subscription.welcomeEmailSent = false;
    await order.save();

    await sendEmail({
      to: process.env.COMPANY_EMAIL,
      subject: `🧾 New Subscription Order - ${order.membershipId}`,
      html: `
<h2>New Customer Subscription Received</h2>
<ul>
  <li><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</li>
  <li><b>Phone:</b> ${order.user.phone}</li>
  <li><b>Email:</b> ${order.user.email}</li>
  <li><b>Plan:</b> ${formattedPlan}</li>
  <li><b>Amount:</b> ₹${order.subscription.amount}</li>
  <li><b>Slot:</b> ${order.deliverySlot}</li>
  <li><b>Receipt No:</b> ${order.receiptNumber}</li>
  <li><b>Membership ID:</b> ${order.membershipId}</li>
</ul>
<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>
    <td style="width:33.33%; vertical-align:middle;">
      <h2 style="margin:0; font-weight:bold; font-size:22px; color:#243E36;">Ryvive Roots</h2>
      <p style="margin:3px 0 15px 0; color:#555;">Live | Relive | Believe</p>
      <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="margin-right:8px;"><img src="https://ryviveroots.com/link.png" width="28" alt="LinkedIn"/></a>
      <a href="https://www.instagram.com/ryvive_roots/"><img src="https://ryviveroots.com/ins.png" width="28" alt="Instagram"/></a>
    </td>
    <td style="width:33.33%; text-align:center; vertical-align:middle;">
      <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots"/>
    </td>
    <td style="width:33.33%; vertical-align:middle; font-size:14px; color:#333;">
      <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
      <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
      <p style="margin:5px 0;">www.ryviveroots.com</p>
      <p style="margin:5px 0;">Dombivli East, Maharashtra 421201, India</p>
    </td>
  </tr>
</table>`,
      attachments: [{ filename: `invoice-${order.receiptNumber}.pdf`, path: invoicePath }],
    });

    tempPayment.status = "SUCCESS";
    tempPayment.membershipId = membershipId;
    await tempPayment.save();

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