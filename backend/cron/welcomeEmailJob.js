import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

export const silverWelcomeEmail = ({ order }) => ({
  subject: "Welcome to Ryvive Silver 🌿",
  html: `
<div style="font-family: Arial, sans-serif; line-height:1.7; color:#333">

<p>Dear ${order.user.firstName} ${order.user.lastName},</p>

<p>
Welcome to <b>Ryvive Roots</b>. Your <b>Ryvive Silver</b> subscription has been successfully confirmed.
</p>

<h3>Subscription Details</h3>

<table style="border-collapse: collapse;">
<tr>
<td><b>Membership ID</b></td>
<td>: ${order.membershipId}</td>
</tr>

<tr>
<td><b>Plan</b></td>
<td>: Ryvive Silver</td>
</tr>

<tr>
<td><b>Activation Date</b></td>
<td>: ${order.subscription.startDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td><b>Expiration Date</b></td>
<td>: ${order.subscription.endDate.toLocaleDateString("en-IN")}</td>
</tr>
</table>

<p>Your Silver plan includes:</p>

<ul>
<li>Fresh Juices</li>
<li>Nutritious Salads</li>
<li>Healthy Wraps</li>
<li>Light Balanced Meals</li>
</ul>

<p>Warm regards,<br/><b>Team Ryvive Roots</b></p>

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

</div>
`,
});

export const goldWelcomeEmail = ({ order }) => ({
  subject: "Welcome to Ryvive Gold 🌿",
  html: `
<div style="font-family: Arial, sans-serif; line-height:1.7; color:#333">

<p>Dear ${order.user.firstName} ${order.user.lastName},</p>

<p>
Thank you for choosing the <b>Ryvive Gold</b> subscription.
</p>

<h3>Subscription Details</h3>

<table style="border-collapse: collapse;">
<tr>
<td><b>Membership ID</b></td>
<td>: ${order.membershipId}</td>
</tr>

<tr>
<td><b>Plan</b></td>
<td>: Ryvive Gold</td>
</tr>

<tr>
<td><b>Activation Date</b></td>
<td>: ${order.subscription.startDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td><b>Expiration Date</b></td>
<td>: ${order.subscription.endDate.toLocaleDateString("en-IN")}</td>
</tr>
</table>

<p>Your Gold plan includes:</p>

<ul>
<li>Fresh Juices</li>
<li>Nutritious Salads</li>
<li>Healthy Sandwiches</li>
<li>Wholesome Wraps</li>
<li>Balanced Pasta</li>
</ul>

<p>Warm regards,<br/><b>Team Ryvive Roots</b></p>

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

</div>
`,
});

export const platinumWelcomeEmail = ({ order }) => ({
  subject: "Welcome to Ryvive Platinum 🌿",
html: `
<div style="font-family: Arial, sans-serif; line-height:1.7; color:#333; font-size:14px;">

<p>Dear ${order.user.firstName} ${order.user.lastName},</p>

<p><strong>Welcome to Ryvive Roots.</strong></p>

<p>
We are delighted to have you join our community of mindful eaters and congratulate you on choosing our most comprehensive wellness journey — the 
<strong>Ryvive Platinum – 4 Week Wellness Plan (24 Deliveries).</strong>
</p>

<p>
Your payment has been successfully received, and your subscription will be 
<strong>activated within the next 48 hours</strong>. Once activated, your daily deliveries will begin according to your selected delivery window.
</p>

<h3 style="margin-top:20px;">Your Subscription Details</h3>

<table style="border-collapse: collapse; margin-top:10px;">
<tr>
<td style="padding:6px 10px;"><strong>Membership ID</strong></td>
<td>: ${order.membershipId}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><strong>Plan</strong></td>
<td>: Ryvive Platinum – 4 Week Wellness Plan (24 Deliveries)</td>
</tr>

<tr>
<td style="padding:6px 10px;"><strong>Activation Date</strong></td>
<td>: ${order.subscription.startDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><strong>Expiration Date</strong></td>
<td>: ${order.subscription.endDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><strong>Delivery Time Slot</strong></td>
<td>: ${order.deliverySlot}</td>
</tr>
</table>

<p style="margin-top:20px;">
As a <strong>Platinum member</strong>, you will experience a thoughtfully curated rotating menu designed to nourish your body while making healthy eating simple and enjoyable.
Every meal is freshly prepared using <strong>clean, high-quality ingredients</strong>, free from refined sugar, chemicals, and preservatives.
</p>

<p><strong>Throughout your 4-Week Wellness Plan, you will enjoy a thoughtfully curated rotation of nourishing meals, including:</strong></p>

<ul>
<li>Freshly prepared detox juices crafted from wholesome fruits and vegetables</li>
<li>Nutrient-rich salads with our signature in-house dressings</li>
<li>Triple-layer wholesome sandwiches packed with balanced fillings</li>
<li>Healthy wraps filled with nourishing ingredients and bold flavours</li>
<li>Zucchini Zoodles — our light and wholesome take on healthy pasta</li>
<li>Freshly prepared wholesome chaats with a nutritious twist</li>
<li>A special Chef’s Surprise Dish every week to keep your wellness journey exciting</li>
</ul>

<p>
Across your plan, you will experience a <strong>24-day rotating menu</strong>, ensuring variety, balanced nutrition, and delightful flavours throughout your wellness journey.
</p>

<p><strong>Your Platinum membership also includes flexible delivery management:</strong></p>

<ul>
<li>Unlimited delivery pauses during your plan</li>
<li>Seamless automatic resumption after each pause period</li>
<li>Dedicated support from our customer care team</li>
</ul>

<p>
At Ryvive Roots, our mission is simple — <strong>to make clean, nourishing food a daily habit, not an effort.</strong>
</p>

<p>
If you require any assistance regarding activation, delivery scheduling, or pause requests, our team will be happy to assist you.
</p>

<p>
<strong>Customer Support</strong><br/>
Phone: +91 97656 00701<br/>
Email: customerservice@ryviveroots.com
</p>

<p>
Thank you for choosing <strong>Ryvive Roots</strong>.<br/>
We look forward to being a part of your healthy lifestyle journey.
</p>

<p>
Warm regards,<br/>
<strong>Team Ryvive Roots</strong><br/>

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

</div>
`,
});

export const welcomeEmailJob = async () => {
  try {

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const orders = await Order.find({
      "subscription.thankYouEmailSentAt": { $lte: oneHourAgo },
      "subscription.welcomeEmailSent": false,
    });

    for (const order of orders) {

      const planType = order.subscription.plan.split("_")[0];

      let emailTemplate;

      if (planType === "SILVER") {
        emailTemplate = silverWelcomeEmail({ order });
      }

      if (planType === "GOLD") {
        emailTemplate = goldWelcomeEmail({ order });
      }

      if (planType === "PLATINUM") {
        emailTemplate = platinumWelcomeEmail({ order });
      }

      if (!emailTemplate) continue;

      await sendEmail({
        to: order.user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      order.subscription.welcomeEmailSent = true;
      await order.save();

      console.log("Welcome email sent:", order.user.email);
    }

  } catch (error) {
    console.error("Welcome email job error:", error);
  }
};