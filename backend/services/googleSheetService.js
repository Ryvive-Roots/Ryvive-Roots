import sheets from "../config/googleSheets.js";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// =====================================================
// GET MONTHLY SHEET NAME
// Example: "August 2026"
// =====================================================

const getSheetName = (date) => {
  const d = new Date(date);

  return d.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};


// =====================================================
// GOOGLE SHEET HEADERS
// Must match your Google Sheet
// =====================================================

const HEADERS = [
  "Date",
  "Membership ID",
  "Customer Name",
  "Plan",
  "Status",
  "Slot",
  "Meal Given",
  "Reason",
  "Menu",
  "Total Days",
  "Consumed",
  "Remaining",
  "Start Date",
  "End Date",
];


// =====================================================
// FORMAT DATE
// Example: 13/08/2026
// =====================================================

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleDateString("en-GB");
};


// =====================================================
// GET MEAL GIVEN VALUE
//
// Frontend:
// Delivered -> Yes
// Pending   -> No
// Paused    -> Paused
// =====================================================

const getMealGiven = (status) => {
  if (status === "Delivered") {
    return "Yes";
  }

  if (status === "Paused") {
    return "Paused";
  }

  return "No";
};


// =====================================================
// CREATE MONTHLY SHEET
//
// Example:
// August 2026
// September 2026
// October 2026
// =====================================================

export const createMonthlySheet = async (date) => {
  if (!spreadsheetId) {
    throw new Error(
      "GOOGLE_SHEET_ID is missing in environment variables"
    );
  }

  const sheetName = getSheetName(date);

  try {
    // -----------------------------------------------
    // Get spreadsheet information
    // -----------------------------------------------

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets = spreadsheet.data.sheets || [];

    // -----------------------------------------------
    // Check if monthly sheet already exists
    // -----------------------------------------------

    const exists = existingSheets.some(
      (sheet) =>
        sheet.properties?.title === sheetName
    );

    // -----------------------------------------------
    // If already exists, return it
    // -----------------------------------------------

    if (exists) {
      return sheetName;
    }

    // -----------------------------------------------
    // Create new monthly sheet
    // -----------------------------------------------

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,

      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    // -----------------------------------------------
    // Add headers
    // -----------------------------------------------

    await sheets.spreadsheets.values.update({
      spreadsheetId,

      range: `${sheetName}!A1:N1`,

      valueInputOption: "RAW",

      requestBody: {
        values: [HEADERS],
      },
    });

    console.log(
      `✅ Google Sheet created: ${sheetName}`
    );

    return sheetName;

  } catch (error) {

    console.error(
      "❌ Create Monthly Google Sheet Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =====================================================
// UPDATE GOOGLE SHEET
//
// ONE CUSTOMER + ONE DATE = ONE ROW
//
// Example:
//
// 13/08/2026 + RV001
//
// If the row already exists:
//       UPDATE
//
// If it doesn't exist:
//       ADD
// =====================================================

export const updateGoogleSheet = async ({
  order,
  delivery,
  deliveryDate,
}) => {

  try {

    // =================================================
    // VALIDATION
    // =================================================

    if (!order) {
      throw new Error(
        "Order is required for Google Sheet sync"
      );
    }

    if (!delivery) {
      throw new Error(
        "Delivery data is required for Google Sheet sync"
      );
    }

    if (!deliveryDate) {
      throw new Error(
        "Delivery date is required for Google Sheet sync"
      );
    }

    if (!order.membershipId) {
      throw new Error(
        "Membership ID is missing"
      );
    }


    // =================================================
    // GET / CREATE MONTHLY SHEET
    // =================================================

    const sheetName =
      await createMonthlySheet(deliveryDate);


    // =================================================
    // GET ALL EXISTING ROWS
    // =================================================

    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,

        range: `${sheetName}!A:N`,
      });

    const rows =
      response.data.values || [];


    // =================================================
    // VALUES FOR SEARCH
    // =================================================

    const membershipId =
      String(order.membershipId).trim();

    const formattedDeliveryDate =
      formatDate(deliveryDate);


    // =================================================
    // FIND EXISTING ROW
    //
    // IMPORTANT:
    //
    // We check BOTH:
    //
    // Date
    // +
    // Membership ID
    //
    // This prevents duplicate daily records.
    // =================================================

    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {

      const existingDate =
        String(rows[i][0] || "").trim();

      const existingMembershipId =
        String(rows[i][1] || "").trim();

      if (
        existingDate === formattedDeliveryDate &&
        existingMembershipId === membershipId
      ) {

        rowIndex = i + 1;

        break;
      }
    }


    // =================================================
    // CUSTOMER NAME
    // =================================================

    const customerName = [
      order.user?.firstName,
      order.user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");


    // =================================================
    // SUBSCRIPTION
    // =================================================

    const subscription =
      order.subscription || {};


    // =================================================
    // MEAL COUNTS
    // =================================================

    const totalDays =
      delivery.totalMeals ??
      subscription.totalMeals ??
      0;


    const consumed =
      delivery.consumedMeals ??
      subscription.consumedMeals ??
      0;


    const remaining =
      delivery.remainingMeals ??
      subscription.remainingMeals ??
      Math.max(
        Number(totalDays) -
        Number(consumed),
        0
      );


    // =================================================
    // STATUS
    // =================================================

    const subscriptionStatus =
      subscription.status || "";


    // =================================================
    // MEAL GIVEN
    // =================================================

    const mealGiven =
      getMealGiven(delivery.status);


    // =================================================
    // FINAL GOOGLE SHEET ROW
    //
    // A → Date
    // B → Membership ID
    // C → Customer Name
    // D → Plan
    // E → Status
    // F → Slot
    // G → Meal Given
    // H → Reason
    // I → Menu
    // J → Total Days
    // K → Consumed
    // L → Remaining
    // M → Start Date
    // N → End Date
    // =================================================

    const values = [[

      // A
      formattedDeliveryDate,

      // B
      membershipId,

      // C
      customerName,

      // D
      subscription.plan || "",

      // E
      subscriptionStatus,

      // F
      order.deliverySlot || "",

      // G
      mealGiven,

      // H
      delivery.notes || "",

      // I
      delivery.menu || "",

      // J
      totalDays,

      // K
      consumed,

      // L
      remaining,

      // M
      formatDate(
        subscription.startDate
      ),

      // N
      formatDate(
        subscription.endDate
      ),
    ]];


    // =================================================
    // UPDATE EXISTING ROW
    // =================================================

    if (rowIndex !== -1) {

      await sheets.spreadsheets.values.update({

        spreadsheetId,

        range:
          `${sheetName}!A${rowIndex}:N${rowIndex}`,

        valueInputOption: "USER_ENTERED",

        requestBody: {
          values,
        },

      });

      console.log(
        `✅ Google Sheet UPDATED | ${membershipId} | ${formattedDeliveryDate}`
      );

      return {
        success: true,

        action: "updated",

        sheetName,

        row: rowIndex,
      };
    }


    // =================================================
    // CREATE NEW ROW
    // =================================================

    await sheets.spreadsheets.values.append({

      spreadsheetId,

      range: `${sheetName}!A:N`,

      valueInputOption: "USER_ENTERED",

      insertDataOption: "INSERT_ROWS",

      requestBody: {
        values,
      },

    });


    console.log(
      `✅ Google Sheet ROW ADDED | ${membershipId} | ${formattedDeliveryDate}`
    );


    return {

      success: true,

      action: "created",

      sheetName,

    };


  } catch (error) {

    console.error(
      "❌ Google Sheet Sync Error:",
      error.response?.data ||
      error.message ||
      error
    );

    throw error;
  }
};