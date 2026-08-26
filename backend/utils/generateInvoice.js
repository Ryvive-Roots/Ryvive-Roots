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

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
  });

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  /* =======================
     BACKGROUND IMAGE
  ======================= */

  const bgImagePath = path.join(
    __dirname,
    "../assets/invoice1.png"
  );

  doc.image(bgImagePath, 0, 0, {
    width: doc.page.width,
    height: doc.page.height,
  });

  /* =======================
     FONT - POPPINS
  ======================= */

  const fontPath = path.join(
    __dirname,
    "../assets/fonts/Poppins-Regular.ttf"
  );

  doc.registerFont(
    "Poppins",
    fontPath
  );

  doc
    .font("Poppins")
    .fillColor("#2a2a2a")
    .fontSize(12);


  /* =======================
     INVOICE HEADER
  ======================= */

  const textColor = "#4c4f28";


  // Invoice Number

  doc
    .fillColor(textColor)
    .fontSize(12)
    .text(
      order.receiptNumber || "-",
      146,
      139
    );


  // Invoice Date

  const invoiceDate =
    order.subscription?.renewedAt ||
    order.createdAt;


  doc.text(
    new Date(invoiceDate).toLocaleDateString(
      "en-IN"
    ),
    146,
    167
  );


  /* =======================
     CUSTOMER INFO
  ======================= */

  doc
    .fillColor("#2a2a2a")
    .fontSize(12);


  // Customer Name

  doc.text(
    `${order.user?.firstName || ""} ${
      order.user?.lastName || ""
    }`,
    434,
    139
  );


  // Contact Number

  doc.text(
    order.user?.phone || "-",
    434,
    167
  );


  // Auto Detect Payment Mode

  const paymentMode =
    order.paymentMethod === "CASH"
      ? "Cash"
      : order.paymentMethod || "Online";


  // Payment Mode

  doc.text(
    paymentMode,
    445,
    234
  );


  /* =======================
     SUBSCRIPTION DATA
  ======================= */

  const subscription =
    order.subscription || {};


  const rawPlan =
    subscription.plan || "";


  const isAddon =
    Boolean(subscription.isAddon) ||
    rawPlan.endsWith("_ADDON");


  /* =======================
     PLAN NAME
  ======================= */

  let planName = "-";


  if (isAddon) {

    // Remove _ADDON

    const basePlanKey =
      rawPlan.replace(
        "_ADDON",
        ""
      );


    const planParts =
      basePlanKey.split("_");


    const basePlanName =
      planParts[0] || "";


    const durationPart =
      planParts[1] || "";


    const durationText =
      durationPart.replace(
        "MONTH",
        " MONTH"
      );


    planName =
      `RYVIVE ${basePlanName} ${durationText}`;

  } else {

    planName =
      `RYVIVE ${
        rawPlan.split("_")[0] || ""
      }`;

  }


  /* =======================
     PLAN DETAILS
  ======================= */

  const planRowY = 403;


  // =====================================================
  // STANDARD PACKAGE
  // =====================================================

  if (!isAddon) {

    doc.text(
      planName,
      55,
      planRowY
    );


    doc.text(
      `${
        subscription.durationMonths || 0
      } Month`,
      321,
      planRowY
    );


    doc.text(
      "1",
      423,
      planRowY
    );


    doc.text(
      `₹ ${
        subscription.amount || 0
      }`,
      490,
      planRowY
    );


  } else {


    // ===================================================
    // CUSTOMIZED PACKAGE
    // ===================================================

    doc.text(
      planName,
      55,
      planRowY
    );


    // Customized Package label

    doc
      .fontSize(9)
      .text(
        "Customized Package",
        55,
        planRowY + 18
      );


    // Base duration

    doc
      .fontSize(9)
      .text(
        `Base: ${
          subscription.baseDurationDays ||
          subscription.durationDays ||
          0
        } days`,
        55,
        planRowY + 34
      );


    // Additional duration

    const additionalDays =
      Number(
        subscription.additionalDurationDays || 0
      );


    if (additionalDays > 0) {

      doc.text(
        `Additional: +${additionalDays} days`,
        55,
        planRowY + 49
      );

    }


    // ===================================================
    // DURATION COLUMN
    // ===================================================

    doc
      .fontSize(10)
      .text(
        `${
          subscription.durationMonths || 0
        } Month`,
        321,
        planRowY
      );


    // Final duration

    doc
      .fontSize(9)
      .text(
        `Total: ${
          subscription.durationDays ||
          subscription.baseDurationDays ||
          0
        } days`,
        321,
        planRowY + 18
      );


    // Quantity

    doc
      .fontSize(12)
      .text(
        "1",
        423,
        planRowY
      );


    // Final amount

    doc
      .fontSize(12)
      .text(
        `₹ ${
          subscription.amount || 0
        }`,
        490,
        planRowY
      );

  }


  /* =======================
     CUSTOMIZED PACKAGE INFO
  ======================= */

  if (isAddon) {

    const customInfoY =
      475;


    // ===================================================
    // CUSTOMIZED PACKAGE HEADING
    // ===================================================

    doc
      .fillColor(textColor)
      .fontSize(11)
      .font("Poppins")
      .text(
        "Customized Package Details",
        55,
        customInfoY
      );


    // ===================================================
    // BASE PLAN PRICE
    // ===================================================

    doc
      .fillColor("#2a2a2a")
      .fontSize(9)
      .text(
        `Base Plan Price: ₹ ${
          Number(
            subscription.basePlanPrice || 0
          ).toLocaleString("en-IN")
        }`,
        55,
        customInfoY + 20
      );


    // ===================================================
    // CUSTOM PACKAGE PRICE
    // ===================================================

    doc.text(
      `Customized Package Price: ₹ ${
        Number(
          subscription.customPackagePrice || 0
        ).toLocaleString("en-IN")
      }`,
      55,
      customInfoY + 36
    );


    // ===================================================
    // BASE DURATION
    // ===================================================

    doc.text(
      `Base Duration: ${
        subscription.baseDurationDays || 0
      } days`,
      55,
      customInfoY + 52
    );


    // ===================================================
    // ADDITIONAL DURATION
    // ===================================================

    doc.text(
      `Additional Duration: +${
        subscription.additionalDurationDays || 0
      } days`,
      55,
      customInfoY + 68
    );


    // ===================================================
    // FINAL DURATION
    // ===================================================

    doc.text(
      `Final Duration: ${
        subscription.durationDays ||
        subscription.baseDurationDays ||
        0
      } days`,
      55,
      customInfoY + 84
    );


    // ===================================================
    // ADD-ON FEATURES
    // ===================================================

    doc
      .fontSize(9)
      .text(
        "Add-on Features:",
        321,
        customInfoY + 20
      );


    const features =
      Array.isArray(
        subscription.addOnFeatures
      )
        ? subscription.addOnFeatures
        : [];


    if (features.length > 0) {

      let featureY =
        customInfoY + 38;


      features.forEach(
        (feature) => {

          doc
            .fontSize(8)
            .text(
              `• ${feature}`,
              321,
              featureY
            );


          featureY += 14;

        }
      );


    } else {

      doc
        .fontSize(8)
        .text(
          "None",
          321,
          customInfoY + 38
        );

    }

  }


  /* =======================
     PAYMENT SUMMARY
  ======================= */

  const amount =
    Number(
      subscription.amount || 0
    );


  /* =======================
     AMOUNT IN TABLE
  ======================= */

  // Existing amount display

  doc
    .fontSize(12)
    .text(
      `₹ ${amount}`,
      490,
      441
    );


  /* =======================
     PAYMENT SUMMARY
  ======================= */

  const paymentY =
    502;


  // Subtotal

  doc
    .fontSize(12)
    .text(
      `₹ ${amount}`,
      490,
      paymentY
    );


  // Discount

  doc.text(
    "-",
    490,
    paymentY + 33
  );


  /* =======================
     CUSTOMIZED SUMMARY
  ======================= */

  if (isAddon) {

    // Base Plan Price

    doc
      .fontSize(9)
      .text(
        `Base Plan: ₹ ${
          Number(
            subscription.basePlanPrice || 0
          ).toLocaleString("en-IN")
        }`,
        55,
        paymentY
      );


    // Customized amount

    doc.text(
      `Customization: ₹ ${
        Number(
          subscription.customPackagePrice || 0
        ).toLocaleString("en-IN")
      }`,
      55,
      paymentY + 16
    );


    // Additional duration

    doc.text(
      `Additional Days: +${
        subscription.additionalDurationDays || 0
      }`,
      55,
      paymentY + 32
    );

  }


  /* =======================
     GRAND TOTAL
  ======================= */

  doc
    .fontSize(14)
    .font("Poppins")
    .text(
      `₹ ${amount}`,
      490,
      paymentY + 113
    );


  doc.fontSize(12);


  /* =======================
     FINALIZE PDF
  ======================= */

  doc.end();


  await new Promise(
    (resolve) =>
      stream.on(
        "finish",
        resolve
      )
  );


  return filePath;
};


export default generateInvoice;