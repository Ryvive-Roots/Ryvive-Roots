import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

export const renewalReminderJob = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // helper function
    const sendReminder = async (daysLeft, stage) => {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysLeft);

      const orders = await Order.find({
        "subscription.status": "ACTIVE",
        "subscription.endDate": {
          $gte: targetDate,
          $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
        },
        "subscription.renewalReminderStage": { $ne: stage },
        "user.email": { $exists: true, $ne: "" },
      });

      for (const order of orders) {
        const renewLink = `https://ryviveroots.com/renew?membershipId=${order.membershipId}`;

      await sendEmail({
  to: order.user.email,
 subject:
  daysLeft === 1
    ? " Just 1 Day Left⏰ Renew Your Ryvive Roots Subscription"
    : " Just 4 Days Left🌿 Renew Your Ryvive Roots Subscription",

  html: `
    <div style="font-family:Arial, Helvetica, sans-serif; line-height:1.7; color:#333;">
      
      <h2 style="color:#166534;">
        Dear ${order.user.firstName},
      </h2>

      <p>
        We hope you’re loving your healthy journey with 
        <b>Ryvive Roots – Live • Relive • Believe 🌱</b>
      </p>

      <p>
        This is a friendly reminder that your 
        <b>${order.subscription.plan}</b> subscription will be expiring in 
        <b>${daysLeft} day${daysLeft > 1 ? "s" : ""}</b> 
        (on <b>${order.subscription.endDate.toLocaleDateString("en-IN")}</b>).
      </p>

      <p>
        We truly value being a part of your wellness routine and would love to 
        continue serving you fresh, <b>100% vegetarian</b>, nourishing meals every day.
      </p>

      <h4 style="color:#15803d;">With your subscription, you continue enjoying:</h4>
      <ul>
        <li>🥤 Fresh Healthy Juices</li>
        <li>🥗 Wholesome Healthy Salads</li>
        <li>🥪 Premium Healthy Sandwiches</li>
        <li>🌯 Delicious Healthy Wraps</li>
        <li>🌿 Flavorful Healthy Chaat</li>
      </ul>

      <p>
        At Ryvive Roots, every week brings something new and refreshing to your plate — 
        so your healthy lifestyle never feels boring ✨
      </p>

      <p>
        To avoid any interruption in your plan, we recommend renewing before 
        <b>${order.subscription.endDate.toLocaleDateString("en-IN")}</b>.
      </p>

      <div style="margin:25px 0;">
        <a href="${renewLink}"
           style="background:#16a34a;color:#ffffff;
           padding:14px 22px;border-radius:6px;
           text-decoration:none;font-weight:bold;">
          Renew Now
        </a>
      </div>

      <p>
        You can also simply reply to this email or contact us at:<br/>
        📞 <b>+91 97656 00701</b> / <b>+91 90760 00468</b>
      </p>

      <p>
        We look forward to continuing your wellness journey with us 🌿
      </p>

      <p style="margin-top:25px;">
        Warm Regards,<br/>
        <b>Team Ryvive Roots</b>
      </p>
    </div>
  `,
});


        // ✅ update stage
        order.subscription.renewalReminderStage = stage;
        order.subscription.renewalReminderDate = new Date();
        await order.save();

        console.log(
          `📧 ${daysLeft}-day reminder sent → ${order.user.email}`
        );
      }
    };

    // 🔔 4 days reminder
    await sendReminder(4, "4D");

    // 🔔 1 day reminder
    await sendReminder(1, "1D");

  } catch (error) {
    console.error("❌ Multi reminder job error:", error.message);
  }
};
