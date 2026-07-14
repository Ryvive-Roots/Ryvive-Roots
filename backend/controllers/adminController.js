import Order from "../models/order.js";
import User from "../models/User.js";
import crypto from "crypto";

export const impersonateUser = async (req, res) => {
  try {
    const { membershipId } = req.body; // admin sends the target customer's membershipId

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "membershipId required",
      });
    }

    const user = await User.findOne({ membershipId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const order = await Order.findOne({
      membershipId: user.membershipId,
    }).sort({ createdAt: -1 });

    // Simple session token — same shape as your login response,
    // just generated on the admin's behalf instead of the customer's
    const token = crypto.randomBytes(24).toString("hex");

    return res.json({
      success: true,
      token,
      user,
      membershipId: user.membershipId,
      order,
    });
  } catch (error) {
    console.error("Impersonate error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};