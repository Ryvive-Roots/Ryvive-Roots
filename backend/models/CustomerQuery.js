import mongoose from "mongoose";

const customerQuerySchema = new mongoose.Schema(
  {
    membershipId: {
      type: String,
      required: true,
    },

    // snapshot of who raised it, so the admin table never needs a join
    customerName: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    customerEmail: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["Query", "Complaint", "Feedback"],
      default: "Query",
    },

    subject: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // used for Feedback only
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    assignedTo: {
      type: String,
      default: null,
    },

    response: {
      type: String,
      default: null,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomerQuery", customerQuerySchema);