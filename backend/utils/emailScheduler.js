import { Agenda } from "agenda";
import sendEmail from "./sendEmail.js";

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI },
});

agenda.define("send welcome email", async (job) => {
  const { order } = job.attrs.data;

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

<table style="margin-top:30px; border-top:1px solid #ddd; padding-top:15px;">
  <tr>
    <td style="padding-top:15px;">

      <p style="margin:0;"><b>Sakshi Batra</b></p>
      <p style="margin:0;">Operations Associate</p>

      <p style="margin:6px 0;">
        <b>M:</b> 97656 00701
      </p>

      <p style="margin:6px 0;">
        <b>E:</b> management@ryviveroots.com |
        <a href="https://www.ryviveroots.com" style="color:#2e7d32;">
          www.ryviveroots.com
        </a>
      </p>

      <p style="margin:6px 0;">Mumbai, Maharashtra</p>
 
      <img 
        src="https://www.ryviveroots.com/Ryvive.png" 
        alt="Ryvive Roots"
        style="margin-top:10px; height:60px;"
      />

    </td>
  </tr>
</table>

</div>
`,
  });

  console.log("✅ Welcome email sent");
});

export default agenda;