import express from "express";
import { easebuzzSuccess } from "../controllers/orderController.js";

const router = express.Router();

router.post("/easebuzz-success", easebuzzSuccess);

export default router;
