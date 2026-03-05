import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import adminRoutes from "./routes/admin.js";
import subscriptionRoutes from "./routes/subscription.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import createAdminIfNotExists from "./utils/createAdmin.js";
import cron from "node-cron";
import { renewalReminderJob } from "./cron/renewalReminderJob.js";
import agenda from "./utils/emailScheduler.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/invoices", express.static("invoices"));
app.use(express.static("public"));

// Test API
app.get("/", (req, res) => {
  res.send("API Working");
});

// Cloudinary
connectCloudinary();

// DB Connection → THEN cron
connectDB().then(async () => {
  createAdminIfNotExists();

  // ⏰ Start cron ONLY after DB is ready
  cron.schedule("0 6 * * *", async () => {
    console.log("⏰ Running multi-renewal reminder job...");
    await renewalReminderJob();
  });

  // ✅ Start Agenda AFTER DB connection
  await agenda.start();

  console.log("✅ Cron jobs started");
});




// Server Start
app.listen(port, () =>
  console.log(`🚀 Server started on PORT : ${port}`)
);
