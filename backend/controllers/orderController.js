import Order from "../models/Order.js";
import generateMembershipId from "../utils/generateMembershipId.js";

export const placeOrder = async (req, res) => {
  try {
    const { formData } = req.body;

    // 🔐 MOCK PAYMENT SUCCESS (TEMPORARY)
    const paymentSuccess = true;

    if (!paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: "Payment not verified",
      });
    }

    // ✅ Generate Membership ID AFTER payment
    const membershipId = await generateMembershipId();

    const newOrder = new Order({
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
      },

      address: {
        pincode: formData.pincode,
        house: formData.house,
        street: formData.street,
        landmark: formData.landmark,
      },

      slot: formData.slot,
      amount: 4999,

      paymentStatus: "PAID",
      membershipId,
    });

    await newOrder.save();

    return res.json({
      success: true,
      membershipId,
      email: formData.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
