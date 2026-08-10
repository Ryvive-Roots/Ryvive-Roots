import Ticket from "../models/TicketSchema.js";
import generateTicketNumber from "../utils/generateTicketNumber.js";
import Order from "../models/order.js";
import sendEmail from "../utils/sendEmail.js";

const VALID_TYPES = ["Query", "Complaint", "Feedback"];
const MAX_ATTEMPTS = 5;

/* =========================================================
   EMAIL HELPERS
========================================================= */

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getTypeDetails = (type) => {
  switch (type) {
    case "Complaint":
      return { title: "Customer Complaint", emoji: "⚠️", color: "#b23a3a" };
    case "Feedback":
      return { title: "Customer Feedback", emoji: "⭐", color: "#b8860b" };
    case "Query":
    default:
      return { title: "Customer Query", emoji: "🎫", color: "#6b7560" };
  }
};

const humanizeStatus = (status) =>
  ({
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
  }[status] || status);

const dbStatusFromHuman = (value) =>
  ({
    Open: "OPEN",
    "In Progress": "IN_PROGRESS",
    Resolved: "RESOLVED",
    Closed: "CLOSED",
  }[value] || value);

/* =========================================================
   EMAIL TEMPLATES
========================================================= */

const buildCustomerAckEmail = ({ typeDetails, type, customerName, ticket, rating, message }) => `
  <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #2a2520; line-height: 1.6; background: #faf7f0;">
    <div style="background: #171512; padding: 25px; text-align: center;">
      <h1 style="color: #f5f0e6; margin: 0; font-size: 24px; letter-spacing: 2px;">RYVIVE ROOTS</h1>
    </div>

    <div style="padding: 30px 24px;">
      <h2 style="margin-top: 0; color: ${typeDetails.color};">${typeDetails.emoji} We Received Your ${type}</h2>

      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for contacting Ryvive Roots. We have successfully received your ${type.toLowerCase()}.</p>

      <div style="background: #eee9dd; padding: 20px; margin: 22px 0; border-left: 4px solid ${typeDetails.color};">
        <p style="margin: 6px 0;"><strong>Ticket ID:</strong> ${ticket.ticketNumber}</p>
        <p style="margin: 6px 0;"><strong>Type:</strong> ${escapeHtml(type)}</p>
        <p style="margin: 6px 0;"><strong>Status:</strong> Open</p>
        ${
          type === "Feedback" && Number(rating) > 0
            ? `<p style="margin: 6px 0;"><strong>Rating:</strong> ${Number(rating)}/5 ⭐</p>`
            : ""
        }
        <p style="margin: 12px 0 6px;"><strong>Your Message:</strong></p>
        <div style="background: #ffffff; padding: 14px; border-radius: 4px; white-space: pre-wrap;">${message}</div>
      </div>

      <p>Our customer support team will review your request and respond as soon as possible.</p>
      <p>You can check your ticket status and any response from our team in the <strong>Support & Tickets</strong> section of your customer dashboard.</p>

      <p style="margin-top: 30px;">Warm regards,<br/><strong>Team Ryvive Roots</strong></p>
    </div>

    <div style="background: #171512; color: #d9d3c8; padding: 18px; text-align: center; font-size: 12px;">
      This is an automated acknowledgement email.
    </div>
  </div>
`;

const buildSupportNotificationEmail = ({
  typeDetails,
  type,
  ticket,
  membershipId,
  customerName,
  customerEmail,
  customerPhone,
  rating,
  message,
}) => `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #2a2520; line-height: 1.6;">
    <div style="background: #171512; padding: 25px; color: #f5f0e6;">
      <h2 style="margin: 0;">${typeDetails.emoji} New Customer ${escapeHtml(type)}</h2>
      <p style="margin: 8px 0 0; color: #d0c8bd;">Ryvive Roots Customer Support</p>
    </div>

    <div style="background: #faf7f0; padding: 28px 24px;">
      <div style="background: #eee9dd; padding: 20px; border-left: 4px solid ${typeDetails.color};">
        <p><strong>Ticket ID:</strong> ${ticket.ticketNumber}</p>
        <p><strong>Type:</strong> ${escapeHtml(type)}</p>
        <p><strong>Status:</strong> OPEN</p>
        <p><strong>Membership ID:</strong> ${membershipId}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Email:</strong> ${customerEmail ? escapeHtml(customerEmail) : "Not available"}</p>
        <p><strong>Customer Phone:</strong> ${customerPhone ? escapeHtml(customerPhone) : "Not available"}</p>
        ${Number(rating) > 0 ? `<p><strong>Rating:</strong> ${Number(rating)}/5 ⭐</p>` : ""}
      </div>

      <h3 style="margin-top: 25px; color: ${typeDetails.color};">${typeDetails.emoji} ${escapeHtml(typeDetails.title)}</h3>
      <div style="background: #ffffff; border: 1px solid #ddd7ca; padding: 18px; border-radius: 4px; white-space: pre-wrap;">${message}</div>

      <div style="margin-top: 25px; padding: 16px; background: rgba(107,117,96,0.10); border-left: 3px solid #6b7560;">
        <strong>Action Required</strong>
        <p style="margin-bottom: 0;">Please open the Admin Dashboard → <strong>Support Tickets</strong> to review and respond to this customer.</p>
      </div>
    </div>
  </div>
`;

/* =========================================================
   CREATE SUPPORT TICKET (Query / Complaint / Feedback)
========================================================= */

export const createSupportTicket = async (req, res) => {
  try {
    const { membershipId, type, message, rating } = req.body;

    // --- Validation ---
    if (!membershipId || !type || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ticket type. Must be one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    if (!message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    // --- Look up the customer via their most recent order ---
    const order = await Order.findOne({ membershipId }).sort({ createdAt: -1 }).lean();

    const customerName = `${order?.user?.firstName || ""} ${order?.user?.lastName || ""}`.trim() || "Customer";
    const customerEmail = order?.user?.email || "";
    const customerPhone = order?.user?.phone || "";

    // --- Create the ticket, retrying on ticketNumber collisions ---
    let ticket = null;
    let created = false;
    let attempts = 0;
    let ticketNumber;

    while (!created) {
      attempts++;
      ticketNumber = await generateTicketNumber(Ticket, type);

      try {
        ticket = await Ticket.create({
          ticketNumber,
          membershipId,
          type,
          message: message.trim(),
          rating: Number(rating) || 0,
          status: "OPEN",
        });
        created = true;
      } catch (err) {
        const isTicketNumberCollision = err.code === 11000 && err.keyPattern?.ticketNumber;

        if (isTicketNumberCollision && attempts < MAX_ATTEMPTS) {
          console.log(`Ticket number collision on ${ticketNumber} - retrying (${attempts}/${MAX_ATTEMPTS})...`);
          continue;
        }

        throw err;
      }
    }

    const typeDetails = getTypeDetails(type);
    const safeCustomerName = escapeHtml(customerName);
    const safeMessage = escapeHtml(message.trim());
    const safeMembershipId = escapeHtml(membershipId);
    const safeTicketNumber = escapeHtml(ticket.ticketNumber);

    // --- 1. Customer acknowledgement email ---
    if (customerEmail) {
      try {
        await sendEmail({
          to: customerEmail,
          cc: process.env.COMPANY_EMAIL,
          subject: `${typeDetails.emoji} We Received Your ${type} - ${ticket.ticketNumber}`,
          html: buildCustomerAckEmail({
            typeDetails,
            type,
            customerName: safeCustomerName,
            ticket: { ticketNumber: safeTicketNumber },
            rating,
            message: safeMessage,
          }),
          // Already sending directly to the customer here, so skip the generic notification.
          supportEmail: false,
        });

        console.log(`✅ Customer ${type} acknowledgement sent to ${customerEmail}`);
      } catch (emailError) {
        console.error(`❌ Customer ${type} acknowledgement email failed:`, emailError);
      }
    } else {
      console.warn(`⚠️ No customer email found for membershipId: ${membershipId}`);
    }

    // --- 2. Customer support notification email (COMPANY_EMAIL_2, e.g. customersupport@ryviveroots.com) ---
    const supportEmailAddress = process.env.COMPANY_EMAIL_2;

    if (supportEmailAddress) {
      try {
        await sendEmail({
          to: supportEmailAddress,
          subject: `${typeDetails.emoji} New ${type} - ${ticket.ticketNumber}`,
          html: buildSupportNotificationEmail({
            typeDetails,
            type,
            ticket: { ticketNumber: safeTicketNumber },
            membershipId: safeMembershipId,
            customerName: safeCustomerName,
            customerEmail,
            customerPhone,
            rating,
            message: safeMessage,
          }),
          // Already sending directly to COMPANY_EMAIL_2 here, so skip the generic notification.
          supportEmail: false,
        });

        console.log(`✅ ${type} notification sent to Customer Support: ${supportEmailAddress}`);
      } catch (emailError) {
        console.error(`❌ ${type} support notification failed:`, emailError);
      }
    } else {
      console.warn("⚠️ COMPANY_EMAIL_2 is not configured.");
    }

    return res.status(201).json({
      success: true,
      message: "Support ticket created successfully.",
      ticket,
    });
  } catch (error) {
    console.error("❌ createSupportTicket error:", error);
    return res.status(500).json({ success: false, message: "Unable to create ticket." });
  }
};

/* =========================================================
   GET CUSTOMER'S OWN TICKETS
========================================================= */

export const getTickets = async (req, res) => {
  try {
    const { membershipId } = req.query;

    if (!membershipId) {
      return res.status(400).json({ success: false, message: "membershipId is required" });
    }

    const tickets = await Ticket.find({ membershipId }).sort({ createdAt: -1 });

    return res.json({ success: true, tickets });
  } catch (error) {
    console.error("❌ getTickets error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch tickets." });
  }
};

/* =========================================================
   GET ALL TICKETS FOR ADMIN
========================================================= */

export const getAllTicketsForAdmin = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();

    const membershipIds = [...new Set(tickets.map((ticket) => ticket.membershipId))];

    const orders = await Order.find({ membershipId: { $in: membershipIds } })
      .select("membershipId user.firstName user.lastName user.email user.phone")
      .sort({ createdAt: -1 })
      .lean();

    const customerByMembershipId = {};

    for (const order of orders) {
      if (!customerByMembershipId[order.membershipId]) {
        customerByMembershipId[order.membershipId] = {
          name: `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || order.membershipId,
          email: order.user?.email || "",
          phone: order.user?.phone || "",
        };
      }
    }

    const queries = tickets.map((ticket) => {
      const customer = customerByMembershipId[ticket.membershipId];

      return {
        _id: ticket._id,
        id: ticket._id,
        subject: ticket.type,
        type: ticket.type,
        customerId: ticket.membershipId,
        customer: customer?.name || ticket.membershipId,
        customerEmail: customer?.email || "",
        customerPhone: customer?.phone || "",
        message: ticket.message,
        rating: ticket.rating,
        status: humanizeStatus(ticket.status),
        response: ticket.adminReply || "",
        adminReply: ticket.adminReply || "",
        repliedAt: ticket.repliedAt || null,
        priority: ticket.type === "Complaint" ? "High" : ticket.type === "Feedback" ? "Low" : "Normal",
        date: new Date(ticket.createdAt).toLocaleDateString("en-IN"),
        time: new Date(ticket.createdAt).toLocaleTimeString("en-IN"),
        createdAt: ticket.createdAt,
        ticketNumber: ticket.ticketNumber,
      };
    });

    return res.json({ success: true, queries });
  } catch (error) {
    console.error("❌ getAllTicketsForAdmin error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch queries." });
  }
};

/* =========================================================
   ADMIN UPDATE TICKET (Status + Admin Reply)
========================================================= */

export const updateTicketByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const update = {};

    if (status) {
      update.status = dbStatusFromHuman(status);
    }

    if (response !== undefined) {
      update.adminReply = response.trim();
      update.repliedAt = new Date();
    }

    if (update.status === "CLOSED") {
      update.closedAt = new Date();
    }

    const ticket = await Ticket.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

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
        adminReply: ticket.adminReply || "",
        repliedAt: ticket.repliedAt || null,
        date: new Date(ticket.createdAt).toLocaleDateString("en-IN"),
        time: new Date(ticket.createdAt).toLocaleTimeString("en-IN"),
        createdAt: ticket.createdAt,
        ticketNumber: ticket.ticketNumber,
      },
    });
  } catch (error) {
    console.error("❌ updateTicketByAdmin error:", error);
    return res.status(500).json({ success: false, message: "Unable to update ticket." });
  }
};