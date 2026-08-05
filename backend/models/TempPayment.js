import mongoose from "mongoose";

const TempPaymentSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true, unique: true },

    amount: { type: Number, required: true },

    plan: { type: String, required: true },

    // ⭐ required only for NEW subscription
    formData: {
      type: Object,
    required: function () {
  return (
    !this.isRenewal &&
    !this.isExistingCustomerPurchase
  );
},
    },

    // ⭐ add these (you already use them in controller)
    isRenewal: {
      type: Boolean,
      default: false,
    },

    isExistingCustomerPurchase: {
  type: Boolean,
  default: false,
},

    // 🆕 "Continue with this plan" from the ongoing-plan modal — when true
    // (only ever alongside isExistingCustomerPurchase), easebuzzSuccess
    // creates a queued "UPCOMING" order instead of switching the plan
    // immediately. See controllers/easebuzz.controller.js.
    startAfterCurrentPlanEnds: {
      type: Boolean,
      default: false,
    },

    membershipId: {
      type: String,
      default: null,
      index: true,
    },

    durationMonths: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TempPayment", TempPaymentSchema);