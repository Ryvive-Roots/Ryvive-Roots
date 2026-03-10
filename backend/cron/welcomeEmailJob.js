import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

export const welcomeEmailJob = async () => {
  try {

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const orders = await Order.find({
      "subscription.thankYouEmailSentAt": { $lte: oneHourAgo },
      "subscription.welcomeEmailSent": false,
    });

    for (const order of orders) {

      await sendEmail({
        to: order.user.email,
        subject: "Welcome to Ryvive Roots 🌿",
        html: `
       <div style="font-family: Arial, sans-serif; line-height: 1.7; color:#333">

<p>Dear ${order.user.firstName} ${order.user.lastName},</p>

<p>
We are pleased to welcome you to <b>Ryvive Roots</b> and congratulate you on subscribing 
to our most comprehensive plan — the <b>${order.subscription.plan}</b>.
</p>

<p>
We confirm that your payment has been successfully received. 
Your subscription is scheduled to activate within <b>48 hours from the time of payment</b>, 
after which deliveries will commence as per your selected time slot.
</p>

<h3 style="margin-top:20px;">Subscription Details</h3>

<table style="border-collapse: collapse; margin-top:10px;">
<tr>
<td style="padding:6px 10px;"><b>Membership ID</b></td>
<td>: ${order.membershipId}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><b>Plan</b></td>
<td>: ${order.subscription.plan}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><b>Activation Date</b></td>
<td>: ${order.subscription.startDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><b>Expiration Date</b></td>
<td>: ${order.subscription.endDate.toLocaleDateString("en-IN")}</td>
</tr>

<tr>
<td style="padding:6px 10px;"><b>Delivery Time Slot</b></td>
<td>: ${order.deliverySlot}</td>
</tr>
</table>

<p style="margin-top:20px;">
As a <b>${order.subscription.plan}</b> member, you will receive expertly curated, 
pre-set meals delivered daily. Your plan includes a premium rotating menu featuring:
</p>

<ul>
<li>Fresh juices</li>
<li>Nutritious salads</li>
<li>Healthy sandwiches</li>
<li>Wholesome wraps</li>
<li>Balanced pasta</li>
<li>Light and flavorful chaat</li>
</ul>

<p>
In addition, your subscription offers maximum flexibility, including:
</p>

<ul>
<li>Up to <b>3 pauses per month</b>, allowing you to temporarily suspend deliveries</li>
<li>Automatic resumption of service after each pause period</li>
</ul>

<p>
Our team will manage everything seamlessly for you.
</p>

<p>
Should you need any assistance regarding activation, delivery, or pause management, 
please contact us at <b>customerservice@ryviveroots.com</b>.  
Our team will be happy to assist you.
</p>

<p>
Thank you for choosing <b>Ryvive Roots</b>. We look forward to delivering a premium, 
stress-free healthy eating experience.
</p>

<br/>

<p>
Warm regards,<br/>
<b>Team Ryvive Roots</b>
</p>

<table style="width:100%; background:#f3f3f3; padding:25px; font-family:Arial, sans-serif;">
  <tr>


<!-- LEFT SIDE -->
<td style="width:35%; vertical-align:top;">
  <h2 style="margin:0; font-size:22px; color:#000;">Ryvive Roots</h2>
  <p style="margin:3px 0 15px 0; color:#555;">Wellness & Nutrition</p>

  <!-- SOCIAL ICONS -->
  <div>
    <a href="#" style="margin-right:8px;">
      <img src="https://img.icons8.com/ios-filled/22/000000/facebook.png"/>
    </a>

    <a href="#" style="margin-right:8px;">
      <img src="https://img.icons8.com/ios-filled/22/000000/twitter.png"/>
    </a>

    <a href="#" style="margin-right:8px;">
      <img src="https://img.icons8.com/ios-filled/22/000000/youtube-play.png"/>
    </a>

    <a href="#" style="margin-right:8px;">
      <img src="https://img.icons8.com/ios-filled/22/000000/linkedin.png"/>
    </a>

    <a href="#">
      <img src="https://img.icons8.com/ios-filled/22/000000/instagram-new.png"/>
    </a>
  </div>
</td>

<!-- CENTER LOGO -->
<td style="width:30%; text-align:center;">
  <img src="https://ryviveroots.com/Ryvive.png" width="85" alt="Ryvive Roots"/>
</td>

<!-- RIGHT SIDE -->
<td style="width:35%; vertical-align:top; font-size:14px; color:#333;">
  <p style="margin:5px 0;"><b>M:</b> 97656 00701</p>
  <p style="margin:5px 0;"><b>T:</b> 97656 00701</p>
  <p style="margin:5px 0;"><b>E:</b> subscribe@ryviveroots.com</p>
  <p style="margin:5px 0;">www.ryviveroots.com</p>
  <p style="margin:5px 0;">Dombivli East, Maharashtra 421201, India</p>
</td>


  </tr>
</table>


</div>
        `,
      });

      order.subscription.welcomeEmailSent = true;
      await order.save();

      console.log("Welcome email sent:", order.user.email);
    }

  } catch (error) {
    console.error("Welcome email job error:", error);
  }
};