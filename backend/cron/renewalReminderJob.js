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
        const renewLink = `https://yourwebsite.com/renew?membershipId=${order.membershipId}`;

        await sendEmail({
          to: order.user.email,
          subject: "⏰ Subscription Renewal Reminder – Ryvive Roots",
          html: `
            <div style="font-family:Arial; line-height:1.6;">
              <h3>Hi ${order.user.firstName},</h3>

              <p>
                Your <b>${order.subscription.plan}</b> subscription will expire in
                <b>${daysLeft} day${daysLeft > 1 ? "s" : ""}</b>
                on <b>${order.subscription.endDate.toLocaleDateString("en-IN")}</b>.
              </p>

              <p>Please renew to continue uninterrupted service.</p>

              <a href="${renewLink}"
                 style="background:#16a34a;color:#fff;
                 padding:12px 18px;border-radius:6px;
                 text-decoration:none;font-weight:bold;">
                Renew Now
              </a>

              <p style="margin-top:20px;">
                Regards,<br/>
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
