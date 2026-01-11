import Order from "../models/Order.js";
import User from "../models/User.js";
import { PLANS } from "../utils/planConfig.js";
import generateMembershipId from "../utils/generateMembershipId.js";




export const placeOrder = async (req, res) => {
  try {
    const { formData, plan } = req.body;

    console.log("📦 ORDER DATA:", formData, plan);
    console.log("✅ /place-order HIT");
    console.log(req.body);

    // ❌ Validate input
    if (!formData || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    // ❌ Validate plan
    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // 1️⃣ FIND OR CREATE USER
    let user = await User.findOne({ phone: formData.phone });

    if (!user) {
      user = await User.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
    }

    // 3️⃣ CALCULATE DATES
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + selectedPlan.duration);

    // 2️⃣ CREATE MEMBERSHIP ID
    const membershipId = await generateMembershipId(Order);

    // 4️⃣ CREATE ORDER ✅
    const order = await Order.create({
      membershipId,

      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      },

      address: {
        pincode: formData.pincode,
        house: formData.house,
        street: formData.street,
        landmark: formData.landmark || "",
        city: "Dombivli",
        state: "Maharashtra",
      },

      deliverySlot: formData.slot, // ✅ REQUIRED FIELD

      subscription: {
        plan,
        amount: selectedPlan.price,
        duration: selectedPlan.duration,
        startDate,
        endDate,
        status: "ACTIVE",
      },

      paymentStatus: "PAID", // DEV MODE
    });

    console.log("✅ ORDER SAVED:", order._id);

    return res.json({
      success: true,
      membershipId,
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
