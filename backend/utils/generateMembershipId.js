const generateMembershipId = async (Order, amount) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // ✅ ₹1 = TEST
  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST" : "RR";

  // ✅ Keep your createdAt filter
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 1);

  // 🔥 Get LAST order instead of count
  const lastOrder = await Order.findOne({
    membershipId: { $regex: `^${prefix}${year}${month}` },
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  }).sort({ membershipId: -1 });

  let nextNumber = 1;

  if (lastOrder) {
    const lastId = lastOrder.membershipId;

    // extract last 2 digits (same as your format)
    const lastNumber = parseInt(lastId.slice(-2), 10);

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  // ✅ keep your 2-digit format
  const customerNumber = String(nextNumber).padStart(2, "0");

  return `${prefix}${year}${month}${customerNumber}`;
};

export default generateMembershipId;