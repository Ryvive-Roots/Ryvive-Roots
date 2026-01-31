import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
 

  {
     
    // 🧪 TEST MODE FLAG
    isTest: {
      type: Boolean,
      default: false,
      index: true, // helpful for filtering test orders
    },

   membershipId: {
  type: String,
  required: true,
  index: true,   // ✅ fast search, NOT unique
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
      durationMonths: {
        type: Number,
        default: 1, // ✅ 1 month
      },

      // ⏳ ACTIVATION AFTER 48 HOURS
   activationAt: {
  type: Date,
  required: true,
  default: Date.now,
},



      // 📆 Subscription starts ONLY after activation
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      pause: {
        used: { type: Number, default: 0 }, // ✅ pause counter
        history: [
          {
            startDate: Date,
            resumeDate: Date,
            days: Number,
          },
        ],
      },

      status: {
        type: String,
        enum: ["UNDER_PROCESS", "ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"],
        default: "UNDER_PROCESS", // 🟠 default now
      },
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PAID",
    },
   paymentMethod: {
  type: String,
  enum: ["CASH", "ONLINE", "GPAY", "CARD", "RAZORPAY"],
  default: "CASH",
},

  },
  { timestamps: true },
);

// ✅ SAFE EXPORT (CORRECT)
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
