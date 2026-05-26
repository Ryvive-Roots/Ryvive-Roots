import express from "express";

import {
  createPendingPayment,
  getPendingPayments,
  
} from "../controllers/pendingPaymentController.js";

const router = express.Router();


// ✅ CREATE PENDING PAYMENT
router.post(
  "/pending-payment",
  createPendingPayment
);


// ✅ GET ALL PENDING PAYMENTS
router.get(
  "/pending-payments",
  getPendingPayments
);

export default router;