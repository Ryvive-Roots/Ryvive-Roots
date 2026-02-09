import cron from "node-cron";
import Order from "../models/order.js";

cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  const pausedOrders = await Order.find({
    "subscription.status": "PAUSED",
    "subscription.pause.resumeDate": { $lte: today },
  });

  for (const order of pausedOrders) {
    order.subscription.status = "ACTIVE";
    order.subscription.pause = null;
    await order.save();
  }

  console.log("Paused subscriptions resumed");
});
