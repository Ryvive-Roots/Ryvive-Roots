import express from "express";
import { loginUser, checkCustomer  } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/check-customer", checkCustomer); 

export default router;
