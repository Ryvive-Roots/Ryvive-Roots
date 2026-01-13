import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      unique: true,
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      dob: {
        type: Date, // ✅ BEST PRACTICE
        required: true,
      },
    },

    address: {
      pincode: String,
      house: String,
      street: String,
      landmark: String,
      city: { type: String, default: "Dombivli" },
      state: { type: String, default: "Maharashtra" },
    },

    // ✅ DELIVERY SLOT (FIXED)
    deliverySlot: {
      type: String,
      required: true,
    },

    subscription: {
      plan: {
        type: String,
        enum: ["SILVER", "GOLD", "PLATINUM"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        default: 30,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"],
        default: "ACTIVE",
      },
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PAID",
    },
  },
  { timestamps: true }
);

// ✅ SAFE EXPORT (CORRECT)
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
