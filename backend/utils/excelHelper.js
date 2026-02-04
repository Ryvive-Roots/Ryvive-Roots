import ExcelJS from "exceljs";
import fs from "fs-extra";
import path from "path";

const EXCEL_PATH = path.join(process.cwd(), "exports", "members.xlsx");

export const appendOrderToExcel = async (order) => {
  await fs.ensureDir(path.dirname(EXCEL_PATH));

  const workbook = new ExcelJS.Workbook();
  let sheet;

  if (fs.existsSync(EXCEL_PATH)) {
    await workbook.xlsx.readFile(EXCEL_PATH);
    sheet = workbook.getWorksheet("Members");
  } else {
    sheet = workbook.addWorksheet("Members");

    sheet.columns = [
      { header: "Membership ID", key: "membershipId", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 30 },
      { header: "Plan", key: "plan", width: 15 },
      { header: "Slot", key: "slot", width: 20 },
      { header: "Allergies", key: "allergies", width: 30 },
      { header: "Medical Conditions", key: "medical", width: 30 },
      { header: "Remarks", key: "remarks", width: 30 },
      { header: "Address", key: "address", width: 40 },
      { header: "Start Date", key: "start", width: 15 },
      { header: "End Date", key: "end", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];
  }

  sheet.addRow({
    membershipId: order.membershipId,
    name: `${order.user.firstName} ${order.user.lastName}`,
    phone: order.user.phone,
    email: order.user.email,
    plan: order.subscription.plan,
    slot: order.deliverySlot,
    allergies: order.healthInfo?.allergies || "",
    medical: order.healthInfo?.medicalConditions || "",
    remarks: order.remarks || "",
    address: `${order.address.house}, ${order.address.street}, ${order.address.city} - ${order.address.pincode}`,
    start: order.subscription.startDate?.toLocaleDateString("en-IN"),
    end: order.subscription.endDate?.toLocaleDateString("en-IN"),
    createdAt: new Date().toLocaleString("en-IN"),
  });

  await workbook.xlsx.writeFile(EXCEL_PATH);
};



export const rebuildExcelFromMongo = async () => {
  await fs.ensureDir(path.dirname(EXCEL_PATH));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Members");

  sheet.columns = [
    { header: "Membership ID", key: "membershipId", width: 20 },
    { header: "Name", key: "name", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Email", key: "email", width: 30 },
    { header: "Plan", key: "plan", width: 15 },
    { header: "Slot", key: "slot", width: 20 },
    { header: "Allergies", key: "allergies", width: 30 },
    { header: "Medical Conditions", key: "medical", width: 30 },
    { header: "Remarks", key: "remarks", width: 30 },
    { header: "Address", key: "address", width: 40 },
    { header: "Start Date", key: "start", width: 15 },
    { header: "End Date", key: "end", width: 15 },
    { header: "Created At", key: "createdAt", width: 20 },
  ];

  const orders = await Order.find().sort({ createdAt: -1 });

  orders.forEach((order) => {
    sheet.addRow({
      membershipId: order.membershipId,
      name: `${order.user.firstName} ${order.user.lastName}`,
      phone: order.user.phone,
      email: order.user.email,
      plan: order.subscription.plan,
      slot: order.deliverySlot,
      allergies: order.healthInfo?.allergies || "",
      medical: order.healthInfo?.medicalConditions || "",
      remarks: order.remarks || "",
      address: `${order.address.house}, ${order.address.street}, ${order.address.city} - ${order.address.pincode}`,
      start: order.subscription.startDate?.toLocaleDateString("en-IN"),
      end: order.subscription.endDate?.toLocaleDateString("en-IN"),
      createdAt: order.createdAt.toLocaleString("en-IN"),
    });
  });

  await workbook.xlsx.writeFile(EXCEL_PATH);
};
