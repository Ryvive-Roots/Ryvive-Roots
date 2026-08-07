import express from "express";
import CustomerQuery from "../models/CustomerQuery.js";

const router = express.Router();

/* ===========================
   GET ALL CUSTOMER QUERIES
   Optional filters: ?status=Open&type=Complaint
=========================== */
router.get("/queries", async (req, res) => {
  try {
    const { status, type } = req.query;

    const filter = {};
    if (status && status !== "ALL") filter.status = status;
    if (type && type !== "ALL") filter.type = type;

    const queries = await CustomerQuery.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      queries,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch queries",
    });
  }
});

/* ===========================
   UPDATE A QUERY — status / assignee / response
   Body: { status?, assignedTo?, response? }
=========================== */
router.put("/queries/:id", async (req, res) => {
  try {
    const { status, assignedTo, response } = req.body;

    const allowedStatuses = ["Open", "In Progress", "Resolved"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const update = {};
    if (status) update.status = status;
    if (assignedTo !== undefined) update.assignedTo = assignedTo;
    if (response !== undefined) {
      update.response = response;
      update.respondedAt = new Date();
    }

    const query = await CustomerQuery.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      query,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to update query",
    });
  }
});

export default router;