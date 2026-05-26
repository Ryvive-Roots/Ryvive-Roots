import express from "express";

import {
  createPendingPayment,
  getPendingPayments,
    verifyPendingPayment
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


router.post(
  "/verify-pending-payment/:id",
  verifyPendingPayment
);

export default router;