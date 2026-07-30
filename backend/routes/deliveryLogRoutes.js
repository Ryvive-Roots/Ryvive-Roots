import express from "express";
import {
  getDeliveryLog,
  saveDeliveryLog,
} from "../controllers/deliveryLogController.js";

const router = express.Router();

router.get("/delivery-log", getDeliveryLog);

router.post("/delivery-log", saveDeliveryLog);

export default router;