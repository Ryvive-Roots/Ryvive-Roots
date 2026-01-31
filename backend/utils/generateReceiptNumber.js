const generateReceiptNumber = async (Order) => {
  const today = new Date();
  const year = today.getFullYear();

  const isTest = process.env.EASEBUZZ_ENV === "TEST";
  const prefix = isTest ? "TEST-REC" : "RR-REC";

  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const count = await Order.countDocuments({
    receiptNumber: { $regex: `^${prefix}-${year}` },
    createdAt: {
      $gte: startOfYear,
      $lt: endOfYear,
    },
  });

  const sequence = String(count + 1).padStart(4, "0");

  return `${prefix}-${year}-${sequence}`;
};

export default generateReceiptNumber;
