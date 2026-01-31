import crypto from "crypto";
import axios from "axios";
import TempPayment from "../models/TempPayment.js";
import { PLANS } from "../utils/planConfig.js";

/**
 * STEP 1️⃣ — INITIATE EASEBUZZ PAYMENT
 */
export const initiateEasebuzzPayment = async (req, res) => {
  try {
    let { amount, firstname, email, phone, plan, formData } = req.body;

    // ✅ Basic validation
    if (!firstname || !email || !phone || !plan || !formData) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    /**
     * ✅ RULE:
     * ₹1  → TEST payment
     * Real price → LIVE payment
     * (Independent of Easebuzz ENV)
     */
   if (Number(amount) === 1) {
  amount = 1; // ✅ NUMBER
} else {
  if (Number(amount) !== selectedPlan.price) {
    return res.status(400).json({
      success: false,
      message: "Amount mismatch",
    });
  }
  amount = Number(amount); // ✅ NUMBER
}


    const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // ✅ Save temp payment
    await TempPayment.create({
      txnid,
      amount,
      plan,
      formData,
      status: "PENDING",
    });

    // ✅ UDFs
    const udf1 = plan;
    const udf2 = phone;
    const udf3 = "";
    const udf4 = "";
    const udf5 = "";

    // ✅ Easebuzz hash (correct order)
    const hashString = [
      process.env.EASEBUZZ_MERCHANT_KEY,
      txnid,
      amount,
      "Subscription Payment",
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      "", "", "", "",
      process.env.EASEBUZZ_SALT,
    ].join("|");

    const hash = crypto
      .createHash("sha512")
      .update(hashString)
      .digest("hex");

    // ✅ Payment URL based on ENV
    const paymentUrl =
      process.env.EASEBUZZ_ENV === "TEST"
        ? "https://testpay.easebuzz.in/payment/initiateLink"
        : "https://pay.easebuzz.in/payment/initiateLink";

    return res.json({
      success: true,
      payment_url: paymentUrl,
      data: {
        key: process.env.EASEBUZZ_MERCHANT_KEY,
        txnid,
        amount,
        productinfo: "Subscription Payment",
        firstname,
        email,
        phone,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        surl: `${process.env.BACKEND_URL}/api/payment/easebuzz/success`,
        furl: `${process.env.BACKEND_URL}/api/payment/easebuzz/failure`,
        hash,
      },
    });
  } catch (error) {
    console.error("Easebuzz initiate error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
    });
  }
};

/**
 * SUCCESS CALLBACK (FORWARD ONLY)
 */
export const easebuzzPaymentSuccess = async (req, res) => {
  try {
    // Forward Easebuzz response to order controller
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/orders/easebuzz-success`,
      req.body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Redirect user to frontend success page
    return res.redirect(response.request.res.responseUrl);
  } catch (error) {
    console.error("Easebuzz payment success forward error:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

/**
 * FAILURE CALLBACK
 */
export const easebuzzFailure = async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
