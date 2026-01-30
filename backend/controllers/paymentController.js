import crypto from "crypto";
import TempPayment from "../models/TempPayment.js";
import { PLANS } from "../utils/planConfig.js";
import axios from "axios";

/**
 * STEP 1️⃣ — INITIATE PAYMENT
 */
export const initiateEasebuzzPayment = async (req, res) => {
  try {
    const {
      amount,
      firstname,
      lastname,
      email,
      phone,
      plan,
      formData,
    } = req.body;

    const selectedPlan = PLANS[plan];
    if (!selectedPlan || selectedPlan.price !== amount) {
      return res.status(400).json({ success: false });
    }

    const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await TempPayment.create({
      txnid,
      amount,
      plan,
      formData,
      status: "PENDING",
    });

    const hashString = [
      process.env.EASEBUZZ_KEY,
      txnid,
      amount,
      "Subscription Payment",
      firstname,
      email,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      process.env.EASEBUZZ_SALT,
    ].join("|");

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    return res.json({
      success: true,
      payment_url: "https://pay.easebuzz.in/payment/initiateLink",
      data: {
        key: process.env.EASEBUZZ_KEY,
        txnid,
        amount,
        productinfo: "Subscription Payment",
        firstname,
        lastname,
        email,
        phone,
        surl: `${process.env.BACKEND_URL}/api/payment/easebuzz/success`,
        furl: `${process.env.BACKEND_URL}/api/payment/easebuzz/failure`,
        hash,
      },
    });
  } catch (err) {
    console.error("Initiate error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * STEP 2️⃣ — EASEBUZZ SUCCESS CALLBACK
 * (just forward to orderController)
 */
export const easebuzzPaymentSuccess = async (req, res) => {
  try {
    // forward SAME request to order controller
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/order/easebuzz-success`,
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.redirect(response.request.res.responseUrl);
  } catch (err) {
    console.error("Easebuzz success forward error:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

/**
 * STEP 3️⃣ — EASEBUZZ FAILURE CALLBACK
 */
export const easebuzzPaymentFailure = async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
