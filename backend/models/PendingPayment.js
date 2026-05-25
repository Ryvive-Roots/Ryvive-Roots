import mongoose from "mongoose";

const PendingPaymentSchema = new mongoose.Schema(
  {
    user: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,

      dob: {
        type: Date,
      },
    },

    address: {
      pincode: String,
      area: String,
      house: String,
      street: String,
      landmark: String,

      city: {
        type: String,
        default: "Dombivli",
      },

      state: {
        type: String,
        default: "Maharashtra",
      },

      country: {
        type: String,
        default: "India",
      },
    },

    healthInfo: {
      allergies: String,
      medicalConditions: String,
    },

    remarks: String,

    // ✅ SAME AS ORDER
    deliverySlot: {
      type: String,
      required: true,
    },

    subscription: {
      plan: {
        type: String,

        enum: [
          "SILVER_1MONTH",
          "GOLD_1MONTH",
          "PLATINUM_1MONTH",

          "SILVER_3MONTH",
          "GOLD_3MONTH",
          "PLATINUM_3MONTH",
        ],
      },

      amount: {
        type: Number,
        required: true,
      },

      durationMonths: {
        type: Number,
        default: 1,
      },

      startDate: {
        type: Date,
      },
    },

    paymentMethod: {
      type: String,

      enum: [
        "CASH",
        "ONLINE",
        "GPAY",
        "CARD",
        "EASEBUZZ",
      ],

      default: "CASH",
    },

    paymentStatus: {
      type: String,

      enum: ["PENDING", "PAID"],

      default: "PENDING",
    },

    createdBy: String,
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.PendingPayment) {
  delete mongoose.models.PendingPayment;
}

export default mongoose.model(
  "PendingPayment",
  PendingPaymentSchema
);