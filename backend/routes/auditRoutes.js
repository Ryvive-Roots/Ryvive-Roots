import express from "express";

import {
  getAuditLogs,
} from "../controllers/auditController.js";

const router = express.Router();


// ✅ GET AUDIT LOGS
router.get(
  "/audit-logs",
  getAuditLogs
);

export default router;