import Notification from "../models/Notification.js";
import Order from "../models/Order.js";

// Individual Message
export const sendMessage = async (req, res) => {
  try {
    const { membershipId, message } = req.body;

    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const notification = await Notification.create({
      membershipId,
      title: "Message From Admin",
      message,
    });

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Broadcast Message
export const broadcastMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const orders = await Order.find();

    const notifications = orders.map((o) => ({
      membershipId: o.membershipId,
      title: "Broadcast Message",
      message,
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: "Broadcast sent",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};