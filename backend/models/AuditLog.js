import mongoose from "mongoose";

const AuditLogSchema =
  new mongoose.Schema(
    {
      action: {
        type: String,
        required: true,
      },

      performedBy: {
        type: String,
        default: "Admin",
      },

      customerName: String,

      membershipId: String,

      details: String,
    },
    {
      timestamps: true,
    }
  );

if (mongoose.models.AuditLog) {
  delete mongoose.models.AuditLog;
}

export default mongoose.model(
  "AuditLog",
  AuditLogSchema
);