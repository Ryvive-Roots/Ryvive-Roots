

import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import BgImage from "../assets/Form.png";




const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  {
    code: "421202",
    area: "Dombivli West",
  },
  { code: "421203", area: "Dombivli East" },
  { code: "421204", area: "Khoni, Padle" },
];

const inputStyle = `
  w-full font-roboto rounded-lg border border-gray-200 bg-white
  px-4 py-3 text-sm text-gray-900 shadow-sm
  transition-all duration-300
  focus:outline-none focus:border-green-600
  focus:ring-4 focus:ring-green-500/20
  hover:border-gray-300 placeholder:text-gray-400
`;

const steps = [
  "Personal Details",
  "Health Information",
  "Delivery Slot",
  "Delivery Address",
  "Review & Place Order",
  "Payment Successful",
];




const PlatinumsubForm = () => {
  const [step, setStep] = useState(0);
  const [membershipId, setMembershipId] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);


  // DELIVERY SLOT STATE
  const [deliverySlot, setDeliverySlot] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("subscriptionDeliverySlot")) || {
        type: "",
        time: "",
      }
    );
  });
  const PAYMENT_ENABLED = false; // 🔴 set true when Razorpay is ready

  // Save delivery slot to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "subscriptionDeliverySlot",
      JSON.stringify(deliverySlot)
    );
  }, [deliverySlot]);

  // FORM DATA STATE
  const [formData, setFormData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("subscriptionFormData")) || {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dob: "",
        allergies: "",
        medical: "",
        slot: deliverySlot, // optional: set default slot from localStorage
        pincode: "",
        house: "",
        street: "",
        landmark: "",
      }
    );
  });

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("subscriptionFormData", JSON.stringify(formData));
  }, [formData]);

  const progress = Math.round(((step + 1) / steps.length) * 100);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStepValid = () => {
    if (step === 0) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.phone &&
        formData.email &&
        formData.dob
      );
    }
    if (step === 1) return true;
 if (step === 2)
   return typeof formData.slot === "string" && formData.slot.length > 0;


    if (step === 3) {
      return formData.pincode && formData.house && formData.street;
    }
    return true;
  };

  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay Order (Backend)
      const orderRes = await fetch(
        "http://localhost:4000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 4999 }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Payment order creation failed");
        return;
      }

      // 2️⃣ Razorpay Checkout Options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // TEST KEY ONLY
        amount: orderData.order.amount,
        currency: "INR",
        name: "Ryvive Roots",
        description: "Wellness Subscription",
        order_id: orderData.order.id,

        handler: async function (response) {
          // 3️⃣ Verify Payment
          const verifyRes = await fetch(
            "http://localhost:4000/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 4️⃣ Payment verified → Place order
            await placeFinalOrder();
          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#16a34a",
        },
      };

      // Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };


 const placeFinalOrder = async () => {
   try {
     console.log("Placing order...");

     const res = await fetch("http://localhost:4000/api/orders/place-order", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         formData,
         plan: "PLATINUM",
         paymentMethod: "RAZORPAY",
       }),
     });

     const data = await res.json();
     console.log("Order response:", data);

     if (!data.success) {
       alert(data.message || "Order failed");
       return;
     }

     // ✅ SAVE MEMBERSHIP
     localStorage.setItem("membershipId", data.membershipId);

     // ✅ UPDATE STATE
     setMembershipId(data.membershipId);
     setStep(5); // 🔥 THIS WILL MOVE TO PAYMENT SUCCESS

     // ✅ CLEAR TEMP DATA
     localStorage.removeItem("subscriptionFormData");
     localStorage.removeItem("subscriptionDeliverySlot");
   } catch (error) {
     console.error("Order error:", error);
     alert("Something went wrong while placing order");
   }
  };
  


  return (
    <div
      className="min-h-screen bg-cover bg-top mt-20 bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-lobster md:text-4xl   text-white">
              Subscription Checkout
            </h1>
            <p className="text-white text-xl  mt-2 font-fredoka">
              Complete your details to begin your wellness journey
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mb-14">
            <div className="flex justify-between text-xs font-medium font-fredoka text-gray-200 mb-2">
              <span>{steps[step]}</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-green-500 transition-all duration-700"
              />
            </div>
          </div>

          {/* CENTER FORM */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="bg-white/55  rounded p-6 md:p-10 shadow-xl">
                <h2 className="text-2xl text-black/80 font-semibold font-fredoka mb-1">
                  {steps[step]}
                </h2>
                <div className="w-10 h-1 font-roboto bg-green-500 rounded-full mb-4" />

                {/* STEP 1 */}
                {step === 0 && (
                  <div className="grid md:grid-cols-2 font-roboto gap-6">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="First Name"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Last Name"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Phone Number"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email ID
                      </label>
                      <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Email ID"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="dob" className="text-sm font-medium">
                        Date of Birth
                      </label>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 1 && (
                  <div className="space-y-4 font-roboto">
                    <input
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Allergies (if any)"
                    />
                    <textarea
                      name="medical"
                      value={formData.medical}
                      rows="3"
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Any Medical Conditions? (Optional)"
                    />

                    <p className="text-xs text-gray-500">
                      Your information is kept private.
                    </p>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 2 && (
                  <div className="grid md:grid-cols-2 font-roboto gap-4">
                    {/* 🌅 Morning Slot */}
                    <div className="relative group">
                      <select
                        className={`${inputStyle} appearance-none pr-10 ${
                          deliverySlot.type === "evening"
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deliverySlot.type === "evening"}
                        value={
                          deliverySlot.type === "morning"
                            ? deliverySlot.time
                            : ""
                        }
                        onChange={(e) => {
                          const slotValue = e.target.value;
                          setDeliverySlot({ type: "morning", time: slotValue });

                          setFormData({
                            ...formData,
                            slot: `Morning - ${slotValue}`,
                          });
                        }}
                      >
                        <option value="">Morning Slot</option>
                        <option value="08:00 – 09:00 AM">
                          08:00 – 09:00 AM
                        </option>
                        <option value="09:00 – 10:00 AM">
                          09:00 – 10:00 AM
                        </option>
                        <option value="10:00 – 11:00 AM">
                          10:00 – 11:00 AM
                        </option>
                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>

                    {/* 🌙 Evening Slot */}
                    <div className="relative group">
                      <select
                        className={`${inputStyle} appearance-none pr-10 ${
                          deliverySlot.type === "morning"
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deliverySlot.type === "morning"}
                        value={
                          deliverySlot.type === "evening"
                            ? deliverySlot.time
                            : ""
                        }
                        onChange={(e) => {
                          const slotValue = e.target.value;
                          setDeliverySlot({ type: "evening", time: slotValue });

                          setFormData({
                            ...formData,
                            slot: `Evening - ${slotValue}`,
                          });
                        }}
                      >
                        <option value="">Evening Slot</option>
                        <option value="05:00 – 06:00 PM">
                          05:00 – 06:00 PM
                        </option>
                        <option value="06:00 – 07:00 PM">
                          06:00 – 07:00 PM
                        </option>
                        <option value="07:00 – 08:00 PM">
                          07:00 – 08:00 PM
                        </option>
                        <option value="08:00 – 09:00 PM">
                          08:00 – 09:00 PM
                        </option>
                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 3 && (
                  <div className="grid md:grid-cols-2 font-roboto gap-4">
                    <select
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={inputStyle}
                    >
                      <option value="">Select Pincode</option>
                      {allowedPincodes.map((p) => (
                        <option key={p.code}>
                          {p.code} — {p.area}
                        </option>
                      ))}
                    </select>
                    <input
                      name="house"
                      value={formData.house}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="House / Flat"
                    />
                    <input
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Street / Area"
                    />
                    <input
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="Landmark (Optional)"
                    />
                    <input
                      value="Dombivli"
                      readOnly
                      className={`${inputStyle} bg-gray-100`}
                    />
                    <input
                      value="Maharashtra"
                      readOnly
                      className={`${inputStyle} bg-gray-100`}
                    />
                    <input
                      value="India"
                      readOnly
                      className={`${inputStyle} bg-gray-100`}
                    />
                  </div>
                )}

                {/* STEP 5 — REVIEW & PLACE ORDER */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* Success Header */}
                    <div className="text-center">
                      <CheckCircle
                        size={60}
                        className="mx-auto text-green-500 mb-4 animate-pulse"
                      />
                      <h3 className="text-2xl font-semibold">
                        Almost Done! 🎉
                      </h3>
                      <p className="text-gray-500 mt-1">
                        Please review your subscription details before placing
                        the order.
                      </p>
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-gray-50 border rounded-2xl p-5 space-y-3">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Subscription Summary
                      </h4>
                      <div className="flex justify-between text-sm">
                        <span>Platinum Subscription Plan</span>
                        <span>₹ 6,999.00</span>
                      </div>

                      <div className="flex justify-between text-sm text-green-600">
                        <span>Delivery Fee</span>
                        <span>FREE</span>
                      </div>

                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Total Payable</span>
                        <span>₹ 6,999.00</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        🚚 Free delivery included • No hidden charges
                      </p>
                    </div>

                    {/* Place Order Button */}
                    <button
                      disabled={loadingOrder}
                      onClick={async () => {
                        setLoadingOrder(true);

                        if (PAYMENT_ENABLED) {
                          await handlePayment();
                        } else {
                          await placeFinalOrder();
                        }

                        setLoadingOrder(false);
                      }}
                      className={`w-full py-4 rounded-xl text-white
    ${loadingOrder ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      {loadingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
                    </button>

                    {/* Trust Note */}
                    <p className="text-center text-xs text-gray-500">
                      🔒 Secure checkout • Your information is protected
                    </p>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center space-y-6">
                    <CheckCircle
                      size={80}
                      className="mx-auto text-green-500 animate-bounce"
                    />

                    <h2 className="text-3xl font-semibold">
                      Payment Successful 🎉
                    </h2>

                    <p className="text-gray-600">
                      Your membership has been created successfully.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-gray-500">
                        Your Membership ID
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {membershipId}
                      </p>
                    </div>

                    <button
                      onClick={() => window.location.replace("/login")}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
                    >
                      GO TO LOGIN
                    </button>
                  </div>
                )}

                {/* NAVIGATION */}
                <div className="flex justify-between mt-8">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-sm text-gray-600 disabled:opacity-30"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  {step < 4 && (
                    <button
                      disabled={!isStepValid()}
                      onClick={() => isStepValid() && setStep(step + 1)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium
      ${
        isStepValid()
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {!isStepValid() && (
                  <p className="text-xs text-red-500 mt-3">
                    Please fill all required fields to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PlatinumsubForm;
