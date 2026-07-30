import sheets from "../config/googleSheets.js";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

const getSheetName = () => {
  const now = new Date();

  return now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

// Create monthly sheet automatically
export const createMonthlySheet = async () => {
  const sheetName = getSheetName();

  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const exists = spreadsheet.data.sheets.some(
      (sheet) => sheet.properties.title === sheetName
    );

    if (exists) return sheetName;

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

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:N1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          "Client",
          "Membership ID",
          "Plan",
          "Today's Date",
          "Today's Status",
          "Total Days",
          "Consumed",
          "Remaining",
          "Meal Day",
          "Reason",
          "Start Date",
          "End Date",
          "Status",
          "Last Updated",
        ]],
      },
    });

    return sheetName;

  } catch (err) {
    console.error(err);
  }
};

export const updateGoogleSheet = async (subscription) => {

  const sheetName = await createMonthlySheet();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:N`,
  });

  const rows = response.data.values || [];

  const membershipId = subscription.membershipId;

  let rowIndex = -1;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] === membershipId) {
      rowIndex = i + 1;
      break;
    }
  }

  const values = [[
    subscription.clientName,
    subscription.membershipId,
    subscription.plan,
    new Date().toLocaleDateString("en-GB"),
    subscription.todayStatus,
    subscription.totalDays,
    subscription.consumed,
    subscription.remaining,
    subscription.mealDay,
    subscription.reason || "",
    subscription.startDate,
    subscription.endDate,
    subscription.status,
    new Date().toLocaleString(),
  ]];

  if (rowIndex === -1) {

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:N`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("Google Sheet Row Added");

  } else {

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${rowIndex}:N${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("Google Sheet Updated");
  }

};