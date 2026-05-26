import PendingPayment from "../models/PendingPayment.js";
import AuditLog from "../models/AuditLog.js";
import Order from "../models/Order.js";


// ✅ CREATE PENDING PAYMENT
export const createPendingPayment =
  async (req, res) => {

    try {

      const {
        user,
        address,
        healthInfo,
        remarks,

        deliverySlot,

        subscription,

        paymentMethod,

        createdBy,
      } = req.body;

      // ✅ VALIDATION
      if (
        !user?.firstName ||
        !user?.phone ||
        !subscription?.plan ||
        !subscription?.amount ||
        !deliverySlot
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields",
        });
      }

      // ✅ CREATE PENDING PAYMENT
      const pending =
        await PendingPayment.create({

          user,

          address,

          healthInfo,

          remarks,

          deliverySlot,

          subscription,

          paymentMethod,

          createdBy,

          paymentStatus:
            "PENDING",
        });

      // ✅ AUDIT LOG
      await AuditLog.create({

        action:
          "PENDING_PAYMENT_CREATED",

        performedBy:
          createdBy || "Admin",

        customerName:
          `${user.firstName} ${user.lastName}`,

        details:
          `Pending payment created for ${subscription.plan}`,
      });

      res.status(201).json({
        success: true,
        message:
          "Pending payment created",
        pending,
      });

    } catch (err) {

      console.error(
        "CREATE PENDING PAYMENT ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create pending payment",
      });
    }
};




// ✅ GET ALL PENDING PAYMENTS
export const getPendingPayments =
  async (req, res) => {

    try {

      const pendingPayments =
        await PendingPayment.find({
          paymentStatus:
            "PENDING",
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        total:
          pendingPayments.length,
        pendingPayments,
      });

    } catch (err) {

      console.error(
        "GET PENDING PAYMENTS ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch pending payments",
      });
    }
};




// ✅ VERIFY PENDING PAYMENT
export const verifyPendingPayment =
  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        paymentMethod,
      } = req.body;

      // ✅ FIND PENDING
      const pending =
        await PendingPayment.findById(id);

      if (!pending) {

        return res.status(404).json({
          success: false,
          message:
            "Pending payment not found",
        });
      }

      // ✅ MEMBERSHIP ID
      const membershipId =
        `RR${Date.now()}`;

      // ✅ RECEIPT
      const receiptNumber =
        `RCPT-${Date.now()}`;

      // ✅ START DATE
      const startDate =
        new Date(
          pending.subscription?.startDate
        );

      // ✅ END DATE
      const endDate =
        new Date(startDate);

      endDate.setMonth(
        endDate.getMonth() +
        (
          pending.subscription
            ?.durationMonths || 1
        )
      );

      // ✅ CREATE ORDER
      const order =
        await Order.create({

          membershipId,

          receiptNumber,

          user:
            pending.user,

          address:
            pending.address,

          healthInfo:
            pending.healthInfo,

          remarks:
            pending.remarks,

          deliverySlot:
            pending.deliverySlot,

          subscription: {

            plan:
              pending.subscription?.plan,

            amount:
              pending.subscription?.amount,

            durationMonths:
              pending.subscription
                ?.durationMonths || 1,

            activationAt:
              new Date(),

            startDate,

            endDate,

            status:
              "ACTIVE",
          },

          paymentStatus:
            "PAID",

          paymentMethod:
            paymentMethod ||
            "CASH",
        });

      // ✅ AUDIT LOG
      await AuditLog.create({

        action:
          "PAYMENT_VERIFIED",

        performedBy:
          pending.createdBy ||
          "Admin",

        customerName:
          `${pending.user.firstName} ${pending.user.lastName}`,

        membershipId,

        details:
          `Pending payment verified and customer activated`,
      });

      // ✅ DELETE PENDING
      await PendingPayment.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message:
          "Payment verified successfully",
        order,
      });

    } catch (err) {

      console.error(
        "VERIFY PAYMENT ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to verify payment",
      });
    }
};