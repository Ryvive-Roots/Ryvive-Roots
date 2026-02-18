import crypto from "crypto";
import axios from "axios";
import TempPayment from "../models/TempPayment.js";
import { PLANS } from "../utils/planConfig.js";

/**
 * STEP 1️⃣ — INITIATE EASEBUZZ PAYMENT
 */
export const initiateEasebuzzPayment = async (req, res) => {
  try {
    let {
    
      firstname,
      email,
      phone,
      plan,
      formData,
      isRenewal,
      membershipId,
    } = req.body;

    // ✅ Basic validation (common fields)
    if (!firstname || !email || !phone || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Require formData ONLY for new subscription
    if (!isRenewal && !formData) {
      return res.status(400).json({
        success: false,
        message: "Form data required for new subscription",
      });
    }

    // ✅ Require membershipId for renewal
    if (isRenewal && !membershipId) {
      return res.status(400).json({
        success: false,
        message: "Membership ID required for renewal",
      });
    }

// 🔎 Extract base plan
const selectedPlan = PLANS[plan];



if (!selectedPlan) {
  return res.status(400).json({
    success: false,
    message: "Invalid plan",
  });
}

const durationMonths = selectedPlan.durationMonths;
const dbAmount = selectedPlan.price;


if (dbAmount === undefined) 
 {
  return res.status(400).json({
    success: false,
    message: "Invalid pricing configuration",
  });
}







    const easebuzzAmount = dbAmount.toString();
    const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // ✅ Save temp payment
    await TempPayment.create({
      txnid,
      amount: dbAmount,
      plan: plan,
      durationMonths,
      formData: isRenewal ? null : formData,
      isRenewal: isRenewal || false,
      membershipId: membershipId || null,
      status: "PENDING",
    });

    // 🔐 Easebuzz hash
   const udf1 = plan;   // IMPORTANT
    const udf2 = phone.toString();

    const productinfo = "Subscription Payment";

    const hashString = [
      process.env.EASEBUZZ_MERCHANT_KEY,
      txnid,
      easebuzzAmount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
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

    const paymentUrl =
      process.env.EASEBUZZ_ENV === "TEST"
        ? "https://testpay.easebuzz.in/payment/initiateLink"
        : "https://pay.easebuzz.in/payment/initiateLink";

    const easebuzzResponse = await axios.post(
      paymentUrl,
      new URLSearchParams({
        key: process.env.EASEBUZZ_MERCHANT_KEY,
        txnid,
        amount: easebuzzAmount,
        productinfo,
        firstname,
        email,
        phone: phone.toString(),
        udf1,
        udf2,
        udf3: "",
        udf4: "",
        udf5: "",
        udf6: "",
        udf7: "",
        udf8: "",
        udf9: "",
        udf10: "",
        surl: `${process.env.BACKEND_URL}/api/payment/easebuzz/success`,
        furl: `${process.env.BACKEND_URL}/api/payment/easebuzz/failure`,
        hash,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (easebuzzResponse.data.status !== 1) {
      return res.status(400).json({
        success: false,
        message: "Easebuzz initiation failed",
      });
    }

    return res.json({
      success: true,
      access_key: easebuzzResponse.data.data,
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
 * SUCCESS CALLBACK
 */
export const easebuzzPaymentSuccess = async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/orders/easebuzz-success`,
      req.body,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

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
