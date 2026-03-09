import express from "express";
import {
  initiateEasebuzzPayment,
  easebuzzPaymentSuccess,
  easebuzzFailure,
} from "../controllers/paymentController.js";
import { abandonedForm } from "../controllers/abandonedForm.js";

const router = express.Router();

router.post("/easebuzz/initiate", initiateEasebuzzPayment);
router.post("/easebuzz/success", easebuzzPaymentSuccess); 
router.post("/easebuzz/failure", easebuzzFailure);
router.post("/abandoned-form", abandonedForm);
export default router;
