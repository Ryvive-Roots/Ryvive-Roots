import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Promotes queued ("UPCOMING") plans to "ACTIVE" once their activationAt
 * date has arrived. This is the counterpart to the new
 * `startAfterCurrentPlanEnds` flow in easebuzz.controller.js — when a
 * member chooses "Continue with this plan" while an ongoing plan is
 * still running, a new Order is created with status "UPCOMING" and
 * activationAt = (their current plan's endDate). This job is what
 * actually flips that order live once the date arrives.
 *
 * Scheduled from server.js, same as renewalReminderJob / welcomeEmailJob.
 */
export const activateQueuedPlansJob = async () => {
  const now = new Date();

  try {
    const dueOrders = await Order.find({
      "subscription.status": "UPCOMING",
      "subscription.activationAt": { $lte: now },
    });

    if (!dueOrders.length) return;

    console.log(`[activateQueuedPlans] Found ${dueOrders.length} plan(s) due for activation.`);

    for (const order of dueOrders) {
      try {
        // Mark whichever order this one was queued from as EXPIRED, if it's
        // still sitting as ACTIVE/PAUSED/UNDER_PROCESS (it should have
        // naturally ended by now, but this keeps backend status consistent
        // for admin views — the customer dashboard already computes
        // "EXPIRED" from endDate regardless of this field).
        if (order.queuedFromOrderId) {
          const previousOrder = await Order.findById(order.queuedFromOrderId);
          if (
            previousOrder &&
            ["ACTIVE", "PAUSED", "UNDER_PROCESS"].includes(previousOrder.subscription.status)
          ) {
            previousOrder.subscription.status = "EXPIRED";
            await previousOrder.save();
          }
        }

        order.subscription.status = "ACTIVE";
        await order.save();

        const formattedPlan = `RYVIVE ${String(order.subscription.plan).split("_")[0]}`;

        if (order.user?.email) {
          await sendEmail({
            to: order.user.email,
            subject: "Your New RYVIVE Plan Is Now Active 🌿",
            html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6;">
  <h2>Hi ${order.user.firstName || ""},</h2>
  <p>
    Great news — your <b>${formattedPlan}</b> plan is now active, and today's
    meal cycle has officially begun. Welcome to this next chapter of your
    wellness journey!
  </p>
  <p>
    If anything looks off or you have questions, reach us anytime at
    <b>customersupport@ryviveroots.com</b>.
  </p>
  <p>Warmly,<br/><b>Team Ryvive Roots</b></p>
</div>
`,
          });
        }

        console.log(
          `[activateQueuedPlans] Activated order ${order._id} (${order.membershipId}) -> ${formattedPlan}`
        );
      } catch (innerErr) {
        // One bad order shouldn't block the rest of the batch.
        console.error(`[activateQueuedPlans] Failed to activate order ${order._id}:`, innerErr);
      }
    }
  } catch (err) {
    console.error("[activateQueuedPlans] job failed:", err);
  }
};