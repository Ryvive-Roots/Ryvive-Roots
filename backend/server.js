import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// DB Connection
connectDB();

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Cloudinary
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("API Working");
});

// Server Start
app.listen(port, () => console.log(`🚀 Server started on PORT : ${port}`));
