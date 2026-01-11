import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,

  membershipId: String,
  password: String, // 🔐 hashed later

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
