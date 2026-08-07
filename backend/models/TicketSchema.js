import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    membershipId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Query", "Complaint", "Feedback"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
      ],
      default: "OPEN",
    },

    adminReply: {
      type: String,
      default: "",
    },

    repliedAt: Date,
    closedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);