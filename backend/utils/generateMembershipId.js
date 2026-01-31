const generateMembershipId = async (Order, amount) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // ✅ ₹1 = TEST
  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST" : "RR";

  const count = await Order.countDocuments({
    membershipId: { $regex: `^${prefix}${year}${month}` },
    createdAt: {
      $gte: new Date(year, now.getMonth(), 1),
      $lt: new Date(year, now.getMonth() + 1, 1),
    },
  });

  const customerNumber = String(count + 1).padStart(2, "0");

  return `${prefix}${year}${month}${customerNumber}`;
};

export default generateMembershipId;
