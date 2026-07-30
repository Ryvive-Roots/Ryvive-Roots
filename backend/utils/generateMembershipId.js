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
 const latest = await Model.findOne({
   membershipId: { $regex: `^${prefix}${year}${month}` },
 })
   .sort({ membershipId: -1 })
   .select("membershipId")
   .lean();

 let nextNumber = 1;

 if (latest?.membershipId) {
   nextNumber = parseInt(latest.membershipId.slice(-2), 10) + 1;
 }

 return `${prefix}${year}${month}${String(nextNumber).padStart(2, "0")}`;
};

export default generateMembershipId;