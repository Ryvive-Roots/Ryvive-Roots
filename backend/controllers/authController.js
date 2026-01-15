import Order from "../models/Order.js";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { membershipId, identifier } = req.body;
    // identifier = email OR phone

    if (!membershipId || !identifier) {
      return res.status(400).json({
        success: false,
        message: "Membership ID and Email/Phone required",
      });
    }

    // ✅ Find user directly
    const user = await User.findOne({
      membershipId,
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    // ✅ Fetch latest order (optional but useful)
    const order = await Order.findOne({ membershipId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      user,
      membershipId,
      order,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
