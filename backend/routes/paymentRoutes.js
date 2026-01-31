import express from "express";
import {
  initiateEasebuzzPayment,
  easebuzzPaymentSuccess,
  easebuzzPaymentFailure,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/easebuzz/initiate", initiateEasebuzzPayment);
router.post("/easebuzz/success", easebuzzPaymentSuccess); // forward only
router.post("/easebuzz/failure", easebuzzPaymentFailure);

export default router;
