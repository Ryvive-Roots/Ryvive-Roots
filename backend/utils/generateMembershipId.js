
const generateMembershipId = async (Model, amount) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // ✅ ₹1 = TEST
  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST" : "RR";

  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 1);

  // ✅ Get ALL IDs of this month
  const orders = await Model.find({
    membershipId: { $regex: `^${prefix}${year}${month}` },
    createdAt: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  }).select("membershipId");

  let maxNumber = 0;

  for (const order of orders) {
    const id = order.membershipId;

    // extract last 2 digits safely
    const match = id.match(/(\d{2})$/);

    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }

  const nextNumber = maxNumber + 1;

  const customerNumber = String(nextNumber).padStart(2, "0");

  return `${prefix}${year}${month}${customerNumber}`;
};

export default generateMembershipId;

// generateChildMembershipId.js

const generateChildMembershipId = async (Order, baseMembershipId) => {
  // Find all child orders for this base membership (e.g. RR202506001-R1, -R2 ...)
  const existingChildren = await Order.find({
    membershipId: { $regex: `^${baseMembershipId}-R\\d+$` },
  }).select("membershipId");

  let maxR = 0;

  for (const order of existingChildren) {
    const match = order.membershipId.match(/-R(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxR) maxR = num;
    }
  }

  const nextR = maxR + 1;

  return `${baseMembershipId}-R${nextR}`;
};

export default generateChildMembershipId;

