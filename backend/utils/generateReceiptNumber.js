const generateReceiptNumber = async (Order, amount) => {
  const year = new Date().getFullYear();
  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST-REC" : "RR-REC";

  const lastOrder = await Order.findOne({
    receiptNumber: { $regex: `^${prefix}-${year}` },
  })
    .sort({ receiptNumber: -1 })
    .lean();

  let nextNumber = 1;

  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.receiptNumber.split("-").pop());
    nextNumber = lastSeq + 1;
  }

  const sequence = String(nextNumber).padStart(4, "0");

  return `${prefix}-${year}-${sequence}`;
};

export default generateReceiptNumber;