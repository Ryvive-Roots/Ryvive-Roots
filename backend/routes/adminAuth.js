import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

// 🔐 Admin Login
router.post("/loginAdmin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

export default router;
