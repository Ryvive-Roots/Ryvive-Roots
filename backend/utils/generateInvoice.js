import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const generateInvoice = async (order) => {
  const invoiceDir = "invoices";
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const filePath = path.join(
    invoiceDir,
    `invoice-${order.membershipId}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Ryvive Roots Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Membership ID: ${order.membershipId}`);
  doc.text(`Name: ${order.user.firstName} ${order.user.lastName}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Phone: ${order.user.phone}`);
  doc.moveDown();

  doc.text(`Plan: ${order.subscription.plan}`);
  doc.text(`Amount Paid: ₹${order.subscription.amount}`);
  doc.text(
    `Valid Till: ${order.subscription.endDate.toDateString()}`
  );

  doc.moveDown();
  doc.text("Thank you for choosing Ryvive Roots 🌱");

  doc.end();

  return filePath;
};

export default generateInvoice;
