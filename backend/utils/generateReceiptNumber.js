const generateReceiptNumber = async (Order) => {
  const today = new Date();

  const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

  const count = await Order.countDocuments({
    createdAt: {
      $gte: new Date(today.setHours(0, 0, 0, 0)),
    },
  });

  const sequence = String(count + 1).padStart(4, "0");

  return `RR-REC-${datePart}-${sequence}`;
};

export default generateReceiptNumber;
