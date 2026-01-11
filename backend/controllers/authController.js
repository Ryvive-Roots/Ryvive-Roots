import Order from "../models/Order.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createPassword = async (req, res) => {
  try {
    const { membershipId, password } = req.body;

    // 1️⃣ Find order by membershipId
    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid membership ID",
      });
    }

    // 2️⃣ Find user using phone/email from order
    const user = await User.findOne({ phone: order.user.phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Prevent re-creating password
    if (user.password) {
      return res.status(400).json({
        success: false,
        message: "Password already created. Please login.",
      });
    }

    // 4️⃣ Hash & save password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isPasswordCreated = true;

    await user.save();

    // 5️⃣ AUTO LOGIN → JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Create password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { membershipId, password } = req.body;

    // 1️⃣ Find order by membershipId
    const order = await Order.findOne({ membershipId });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership ID",
      });
    }

    // 2️⃣ Find user using phone from order
    const user = await User.findOne({ phone: order.user.phone });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        membershipId: order.membershipId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      membershipId: order.membershipId,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

