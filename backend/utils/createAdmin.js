import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const createAdminIfNotExists = async () => {
  try {
    const email = "admin@ryviveroots.com";
    const password = "shravaniDidi@2026";

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

  
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
  }
};

export default createAdminIfNotExists;
