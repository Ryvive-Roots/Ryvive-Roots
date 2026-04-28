import Order from "../models/order.js";
import generateInvoice from "../utils/generateInvoice.js";
import fs from "fs";

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

    const order = await Order.findOne({ membershipId, receiptNumber });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Always regenerate fresh PDF — no dependency on invoiceUrl
    const invoicePath = await generateInvoice(order);

    if (!fs.existsSync(invoicePath)) {
      return res.status(404).json({ success: false, message: "Could not generate invoice" });
    }

    // Stream PDF directly to browser as download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${receiptNumber}.pdf"`
    );

    const stream = fs.createReadStream(invoicePath);
    stream.pipe(res);

    // Clean up file after sending
    stream.on("end", () => {
      fs.unlink(invoicePath, (err) => {
        if (err) console.error("Cleanup error:", err);
      });
    });

  } catch (err) {
    console.error("Receipt error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};