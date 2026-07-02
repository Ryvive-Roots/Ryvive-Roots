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
  const bgImagePath = path.join(__dirname, "../assets/invoice0.png");
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
  doc.fillColor(textColor).fontSize(12).text(order.receiptNumber || "-", 146, 130);

  // Invoice Date
 const invoiceDate =
  order.subscription?.renewedAt || order.createdAt;

doc.text(
  new Date(invoiceDate).toLocaleDateString("en-IN"),
  146,
  165
);

  /* =======================
   CUSTOMER INFO
======================= */
doc.fillColor("#2a2a2a").fontSize(12);
  // Customer Name
  doc.text(
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`,
    434,
    130
  );

  // Contact Number
  doc.text(order.user?.phone || "-", 434, 165);

    // Auto Detect Payment Mode
 const paymentMode =
  order.paymentMethod === "CASH"
    ? "Cash"
    : order.paymentMethod || "Online";

  // Payment Mode
  doc.text(paymentMode, 440, 230);

  /* =======================
   PLAN DETAILS (Table Row)
======================= */

  // Row Y position aligned to background table
  const planRowY = 395;

 const rawPlan = order.subscription?.plan || "";
const planName = `RYVIVE ${rawPlan.split("_")[0]}`;

doc.text(planName, 55, planRowY);
  doc.text(`${order.subscription?.durationMonths || 0} Month`, 321, planRowY);
  doc.text("1", 423, planRowY);
  doc.text(`₹ ${order.subscription?.amount || 0}`, 490, planRowY);
doc.text(`₹ ${order.subscription?.amount || 0}`, 490, 445);
   /* =======================
   PAYMENT SUMMARY
======================= */



  const amount = order.subscription?.amount || 0;




  // Start Y for payment section
  const paymentY = 500;

  // Subtotal
  doc.text(`₹ ${amount}`, 490, paymentY);

  // Discount
  doc.text(`-`, 490, paymentY + 32);



  

  // Grand Total (Bold & Center Feel)
  doc
    .fontSize(14)
    .font("Poppins")
    .text(`₹ ${amount}`, 490, paymentY + 125);

  doc.fontSize(12);

  // ✅ FINALIZE PDF
  doc.end();

 await new Promise((resolve) => stream.on("finish", resolve));

return filePath;
};

export default generateInvoice;
