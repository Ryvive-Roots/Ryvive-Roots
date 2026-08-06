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
      isExistingCustomerPurchase,
      startAfterCurrentPlanEnds,
    } = req.body;

    isRenewal = isRenewal === true || isRenewal === "true";

    // 🆕 "Continue with this plan" -> queue it to start after the
    // member's currently running plan ends, instead of activating soon.
    // Only meaningful for isExistingCustomerPurchase; ignored otherwise.
    startAfterCurrentPlanEnds =
      startAfterCurrentPlanEnds === true || startAfterCurrentPlanEnds === "true";

    // ✅ Basic validation (common fields)
    if (!firstname || !email || !phone || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Require formData ONLY for new subscription
    if (
  !isRenewal &&
  !isExistingCustomerPurchase &&
  !formData
) {
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

    // ✅ Require membershipId for existing-customer purchases too — the
    // queued-plan flow specifically needs it to look up the current order.
    if (isExistingCustomerPurchase && !membershipId) {
      return res.status(400).json({
        success: false,
        message: "Membership ID required for this purchase",
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
    formData: isRenewal ? undefined : formData,
      isRenewal: isRenewal || false,
      isExistingCustomerPurchase:
  isExistingCustomerPurchase || false,
      // 🆕 only ever true alongside isExistingCustomerPurchase — the
      // easebuzzSuccess handler checks this to decide whether to create a
      // queued "UPCOMING" order instead of switching the plan immediately.
      startAfterCurrentPlanEnds:
        isExistingCustomerPurchase ? !!startAfterCurrentPlanEnds : false,
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
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("Easebuzz FULL RESPONSE:", easebuzzResponse.data);

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
  console.error(
    "Easebuzz initiate error:",
    error.response?.data || error.message || error
  );

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
   const url = `${process.env.BACKEND_URL}/api/orders/easebuzz-success`;

console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("Forward URL:", url);

const response = await axios.post(
  url,
  req.body,
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 60000,
  }
);

    return res.redirect(response.request.res.responseUrl);
  } catch (error) {
  console.error("Forward Error:", {
  message: error.message,
  code: error.code,
  status: error.response?.status,
  data: error.response?.data,
  url: error.config?.url,
});
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  }
};

/**
 * FAILURE CALLBACK
 */
export const easebuzzFailure = async (req, res) => {
  return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};