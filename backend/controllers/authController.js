import Order from "../models/order.js";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { identifier } = req.body; // membershipId OR email OR phone

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Identifier required",
      });
    }

    const user = await User.findOne({
      $or: [
        { membershipId: identifier },
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login credentials",
      });
    }

    const order = await Order.findOne({
      membershipId: user.membershipId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      user,
      membershipId: user.membershipId,
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

