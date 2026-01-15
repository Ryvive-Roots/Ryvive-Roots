const generateReceiptNumber = async (Order) => {
  const today = new Date();
  const year = today.getFullYear(); // 2026

  // Count receipts only for this year
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const count = await Order.countDocuments({
    createdAt: {
      $gte: startOfYear,
      $lt: endOfYear,
    },
  });

  const sequence = String(count + 1).padStart(4, "0");

  return `RR-REC-${year}-${sequence}`;
};

export default generateReceiptNumber;
