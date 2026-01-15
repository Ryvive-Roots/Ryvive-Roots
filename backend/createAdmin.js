import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

const MONGO_URI =
  "mongodb+srv://ryviveroots:ryviveroots26@cluster0.hmma5fq.mongodb.net"; // same as server.js

await mongoose.connect(MONGO_URI);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await Admin.create({
    email: "admin@gmail.com",
    password: hashedPassword,
  });

  console.log("✅ Admin created:", admin.email);
  process.exit();
};

createAdmin();
