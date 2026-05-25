import AuditLog from "../models/AuditLog.js";


// ✅ GET AUDIT LOGS
export const getAuditLogs =
  async (req, res) => {

    try {

      const logs =
        await AuditLog.find()
          .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        logs,
      });

    } catch (err) {

      console.error(
        "GET AUDIT LOGS ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch audit logs",
      });
    }
};