import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateInvoice = async (order) => {
 const invoiceDir = path.join(__dirname, "../../invoices");

if (!fs.existsSync(invoiceDir)) {
  fs.mkdirSync(invoiceDir, { recursive: true });
}

const fileName = `invoice-${order.receiptNumber}.pdf`;
const filePath = path.join(invoiceDir, fileName);

  const doc = new PDFDocument({ size: "A4", margin: 0 });
const stream = fs.createWriteStream(filePath);
doc.pipe(stream);

  /* =======================
     BACKGROUND IMAGE
  ======================= */
  const bgImagePath = path.join(__dirname, "../assets/invoice.png");
  doc.image(bgImagePath, 0, 0, {
    width: doc.page.width,
    height: doc.page.height,
  });

  /* =======================
     FONT - POPPINS
  ======================= */
  const fontPath = path.join(__dirname, "../assets/fonts/Poppins-Regular.ttf");


 

  doc.registerFont("Poppins", fontPath);
  doc.font("Poppins").fillColor("#2a2a2a").fontSize(12);

  /* =======================
   INVOICE HEADER
======================= */
 const textColor = "#4c4f28";

  // Invoice Number (move UP)
  doc.fillColor(textColor).fontSize(14).text(order.receiptNumber || "-", 146, 153);

  // Invoice Date
  doc.text(new Date(order.createdAt).toLocaleDateString("en-IN"), 146, 184);

  /* =======================
   CUSTOMER INFO
======================= */
doc.fillColor("#2a2a2a").fontSize(14);
  // Customer Name
  doc.text(
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`,
    303,
    225
  );

  // Contact Number
  doc.text(order.user?.phone || "-", 303, 259);

  /* =======================
   PLAN DETAILS (Table Row)
======================= */

  // Row Y position aligned to background table
  const planRowY = 389;

  doc.text(order.subscription?.plan || "-", 55, planRowY);
  doc.text(`${order.subscription?.durationMonths || 0} Month`, 321, planRowY);
  doc.text("1", 423, planRowY);
  doc.text(`₹ ${order.subscription?.amount || 0}`, 490, planRowY);
doc.text(`₹ ${order.subscription?.amount || 0}`, 490, 422);
   /* =======================
   PAYMENT SUMMARY
======================= */

  const amount = order.subscription?.amount || 0;

  // Auto Detect Payment Mode
 const paymentMode =
  order.paymentMethod === "CASH"
    ? "Cash"
    : order.paymentMethod || "Online";


  // Start Y for payment section
  const paymentY = 500;

  // Subtotal
  doc.text(`₹ ${amount}`, 490, paymentY);

  // Discount
  doc.text(`-`, 490, paymentY + 32);

  // Delivery Charges
  doc.text(`Free`, 490, paymentY + 70);

  // Payment Mode
  doc.text(paymentMode, 490, paymentY + 102);

  // Grand Total (Bold & Center Feel)
  doc
    .fontSize(14)
    .font("Poppins")
    .text(`₹ ${amount}`, 490, paymentY + 135);

  doc.fontSize(12);

  // ✅ FINALIZE PDF
  doc.end();

 await new Promise((resolve) => stream.on("finish", resolve));

return path.join(__dirname, "../invoices", fileName);
};

export default generateInvoice;
