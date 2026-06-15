import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // 🧪 TEST MODE FLAG
    isTest: {
      type: Boolean,
      default: false,
      index: true,
    },

    membershipId: {
      type: String,
      required: true,
      index: true, // ✅ fast search, NOT unique — child orders share base ID
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
      emailChanges:    { type: Number, default: 0 },
      lastEmailChange: { type: Date },
      phoneChanges:    { type: Number, default: 0 },
      lastPhoneChange: { type: Date },
      dob:             { type: Date },
    },

    address: {
      pincode:           String,
      house:             String,
      street:            String,
      landmark:          String,
      city:              { type: String, default: "Dombivli" },
      state:             { type: String, default: "Maharashtra" },
      addressChanges:    { type: Number, default: 0 },
      lastAddressChange: { type: Date },
    },

    healthInfo: {
      allergies:         String,
      medicalConditions: String,
    },

    remarks: String,

    // ✅ removed required:true — renewal + child orders copy from parent
    deliverySlot: {
      type: String,
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
      activationAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      pause: {
        used: { type: Number, default: 0 },
        history: [
          {
            startDate:  Date,
            endDate:    Date,
            resumeDate: Date,
            days:       Number,
          },
        ],
      },
      status: {
        type: String,
        enum: ["UNDER_PROCESS", "ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"],
        default: "UNDER_PROCESS",
      },
      renewalReminderStage: {
        type: String,
        enum: ["NONE", "4D", "1D"],
        default: "NONE",
      },
      renewalReminderDate: { type: Date },
      thankYouEmailSentAt: { type: Date },
      welcomeEmailSent: {
        type: Boolean,
        default: false,
      },
      renewal: {
        pending:        { type: Boolean, default: false },
        durationMonths: { type: Number },
      },
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // ✅ removed ONLINE — use EASEBUZZ for all gateway payments
    paymentMethod: {
      type: String,
      enum: ["CASH", "GPAY", "CARD", "EASEBUZZ"],
      default: "CASH",
    },

    // ✅ kept for simple single-field reference
    transactionId: {
      type: String,
      default: "",
    },

    // ✅ ADDED — full Easebuzz payment details
    paymentDetails: {
      gateway:   { type: String },
      txnid:     { type: String },
      easepayid: { type: String },
    },
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model("Order", OrderSchema);