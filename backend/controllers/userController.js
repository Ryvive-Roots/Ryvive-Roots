import Order from "../models/Order.js";

export const getUserOrders = async (req, res) => {
  try {
    const { membershipId } = req.query;

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "Membership ID required",
      });
    }

    const orders = await Order.find({ membershipId }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("User orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
