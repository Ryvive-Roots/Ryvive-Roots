import mongoose from "mongoose";

const CustomerMenuSchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      required: true,
      index: true, // fast lookup per member
    },

    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },

    meal: {
      type: String,
      default: "",
    },

    restDay: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One override per member per date — prevents duplicate rows for the same day
CustomerMenuSchema.index({ membershipId: 1, date: 1 }, { unique: true });

export default mongoose.model("CustomerMenu", CustomerMenuSchema);