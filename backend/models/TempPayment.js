import mongoose from "mongoose";

const TempPaymentSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    formData: { type: Object, required: true },
    status: {
      type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
  default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TempPayment", TempPaymentSchema);
