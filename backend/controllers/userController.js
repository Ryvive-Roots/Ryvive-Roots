import Order from "../models/order.js";

export const getUserOrders = async (req, res) => {
  try {
    const { membershipId } = req.query;

    const orders = await Order.find({ membershipId });

    const now = new Date();
    console.log("🕒 Server Time:", now);

    for (const order of orders) {
      console.log("⏳ Activation At:", order.subscription.activationAt);
      console.log("📌 Current Status:", order.subscription.status);

      if (
        order.subscription.status === "UNDER_PROCESS" &&
        order.subscription.activationAt &&
        new Date(order.subscription.activationAt) <= now
      ) {
        order.subscription.status = "ACTIVE";
        await order.save();

        console.log("✅ Activated:", order.membershipId);
      }
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const { membershipId, receiptNumber } = req.query;

    console.log("📥 membershipId:", membershipId);
    console.log("📥 receiptNumber:", receiptNumber);

    const order = await Order.findOne({ membershipId, receiptNumber });

    console.log("📦 Order found:", order?._id ?? "NOT FOUND");
    console.log("🧾 invoiceUrl:", order?.invoiceUrl ?? "NO URL");

    if (!order || !order.invoiceUrl) {
      return res.json({ success: false, message: "Receipt not found" });
    }

    // Temporarily just return the URL to confirm flow works
    return res.json({ success: true, invoiceUrl: order.invoiceUrl });

  } catch (err) {
    console.error(err);
    return res.json({ success: false });
  }
};
