import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

// ─── Plan Details Helper ──────────────────────────────────────────────────────

const getPlanDetails = (plan, durationMonths, order) => {
  const basePlan = plan?.split("_")[0]?.toUpperCase();

  const subscription = order?.subscription || {};
  const isAddon = Boolean(subscription.isAddon);

  // ✅ Use the REAL saved durationDays whenever it's available (this now
  // includes any additionalDurationDays from a customized package). Each
  // durationDays unit is already a delivery day (Mon–Sat), per addMealDays(),
  // so it maps 1:1 to meal count — no need to guess from weeks anymore.
  //
  // Falls back to the old weeks*6 assumption only for legacy orders that
  // predate the durationDays field being persisted.
  const weeks = durationMonths === 3 ? 12 : 4;
  const legacyMeals = weeks * 6; // Mon–Sat

  const meals =
    Number(subscription.durationDays) > 0
      ? Number(subscription.durationDays)
      : legacyMeals;

  const planNames = {
    SILVER:   "Ryvive Silver",
    GOLD:     "Ryvive Gold",
    PLATINUM: "Ryvive Platinum",
  };

  const planDescriptions = {
    SILVER: {
      tagline: "Clean, simple, and nourishing meals to build a healthy daily habit.",
      bullets: [
        "Freshly prepared clean meals with wholesome ingredients",
        "Easy-to-digest recipes free from refined sugar and preservatives",
        "Weekly variety to keep your meals exciting and balanced",
        "Functional detox and immunity juices",
        "No calorie counting — just clean, honest food",
      ],
      pauseInfo: durationMonths === 1
        ? "Please note: Pause is not available on the Silver 1-Month plan."
        : "1 pause per month included with your Silver 3-Month plan.",
    },
    GOLD: {
      tagline: "High-protein, gut-friendly meals designed to fuel your active lifestyle.",
      bullets: [
        "6 high-protein meals per week to support muscle and energy",
        "Gut and skin-friendly recipes crafted by our nutrition team",
        "Advanced energy and immunity boosting juices",
        "Naturally detoxifying ingredients in every meal",
        "Rotating menu ensuring variety and balanced macros throughout your plan",
      ],
      pauseInfo: durationMonths === 1
        ? "2 pauses included with your Gold 1-Month plan."
        : "2 pauses per month included with your Gold 3-Month plan.",
    },
    PLATINUM: {
      tagline: "Our most comprehensive wellness journey — crafted for those who want the very best.",
      bullets: [
        "Chef's signature rotating menu — freshly curated every week",
        "Glow and recovery juices to nourish from the inside out",
        "Guilt-free wraps, Zucchini Zoodles, and wholesome chaats",
        "Elite meal combinations with premium clean ingredients",
        "A special Chef's Surprise Dish every week",
        "Freshly prepared detox juices from seasonal fruits and vegetables",
        "Triple-layer wholesome sandwiches and nutrient-rich salads",
      ],
      pauseInfo: durationMonths === 1
        ? "3 pauses included with your Platinum 1-Month plan."
        : "3 pauses per month included with your Platinum 3-Month plan.",
    },
  };

  const planName = planNames[basePlan] || basePlan;
  const description = planDescriptions[basePlan] || planDescriptions.SILVER;

  // ✅ Addon-aware plan title — mirrors the wording used in the
  // manual-order confirmation email so customers see consistent naming
  // across every email they get for a customized package.
  const fullPlanName = isAddon
    ? `${planName} – Customized ${weeks}-Week Wellness Plan (${meals} Deliveries)`
    : `${planName} – ${weeks}-Week Wellness Plan (${meals} Deliveries)`;

  return {
    basePlan,
    weeks,
    meals,
    isAddon,
    planName,
    description,
    fullPlanName,
  };
};

// ─── Welcome Email Template ───────────────────────────────────────────────────

export const welcomeEmail = ({ order }) => {
  const durationMonths = order.subscription?.durationMonths || 1;
  const { planName, fullPlanName, description, meals, weeks, isAddon } =
    getPlanDetails(order.subscription?.plan, durationMonths, order);

  const subscription = order.subscription || {};

  // ✅ Add-on feature list — same rendering approach as the manual-order
  // confirmation email, so both emails read consistently.
  const addOnFeatures = Array.isArray(subscription.addOnFeatures)
    ? subscription.addOnFeatures
    : [];

  const addOnFeaturesHtml =
    addOnFeatures.length > 0
      ? addOnFeatures.map((feature) => `• ${feature}`).join("<br>")
      : "None";

  return {
    subject: isAddon
      ? `Welcome to Your Customized ${planName} Package 🌿`
      : `Welcome to ${planName} 🌿`,
    html: `
<div style="font-family: Arial, sans-serif; line-height:1.7; color:#333; font-size:14px;">

<p>Dear ${order.user.firstName} ${order.user.lastName},</p>

<p><strong>Welcome to Ryvive Roots.</strong></p>

<p>
  We are delighted to have you join our community of mindful eaters and congratulate you 
  on choosing the <strong>${fullPlanName}.</strong>
</p>

<p>${description.tagline}</p>

${
  isAddon
    ? `
<p>
  Your package has been <strong>customized</strong> with additional features tailored
  to your preferences, on top of your ${planName} base plan.
</p>
`
    : ""
}

<p>
  Your payment has been successfully received, and your subscription will be 
  <strong>activated within the next 48 hours</strong>. Once activated, your daily 
  deliveries will begin according to your selected delivery window.
</p>

<h3 style="margin-top:20px;">Your Subscription Details</h3>

<table style="border-collapse:collapse; margin-top:10px;">
  <tr>
    <td style="padding:6px 10px;"><strong>Membership ID</strong></td>
    <td>: ${order.membershipId}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Plan</strong></td>
    <td>: ${planName}</td>
  </tr>
  ${
    isAddon
      ? `
  <tr>
    <td style="padding:6px 10px;"><strong>Package Type</strong></td>
    <td>: <strong>Customized Package</strong></td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Base Plan Price</strong></td>
    <td>: ₹${Number(subscription.basePlanPrice || 0).toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Customized Package Price</strong></td>
    <td>: ₹${Number(subscription.customPackagePrice || 0).toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px; vertical-align:top;"><strong>Add-on Features</strong></td>
    <td>: ${addOnFeaturesHtml}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Base Duration</strong></td>
    <td>: ${subscription.baseDurationDays || 0} days</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Additional Duration</strong></td>
    <td>: +${subscription.additionalDurationDays || 0} days</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Final Duration</strong></td>
    <td>: ${subscription.durationDays || 0} days</td>
  </tr>
  `
      : ""
  }
  <tr>
    <td style="padding:6px 10px;"><strong>Amount Paid</strong></td>
    <td>: ₹${Number(subscription.amount || 0).toLocaleString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Activation Date</strong></td>
    <td>: ${new Date(order.subscription.startDate).toLocaleDateString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Expiration Date</strong></td>
    <td>: ${new Date(order.subscription.endDate).toLocaleDateString("en-IN")}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Delivery Time Slot</strong></td>
    <td>: ${order.deliverySlot}</td>
  </tr>
  <tr>
    <td style="padding:6px 10px;"><strong>Total Deliveries</strong></td>
    <td>: ${meals} meals (Mon – Sat)</td>
  </tr>
</table>

<p style="margin-top:20px;">
  As a <strong>${planName} member</strong>, you will experience a thoughtfully curated 
  rotating menu designed to nourish your body while making healthy eating simple and enjoyable.
  Every meal is freshly prepared using <strong>clean, high-quality ingredients</strong>, 
  free from refined sugar, chemicals, and preservatives.
</p>

<p><strong>Throughout your ${weeks}-Week Wellness Plan, you will enjoy:</strong></p>

<ul>
  ${description.bullets.map((b) => `<li>${b}</li>`).join("\n  ")}
</ul>

<p>
  Across your plan, you will experience a <strong>${meals}-meal rotating menu</strong>, 
  ensuring variety, balanced nutrition, and delightful flavours throughout your wellness journey.
</p>

${
  isAddon && addOnFeatures.length > 0
    ? `
<p><strong>Your customized add-on selections for this plan:</strong></p>
<ul>
  ${addOnFeatures.map((f) => `<li>${f}</li>`).join("\n  ")}
</ul>
`
    : ""
}

<p><strong>Your ${planName} membership also includes:</strong></p>

<ul>
  <li>${description.pauseInfo}</li>
  <li>Seamless automatic resumption after each pause period</li>
  <li>Dedicated support from our customer care team</li>
  <li>Access to your personal wellness dashboard at ryviveroots.com</li>
</ul>

<p>
  At Ryvive Roots, our mission is simple — 
  <strong>to make clean, nourishing food a daily habit, not an effort.</strong>
</p>

<p>
  If you require any assistance regarding activation, delivery scheduling, or pause requests, 
  our team will be happy to assist you.
</p>

<p>
  <strong>Customer Support</strong><br/>
  Phone: +91 97656 00701<br/>
  Email: customersupport@ryviveroots.com
</p>

<p>
  Thank you for choosing <strong>Ryvive Roots</strong>.<br/>
  We look forward to being a part of your healthy lifestyle journey.
</p>

<p>Warm regards,<br/><strong>Team Ryvive Roots</strong></p>

<style>
@media only screen and (max-width:600px) {
  .footer-table td { display:block !important; width:100% !important; text-align:center !important; margin-bottom:15px; }
  .footer-icons img { margin:0 6px !important; }
}
</style>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif; border-spacing:0;">
<tr><td align="center">
<table style="text-align:center; border-spacing:0;">
<tr><td style="padding:6px 0;">
  <img src="https://ryviveroots.com/Ryvive.png" width="180" alt="Ryvive Roots Logo" style="border:none;">
</td></tr>
<tr><td style="padding:6px 0; font-size:13px; color:#333; line-height:1.5; text-align:center;">
  You're receiving this email because you recently activated a Ryvive Roots membership.<br>
  If you have any concerns, please contact us at
  <a href="mailto:customersupport@ryviveroots.com" style="text-decoration:none;">customersupport@ryviveroots.com</a>.
</td></tr>
<tr><td style="padding:8px 0; text-align:center;">
  <a href="https://www.instagram.com/ryvive_roots/" style="margin-right:12px; text-decoration:none;">
    <img src="https://cdn-icons-png.flaticon.com/512/1400/1400829.png" width="22" alt="Instagram" style="vertical-align:middle; border:none;">
  </a>
  <a href="https://www.linkedin.com/in/ryvive-roots-750b533a7/" style="text-decoration:none;">
    <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="22" alt="LinkedIn" style="vertical-align:middle; border:none;">
  </a>
</td></tr>
<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">+91 9076000468 / 97656 00701</td></tr>
<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">
  <a href="https://www.ryviveroots.com" style="text-decoration:none;">www.ryviveroots.com</a>
</td></tr>
<tr><td style="padding:6px 0; text-align:center;">
  <a href="https://ryviveroots.com/privacy-policy" style="text-decoration:none;">Privacy Policy</a>
</td></tr>
<tr><td style="padding:3px 0; font-size:13px; color:#333; text-align:center;">Dombivli East, Maharashtra 421201, India</td></tr>
<tr><td style="padding-top:10px; font-size:13px; color:#333; text-align:center;">© 2026 RYVIVE ROOTS All Rights Reserved.</td></tr>
</table>
</td></tr>
</table>

</div>`,
  };
};

// ─── Welcome Email Cron Job ───────────────────────────────────────────────────

export const welcomeEmailJob = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const orders = await Order.find({
      "subscription.thankYouEmailSentAt": { $lte: oneHourAgo },
      "subscription.welcomeEmailSent": false,
    });

    for (const order of orders) {
      try {
        const { subject, html } = welcomeEmail({ order });

        await sendEmail({
          to: order.user.email,
          subject,
          html,
        });

        order.subscription.welcomeEmailSent = true;
        await order.save();

        console.log("✅ Welcome email sent:", order.user.email, "| Plan:", order.subscription.plan);

      } catch (err) {
        console.error("❌ Failed for:", order.membershipId, err.message);
      }
    }

  } catch (error) {
    console.error("Welcome email job error:", error);
  }
};