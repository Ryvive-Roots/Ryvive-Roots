import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// GOOGLE AUTHENTICATION
// =====================================================

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "google-credentials.json"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

// =====================================================
// CONFIG
// =====================================================

// Put your Google Spreadsheet ID here
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Change this according to your sheet
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sheet1";

// How long we keep the sheet data in memory
// 30 seconds means we don't READ Google Sheet repeatedly
const CACHE_TTL = 30 * 1000;

// =====================================================
// LOCAL CACHE
// =====================================================

let sheetCache = {
  rows: [],
  lastFetched: 0,
};

// =====================================================
// SLEEP
// =====================================================

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// =====================================================
// CHECK 429 / QUOTA ERROR
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
    status === 429 ||
    status === "429" ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded") ||
    message.includes("Too many requests")
  );
};

// =====================================================
// RETRY WITH EXPONENTIAL BACKOFF
// =====================================================

async function withRetry(fn, retries = 5) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isQuotaError(error)) {
        throw error;
      }

      if (attempt === retries) {
        throw error;
      }

      // 2 sec → 4 sec → 8 sec → 16 sec → 32 sec
      const baseDelay = Math.min(
        2000 * Math.pow(2, attempt),
        32000
      );

      // Random delay prevents simultaneous retries
      const randomDelay = Math.floor(
        Math.random() * 1000
      );

      const delay = baseDelay + randomDelay;

      console.log(
        `⚠️ Google Sheets quota reached. ` +
        `Retry ${attempt + 1}/${retries} after ${delay}ms`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

// =====================================================
// READ SHEET ONLY WHEN CACHE EXPIRED
// =====================================================

export async function getSheetRows(forceRefresh = false) {
  const now = Date.now();

  // Return cached rows
  if (
    !forceRefresh &&
    sheetCache.rows.length > 0 &&
    now - sheetCache.lastFetched < CACHE_TTL
  ) {
    return sheetCache.rows;
  }

  console.log("📥 Reading Google Sheet...");

  const response = await withRetry(() =>
    sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    })
  );

  const rows = response.data.values || [];

  sheetCache = {
    rows,
    lastFetched: Date.now(),
  };

  console.log(
    `✅ Google Sheet read successfully: ${rows.length} rows`
  );

  return rows;
}

// =====================================================
// CLEAR CACHE
// =====================================================

export function clearSheetCache() {
  sheetCache = {
    rows: [],
    lastFetched: 0,
  };

  console.log("🧹 Google Sheet cache cleared");
}

// =====================================================
// FIND MEMBERSHIP ID
// =====================================================

export async function findMembershipRow(
  membershipId,
  membershipColumn = 0
) {
  const rows = await getSheetRows();

  const normalizedId = String(membershipId)
    .trim()
    .toUpperCase();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const currentId = String(
      row[membershipColumn] || ""
    )
      .trim()
      .toUpperCase();

    if (currentId === normalizedId) {
      return {
        rowNumber: i + 1,
        row,
      };
    }
  }

  return null;
}

// =====================================================
// UPDATE EXISTING ROW
// =====================================================

export async function updateSheetRow(
  rowNumber,
  values
) {
  if (!SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SHEET_ID is not configured"
    );
  }

  const range = `${SHEET_NAME}!A${rowNumber}:Z${rowNumber}`;

  const response = await withRetry(() =>
    sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,

      range,

      valueInputOption: "USER_ENTERED",

      requestBody: {
        values: [values],
      },
    })
  );

  // Update local cache if possible
  if (sheetCache.rows.length > 0) {
    const cacheIndex = rowNumber - 1;

    sheetCache.rows[cacheIndex] = values;
  }

  console.log(
    `✅ Google Sheet UPDATED | Row ${rowNumber}`
  );

  return response.data;
}

// =====================================================
// ADD NEW ROW
// =====================================================

export async function appendSheetRow(values) {
  if (!SPREADSHEET_ID) {
    throw new Error(
      "GOOGLE_SHEET_ID is not configured"
    );
  }

  const response = await withRetry(() =>
    sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,

      range: `${SHEET_NAME}!A:Z`,

      valueInputOption: "USER_ENTERED",

      insertDataOption: "INSERT_ROWS",

      requestBody: {
        values: [values],
      },
    })
  );

  // Add to local cache
  if (sheetCache.rows.length > 0) {
    sheetCache.rows.push(values);
  }

  console.log(
    `✅ Google Sheet ROW ADDED`
  );

  return response.data;
}

// =====================================================
// ADD OR UPDATE MEMBERSHIP
// =====================================================

export async function upsertMembershipRow({
  membershipId,
  values,
  membershipColumn = 0,
}) {
  if (!membershipId) {
    throw new Error(
      "Membership ID is required"
    );
  }

  // IMPORTANT:
  // This uses cached sheet data instead of
  // making a new Google READ request every time.

  const existing = await findMembershipRow(
    membershipId,
    membershipColumn
  );

  if (existing) {
    console.log(
      `🔄 Updating membership: ${membershipId}`
    );

    return await updateSheetRow(
      existing.rowNumber,
      values
    );
  }

  console.log(
    `➕ Adding membership: ${membershipId}`
  );

  return await appendSheetRow(values);
}

// =====================================================
// FORCE REFRESH
// =====================================================

export async function refreshSheetCache() {
  return await getSheetRows(true);
}

// =====================================================
// EXPORT GOOGLE SHEETS CLIENT
// =====================================================

export default sheets;