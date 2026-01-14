import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoice = async (order) => {
  const invoiceDir = "invoices";
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

 const filePath = path.join(invoiceDir, `invoice-${order.receiptNumber}.pdf`);


  const doc = new PDFDocument({ size: "A4", margin: 0 });
  doc.pipe(fs.createWriteStream(filePath));

  // 🖼 Background image
  const bgImagePath = path.join(__dirname, "../assets/invoice.png");
  doc.image(bgImagePath, 0, 0, {
    width: doc.page.width,
    height: doc.page.height,
  });

  doc.fillColor("#000").fontSize(12);

  /* =======================
     INVOICE HEADER (VALUES ONLY)
  ======================= */
  doc.text(order.receiptNumber, 160, 100); // moved down slightly
  doc.text(order.createdAt.toLocaleDateString("en-IN"), 160, 120);

  /* =======================
     CUSTOMER INFO (VALUES ONLY)
  ======================= */
  doc.text(`${order.user.firstName} ${order.user.lastName}`, 210, 198);

  doc.text(order.user.phone, 210, 222);

  /* =======================
     PLAN DETAILS (VALUES ONLY)
  ======================= */
  doc.text(`${order.subscription.plan} Subscription`, 120, 306);
  doc.text(`${order.subscription.duration} Days`, 120, 332);

  /* =======================
     PAYMENT SUMMARY (VALUES ONLY)
  ======================= */
  const amount = order.subscription.amount;

  // Right column – move DOWN
  doc.text(`Rs. ${amount}`, 440, 420); // Subtotal
  doc.text(`Rs. 0`, 440, 446); // Taxes
  doc.text(`Rs. 0`, 440, 472); // Discounts

  doc.fontSize(14).text(`Rs. ${amount}`, 440, 500); // Total Paid
  doc.fontSize(12).text(`Online`, 440, 528); // Payment Mode

  doc.end();
  return filePath;
};

export default generateInvoice;
