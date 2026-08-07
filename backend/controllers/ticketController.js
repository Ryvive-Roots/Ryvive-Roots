import Ticket from "../models/TicketSchema.js";
import generateTicketNumber from "../utils/generateTicketNumber.js";

import Order from "../models/order.js"; 

const VALID_TYPES = ["Query", "Complaint", "Feedback"];

/**
 * Create a new support ticket (Query / Complaint / Feedback).
 *
 * NOTE on the retry loop below: ticketNumber generation (generateTicketNumber)
 * is check-then-generate, not atomic — same class of race condition we hit
 * with membershipId. If two tickets are created in the same second, both
 * could compute the same "next" ticketNumber. Ticket.ticketNumber is unique,
 * so MongoDB will reject the second one with an E11000 error instead of
 * silently corrupting data — this loop just catches that specific error and
 * retries with a freshly generated number.
 *
 * Retries are capped at 5 attempts (unlike the old generateMembershipId bug,
 * which retried forever on a value that could never change and caused a 504).
 * If it's still colliding after 5 tries, something else is wrong — better to
 * fail loudly than hang the request.
 */
export const createSupportTicket = async (req, res) => {
  try {
    const { membershipId, type, message, rating } = req.body;

    if (!membershipId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ticket type. Must be one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    let ticket = null;
    let created = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (!created) {
      attempts++;
      const ticketNumber = await generateTicketNumber(Ticket, type);

      try {
        ticket = await Ticket.create({
          ticketNumber,
          membershipId,
          type,
          message,
          rating,
        });
        created = true;
      } catch (err) {
        const isTicketNumberCollision =
          err.code === 11000 && err.keyPattern?.ticketNumber;

        if (isTicketNumberCollision && attempts < MAX_ATTEMPTS) {
          console.log(
            `Ticket number collision on ${ticketNumber} — retrying (attempt ${attempts}/${MAX_ATTEMPTS})...`
          );
          continue; // loop again with a freshly generated ticketNumber
        }

        // Either a different kind of error, or we've exhausted retries —
        // don't loop forever, just surface it.
        throw err;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      ticket,
    });
  } catch (error) {
    console.error("createSupportTicket error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create ticket.",
    });
  }
};

/**
 * Fetch all tickets for a member — powers the dashboard's
 * "Support & Tickets → Your Tickets" list.
 */
export const getTickets = async (req, res) => {
  try {
    const { membershipId } = req.query;

    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: "membershipId is required",
      });
    }

    const tickets = await Ticket.find({ membershipId }).sort({ createdAt: -1 });

    return res.json({ success: true, tickets });
  } catch (error) {
    console.error("getTickets error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch tickets.",
    });
  }
};



export const getAllTicketsForAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();

    const membershipIds = [...new Set(tickets.map((t) => t.membershipId))];
    const orders = await Order.find({ membershipId: { $in: membershipIds } })
      .select("membershipId user.firstName user.lastName")
      .sort({ createdAt: -1 }) // in case of dupes, prefer most recent order per member
      .lean();

    const nameByMembershipId = {};
    for (const o of orders) {
      if (!nameByMembershipId[o.membershipId]) {
        nameByMembershipId[o.membershipId] =
          `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.trim();
      }
    }

    const humanizeStatus = (status) => ({
      OPEN: "Open",
      IN_PROGRESS: "In Progress",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
    }[status] || status);

    const queries = tickets.map((t) => ({
      _id: t._id,
      id: t._id,
      subject: t.type,
      type: t.type,
      customerId: t.membershipId,
      customer: nameByMembershipId[t.membershipId] || t.membershipId,
      message: t.message,
      rating: t.rating,
      status: humanizeStatus(t.status),
      response: t.adminReply || "",
      priority: t.type === "Complaint" ? "High" : "Normal",
      date: new Date(t.createdAt).toLocaleDateString("en-IN"),
      time: new Date(t.createdAt).toLocaleTimeString("en-IN"),
      createdAt: t.createdAt,
      ticketNumber: t.ticketNumber,
    }));

    return res.json({ success: true, queries });
  } catch (error) {
    console.error("getAllTicketsForAdmin error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch queries." });
  }
};

export const updateTicketByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const dbStatusFromHuman = (s) => ({
      Open: "OPEN",
      "In Progress": "IN_PROGRESS",
      Resolved: "RESOLVED",
      Closed: "CLOSED",
    }[s] || s);

    const humanizeStatus = (status) => ({
      OPEN: "Open",
      IN_PROGRESS: "In Progress",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
    }[status] || status);

    const update = {};
    if (status) update.status = dbStatusFromHuman(status);
    if (response !== undefined) {
      update.adminReply = response;
      update.repliedAt = new Date();
    }
    if (update.status === "CLOSED") update.closedAt = new Date();

    const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.json({
      success: true,
      query: {
        _id: ticket._id,
        id: ticket._id,
        subject: ticket.type,
        type: ticket.type,
        customerId: ticket.membershipId,
        message: ticket.message,
        rating: ticket.rating,
        status: humanizeStatus(ticket.status),
        response: ticket.adminReply || "",
        date: new Date(ticket.createdAt).toLocaleDateString("en-IN"),
        time: new Date(ticket.createdAt).toLocaleTimeString("en-IN"),
      },
    });
  } catch (error) {
    console.error("updateTicketByAdmin error:", error);
    return res.status(500).json({ success: false, message: "Unable to update ticket." });
  }
};