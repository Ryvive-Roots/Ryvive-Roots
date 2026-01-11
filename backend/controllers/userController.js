import Order from "../models/Order.js";

export const getUserOrders = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware

    // ✅ Find orders using phone (since orders store embedded user)
    const orders = await Order.find({
      "user.phone": user.phone,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
