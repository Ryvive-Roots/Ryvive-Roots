import CustomerMenu from "../models/CustomerMenu.js";

// Build YYYY-MM-DD boundaries for a given year/month (month is 1-indexed)
function monthBounds(year, month) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

// ── ADMIN: fetch overrides for a customer + month ──
// GET /api/admin/customer-menu?membershipId=RR123&year=2026&month=9
export const getAdminCustomerMenu = async (req, res) => {
  try {
    const { membershipId, year, month } = req.query;
    if (!membershipId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: "membershipId, year and month are required",
      });
    }

    const { start, end } = monthBounds(Number(year), Number(month));
    const entries = await CustomerMenu.find({
      membershipId,
      date: { $gte: start, $lte: end },
    }).lean();

    return res.json({
      success: true,
      entries: entries.map((e) => ({
        date: e.date,
        meal: e.meal,
        restDay: e.restDay,
      })),
    });
  } catch (err) {
    console.error("getAdminCustomerMenu error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch menu overrides" });
  }
};

// ── CUSTOMER DASHBOARD: same data, read-only ──
// GET /api/user/customer-menu?membershipId=RR123&year=2026&month=9
export const getUserCustomerMenu = async (req, res) => {
  try {
    const { membershipId, year, month } = req.query;
    if (!membershipId || !year || !month) {
      return res.status(400).json({
        success: false,
        message: "membershipId, year and month are required",
      });
    }

    const { start, end } = monthBounds(Number(year), Number(month));
    const entries = await CustomerMenu.find({
      membershipId,
      date: { $gte: start, $lte: end },
    }).lean();

    return res.json({
      success: true,
      entries: entries.map((e) => ({
        date: e.date,
        meal: e.meal,
        restDay: e.restDay,
      })),
    });
  } catch (err) {
    console.error("getUserCustomerMenu error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch menu" });
  }
};

// ── ADMIN: create or update a single day (upsert) ──
// POST /api/admin/customer-menu   body: { membershipId, date, meal, restDay }
export const saveCustomerMenuDay = async (req, res) => {
  try {
    const { membershipId, date, meal, restDay } = req.body;
    if (!membershipId || !date) {
      return res.status(400).json({
        success: false,
        message: "membershipId and date are required",
      });
    }

    const updated = await CustomerMenu.findOneAndUpdate(
      { membershipId, date },
      { meal: restDay ? "" : (meal || ""), restDay: !!restDay },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, entry: updated });
  } catch (err) {
    console.error("saveCustomerMenuDay error:", err);
    return res.status(500).json({ success: false, message: "Failed to save menu day" });
  }
};

// ── ADMIN: reset a day back to the live rotating menu ──
// DELETE /api/admin/customer-menu?membershipId=RR123&date=2026-09-30
export const deleteCustomerMenuDay = async (req, res) => {
  try {
    const { membershipId, date } = req.query;
    if (!membershipId || !date) {
      return res.status(400).json({
        success: false,
        message: "membershipId and date are required",
      });
    }

    await CustomerMenu.deleteOne({ membershipId, date });
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteCustomerMenuDay error:", err);
    return res.status(500).json({ success: false, message: "Failed to reset menu day" });
  }
};