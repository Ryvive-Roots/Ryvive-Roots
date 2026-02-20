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
        return !this.isRenewal;
      },
    },

    // ⭐ add these (you already use them in controller)
    isRenewal: {
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