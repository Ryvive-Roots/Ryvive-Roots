import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

function addMonthsSafe(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

const activatePendingRenewals = async () => {
  
  const now = new Date();

  const orders = await Order.find({
    "subscription.status": "UNDER_PROCESS",
    "subscription.activationAt": { $lte: now },
  });

  for (const order of orders) {
    if (order.subscription.renewal?.pending) {
      order.subscription.endDate = addMonthsSafe(
        order.subscription.endDate,
        order.subscription.renewal.durationMonths
      );

      order.subscription.durationMonths =
        order.subscription.renewal.durationMonths;

         // ⭐ RESET PAUSES (ADD THIS LINE HERE)
  order.subscription.pause = { used: 0, history: [] };

      order.subscription.renewal.pending = false;
    }

 order.subscription.status = "ACTIVE";
await order.save();

// 📧 Send activation email
await sendEmail({
  to: order.user.email,
  subject: "🌿 Your Ryvive Roots Journey Starts NOW!",
  html: `
  <div style="font-family:Arial, Helvetica, sans-serif; line-height:1.7; color:#333; max-width:650px; margin:auto;">

    <h2 style="color:#166534;">Hi ${order.user.firstName},</h2>

    <p>
      The wait is over! Your <b>Ryvive Roots membership is officially ACTIVE!</b>
    </p>

    <p>
      What an exciting moment! We are so thrilled to have you with us, and we want to make sure your start is as smooth and seamless as possible. Below you'll find everything you need to jump right in — how to log in and how to stay connected with our wonderful community.
    </p>

    <p><b>Let's get you started!</b></p>

    <h3 style="color:#166534;">Log into Your Account</h3>

    <p>Getting in is simple! Just follow these steps:</p>

    <ol>
      <li>Visit our website at <a href="https://ryviveroots.com">www.ryviveroots.com</a></li>
      <li>Click on <b>"Member Login"</b> at the top right corner</li>
      <li>Enter your <b>Membership ID</b></li>
      <li>Enter your <b>registered email address</b></li>
      <li>Click <b>"Login"</b> and you'll be taken straight to your personal wellness dashboard</li>
    </ol>

    <p>
      Having trouble logging in? Drop us a line at 
      <b>customersupport@ryviveroots.com</b> and we'll sort it out for you right away!
    </p>

    <h3 style="color:#166534;">Let's Stay Connected</h3>

    <p>
      The Ryvive Roots community doesn't stop at your inbox! Come find us on social media where we show up daily with wellness inspiration, real member stories, and content that actually feels good to scroll through.
    </p>

    <p>
      • Instagram: 
      <a href="https://www.instagram.com/ryvive_roots/">@ryvive_roots</a>
      <br/>
      • Facebook: 
      <a href="https://www.facebook.com/">Ryvive Roots</a>
    </p>

    <p>
      We'd love to see you there, give us a follow and say hi!
    </p>

    <p>
      A gentle reminder, wellness is a journey, and questions are always welcome along the way. We're here for you anytime at 
      <b>customersupport@ryviveroots.com</b>.
    </p>

    <p style="margin-top:25px;">
      Warmly,<br/>
      <b>Team Ryvive Roots</b>
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
});
console.log("✅ Subscription activated:", order.membershipId);
  }
};

export const renewalReminderJob = async () => {
  try {
     await activatePendingRenewals();
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
  <div style="font-family:Arial, Helvetica, sans-serif; line-height:1.7; color:#333; max-width:650px; margin:auto;">
    
    <h2 style="color:#166534;">
      Hi ${order.user.firstName},
    </h2>

    <p>
      Just popping in to let you know your <b>Ryvive Roots membership</b> expires on 
      <b>${order.subscription.endDate.toLocaleDateString("en-IN")}</b>.
    </p>

    <p>
      You've been doing so well on your wellness journey, and honestly renewing is simple 
      and keeps everything going right where you left off. We'd love to have you stay.
    </p>

    <h3 style="color:#166534;">Let's Get You Renewed!</h3>

    <p><b>Renewing is Quick & Easy</b></p>

    <ol>
      <li>Log in to your account at <a href="https://ryviveroots.com">www.ryviveroots.com</a></li>
      <li>Go to <b>"My Membership"</b></li>
      <li>Click on <b>"Renew My Plan"</b></li>
      <li>Confirm your details and you're all set!</li>
    </ol>

    <p>
      Your journey keeps going just like that!
    </p>

    <h3 style="color:#166534;">Your Renewal Details</h3>

    <p>
      • <b>Membership ID:</b> ${order.membershipId || "Your Membership ID"} <br/>
      • <b>Current Plan:</b> ${order.subscription.plan} <br/>
      • <b>Expiry Date:</b> ${order.subscription.endDate.toLocaleDateString("en-IN")} <br/>
      • <b>Renewal Amount:</b> ₹${order.subscription.amount}
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
      Need help renewing or have questions about your plan? We're right here at 
      <b>customersupport@ryviveroots.com</b> always happy to help!
    </p>

    <p>
      Just a gentle reminder: your wellness journey deserves to keep going. 
      Every step forward counts, and we're excited to keep walking alongside you.
    </p>

    <p style="margin-top:25px;">
      Warmly,<br/>
      <b>Team Ryvive Roots</b>
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
