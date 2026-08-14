import sheets from "../config/googleSheets.js";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// =====================================================
// GOOGLE SHEET REQUEST QUEUE
// =====================================================
//
// Every membership will be processed one by one.
//
// Example:
//
// RR20260503
//     ↓
// Google Sheet
//     ↓ wait 1 second
// RR20260504
//     ↓
// Google Sheet
//
// This prevents many Google Sheet requests from
// happening at exactly the same time.
// =====================================================

let googleSheetQueue = Promise.resolve();

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const runSequentially = (job) => {
  const nextJob = googleSheetQueue.then(async () => {
    try {
      return await job();
    } finally {
      // Wait 1 second before next membership
      await sleep(1000);
    }
  });

  // IMPORTANT:
  // Even if one membership fails,
  // the queue must continue.
  googleSheetQueue = nextJob.catch(() => {});

  return nextJob;
};

// =====================================================
// GOOGLE SHEET QUOTA / 429 CHECK
// =====================================================

const isQuotaError = (error) => {
  const status =
    error?.code ||
    error?.response?.status ||
    error?.status;

  const message =
    error?.message ||
    error?.response?.data?.error?.message ||
    "";

  return (
    Number(status) === 429 ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded") ||
    message.includes("Too many requests")
  );
};

// =====================================================
// GOOGLE SHEET RETRY
// =====================================================
//
// Retry sequence:
//
// 429
// ↓
// 5 sec
// ↓
// 10 sec
// ↓
// 20 sec
// ↓
// 40 sec
// ↓
// 60 sec
//
// Maximum 5 retries.
// =====================================================

const withRetry = async (fn, retries = 5) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this is NOT a quota error,
      // immediately stop.
      if (!isQuotaError(error)) {
        throw error;
      }

      // No more retries
      if (attempt === retries) {
        console.error(
          "❌ Google Sheets quota retry limit reached."
        );

        throw error;
      }

      // 5 → 10 → 20 → 40 → 60 seconds
      const delays = [
        5000,
        10000,
        20000,
        40000,
        60000,
      ];

      const baseDelay =
        delays[Math.min(attempt, delays.length - 1)];

      // Small random delay
      // prevents multiple requests from
      // retrying at exactly the same time.
      const randomDelay =
        Math.floor(Math.random() * 1000);

      const delay = baseDelay + randomDelay;

      console.log(
        `⚠️ Google Sheets quota reached.` +
        ` Retry ${attempt + 1}/${retries}` +
        ` after ${Math.round(delay / 1000)} seconds`
      );

      await sleep(delay);
    }
  }

  throw lastError;
};

// =====================================================
// GET MONTHLY SHEET NAME
// =====================================================
//
// Example:
//
// August 2026
// September 2026
// October 2026
//
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
// =====================================================
//
// Example:
// 13/08/2026
//
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleDateString("en-GB");
};

// =====================================================
// GET MEAL GIVEN VALUE
// =====================================================
//
// Delivered -> Yes
// Pending   -> No
// Paused    -> Paused
//
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
// =====================================================

export const createMonthlySheet = async (date) => {
  if (!spreadsheetId) {
    throw new Error(
      "GOOGLE_SHEET_ID is missing in environment variables"
    );
  }

  const sheetName = getSheetName(date);

  try {
    // =================================================
    // GET SPREADSHEET INFORMATION
    // =================================================

    const spreadsheet = await withRetry(() =>
      sheets.spreadsheets.get({
        spreadsheetId,
      })
    );

    const existingSheets =
      spreadsheet.data.sheets || [];

    // =================================================
    // CHECK IF MONTHLY SHEET ALREADY EXISTS
    // =================================================

    const exists = existingSheets.some(
      (sheet) =>
        sheet.properties?.title === sheetName
    );

    // =================================================
    // ALREADY EXISTS
    // =================================================

    if (exists) {
      return sheetName;
    }

    // =================================================
    // CREATE NEW MONTHLY SHEET
    // =================================================

    await withRetry(() =>
      sheets.spreadsheets.batchUpdate({
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
      })
    );

    // =================================================
    // ADD HEADERS
    // =================================================

    await withRetry(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId,

        range: `${sheetName}!A1:N1`,

        valueInputOption: "RAW",

        requestBody: {
          values: [HEADERS],
        },
      })
    );

    console.log(
      `✅ Google Sheet created: ${sheetName}`
    );

    return sheetName;

  } catch (error) {
    console.error(
      "❌ Create Monthly Google Sheet Error:",
      error.response?.data ||
        error.message ||
        error
    );

    throw error;
  }
};

// =====================================================
// UPDATE GOOGLE SHEET
// =====================================================
//
// ONE CUSTOMER + ONE DATE = ONE ROW
//
// If row exists:
//     UPDATE
//
// If row doesn't exist:
//     ADD
//
// =====================================================

export const updateGoogleSheet = async ({
  order,
  delivery,
  deliveryDate,
}) => {

  // ===================================================
  // IMPORTANT:
  //
  // Put complete membership operation into queue.
  // ===================================================

  return runSequentially(async () => {

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
      // MEMBERSHIP ID
      // =================================================

      const membershipId =
        String(order.membershipId).trim();

      console.log(
        `\n📊 Starting Google Sheet sync: ${membershipId}`
      );

      // =================================================
      // GET / CREATE MONTHLY SHEET
      // =================================================

      const sheetName =
        await createMonthlySheet(deliveryDate);

      // =================================================
      // GET ALL EXISTING ROWS
      // =================================================
      //
      // IMPORTANT:
      // This READ is protected by withRetry().
      //
      // If Google returns 429,
      // it automatically waits and retries.
      //
      // =================================================

      const response =
        await withRetry(() =>
          sheets.spreadsheets.values.get({
            spreadsheetId,

            range: `${sheetName}!A:N`,
          })
        );

      const rows =
        response.data.values || [];

      // =================================================
      // FORMAT DELIVERY DATE
      // =================================================

      const formattedDeliveryDate =
        formatDate(deliveryDate);

      // =================================================
      // FIND EXISTING ROW
      // =================================================
      //
      // Check:
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
      // =================================================

      const values = [[

        // A - Date
        formattedDeliveryDate,

        // B - Membership ID
        membershipId,

        // C - Customer Name
        customerName,

        // D - Plan
        subscription.plan || "",

        // E - Status
        subscriptionStatus,

        // F - Slot
        order.deliverySlot || "",

        // G - Meal Given
        mealGiven,

        // H - Reason
        delivery.notes || "",

        // I - Menu
        delivery.menu || "",

        // J - Total Days
        totalDays,

        // K - Consumed
        consumed,

        // L - Remaining
        remaining,

        // M - Start Date
        formatDate(
          subscription.startDate
        ),

        // N - End Date
        formatDate(
          subscription.endDate
        ),

      ]];

      // =================================================
      // UPDATE EXISTING ROW
      // =================================================

      if (rowIndex !== -1) {

        await withRetry(() =>
          sheets.spreadsheets.values.update({
            spreadsheetId,

            range:
              `${sheetName}!A${rowIndex}:N${rowIndex}`,

            valueInputOption: "USER_ENTERED",

            requestBody: {
              values,
            },
          })
        );

        console.log(
          `✅ Google Sheet UPDATED | ` +
          `${membershipId} | ` +
          `${formattedDeliveryDate}`
        );

        return {
          success: true,
          action: "updated",
          sheetName,
          row: rowIndex,
          membershipId,
        };
      }

      // =================================================
      // CREATE NEW ROW
      // =================================================

      await withRetry(() =>
        sheets.spreadsheets.values.append({
          spreadsheetId,

          range: `${sheetName}!A:N`,

          valueInputOption: "USER_ENTERED",

          insertDataOption: "INSERT_ROWS",

          requestBody: {
            values,
          },
        })
      );

      console.log(
        `✅ Google Sheet ROW ADDED | ` +
        `${membershipId} | ` +
        `${formattedDeliveryDate}`
      );

      return {
        success: true,
        action: "created",
        sheetName,
        membershipId,
      };

    } catch (error) {

      console.error(
        `❌ Google Sheet Sync Error | ` +
        `${order?.membershipId || "UNKNOWN"}`,
        error.response?.data ||
          error.message ||
          error
      );

      // Throw so caller knows this membership failed.
      // Queue itself will continue because
      // runSequentially() handles the queue.
      throw error;
    }
  });
};