const generateTicketNumber = async (Ticket, type) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  let prefix = "Q";

  if (type === "Complaint") prefix = "C";
  if (type === "Feedback") prefix = "F";

  const ticketPrefix = `RR-${prefix}-${year}${month}`;

  const tickets = await Ticket.find({
    ticketNumber: {
      $regex: `^${ticketPrefix}`,
    },
  }).select("ticketNumber");

  let max = 0;

  tickets.forEach((t) => {
    const match = t.ticketNumber.match(/(\d{4})$/);

    if (match) {
      const num = parseInt(match[1]);

      if (num > max) max = num;
    }
  });

  return `${ticketPrefix}-${String(max + 1).padStart(4, "0")}`;
};

export default generateTicketNumber;