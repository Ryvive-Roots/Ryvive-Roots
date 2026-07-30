import DeliveryLog from "../models/DeliveryLog.js";
import Order from "../models/order.js";
import { updateGoogleSheet } from "../services/googleSheetService.js";

/**
 * GET /api/admin/delivery-log?date=2026-07-20
 */
export const getDeliveryLog = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const log = await DeliveryLog.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ membershipId: 1 });

    return res.json({
      success: true,
      log,
    });
  } catch (error) {
    console.error("Get Delivery Log Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery log",
    });
  }
};

/**
 * POST /api/admin/delivery-log
 */
export const saveDeliveryLog = async (req, res) => {
  try {
    const { date, log } = req.body;

    if (!date || !Array.isArray(log)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const updatedLogs = [];

    for (const item of log) {
      //---------------------------------------
      // Find Order
      //---------------------------------------

      const order = await Order.findById(item.orderId);

      if (!order) continue;

      //---------------------------------------
      // Save Delivery Log
      //---------------------------------------

      const deliveryLog = await DeliveryLog.findOneAndUpdate(
        {
          membershipId: order.membershipId,
          date: new Date(date),
        },
        {
          date: new Date(date),

          orderId: order._id,

          membershipId: order.membershipId,

          receiptNumber: order.receiptNumber,

          customer: {
            firstName: order.user.firstName,
            lastName: order.user.lastName,
            phone: order.user.phone,
            email: order.user.email,
          },

          subscription: {
            plan: order.subscription.plan,
            startDate: order.subscription.startDate,
            endDate: order.subscription.endDate,
            status: order.subscription.status,
          },

          deliverySlot: order.deliverySlot,

          totalMeals: item.totalMeals,

          mealDay: item.mealDay,

          consumedMeals: item.consumedMeals,

          remainingMeals: item.remainingMeals,

          deliveryStatus: item.status,

          reason: item.notes || "",

          menu: item.menu || "",

          weekNumber: item.weekNumber,

          weekdayNumber: item.weekdayNumber,

          staffInitials: item.staffInitials || "",

          updatedBy: "Admin",
        },
        {
          upsert: true,
          new: true,
        }
      );

      //---------------------------------------
      // Update Order Meal Count
      //---------------------------------------

      if (item.status === "DELIVERED") {

        order.subscription.consumedMeals =
          item.consumedMeals;

        order.subscription.remainingMeals =
          item.remainingMeals;

        order.subscription.mealDay =
          item.mealDay;

        await order.save();
      }

      //---------------------------------------
      // Google Sheet
      //---------------------------------------

      try {
        await updateGoogleSheet(order);

        deliveryLog.googleSheetSynced = true;
        deliveryLog.syncedAt = new Date();

        await deliveryLog.save();
      } catch (err) {
        console.error("Google Sheet Error:", err);
      }

      updatedLogs.push(deliveryLog);
    }

    return res.json({
      success: true,
      message: "Delivery log saved successfully.",
      updated: updatedLogs,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to save delivery log.",
    });
  }
};