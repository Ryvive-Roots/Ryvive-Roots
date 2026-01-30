import crypto from "crypto";
import axios from "axios";
import TempPayment from "../models/TempPayment.js";

export const initiateEasebuzzPayment = async (req, res) => {
  try {
    const { amount, firstname, email, phone, plan, formData } = req.body;

    const txnid = "RB" + Date.now();
    const key = process.env.EASEBUZZ_KEY;
    const salt = process.env.EASEBUZZ_SALT;

    // 1️⃣ Save temp payment
    await TempPayment.create({
      txnid,
      amount,
      email,
      phone,
      plan,
      formData,
    });

    // 2️⃣ Generate hash (Easebuzz format)
    const hashString =
      `${key}|${txnid}|${amount}|Subscription|${firstname}|${email}` +
      `|||||||||||${salt}`;

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    // 3️⃣ Easebuzz payload
    const payload = {
      key,
      txnid,
      amount,
      productinfo: "Subscription",
      firstname,
      email,
      phone,

      surl: `${process.env.BACKEND_URL}/api/payment/easebuzz/success`,
      furl: `${process.env.BACKEND_URL}/api/payment/easebuzz/failure`,

      hash,

      // 🔒 EMI DISABLED
      payment_mode: "NB,UPI,DC,CC",
    };

    const response = await axios.post(
      "https://pay.easebuzz.in/payment/initiateLink",
      payload
    );

    return res.json({
      success: true,
      payment_url: response.data.data.payment_url,
    });
  } catch (error) {
    console.error("Easebuzz initiate error:", error);
    res.status(500).json({ success: false });
  }
};
