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

    invoiceUrl: String,

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

   healthInfo: {
  allergies: String,
  medicalConditions: String,
},

remarks: String,


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
  set: v => {
    if (!v) return v;
    const p = v.toUpperCase();
    if (p.includes("PLATINUM")) return "PLATINUM";
    if (p.includes("GOLD")) return "GOLD";
    if (p.includes("SILVER")) return "SILVER";
    return v;
  }
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
       // 🔔 NEW FIELDS (ADD THESE)
   // 🔔 MULTI-REMINDER SUPPORT
      renewalReminderStage: {
        type: String,
        enum: ["NONE", "4D", "1D"],
        default: "NONE",
      },

      renewalReminderDate: {
        type: Date,
      },
    },

    

   paymentStatus: {
  type: String,
  enum: ["PENDING", "PAID", "FAILED"],
  default: "PENDING",
},

   paymentMethod: {
  type: String,
  enum: ["CASH", "ONLINE", "GPAY", "CARD", "EASEBUZZ"],
  default: "CASH",
},

  },
  { timestamps: true },
);

// ✅ SAFE EXPORT (CORRECT)
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
