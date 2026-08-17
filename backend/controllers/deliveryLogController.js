import DeliveryLog from "../models/DeliveryLog.js";
import Order from "../models/order.js";
import { updateGoogleSheet } from "../services/googleSheetService.js";

/**
 * GET /api/admin/delivery-log?date=2026-07-20
 *
 * Get delivery log for selected date
 */
export const getDeliveryLog = async (req, res) => {
  try {
    const { date } = req.query;

    // =========================================
    // Validate date
    // =========================================

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // =========================================
    // Start of selected date
    // =========================================

    const start = new Date(selectedDate);

    start.setHours(0, 0, 0, 0);

    // =========================================
    // End of selected date
    // =========================================

    const end = new Date(selectedDate);

    end.setHours(23, 59, 59, 999);

    // =========================================
    // Find delivery logs
    // =========================================

    const log = await DeliveryLog.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      membershipId: 1,
    });

    // =========================================
    // Response
    // =========================================

    return res.json({
      success: true,
      log,
    });

  } catch (error) {
    console.error(
      "Get Delivery Log Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery log",
    });
  }
};


/**
 * POST /api/admin/delivery-log
 *
 * Save daily delivery log
 *
 * Flow:
 *
 * Admin Dashboard
 *       ↓
 * Save Delivery Log
 *       ↓
 * MongoDB DeliveryLog
 *       ↓
 * Update Order Meal Counts
 *       ↓
 * Google Sheet
 */
export const saveDeliveryLog = async (req, res) => {
  try {
    const { date, log } = req.body;

    // =========================================
    // Validate request
    // =========================================

    if (!date || !Array.isArray(log)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery date",
      });
    }

    // =========================================
    // Normalize date
    // =========================================

    selectedDate.setHours(
      0,
      0,
      0,
      0
    );

    const updatedLogs = [];

    // =========================================
    // Process every customer
    // =========================================

    for (const item of log) {
      try {

        // =======================================
        // 1. Validate Order ID
        // =======================================

        if (!item.orderId) {
          console.warn(
            "Skipping delivery item: orderId missing"
          );

          continue;
        }


        // =======================================
        // 2. Find Order
        // =======================================

        const order = await Order.findById(
          item.orderId
        );

        if (!order) {
          console.warn(
            `Order not found: ${item.orderId}`
          );

          continue;
        }


        // =======================================
        // 3. Subscription Data
        // =======================================

        const subscription =
          order.subscription || {};


        // =======================================
        // 4. Customer Data
        // =======================================

        const user =
          order.user || {};


        // =======================================
        // 5. Normalize Delivery Status
        //
        // Frontend sends:
        //
        // Delivered
        // Pending
        // Paused
        //
        // MongoDB stores:
        //
        // DELIVERED
        // PENDING
        // PAUSED
        // NOT_DELIVERED
        // =======================================

        const normalizedDeliveryStatus =
          item.status === "Delivered"
            ? "DELIVERED"
            : item.status === "Paused"
              ? "PAUSED"
              : item.status === "Pending"
                ? "PENDING"
                : "NOT_DELIVERED";


// =======================================
// 6. PREPARE MEAL VALUES
// =======================================

// ---------------------------------------
// TOTAL MEAL DAYS
// ---------------------------------------

let totalMeals = Number(
  item.totalMeals ??
  subscription.totalMeals ??
  subscription.totalMealDays ??
  subscription.mealDays ??
  0
);

// ---------------------------------------
// FALLBACK FROM DURATION
// 1 month = 24 meal days
// 2 months = 48 meal days
// 3 months = 72 meal days
// ---------------------------------------

if (
  (!totalMeals || totalMeals <= 0) &&
  subscription.durationMonths
) {
  totalMeals =
    Number(subscription.durationMonths) * 24;
}

// ---------------------------------------
// FALLBACK FROM PLAN NAME
// ---------------------------------------

if (!totalMeals || totalMeals <= 0) {

  const planName = String(
    subscription.plan || ""
  ).toUpperCase();

  if (
    planName.includes("3MONTH") ||
    planName.includes("3M")
  ) {
    totalMeals = 72;
  }

  else if (
    planName.includes("2MONTH") ||
    planName.includes("2M")
  ) {
    totalMeals = 48;
  }

  else if (
    planName.includes("1MONTH") ||
    planName.includes("1M")
  ) {
    totalMeals = 24;
  }
}


// =======================================
// CALCULATE CONSUMED MEALS
// =======================================

// ---------------------------------------
// Subscription start date
// ---------------------------------------

const subscriptionStartDate =
  subscription.startDate
    ? new Date(subscription.startDate)
    : null;

let consumedMeals = 0;


// =======================================
// COUNT PREVIOUS DELIVERED MEALS
// =======================================
//
// IMPORTANT:
// Count only dates BEFORE today's date.
//
// Do NOT include today's DeliveryLog here.
// Today's status is handled separately below.
//
// =======================================

if (
  subscriptionStartDate &&
  !Number.isNaN(
    subscriptionStartDate.getTime()
  )
) {

  const countStart =
    new Date(subscriptionStartDate);

  countStart.setHours(
    0,
    0,
    0,
    0
  );


  const countEnd =
    new Date(selectedDate);

  // IMPORTANT:
  // End at the day BEFORE selected date.

  countEnd.setDate(
    countEnd.getDate() - 1
  );

  countEnd.setHours(
    23,
    59,
    59,
    999
  );


  // Only query if start date is before today

  if (countStart <= countEnd) {

    consumedMeals =
      await DeliveryLog.countDocuments({

        membershipId:
          order.membershipId,

        date: {
          $gte: countStart,
          $lte: countEnd,
        },

        deliveryStatus:
          "DELIVERED",

      });
  }
}


// =======================================
// TODAY'S DELIVERY
// =======================================
//
// Add today's meal ONLY when today's
// selected status is Delivered.
//
// =======================================

if (
  normalizedDeliveryStatus === "DELIVERED"
) {
  consumedMeals += 1;
}


// =======================================
// PREVENT INVALID VALUE
// =======================================

if (consumedMeals < 0) {
  consumedMeals = 0;
}


// =======================================
// CONSUMED CANNOT EXCEED TOTAL
// =======================================

if (
  totalMeals > 0 &&
  consumedMeals > totalMeals
) {
  consumedMeals = totalMeals;
}


// =======================================
// REMAINING
// =======================================

const remainingMeals =
  Math.max(
    totalMeals - consumedMeals,
    0
  );


// =======================================
// MEAL DAY
// =======================================

const mealDay =
  consumedMeals;


console.log(
  `🍱 MEAL COUNTS | ${order.membershipId} | ` +
  `Total: ${totalMeals} | ` +
  `Consumed: ${consumedMeals} | ` +
  `Remaining: ${remainingMeals}`
);

        // =======================================
        // 7. Save / Update Delivery Log
        //
        // One customer + one date = one record
        // =======================================

        const deliveryLog =
          await DeliveryLog.findOneAndUpdate(

            {
              membershipId:
                order.membershipId,

              date: selectedDate,
            },

            {
              date: selectedDate,

              orderId: order._id,

              membershipId:
                order.membershipId,

              receiptNumber:
                order.receiptNumber || "",


              // ---------------------------------
              // Customer Snapshot
              // ---------------------------------

              customer: {
                firstName:
                  user.firstName || "",

                lastName:
                  user.lastName || "",

                phone:
                  user.phone || "",

                email:
                  user.email || "",
              },


              // ---------------------------------
              // Subscription Snapshot
              // ---------------------------------

              subscription: {
                plan:
                  subscription.plan || "",

                startDate:
                  subscription.startDate || null,

                endDate:
                  subscription.endDate || null,

                status:
                  subscription.status || "",
              },


              // ---------------------------------
              // Delivery Slot
              // ---------------------------------

              deliverySlot:
                order.deliverySlot || "",


              // ---------------------------------
              // Meal Progress
              // ---------------------------------

              totalMeals,

              mealDay,

              consumedMeals,

              remainingMeals,


              // ---------------------------------
              // Delivery Status
              // ---------------------------------

              deliveryStatus:
                normalizedDeliveryStatus,


              // ---------------------------------
              // Reason
              // ---------------------------------

              reason:
                item.notes || "",


              // ---------------------------------
              // Menu
              // ---------------------------------

              menu:
                item.menu || "",


              // ---------------------------------
              // Updated By
              // ---------------------------------

              updatedBy: "Admin",
            },

            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );


        // =======================================
        // 8. Update Order Meal Count
        //
        // Only when meal is Delivered
        // =======================================

      if (item.status === "Delivered") {

  // =========================================
  // SAVE CALCULATED MEAL COUNTS
  // =========================================

  order.subscription.totalMeals =
    totalMeals;

  order.subscription.consumedMeals =
    consumedMeals;

  order.subscription.remainingMeals =
    remainingMeals;

  order.subscription.mealDay =
    mealDay;

  await order.save();

  console.log(
    `🍱 Subscription updated | ` +
    `${order.membershipId} | ` +
    `Total: ${totalMeals} | ` +
    `Consumed: ${consumedMeals} | ` +
    `Remaining: ${remainingMeals}`
  );
}


        // =======================================
        // 9. Google Sheet Sync
        // =======================================

        try {

          await updateGoogleSheet({

            order,

            // IMPORTANT:
            // Keep frontend status here:
            //
            // Delivered
            // Pending
            // Paused
            //
            // Google Sheet service converts:
            //
            // Delivered → Yes
            // Pending   → No
            // Paused    → Paused

            delivery: {
              ...item,

              totalMeals,

              mealDay,

              consumedMeals,

              remainingMeals,
            },

            deliveryDate: date,
          });


          // -------------------------------------
          // Mark Google Sheet as synced
          // -------------------------------------

          deliveryLog.googleSheetSynced =
            true;

          deliveryLog.syncedAt =
            new Date();


          await deliveryLog.save();


          console.log(
            `Google Sheet synced successfully: ${order.membershipId} - ${date}`
          );

        } catch (googleSheetError) {

          // -------------------------------------
          // Google Sheet error should NOT
          // cancel MongoDB save
          // -------------------------------------

          console.error(
            `Google Sheet sync failed for ${order.membershipId}:`,
            googleSheetError.response?.data ||
            googleSheetError.message ||
            googleSheetError
          );
        }


        // =======================================
        // 10. Add Updated Log To Response
        // =======================================

        updatedLogs.push(
          deliveryLog
        );

      } catch (itemError) {

        // ---------------------------------------
        // If one customer fails,
        // continue processing others
        // ---------------------------------------

        console.error(
          `Failed to process delivery item ${item.orderId}:`,
          itemError
        );

        continue;
      }
    }


    // =========================================
    // 11. Final Response
    // =========================================

    return res.json({

      success: true,

      message:
        "Delivery log saved successfully.",

      updated:
        updatedLogs,

    });

  } catch (error) {

    console.error(
      "Save Delivery Log Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to save delivery log.",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,

    });
  }
};