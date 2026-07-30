import mongoose from "mongoose";

const DeliveryLogSchema = new mongoose.Schema(
  {
    // Delivery Date
    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Order Reference
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    membershipId: {
      type: String,
      required: true,
      index: true,
    },

    receiptNumber: {
      type: String,
    },

    // Customer Information (Snapshot)
    customer: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
    },

    // Subscription Details
    subscription: {
      plan: String,
      startDate: Date,
      endDate: Date,
      status: String,
    },

    deliverySlot: String,

    // Meal Progress
    totalMeals: {
      type: Number,
      required: true,
    },

    mealDay: {
      type: Number,
      required: true,
    },

    consumedMeals: {
      type: Number,
      required: true,
    },

    remainingMeals: {
      type: Number,
      required: true,
    },

    // Delivery Status
    deliveryStatus: {
      type: String,
      enum: [
        "PENDING",
        "DELIVERED",
        "NOT_DELIVERED",
        "PAUSED",
      ],
      default: "PENDING",
    },

    reason: {
      type: String,
      default: "",
    },

    // Menu
    menu: {
      type: String,
      default: "",
    },

    weekNumber: {
      type: Number,
    },

    weekdayNumber: {
      type: Number,
    },

    staffInitials: {
      type: String,
      default: "",
    },

    updatedBy: {
      type: String,
      default: "Admin",
    },

    googleSheetSynced: {
      type: Boolean,
      default: false,
    },

    syncedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate log for same customer on same day
DeliveryLogSchema.index(
  {
    membershipId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

if (mongoose.models.DeliveryLog) {
  delete mongoose.models.DeliveryLog;
}

export default mongoose.model("DeliveryLog", DeliveryLogSchema);