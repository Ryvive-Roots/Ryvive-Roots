import express from "express";
import Order from "../models/order.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import sendEmail from "../utils/sendEmail.js";
import generateInvoice from "../utils/generateInvoice.js";
import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import generateMembershipId from "../utils/generateMembershipId.js";
import {
  PLANS,
  ADD_ON_FEATURE_PLANS,
  getAddOnPlanConfig,
} from "../utils/planConfig.js";
import User from "../models/User.js";
import { rebuildExcelFromMongo } from "../utils/excelHelper.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { impersonateUser } from "../controllers/adminController.js";


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

// Fixed-length cycle math — 1 month = 24 days, 3 months = 72 days, always.
function addPlanDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days));
  return d;
}

// Adds `mealDays` delivery days (Mon–Sat only, skipping every Sunday).
// Returns the calendar date on which the last delivery day falls.
function addMealDays(startDate, mealDays) {
  const d = new Date(startDate);
  d.setHours(0, 0, 0, 0);
  let count = d.getDay() !== 0 ? 1 : 0; // does the start date itself count as day 1?
  while (count < mealDays) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) count++;
  }
  return d;
}

router.post("/impersonate", impersonateUser);

/* ===========================
   GET ALL ORDERS (ADMIN)
=========================== */
router.get("/orders", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ ACTIVATE PENDING ORDERS
    const pendingOrders = await Order.find({
      "subscription.status": "UNDER_PROCESS",
    });

   for (const order of pendingOrders) {
  try {
    if (!order.subscription || !order.subscription.activationAt) continue;

    const activation = new Date(order.subscription.activationAt);

    if (isNaN(activation)) continue;

    activation.setHours(0, 0, 0, 0);

    if (activation <= today) {
      order.subscription.status = "ACTIVE";

      if (order.subscription.renewal?.pending) {
        order.subscription.pause = { used: 0, history: [] };
        order.subscription.renewal.pending = false;
      }

      await order.save();
    }
  } catch (err) {
    console.error("❌ Order processing failed:", order._id, err.message);
  }
}

    // ✅ FETCH ALL ORDERS
    const orders = await Order.find().sort({ createdAt: 1 });

    // 🔴 EXPIRED LOGIC (fixed)
    for (const order of orders) {
      if (
        order.subscription?.status === "ACTIVE" &&
        order.subscription?.endDate
      ) {
        const expiry = new Date(order.subscription.endDate);
        expiry.setHours(0, 0, 0, 0);

        if (expiry < today) {
          order.subscription.status = "EXPIRED"; // only for response
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
   (handles BOTH new customers AND existing customers buying a new/renewed plan)
=========================== */
router.post("/manual-order", async (req, res) => {
  try {
    const {
      user,
      address,
      plan,
      slot,
      paymentMethod,
      healthInfo,
      remarks,
      totalPrice,

      // NEW CUSTOM PACKAGE FIELDS
      customPackagePrice,
      additionalDurationDays,
      addOnFeatures,
    } = req.body;

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

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

    // =====================================================
    // ADD-ON / CUSTOMIZED PACKAGE DETECTION
    // =====================================================

    const isAddon = String(plan || "").endsWith("_ADDON");

    // ✅ FIX: strip the "_ADDON" suffix so subscription.plan
    // always stores one of the 6 clean enum values that
    // Order schema's subscription.plan enum accepts.
    const basePlanKey = isAddon ? plan.replace("_ADDON", "") : plan;

    // =====================================================
    // PLAN CONFIGURATION
    // =====================================================

    let selectedPlan = null;
    let addonPlanConfig = null;

    if (isAddon) {
      addonPlanConfig = getAddOnPlanConfig(plan);

      if (!addonPlanConfig) {
        return res.status(400).json({
          success: false,
          message: "Invalid add-on package selected",
        });
      }

      selectedPlan = PLANS[addonPlanConfig.basePlan];

      if (!selectedPlan) {
        return res.status(400).json({
          success: false,
          message: "Base plan configuration not found",
        });
      }
    } else {
      selectedPlan = PLANS[plan];

      if (!selectedPlan) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan selected",
        });
      }
    }

    // =====================================================
    // ADD-ON FEATURES
    // =====================================================

    const selectedAddOnFeatures =
      isAddon && Array.isArray(addOnFeatures) ? addOnFeatures : [];

    // =====================================================
    // BASE PLAN PRICE
    // =====================================================

    const basePlanPrice = isAddon
      ? Number(addonPlanConfig.basePlanPrice || selectedPlan.price || 0)
      : Number(selectedPlan.price || 0);

    // =====================================================
    // CUSTOM PACKAGE PRICE
    // =====================================================

    const finalCustomPackagePrice = isAddon
      ? Math.max(0, Number(customPackagePrice || 0))
      : 0;

    // =====================================================
    // ADDITIONAL DURATION
    // =====================================================

    const finalAdditionalDurationDays = isAddon
      ? Math.max(0, Number(additionalDurationDays || 0))
      : 0;

    // =====================================================
    // BASE DURATION
    // =====================================================

    const baseDurationDays = isAddon
      ? Number(addonPlanConfig.durationDays) ||
        Number(selectedPlan.durationDays) ||
        Number(selectedPlan.durationMonths || 1) * 24
      : Number(selectedPlan.durationDays) ||
        Number(selectedPlan.durationMonths || 1) * 24;

    // =====================================================
    // DURATION MONTHS
    // =====================================================

    const months = isAddon
      ? Number(addonPlanConfig.durationMonths) || 1
      : Number(selectedPlan.durationMonths) || 1;

    // =====================================================
    // FINAL DURATION
    // =====================================================

    const durationDays = baseDurationDays + finalAdditionalDurationDays;

    // =====================================================
    // FINAL AMOUNT
    // =====================================================

    const amount = isAddon
      ? basePlanPrice + finalCustomPackagePrice
      : totalPrice || selectedPlan.price;

    // =====================================================
    // ADD-ON VALIDATION
    // =====================================================

    if (isAddon) {
      if (basePlanPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Base plan price is invalid",
        });
      }

      if (finalCustomPackagePrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Custom package price cannot be negative",
        });
      }

      if (durationDays <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid package duration",
        });
      }
    }

    // =====================================================
    // FIND EXISTING CUSTOMER
    // =====================================================

    const existingUser = await User.findOne({
      $or: [
        ...(user.phone ? [{ phone: user.phone }] : []),
        ...(user.email ? [{ email: user.email }] : []),
      ],
    });

    let existingOrder = null;

    if (existingUser?.membershipId) {
      existingOrder = await Order.findOne({
        membershipId: existingUser.membershipId,
      });
    }

    // =====================================================
    // PREVENT ACCIDENTAL DUPLICATE ORDER
    // =====================================================

    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);

    if (existingOrder) {
      const recentOrder = await Order.findOne({
        membershipId: existingOrder.membershipId,
        updatedAt: { $gte: tenSecondsAgo },
      });

      if (recentOrder) {
        return res.status(429).json({
          success: false,
          message: "Order already submitted. Please wait a few seconds.",
        });
      }
    }

    // =====================================================
    // CALCULATE ACTIVATION / START DATE
    // =====================================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate;
    let activationAt;
    let status = "UNDER_PROCESS";

    if (req.body.startDate) {
      startDate = new Date(req.body.startDate);
      startDate.setHours(0, 0, 0, 0);

      activationAt = new Date(startDate);

      status = startDate <= today ? "ACTIVE" : "UNDER_PROCESS";
    } else {
      activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      startDate = new Date(activationAt);
      status = "UNDER_PROCESS";
    }

    // =====================================================
    // ORDER VARIABLES
    // =====================================================

    let order;
    let isRenewal = false;

    // =====================================================
    // EXISTING CUSTOMER
    // =====================================================

    if (existingOrder) {
      isRenewal = true;

      const oldPlan = existingOrder.subscription.plan;
      const oldAmount = existingOrder.subscription.amount;
      const oldDurationMonths = existingOrder.subscription.durationMonths;
      const oldStartDate = existingOrder.subscription.startDate;
      const oldActivationAt = existingOrder.subscription.activationAt;
      const oldEndDate = existingOrder.subscription.endDate;

      const baseEndDate = oldEndDate
        ? new Date(oldEndDate)
        : new Date(activationAt);

      const extendFrom = baseEndDate > activationAt ? baseEndDate : activationAt;

      const newEndDate = addMealDays(extendFrom, durationDays);

      const receiptNumber = await generateReceiptNumber(Order);

      existingOrder.subscription.renewalHistory =
        existingOrder.subscription.renewalHistory || [];

      existingOrder.subscription.renewalHistory.push({
        date: new Date(),
        plan: oldPlan,
        durationMonths: oldDurationMonths,
        amount: oldAmount,
        paymentMethod: paymentMethod || "CASH",
        startDate: oldStartDate,
        activationAt: oldActivationAt,
        endDate: oldEndDate,
      });

      existingOrder.subscription.plan = basePlanKey;
      existingOrder.subscription.amount = amount;
      existingOrder.subscription.originalAmount = amount;
      existingOrder.subscription.durationMonths = months;

      existingOrder.subscription.isAddon = isAddon;
      existingOrder.subscription.basePlanPrice = basePlanPrice;
      existingOrder.subscription.customPackagePrice = finalCustomPackagePrice;
      existingOrder.subscription.addOnFeatures = selectedAddOnFeatures;
      existingOrder.subscription.baseDurationDays = baseDurationDays;
      existingOrder.subscription.additionalDurationDays = finalAdditionalDurationDays;
      existingOrder.subscription.durationDays = durationDays;

      existingOrder.subscription.activationAt = activationAt;
      existingOrder.subscription.startDate = startDate;
      existingOrder.subscription.endDate = newEndDate;
      existingOrder.subscription.status = status;
      existingOrder.subscription.renewedAt = new Date();
      existingOrder.subscription.renewalTriggeredBy = "ADMIN";

      if (status === "ACTIVE") {
        existingOrder.subscription.pause = {
          used: 0,
          history: existingOrder.subscription.pause?.history || [],
        };
      }

      existingOrder.receiptNumber = receiptNumber;
      existingOrder.paymentMethod = paymentMethod || "CASH";
      existingOrder.paymentStatus = "PAID";

      existingOrder.user.firstName = user.firstName;
      existingOrder.user.lastName =
        user.lastName || existingOrder.user.lastName || "";
      existingOrder.user.phone = user.phone;
      existingOrder.user.email = user.email || existingOrder.user.email || "";

      if (user.dob) {
        existingOrder.user.dob = user.dob;
      }

      existingOrder.address = {
        pincode: address.pincode,
        house: address.house,
        street: address.street,
        landmark:
          address.landmark || existingOrder.address?.landmark || "",
        city: address.city || existingOrder.address?.city || "Dombivli",
        state:
          address.state || existingOrder.address?.state || "Maharashtra",
      };

      existingOrder.healthInfo = {
        allergies:
          healthInfo?.allergies || existingOrder.healthInfo?.allergies || "N/A",
        medicalConditions:
          healthInfo?.medicalConditions ||
          existingOrder.healthInfo?.medicalConditions ||
          "N/A",
      };

      existingOrder.remarks = remarks || existingOrder.remarks || "";
      existingOrder.deliverySlot = slot;

      await existingOrder.save();

      order = existingOrder;

      console.log(
        "♻️ EXISTING CLIENT RENEWED VIA MANUAL ORDER:",
        order.membershipId
      );
    } else {
      // =====================================================
      // TRUE NEW CUSTOMER
      // =====================================================

      const membershipId = await generateMembershipId(Order, amount);
      const receiptNumber = await generateReceiptNumber(Order);
      const endDate = addMealDays(startDate, durationDays);

      order = await Order.create({
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
          plan: basePlanKey,
          amount: amount,
          originalAmount: amount,

          isAddon: isAddon,
          basePlanPrice: basePlanPrice,
          customPackagePrice: finalCustomPackagePrice,
          addOnFeatures: selectedAddOnFeatures,

          durationMonths: months,
          baseDurationDays: baseDurationDays,
          additionalDurationDays: finalAdditionalDurationDays,
          durationDays: durationDays,

          activationAt: activationAt,
          startDate: startDate,
          endDate: endDate,

          pause: { used: 0, history: [] },

          status: status,
        },

        paymentStatus: "PAID",
        paymentMethod: paymentMethod || "CASH",
      });

      console.log("✅ NEW MANUAL ORDER SAVED:", order.membershipId);
    }

    // =====================================================
    // REBUILD EXCEL
    // =====================================================

    try {
      await rebuildExcelFromMongo();
      console.log("📊 Excel updated successfully");
    } catch (err) {
      console.error("❌ Excel rebuild failed:", err.message);
    }

    // =====================================================
    // SYNC USER COLLECTION
    // =====================================================

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

    // =====================================================
    // GENERATE INVOICE PDF
    // =====================================================

    const invoicePath = await generateInvoice(order);
    order.invoiceUrl = invoicePath;
    await order.save();

    // =====================================================
    // EXCEL PATH
    // =====================================================

    const excelPath = path.join(__dirname, "..", "exports", "members.xlsx");

    // =====================================================
    // SHARED EMAIL FOOTER (matches easebuzzSuccess format)
    // =====================================================

    const emailFooter = `
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
`;

    // =====================================================
    // CUSTOMER EMAIL
    // =====================================================

    if (order.user.email) {
      const rawPlan = order.subscription?.plan || "";

      let formattedPlan = `RYVIVE ${rawPlan.split("_")[0]}`;

      if (order.subscription?.isAddon) {
        const emailBasePlanKey = rawPlan.replace("_ADDON", "");
        const baseParts = emailBasePlanKey.split("_");
        const basePlanName = baseParts[0] || "RYVIVE";
        const baseDuration = baseParts[1] || "";

        formattedPlan = `RYVIVE ${basePlanName} ${baseDuration.replace(
          "MONTH",
          " MONTH"
        )}`;
      }

      const subscription = order.subscription || {};
      const emailIsAddon = Boolean(subscription.isAddon);
      const emailAddOnFeatures = Array.isArray(subscription.addOnFeatures)
        ? subscription.addOnFeatures
        : [];

      const addOnFeaturesHtml =
        emailAddOnFeatures.length > 0
          ? emailAddOnFeatures.map((feature) => `• ${feature}`).join("<br>")
          : "None";

      await sendEmail({
        to: order.user.email,

        subject: isRenewal
          ? emailIsAddon
            ? "Your Customized Package Has Been Renewed 🌿"
            : "You're Back, And We're Glad 🌿"
          : emailIsAddon
          ? "Your Customized RYVIVE ROOTS Package Is Confirmed 🌿"
          : "Payment successful for RYVIVE ROOTS LLP",

        // =====================================================
        // EMAIL BODY — colorless, receipt-style layout
        // =====================================================
        html: isRenewal
          ? `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">

  <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 400; margin: 0 0 4px;">
    Hi ${order.user.firstName},
  </p>

  <p style="font-size: 15px; font-weight: 600; margin: 0 0 18px; letter-spacing: 0.2px;">
    ${
      emailIsAddon
        ? "Your customized package has been renewed successfully."
        : "Welcome back — we're glad you stayed."
    }
  </p>

  <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 24px;">
    Thank you for continuing your wellness journey with us. Here is your subscription summary for your records.
  </p>

  <!-- RECEIPT CARD -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; margin-bottom: 24px;">
    <tbody>
      <tr>
        <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid #e0e0e0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888;">
          Subscription Summary
        </td>
      </tr>

      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Receipt Number</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${order.receiptNumber}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Plan</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${formattedPlan}</td>
      </tr>

      ${
        emailIsAddon
          ? `
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Package Type</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">Customized Package</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Base Plan Price</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">₹${Number(
          subscription.basePlanPrice || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Customized Package Price</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">₹${Number(
          subscription.customPackagePrice || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666; vertical-align: top;">Add-on Features</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right; line-height: 1.6;">${addOnFeaturesHtml}</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Base Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">${
          subscription.baseDurationDays || 0
        } days</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Additional Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">+${
          subscription.additionalDurationDays || 0
        } days</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Final Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${
          subscription.durationDays || 0
        } days</td>
      </tr>
      `
          : ""
      }

      <tr style="border-top: 1px solid #e0e0e0;">
        <td style="padding: 14px 18px; font-size: 14px; font-weight: 700;">Amount Paid</td>
        <td style="padding: 14px 18px; font-size: 15px; font-weight: 700; text-align: right;">₹${Number(
          order.subscription.amount || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Payment Date</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">${new Date().toLocaleDateString(
          "en-IN"
        )}</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">New Expiry Date</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${new Date(
          order.subscription.endDate
        ).toLocaleDateString("en-IN")}</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 13px; color: #666; margin: 0 0 4px;">
    Your membership ID remains <strong style="color:#111;">${order.membershipId}</strong>.
  </p>

  <p style="font-size: 13px; line-height: 1.7; color: #666; margin: 16px 0;">
    If you ever have a question or concern, reach out anytime at
    <a href="mailto:customersupport@ryviveroots.com" style="color:#111; text-decoration: underline;">customersupport@ryviveroots.com</a>.
  </p>

  <p style="font-size: 14px; margin: 24px 0 0;">
    Warmly,<br/>
    <strong>Team Ryvive Roots</strong>
  </p>

${emailFooter}

</div>
`
          : `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">

  <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; font-weight: 400; margin: 0 0 6px;">
    Dear ${order.user.firstName},
  </p>

  <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 17px; font-weight: 600; line-height: 1.55; margin: 0 0 20px;">
    Thank you so much — we're genuinely thrilled to have you as part of the Ryvive Roots family, and we can't wait to walk alongside you on this wellness journey.
  </p>

  <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 20px;">
    Your payment has gone through successfully and everything is set on our end. Here's a quick summary for your records.
  </p>

  ${
    emailIsAddon
      ? `
  <p style="font-size: 13px; color: #666; margin: 0 0 20px;">
    Your <strong style="color:#111;">Customized RYVIVE ROOTS Package</strong> has been successfully created.
  </p>
  `
      : ""
  }

  <!-- RECEIPT CARD -->
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; margin-bottom: 24px;">
    <tbody>
      <tr>
        <td colspan="2" style="padding: 14px 18px; border-bottom: 1px solid #e0e0e0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #888;">
          Order Summary
        </td>
      </tr>

      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Receipt Number</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${order.receiptNumber}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Your Plan</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${formattedPlan}</td>
      </tr>

      ${
        emailIsAddon
          ? `
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Package Type</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">Customized Package</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Base Plan Price</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">₹${Number(
          subscription.basePlanPrice || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Customized Package Price</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">₹${Number(
          subscription.customPackagePrice || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666; vertical-align: top;">Add-on Features</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right; line-height: 1.6;">${addOnFeaturesHtml}</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Base Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">${
          subscription.baseDurationDays || 0
        } days</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Additional Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">+${
          subscription.additionalDurationDays || 0
        } days</td>
      </tr>
      <tr>
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Final Duration</td>
        <td style="padding: 10px 18px; font-size: 13px; font-weight: 600; text-align: right;">${
          subscription.durationDays || 0
        } days</td>
      </tr>
      `
          : ""
      }

      <tr style="border-top: 1px solid #e0e0e0;">
        <td style="padding: 14px 18px; font-size: 14px; font-weight: 700;">Amount Paid</td>
        <td style="padding: 14px 18px; font-size: 15px; font-weight: 700; text-align: right;">₹${Number(
          order.subscription.amount || 0
        ).toLocaleString("en-IN")}</td>
      </tr>
      <tr style="background: #fafafa;">
        <td style="padding: 10px 18px; font-size: 13px; color: #666;">Payment Date</td>
        <td style="padding: 10px 18px; font-size: 13px; text-align: right;">${
          order.createdAt
            ? order.createdAt.toLocaleDateString("en-IN")
            : new Date().toLocaleDateString("en-IN")
        }</td>
      </tr>
    </tbody>
  </table>

  <p style="font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 16px;">
    Keep an eye on your inbox — you'll be hearing from us shortly with your <strong style="color:#111;">membership number</strong> and everything you need to get started.
  </p>

  <p style="font-size: 13px; line-height: 1.7; color: #666; margin: 0 0 16px;">
    Have a question or just want to say hello? Reach out anytime at
    <a href="mailto:customersupport@ryviveroots.com" style="color:#111; text-decoration: underline;">customersupport@ryviveroots.com</a> — we'll get back to you with a smile.
  </p>

  <p style="font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
    Here's to a healthier, happier you. We're so glad you're here.
  </p>

  <p style="font-size: 14px; margin: 0;">
    Warmly,<br/>
    <strong>Team Ryvive Roots</strong>
  </p>

${emailFooter}

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

    // =====================================================
    // COMPANY EMAIL
    // =====================================================

    await sendEmail({
      to: process.env.COMPANY_EMAIL,

      subject: isRenewal
        ? `🔁 Manual Renewal - ${order.membershipId}`
        : `🧾 Manual Membership Added - ${order.membershipId}`,

      html: `
<h2>${isRenewal ? "Existing Member Renewed (Manual)" : "New Walk-in Member Added"}</h2>

<p><b>Name:</b> ${order.user.firstName} ${order.user.lastName}</p>

<p><b>Phone:</b> ${order.user.phone}</p>

<p><b>Email:</b> ${order.user.email || "N/A"}</p>

<p><b>Allergies:</b> ${order.healthInfo?.allergies || "N/A"}</p>

<p><b>Medical Conditions:</b> ${order.healthInfo?.medicalConditions || "N/A"}</p>

<p><b>📝 Remarks:</b> ${order.remarks || "—"}</p>

<p><b>Plan:</b> ${order.subscription.plan}</p>

${
  order.subscription?.isAddon
    ? `
<p><b>Package Type:</b> Customized Package</p>

<p><b>Base Plan Price:</b> ₹${Number(order.subscription.basePlanPrice || 0).toLocaleString(
        "en-IN"
      )}</p>

<p><b>Customized Package Price:</b> ₹${Number(
        order.subscription.customPackagePrice || 0
      ).toLocaleString("en-IN")}</p>

<p><b>Add-on Features:</b> ${
        order.subscription.addOnFeatures?.length
          ? order.subscription.addOnFeatures.join(", ")
          : "None"
      }</p>

<p><b>Base Duration:</b> ${order.subscription.baseDurationDays || 0} days</p>

<p><b>Additional Duration:</b> +${order.subscription.additionalDurationDays || 0} days</p>

<p><b>Final Duration:</b> ${order.subscription.durationDays || 0} days</p>
`
    : ""
}

<p><b>Amount:</b> ₹${Number(order.subscription.amount || 0).toLocaleString("en-IN")}</p>

<p><b>Slot:</b> ${order.deliverySlot}</p>

<p><b>Membership ID:</b> ${order.membershipId}</p>

<p><b>Receipt:</b> ${order.receiptNumber}</p>

<p><b>Address:</b><br/>
${order.address.house}, ${order.address.street}<br/>
${order.address.landmark}<br/>
${order.address.city} - ${order.address.pincode}</p>

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

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.json({
      success: true,
      order,
      renewed: isRenewal,
    });
  } catch (error) {
    console.error("❌ MANUAL ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      // TEMP: surfacing error.message helps debugging from the
      // browser Network tab / alert. Remove once confirmed stable.
      message: error.message || "Failed to create manual order",
    });
  }
});

router.put("/order/:id/health", async (req, res) => {
  try {
    const { user, healthInfo, remarks, address } = req.body;

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
  "user.firstName": user?.firstName,
  "user.lastName": user?.lastName,
  "user.phone": user?.phone,
  "user.email": user?.email,
  "user.dob": user?.dob,

  healthInfo,
  remarks,

  // ✅ ADDRESS UPDATE
  "address.house": address?.house,
  "address.street": address?.street,
  "address.landmark": address?.landmark,
  "address.city": address?.city,
},
      },
      { new: true }
    );

 // 3️⃣ Sync User collection
if (user?.phone || user?.email) {

  await User.findOneAndUpdate(

    { membershipId: order.membershipId },

    {
      ...(user?.phone && {
        phone: user.phone,
      }),

      ...(user?.email && {
        email: user.email,
      }),
    }

  );

}

 const phoneChanged =
  user?.phone !== oldOrder.user.phone;

const emailChanged =
  user?.email !== oldOrder.user.email;

const firstNameChanged =
  user?.firstName !== oldOrder.user.firstName;

const lastNameChanged =
  user?.lastName !== oldOrder.user.lastName;

const dobChanged =
  new Date(user?.dob).toISOString() !==
  new Date(oldOrder.user.dob).toISOString();


const addressChanged =
  (address?.house !== undefined &&
    oldOrder.address?.house !== address.house) ||

  (address?.street !== undefined &&
    oldOrder.address?.street !== address.street) ||

  (address?.landmark !== undefined &&
    oldOrder.address?.landmark !== address.landmark) ||

  (address?.city !== undefined &&
    oldOrder.address?.city !== address.city) ||

  (address?.pincode !== undefined &&
    oldOrder.address?.pincode !== address.pincode);


const healthChanged =
  JSON.stringify(healthInfo || {}) !==
  JSON.stringify(oldOrder.healthInfo || {});

const remarksChanged =
  (remarks || "") !== (oldOrder.remarks || "");

// ✅ ANY CHANGE
const anyChanges =
  phoneChanged ||
  emailChanged ||
  firstNameChanged ||
  lastNameChanged ||
  dobChanged ||
  addressChanged ||
  healthChanged ||
  remarksChanged;


/* =====================================
   CUSTOMER EMAIL
===================================== */

try {

  if (anyChanges && order.user.email) {

  
await sendEmail({
  to: order.user.email,

  subject: "Your Account Has Been Updated – Ryvive Roots",

  html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">

<h2 style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; margin-bottom:2px;">
  Dear ${order.user.firstName || "Customer"},
</h2>

<p style="font-size:15px;">
  We're writing to confirm that changes have been made to your
  <b>Ryvive Roots</b> account successfully.
</p>

<p>
  Here’s a quick summary of the updated information:
</p>

<table style="font-family: Arial, 'Times New Roman', serif; font-size:15px; margin-bottom:10px;">

  <tr>
    <td><b>Membership ID</b></td>
    <td>: <b>${order.membershipId}</b></td>
  </tr>

  <tr>
    <td><b>Membership Plan</b></td>
    <td>: <b>${order.subscription?.plan || "-"}</b></td>
  </tr>

  <tr>
    <td><b>Updated Date</b></td>
    <td>: <b>${new Date().toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}</b></td>
  </tr>

  <tr>
    <td><b>Updated Time</b></td>
    <td>: <b>${new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}</b></td>
  </tr>

</table>

<br/>

<h3 style="margin-bottom:10px;">Updated Changes</h3>

<ul style="padding-left:20px; font-size:15px;">

  ${
    firstNameChanged || lastNameChanged
      ? `
      <li>
        <b>Name:</b>
        ${oldOrder.user.firstName} ${oldOrder.user.lastName}
        →
        ${order.user.firstName} ${order.user.lastName}
      </li>
    `
      : ""
  }

  ${
    phoneChanged
      ? `
      <li>
        <b>Phone Number:</b>
        ${oldOrder.user.phone}
        →
        ${order.user.phone}
      </li>
    `
      : ""
  }

  ${
    emailChanged
      ? `
      <li>
        <b>Email Address:</b>
        ${oldOrder.user.email || "N/A"}
        →
        ${order.user.email}
      </li>
    `
      : ""
  }

  ${
    dobChanged
      ? `
      <li>
        <b>Date of Birth:</b>
        Updated Successfully
      </li>
    `
      : ""
  }

  ${
    addressChanged
      ? `
      <li>
        <b>Address Information:</b>
        Updated Successfully
      </li>
    `
      : ""
  }

  ${
    healthChanged
      ? `
      <li>
        <b>Health Information:</b>
        Updated Successfully
      </li>
    `
      : ""
  }

  ${
    remarksChanged
      ? `
      <li>
        <b>Remarks:</b>
        ${order.remarks || "—"}
      </li>
    `
      : ""
  }

</ul>

<br/>

<p>
  All changes have been saved successfully and will reflect in your upcoming deliveries and account records.
</p>

<p>
  If you did not request these changes or notice anything unusual,
  please contact us immediately.
</p>

<p>
  Thank you for being a valued member of the
  <b>Ryvive Roots family</b>.
</p>

<p>
  Warm regards,<br/>
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
You're receiving this email because your Ryvive Roots account information was recently updated.<br>
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
});


    
  }

} catch (err) {

  console.error(
    "❌ Customer email failed:",
    err.message
  );

}


/* =====================================
   COMPANY EMAIL
===================================== */

try {

  if (anyChanges) {

    await sendEmail({

      to: process.env.COMPANY_EMAIL,

      subject: `✏️ Member Details Updated - ${order.membershipId}`,

      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">

          <h2>Member Profile Updated</h2>

          <p>
            <b>Name:</b>
            ${order.user.firstName} ${order.user.lastName}
          </p>

          <p>
            <b>Membership ID:</b>
            ${order.membershipId}
          </p>

          <p>
            <b>Updated On:</b>
            ${new Date().toLocaleString("en-IN")}
          </p>

          <br/>

          <h3>Changes:</h3>

          <ul>

            ${
              firstNameChanged || lastNameChanged
                ? `
                  <li>
                    👤 Name:
                    ${oldOrder.user.firstName} ${oldOrder.user.lastName}
                    →
                    ${order.user.firstName} ${order.user.lastName}
                  </li>
                `
                : ""
            }

            ${
              phoneChanged
                ? `
                  <li>
                    📞 Phone:
                    ${oldOrder.user.phone}
                    →
                    ${order.user.phone}
                  </li>
                `
                : ""
            }

            ${
              emailChanged
                ? `
                  <li>
                    📧 Email:
                    ${oldOrder.user.email || "N/A"}
                    →
                    ${order.user.email}
                  </li>
                `
                : ""
            }

            ${
              dobChanged
                ? `
                  <li>
                    🎂 DOB Updated
                  </li>
                `
                : ""
            }

            ${
              addressChanged
                ? `
                  <li>
                    🏠 Address Updated
                  </li>
                `
                : ""
            }

            ${
              healthChanged
                ? `
                  <li>
                    🩺 Health Info Updated
                    <ul>
                      <li>
                        Allergies:
                        ${order.healthInfo?.allergies || "N/A"}
                      </li>

                      <li>
                        Medical Conditions:
                        ${order.healthInfo?.medicalConditions || "N/A"}
                      </li>
                    </ul>
                  </li>
                `
                : ""
            }

            ${
              remarksChanged
                ? `
                  <li>
                    📝 Remarks:
                    ${order.remarks || "—"}
                  </li>
                `
                : ""
            }

          </ul>

        </div>
      `,
    });

  }

} catch (err) {

  console.error(
    "❌ Company email failed:",
    err.message
  );

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

/* ===========================
   MARK NO-DELIVERY DAY (extends endDate by 1 day)
=========================== */
router.post("/no-delivery", async (req, res) => {
  try {
    const { date, reason, orderIds, appliedBy } = req.body;

    if (!date || !reason || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "date, reason, and at least one orderId are required.",
      });
    }

    const noDeliveryDate = new Date(date);
    noDeliveryDate.setHours(0, 0, 0, 0);

    const results = { updated: [], skipped: [] };

    for (const orderId of orderIds) {
      const order = await Order.findById(orderId);
      if (!order) {
        results.skipped.push({ orderId, reason: "Order not found" });
        continue;
      }

      // Prevent applying the same no-delivery date twice to the same order
      const alreadyLogged = (order.subscription?.noDeliveryHistory || []).some(
        (entry) =>
          new Date(entry.date).toDateString() === noDeliveryDate.toDateString()
      );
      if (alreadyLogged) {
        results.skipped.push({ orderId, reason: "Already logged for this date" });
        continue;
      }

      // Log the no-delivery entry
      order.subscription.noDeliveryHistory = order.subscription.noDeliveryHistory || [];
      order.subscription.noDeliveryHistory.push({
        date: noDeliveryDate,
        reason,
        daysAdded: 1,
        appliedBy: appliedBy || "Admin",
        appliedAt: new Date(),
      });

      // Extend the subscription end date by 1 calendar day
      if (order.subscription.endDate) {
        const newEnd = new Date(order.subscription.endDate);
        newEnd.setDate(newEnd.getDate() + 1);
        order.subscription.endDate = newEnd;
      }

      await order.save();
      results.updated.push(orderId);

      // Audit log entry — non-blocking, matches your pattern elsewhere
      try {
        await AuditLog.create({
          customerName: `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim(),
          action: "NO_DELIVERY_EXTENSION",
          details: `No-delivery day on ${noDeliveryDate.toLocaleDateString("en-IN")} — reason: ${reason}. Subscription extended by 1 day (new expiry: ${order.subscription.endDate?.toLocaleDateString("en-IN")}).`,
          performedBy: appliedBy || "Admin",
        });
      } catch (logErr) {
        console.error("❌ Audit log failed (non-blocking):", logErr.message);
      }
    }

    // Rebuild Excel to reflect updated end dates — matches your pattern in other routes
    try {
      await rebuildExcelFromMongo();
    } catch (err) {
      console.error("❌ Excel rebuild failed:", err.message);
    }

    return res.json({
      success: true,
      message: `No-delivery day applied to ${results.updated.length} order(s).`,
      updated: results.updated,
      skipped: results.skipped,
    });
  } catch (err) {
    console.error("❌ No-delivery route error:", err);
    return res.status(500).json({ success: false, message: err.message });
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
    const { membershipId, durationMonths, paymentMethod, startDate, totalPrice } = req.body;

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

    // ✅ SNAPSHOT the pre-renewal state — captured BEFORE anything below overwrites it.
    // This is what stops the original plan/price/dates from being silently lost.
    existingOrder.subscription.periodHistory = existingOrder.subscription.periodHistory || [];
    existingOrder.subscription.periodHistory.push({
      plan: existingOrder.subscription.plan,
      amount: existingOrder.subscription.amount,
      startDate: existingOrder.subscription.startDate,
      endDate: existingOrder.subscription.endDate,
      activationAt: existingOrder.subscription.activationAt,
      status: existingOrder.subscription.status,
      snapshotAt: new Date(),
    });

    /* ======================
       PLAN + AMOUNT
    ====================== */
    let basePlan = existingOrder.subscription.plan?.toUpperCase()?.trim();

    // If plan already contains _1MONTH or _3MONTH etc, strip it
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
    const amount = totalPrice ? Number(totalPrice) : selectedPlan.price;

    /* ======================
       ACTIVATION DATE
    ====================== */
    let activationAt;

    if (startDate) {
      const selected = new Date(startDate);
      // ✅ Force correct local date (no timezone issue)
      selected.setHours(0, 0, 0, 0);
      activationAt = selected;
    } else {
      activationAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    }

    // ✅ Declared BEFORE use — fixes the ReferenceError / 500
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(activationAt);
    selectedDate.setHours(0, 0, 0, 0);

    /* ======================
       RENEWAL PENDING FLAG + STATUS
    ====================== */
    existingOrder.subscription.renewal = {
      pending: selectedDate > today,
      durationMonths,
    };

    existingOrder.subscription.durationMonths = durationMonths;
    existingOrder.subscription.activationAt = activationAt;
    existingOrder.subscription.startDate = activationAt;

    // ✅ status based on start date (single block — duplicate removed)
    if (selectedDate <= today) {
      existingOrder.subscription.status = "ACTIVE";
    } else {
      existingOrder.subscription.status = "UNDER_PROCESS";
    }

    /* ======================
       ✅ EXTEND END DATE (this was missing before)
    ====================== */
    const baseEndDate = existingOrder.subscription.endDate
      ? new Date(existingOrder.subscription.endDate)
      : new Date(activationAt);

    // If the old plan already expired, extend from the new activation date
    // instead of stacking onto a stale/past endDate.
    const extendFrom = baseEndDate > activationAt ? baseEndDate : activationAt;

    const durationDays = selectedPlan.durationDays || duration * 24;
const newEndDate = addMealDays(extendFrom, durationDays);

    existingOrder.subscription.endDate = newEndDate;

    existingOrder.paymentMethod = paymentMethod || "CASH";
    existingOrder.paymentStatus = "PAID";

    /* ======================
       RECEIPT + INVOICE
    ====================== */
    const receiptNumber = await generateReceiptNumber(Order);

    existingOrder.receiptNumber = receiptNumber;
    existingOrder.subscription.amount = amount;

    await existingOrder.save();

    let invoicePath;
    try {
      invoicePath = await generateInvoice(existingOrder);
      existingOrder.invoiceUrl = invoicePath;
    } catch (invoiceErr) {
      console.error("❌ Invoice generation failed:", invoiceErr.message);
      // Don't fail the whole renewal just because the PDF failed
      invoicePath = null;
    }

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
      startDate: startDate ? new Date(startDate) : null, // 👈 user input
      activationAt: activationAt,
      endDate: newEndDate,
    });

    await existingOrder.save();

    /* ======================
       EMAIL SUMMARY DATA
    ====================== */
    const tempPayment = {
      durationMonths,
      amount,
    };

    const activationText = startDate
      ? new Date(startDate).toLocaleDateString("en-IN")
      : "within 48 hours";

    /* ======================
       CUSTOMER EMAIL (SAME TEMPLATE)
    ====================== */
    if (existingOrder.user.email) {
      try {
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
    <tr>
      <td style="padding: 6px 10px;"><b>New Expiry Date</b></td>
      <td style="padding: 6px 10px;">: ${newEndDate.toLocaleDateString("en-IN")}</td>
    </tr>
  </table>

  <br/>

  <p>
   Your subscription will be active <b>${activationText}</b>.
  </p>

</div>
`,
          attachments: invoicePath
            ? [
                {
                  filename: `invoice-${receiptNumber}.pdf`,
                  path: invoicePath,
                },
              ]
            : [],
        });
      } catch (emailErr) {
        console.error("❌ Customer renewal email failed:", emailErr.message);
      }
    }

    /* ======================
       COMPANY EMAIL
    ====================== */
    if (process.env.COMPANY_EMAIL) {
      try {
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
  <li><b>New Expiry:</b> ${newEndDate.toLocaleDateString("en-IN")}</li>
  <li><b>Membership ID:</b> ${existingOrder.membershipId}</li>
  <li><b>Receipt No:</b> ${receiptNumber}</li>
</ul>
`,
          attachments: invoicePath
            ? [
                {
                  filename: `invoice-${receiptNumber}.pdf`,
                  path: invoicePath,
                },
              ]
            : [],
        });
      } catch (emailErr) {
        console.error("❌ Company renewal email failed:", emailErr.message);
      }
    }

    return res.json({ success: true, endDate: newEndDate });
  } catch (err) {
    console.error("Admin renew error:", err);
    // TEMP: leaking err.message to help you debug from the browser/network tab.
    // Remove `message: err.message` once this is confirmed working in production.
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ===========================
   GET CLIENT HISTORY
=========================== */
router.get("/client-history/:membershipId", async (req, res) => {
  try {
    const { membershipId } = req.params;

    const order = await Order.findOne({ membershipId }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found for this membership ID",
      });
    }

    const timeline = [];

    // Original plan/amount — pulled from the FIRST period snapshot if renewals exist
    const originalPlan = order.subscription?.periodHistory?.length
      ? order.subscription.periodHistory[0].plan
      : order.subscription?.plan;

    const originalAmount = order.subscription?.periodHistory?.length
      ? order.subscription.periodHistory[0].amount
      : order.subscription?.amount;

    const originalStartDate = order.subscription?.periodHistory?.length
      ? order.subscription.periodHistory[0].startDate
      : order.subscription?.startDate;

    // Account Created — now correctly shows the ORIGINAL plan and price
    timeline.push({
      type: "joined",
      date: order.createdAt,
      label: "Account Created",
      detail: `${originalPlan || "—"} · ₹${originalAmount || 0}`,
    });

    // Subscription Started — same original plan/price, dated by original start
    if (originalStartDate) {
      timeline.push({
        type: "started",
        date: originalStartDate,
        label: "Subscription Started",
        detail: `${originalPlan || "—"} · ₹${originalAmount ?? 0} · ${order.subscription?.durationMonths || 1} month(s)`,
      });
    }

    // Pauses
    (order.subscription?.pause?.history || []).forEach((p, i) => {
      timeline.push({
        type: "paused",
        date: p.startDate,
        label: `Pause #${i + 1}`,
        detail: `${new Date(p.startDate).toLocaleDateString("en-GB")} → ${new Date(p.resumeDate).toLocaleDateString("en-GB")} · ${p.days || 0} day(s)`,
      });
      if (p.resumeDate) {
        timeline.push({
          type: "resumed",
          date: p.resumeDate,
          label: "Resumed",
          detail: `After ${p.days || 0} day(s) pause`,
        });
      }
    });

    // Past periods — dated by when THAT period started, not when it was snapshotted
    (order.subscription?.periodHistory || []).forEach((p, i) => {
      timeline.push({
        type: "period",
        date: p.startDate,
        label: `Previous Subscription (Period ${i + 1})`,
        detail: `${p.plan || "—"} · ₹${p.amount || 0} · ${p.startDate ? new Date(p.startDate).toLocaleDateString("en-GB") : "—"} → ${p.endDate ? new Date(p.endDate).toLocaleDateString("en-GB") : "—"}`,
      });
    });

    // Renewals
    (order.subscription?.renewalHistory || []).forEach((r, i) => {
      timeline.push({
        type: "renewed",
        date: r.date,
        label: `Renewal #${i + 1}`,
        detail: `${r.durationMonths} month(s) · ₹${r.amount} · ${r.paymentMethod || "—"} · New expiry ${r.endDate ? new Date(r.endDate).toLocaleDateString("en-GB") : "—"}`,
      });
    });

    // Current expiry / expired status
    if (order.subscription?.endDate) {
      const expired = new Date(order.subscription.endDate) < new Date();
      timeline.push({
        type: expired ? "expired" : "ends",
        date: order.subscription.endDate,
        label: expired ? "Subscription Expired" : "Subscription Ends",
        detail: new Date(order.subscription.endDate).toLocaleDateString("en-GB"),
      });
    }

    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalPauses = order.subscription?.pause?.history?.length || 0;
    const totalRenewals = order.subscription?.renewalHistory?.length || 0;

    const totalSpent = order.subscription?.periodHistory?.length
      ? (order.subscription.periodHistory.reduce((sum, p) => sum + (p.amount || 0), 0) +
         (order.subscription?.amount || 0))
      : ((order.subscription?.originalAmount ?? order.subscription?.amount ?? 0) +
         (order.subscription?.renewalHistory || []).reduce((sum, r) => sum + (r.amount || 0), 0));

    res.json({
      success: true,
      membershipId,
      customer: order.user,
      address: order.address,
      currentOrder: order,
      timeline,
      summary: {
        totalSpent,
        totalPauses,
        totalRenewals,
        firstJoined: order.createdAt,
      },
    });
  } catch (err) {
    console.error("Failed to fetch client history:", err);
    res.status(500).json({ success: false, message: "Server error fetching client history" });
  }
});

// adminRoutes.js - one-time fix route
router.post("/fix-invoice/:membershipId", async (req, res) => {
  try {
    const order = await Order.findOne({ 
      membershipId: req.params.membershipId 
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Regenerate invoice
    const invoicePath = await generateInvoice(order);
    
    order.invoiceUrl = invoicePath;
    await order.save();

    console.log("✅ Invoice fixed for:", order.membershipId, invoicePath);
    return res.json({ success: true, invoiceUrl: invoicePath });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

router.post("/fix-all-invoices", async (req, res) => {
  try {
    const orders = await Order.find({ 
      $or: [
        { invoiceUrl: { $exists: false } },
        { invoiceUrl: null },
        { invoiceUrl: "" }
      ]
    });

    console.log(`🔧 Fixing ${orders.length} orders...`);

    for (const order of orders) {
      try {
        const invoicePath = await generateInvoice(order);
        order.invoiceUrl = invoicePath;
        await order.save();
        console.log("✅ Fixed:", order.membershipId);
      } catch (err) {
        console.error("❌ Failed for:", order.membershipId, err.message);
      }
    }

    return res.json({ success: true, fixed: orders.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});


/* ===========================
   SEND INDIVIDUAL MESSAGE
=========================== */
router.post("/send-message", async (req, res) => {
  try {
    const { membershipId, message } = req.body;

    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const notification = await Notification.create({
      membershipId,
      title: "Message From Admin",
      message,
    });

    res.json({
      success: true,
      notification,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ===========================
   BROADCAST MESSAGE
=========================== */
router.post("/broadcast", async (req, res) => {
  try {
    const { message } = req.body;

    const orders = await Order.find();

    const notifications = orders.map((o) => ({
      membershipId: o.membershipId,
      title: "Broadcast Message",
      message,
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: "Broadcast sent",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


export default router;