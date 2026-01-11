import express from "express";
import { createPassword, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/create-password", createPassword);
router.post("/login", loginUser);

export default router;
