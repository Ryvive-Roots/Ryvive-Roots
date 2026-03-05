const generateReceiptNumber = async (Order, amount) => {
  const today = new Date();
  const year = today.getFullYear();

  const isTest = Number(amount) === 1;
  const prefix = isTest ? "TEST-REC" : "RR-REC";

  const lastOrder = await Order.findOne({
    receiptNumber: { $regex: `^${prefix}-${year}` }
  })
  .sort({ createdAt: -1 })
  .lean();

  let sequence = 1;

  if (lastOrder && lastOrder.receiptNumber) {
    const lastSeq = parseInt(lastOrder.receiptNumber.split("-").pop());
    sequence = lastSeq + 1;
  }

  const padded = String(sequence).padStart(4, "0");

  return `${prefix}-${year}-${padded}`;
};

export default generateReceiptNumber;