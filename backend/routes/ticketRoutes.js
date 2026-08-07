import express from "express";
import { createSupportTicket, getTickets } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/support", createSupportTicket);
router.get("/tickets", getTickets);

export default router;