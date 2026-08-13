import mongoose from "mongoose";

const DeliveryLogSchema = new mongoose.Schema(
  {
    // =========================================
    // DELIVERY DATE
    // =========================================
    date: {
      type: Date,
      required: true,
      index: true,
    },

    // =========================================
    // ORDER REFERENCE
    // =========================================
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // =========================================
    // MEMBERSHIP ID
    // =========================================
    membershipId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    // =========================================
    // RECEIPT NUMBER
    // =========================================
    receiptNumber: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================================
    // CUSTOMER INFORMATION
    // Snapshot at delivery time
    // =========================================
    customer: {
      firstName: {
        type: String,
        default: "",
        trim: true,
      },

      lastName: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =========================================
    // SUBSCRIPTION DETAILS
    // =========================================
    subscription: {
      plan: {
        type: String,
        default: "",
      },

      startDate: {
        type: Date,
      },

      endDate: {
        type: Date,
      },

      status: {
        type: String,
        default: "",
      },
    },

    // =========================================
    // DELIVERY SLOT
    // =========================================
    deliverySlot: {
      type: String,
      default: "",
    },

    // =========================================
    // MEAL PROGRESS
    // =========================================
    totalMeals: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    mealDay: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    consumedMeals: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    remainingMeals: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // =========================================
    // DELIVERY STATUS
    // =========================================
    //
    // Frontend values:
    // Delivered → DELIVERED
    // Pending   → PENDING
    // Paused    → PAUSED
    //
    // =========================================
    deliveryStatus: {
      type: String,

      enum: [
        "PENDING",
        "DELIVERED",
        "NOT_DELIVERED",
        "PAUSED",
      ],

      default: "PENDING",

      index: true,
    },

    // =========================================
    // REASON
    // =========================================
    reason: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================================
    // MENU
    // =========================================
    menu: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================================
    // UPDATED BY
    // =========================================
    updatedBy: {
      type: String,
      default: "Admin",
      trim: true,
    },

    // =========================================
    // GOOGLE SHEET SYNC
    // =========================================
    googleSheetSynced: {
      type: Boolean,
      default: false,
      index: true,
    },

    syncedAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);


// =========================================
// PREVENT DUPLICATE DAILY DELIVERY LOG
//
// Same customer + same date = ONE record
//
// Example:
//
// RV001 + 13/08/2026 → one record
// RV001 + 14/08/2026 → another record
//
// =========================================

DeliveryLogSchema.index(
  {
    membershipId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


// =========================================
// MODEL
// =========================================

if (mongoose.models.DeliveryLog) {
  delete mongoose.models.DeliveryLog;
}

export default mongoose.model(
  "DeliveryLog",
  DeliveryLogSchema
); 