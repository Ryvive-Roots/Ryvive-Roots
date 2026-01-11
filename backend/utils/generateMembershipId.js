const generateMembershipId = async (Order) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const count = await Order.countDocuments({
    createdAt: {
      $gte: new Date(year, now.getMonth(), 1),
      $lt: new Date(year, now.getMonth() + 1, 1),
    },
  });

  const customerNumber = String(count + 1).padStart(2, "0");

  return `RR${year}${month}${customerNumber}`;
};

export default generateMembershipId;
