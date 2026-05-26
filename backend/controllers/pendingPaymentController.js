import PendingPayment from "../models/PendingPayment.js";
import AuditLog from "../models/AuditLog.js";


// ✅ CREATE PENDING PAYMENT
export const createPendingPayment = async (req, res) => {
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

    // ✅ BASIC VALIDATION
    if (
      !user?.firstName ||
      !user?.phone ||
      !subscription?.plan ||
      !subscription?.amount ||
      !deliverySlot
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ CREATE PENDING PAYMENT
    const pending = await PendingPayment.create({
      user,
      address,
      healthInfo,
      remarks,

      deliverySlot,

      subscription,

      paymentMethod,

      createdBy,

      paymentStatus: "PENDING",
    });

    await AuditLog.create({
  action: "PENDING_PAYMENT_CREATED",

  performedBy:
    createdBy || "Admin",

  customerName:
    `${user.firstName} ${user.lastName}`,

  details:
    `Pending payment created for ${subscription.plan}`,
});

    res.status(201).json({
      success: true,
      message: "Pending payment created",
      pending,
    });

  } catch (err) {
    console.error("CREATE PENDING PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create pending payment",
    });
  }
};




// ✅ GET ALL PENDING PAYMENTS
export const getPendingPayments = async (req, res) => {
  try {

    const pendingPayments = await PendingPayment.find({
      paymentStatus: "PENDING",
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: pendingPayments.length,
      pendingPayments,
    });

  } catch (err) {

    console.error("GET PENDING PAYMENTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments",
    });
  }
};