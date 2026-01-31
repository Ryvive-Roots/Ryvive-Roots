import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
      isTest: {
      type: Boolean,
      default: false,
      index: true,
    },
    firstName: String,
    lastName: String,

    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },

    membershipId: {
      type: String,
      unique: true,
      sparse: true, // ✅ allow empty initially
      default: null, // ✅ allow missing
    },

    password: String,
    isPasswordCreated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
