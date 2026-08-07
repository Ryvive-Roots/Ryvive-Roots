import express from "express";
import { getAllTicketsForAdmin, updateTicketByAdmin } from "../controllers/ticketController.js";

const router = express.Router();

router.get("/queries", getAllTicketsForAdmin);
router.put("/queries/:id", updateTicketByAdmin);

export default router;