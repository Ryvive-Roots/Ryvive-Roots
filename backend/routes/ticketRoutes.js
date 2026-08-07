import express from "express";
import {
  createSupportTicket,
  getTickets,
  getAllTicketsForAdmin,
  updateTicketByAdmin,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/support", createSupportTicket);
router.get("/tickets", getTickets);

// admin routes — mount this router (or these two lines) under /api/admin
router.get("/admin/queries", getAllTicketsForAdmin);
router.put("/admin/queries/:id", updateTicketByAdmin);

export default router;