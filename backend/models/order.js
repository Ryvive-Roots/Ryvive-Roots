import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      dob: String,
    },

    address: {
      pincode: String,
      house: String,
      street: String,
      landmark: String,
    },

    slot: String,

    amount: Number,

    paymentStatus: {
      type: String,
      default: "PENDING",
    },

    membershipId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
