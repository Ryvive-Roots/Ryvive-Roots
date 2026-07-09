const generateMembershipId = async (Model, amount, userId) => {
  // ✅ Step 1: Check if this customer already has a membership ID (renewal / new plan)
  const existingOrder = await Model.findOne({
    userId,
    membershipId: { $exists: true, $ne: null },
  }).sort({ createdAt: 1 }); // earliest one = original parent ID

  if (existingOrder) {
    // ✅ Reuse the SAME parent membershipId for renewals / additional plans
    return existingOrder.membershipId;
  }

  // ✅ Step 2: First-time customer -> generate a new membershipId
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST" : "RR";

  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 1);

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