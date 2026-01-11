import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,

    email: { type: String, unique: true },
    phone: { type: String, unique: true },

    password: String,
    isPasswordCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
