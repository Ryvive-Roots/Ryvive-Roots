/**
 * Generates a new sequential membershipId for a brand-new customer.
 *
 * NOTE: This function no longer tries to "reuse" an existing membershipId.
 * That logic (Step 1, removed) relied on a `userId` field that does not
 * exist on the User/Order/TempPayment schemas, and with no userId ever
 * passed by the caller, it was matching against `userId: undefined` and
 * silently returning the OLDEST user in the entire database as if they
 * were the current new customer. That caused every new signup to collide
 * with the same stale membershipId, which sent the retry loop in
 * easebuzzSuccess into an infinite loop -> request never resolves ->
 * nginx 504 Gateway Timeout.
 *
 * The caller (easebuzzSuccess) already checks whether the customer exists
 * BEFORE calling this function:
 *
 *   if (user) {
 *     membershipId = user.membershipId;               // existing customer
 *   } else {
 *     membershipId = await generateMembershipId(User, tempPayment.amount); // new customer
 *   }
 *
 * So this function only ever needs to handle the "generate a fresh ID"
 * case. If you ever need "reuse this specific person's ID" logic again,
 * do it in the caller using a real, indexed field (e.g. look up by
 * phone/email first, like easebuzzSuccess already does) — not here.
 */
const generateMembershipId = async (Model, amount) => {
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