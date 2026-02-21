import React, { useEffect, useState } from "react";
import Bg from "../assets/dashboard_Img.png";
import { Lock } from "lucide-react";
import { MdAutorenew } from "react-icons/md";


const UserDashboard = ({ active }) => {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseFromDate, setPauseFromDate] = useState("");
  const [pauseToDate, setPauseToDate] = useState("");

const [showRenewModal, setShowRenewModal] = useState(false);
const [renewDuration, setRenewDuration] = useState("3");
const [selectedPlan, setSelectedPlan] = useState(null);
const [showSummary, setShowSummary] = useState(false);

useEffect(() => {
  if (showSummary || showRenewModal || showPauseModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showSummary, showRenewModal, showPauseModal]);

useEffect(() => {
  if (!order?.subscription?.plan) return;

  const plan = order.subscription.plan.toUpperCase();

  if (["SILVER", "GOLD", "PLATINUM"].includes(plan)) {
    setSelectedPlan(plan);
  }
}, [order]);




  const calculatePauseDays = () => {
    if (!pauseFromDate || !pauseToDate) return 0;

    const from = new Date(pauseFromDate);
    const to = new Date(pauseToDate);

    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  };

  const pauseDays = calculatePauseDays();

  const getResumeDate = () => {
    if (!pauseToDate) return "";
    return new Date(pauseToDate).toLocaleDateString("en-IN");
  };

  const confirmPause = async () => {
    if (!pauseFromDate || !pauseToDate) {
      alert("Please select pause dates.");
      return;
    }

    if (pauseDays <= 0) {
      alert("Invalid pause date selection.");
      return;
    }

    if (pauseDays > 15) {
      alert("Pause duration cannot exceed 15 days.");
      return;
    }

    if (remainingPauseCount === 0) {
      alert("No pauses remaining.");
      return;
    }

    const membershipId = localStorage.getItem("membershipId");

    const res = await fetch("https://api.ryviveroots.com/api/subscription/pause", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId,
        pauseStartDate: pauseFromDate,
        pauseDays,
        pauseToDate,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Subscription paused successfully");
      setShowPauseModal(false);
      window.location.reload();
    } else {
      alert(data.message);
    }
  };

  

 useEffect(() => {
   const fetchDashboard = async () => {
     const membershipId = localStorage.getItem("membershipId");

     if (!membershipId) {
       window.location.replace("/login");
       return;
     }

     try {
       const res = await fetch(
         `https://api.ryviveroots.com/api/user/orders?membershipId=${membershipId}`,
       );

       const data = await res.json();

       if (data.success && data.orders.length > 0) {
         setOrder(data.orders[0]);
       }
     } catch (error) {
       console.error("Dashboard fetch error:", error);
     } finally {
       setLoading(false);
     }
   };

   fetchDashboard(); // initial load

   // ✅ Auto refresh every 30 seconds
   const interval = setInterval(fetchDashboard, 30000);

   return () => clearInterval(interval);
 }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!order) return null;

  const { user, subscription, membershipId } = order;

  // ✅ Pause count per plan
  const PAUSE_COUNT_LIMIT = {
    GOLD: 2,
    PLATINUM: 3,
  };

  // ✅ Max days per pause
  const MAX_PAUSE_DAYS = 15;

  // ✅ Used pauses
  const usedPauseCount = subscription.pause?.history?.length || 0;

  const maxPauseCount = PAUSE_COUNT_LIMIT[subscription.plan] || 0;

  const remainingPauseCount = Math.max(maxPauseCount - usedPauseCount, 0);

  const getSubscriptionStatus = () => {
    const pause = subscription.pause;

    if (!pause || pause.history.length === 0) return "ACTIVE";

    const latestPause = pause.history[pause.history.length - 1];

    const now = new Date();
    const start = new Date(latestPause.startDate);
    const resume = new Date(latestPause.resumeDate);

    if (now < start) {
      return "ACTIVE"; // ⏳ Pause scheduled but not started yet
    }

    if (now >= start && now <= resume) {
      return "PAUSED"; // ⏸ Currently paused
    }

    return "ACTIVE"; // ✅ Pause completed
  };
  const getMaxToDate = () => {
    if (!pauseFromDate) return null;

    const maxDate = new Date(pauseFromDate);
    maxDate.setDate(maxDate.getDate() + 14); // 15 days inclusive
    return maxDate.toISOString().split("T")[0];
  };

  const backendStatus = subscription.status; // UNDER_PROCESS / ACTIVE / EXPIRED
  const pauseStatus = getSubscriptionStatus(); // PAUSED or ACTIVE (pause logic)

  // Final status priority
  const finalStatus =
    backendStatus === "UNDER_PROCESS"
      ? "UNDER_PROCESS"
      : pauseStatus === "PAUSED"
        ? "PAUSED"
        : backendStatus;

  const isLocked = remainingPauseCount === 0 || finalStatus === "UNDER_PROCESS";

  // ✅ Label
  const remainingLabel = isLocked
    ? "No pauses remaining"
    : `${remainingPauseCount} pauses remaining`;
  const latestPause =
    subscription.pause?.history?.length > 0
      ? subscription.pause.history[subscription.pause.history.length - 1]
      : null;

  const pausedUntil = latestPause
    ? new Date(latestPause.resumeDate).toLocaleDateString("en-IN")
    : null;

  const getResumeNextDay = () => {
    if (!pauseToDate) return "";

    const resume = new Date(pauseToDate);
    resume.setDate(resume.getDate() + 1);
    return resume.toLocaleDateString("en-IN");
  };

  const pauseMessage = (() => {
    if (!latestPause) return null;

    const start = new Date(latestPause.startDate);
    const resume = new Date(latestPause.resumeDate);
    const days = latestPause.days || 1;

    if (days === 1) {
      return `⏸ Pause scheduled for ${start.toLocaleDateString(
        "en-IN",
      )}. Service will resume the next day.`;
    }

    return `⏸ Pause scheduled from ${start.toLocaleDateString(
      "en-IN",
    )} to ${resume.toLocaleDateString("en-IN")}`;
  })();

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return 0;

    const diff = new Date(endDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  };
const remainingDays = getRemainingDays(subscription.endDate);

const PAUSE_PER_MONTH = {
  SILVER: 1,
  GOLD: 2,
  PLATINUM: 3,
};

const getDynamicPauseFeature = (plan, duration) => {
  const perMonth = PAUSE_PER_MONTH[plan] || 0;

  // ❌ SILVER 1 MONTH → NO PAUSE
  if (plan === "SILVER" && duration === "1") {
    return "No pause available";
  }

  // ✅ show per month text (your requirement)
  return `${perMonth} pause${perMonth > 1 ? "s" : ""} / month`;
};
const RENEWAL_PRICING = {
  SILVER: {
    "1": { original: 4999, discount: 0, final: 4999 },
    "3": { original: 14997, discount: 998, final: 13999 },
  },
  GOLD: {
    "1": { original: 5999, discount: 0, final: 5999 },
    "3": { original: 17997, discount: 1998, final: 15999 },
  },
  PLATINUM: {
    "1": { original: 6999, discount: 0, final: 6999 },
    "3": { original: 20997, discount: 2100, final: 18897 },
  },
};
const PLAN_ORDER = ["PLATINUM", "GOLD", "SILVER"];


const PLAN_FEATURES = {
SILVER: [
  " Clean Meals",
  " Easy Digestion",
  " Weekly Variety",
  " Functional Juices",
  " No calorie stress",
],

GOLD: [
  " 6 High-protein meals / week",
  " Gut & Skin-Friendly Meals",
  " Advanced energy juices",
  " Boost Energy Levels",
  " Naturally Detoxifying Ingredients",
],

PLATINUM: [
  " Chef’s signature menu",
  " Glow, metabolism & recovery juices",
  " Guilt-Free Wraps & Zoodle Options",
 
  " Elite combinations",
  " Surprise upgrades",
],

};

const handleRenewPayment = async () => {
  try {
   const membershipId = order.membershipId;

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    const planPrices =
      RENEWAL_PRICING[selectedPlan]?.[renewDuration];

    if (!planPrices) return;

   

    const res = await fetch(
      "https://api.ryviveroots.com/api/payment/easebuzz/initiate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  firstname: user.firstName,
  
  email: user.email,
  phone: user.phone,
  plan: `${selectedPlan}_${renewDuration}M`,   // just GOLD / SILVER / PLATINUM
  isRenewal: true,
  membershipId: order.membershipId,  
}),

      }
    );

    const data = await res.json();

    if (!data.success || !data.access_key) {
      alert("Payment initiation failed");
      return;
    }

    // ✅ Correct redirect
    window.location.href =
      `https://pay.easebuzz.in/pay/${data.access_key}`;

  } catch (error) {
    console.error("Renew payment error:", error);
    alert("Something went wrong");
  }
};
 





  return (
  
 <div className="min-h-screen flex bg-[#f6f7f3] px-3 sm:px-6 md:px-20 mt-20 sm:mt-28">

    

      {/* 🌿 Background */}
      <img
        src={Bg}
        alt="Dashboard"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* CONTENT */}
     <div
  className="relative z-10 w-full max-w-3xl
  px-4 sm:px-6 md:px-10
  py-6 sm:py-10
  space-y-5
  mx-auto"
>

{/* ⚠️ RENEWAL WARNING BANNER */}
{remainingDays > 0 && remainingDays <= 25 && (
  <div className="relative z-20 w-full max-w-5xl mx-auto mt-4 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
      bg-white rounded-2xl shadow-lg px-6 py-4 ">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-xl">
          <MdAutorenew />
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            Your subscription is about to expire
          </p>
          <p className="text-sm text-gray-500">
            You have <b>{remainingDays} day{remainingDays > 1 ? "s" : ""}</b> left to renew and continue services.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
       
        <button
         onClick={() => setShowRenewModal(true)}
          className="px-5 py-2 font-fredoka rounded-full bg-[#2c511f] text-white cursor-pointer opacity-90 hover:opacity-100"
        >
          Renew
        </button>
      </div>
    </div>
  </div>
)}


        {/* PROFILE */}
      {active === "profile" && (
  <div className="bg-white/70 rounded-2xl p-4 sm:p-6 shadow">

          <h2 className="text-[#4a7f34]  font-cinzel font-semibold text-lg mb-2">
            MY PROFILE
          </h2>
          <p className=" text-sm lg:text-base  font-roboto">
            <b>Name:</b> {user.firstName} {user.lastName}
          </p>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Email:</b> {user.email}
          </p>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Phone:</b> {user.phone}
          </p>

          <p className="  text-sm lg:text-base font-roboto">
            <b>Membership ID:</b> {membershipId}
          </p>
         </div>
)}


      {/* SUBSCRIPTION + TIMELINE */}
{active === "subscription" && (
  <>
    {/* SUBSCRIPTION */}
    <div className="bg-white/80 rounded-2xl p-4 sm:p-6 shadow">
      <h2 className="text-[#4a7f34] font-cinzel font-semibold text-lg mb-2">
        MY SUBSCRIPTION
      </h2>

      <p className="text-sm lg:text-base font-roboto">
       <b>Plan:</b> RYVIVE {subscription.plan?.replace("_", " ")}


      </p>

      <p className="text-sm lg:text-base font-roboto">
        <b>Amount:</b> ₹{subscription.amount}
      </p>

      <div className="flex text-sm lg:text-base flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <b>
          Status:{" "}
          <span
            className={`font-cinzel font-semibold
              ${
                finalStatus === "UNDER_PROCESS"
                  ? "text-orange-500"
                  : finalStatus === "ACTIVE"
                  ? "text-green-700"
                  : finalStatus === "PAUSED"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
          >
            {finalStatus.replace("_", " ")}
          </span>
        </b>

        {/* 🟢 MODIFICATION BUTTON */}
        {["GOLD", "PLATINUM"].includes(subscription.plan) && (
          <button
            disabled={isLocked}
            onClick={() => !isLocked && setShowPauseModal(true)}
            className={`flex items-center justify-center gap-2 px-5 py-2 text-sm sm:text-base
              rounded-full shadow-lg font-fredoka
              ${
                isLocked
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#2c511f] text-white cursor-pointer opacity-90 hover:opacity-100"
              }`}
          >
            {isLocked ? (
              <>
                <Lock size={16} /> Modify
              </>
            ) : (
              "Modify"
            )}
          </button>
        )}
      </div>

      {["GOLD", "PLATINUM"].includes(subscription.plan) &&
        finalStatus !== "UNDER_PROCESS" && (
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-green-50 rounded-xl px-4 py-3">
            {/* LEFT INFO */}
            <div>
              <p className="text-xs text-gray-500 font-roboto">
                Subscription Modifications
              </p>

              <p
                className={`font-semibold font-cinzel ${
                  isLocked ? "text-red-600" : "text-green-700"
                }`}
              >
                {remainingLabel}
              </p>

              <p className="text-xs text-gray-500 font-roboto">
                Used: {usedPauseCount} / {maxPauseCount} pauses
              </p>
            </div>

            {/* RIGHT STATUS BADGE */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                ${
                  isLocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-200 text-green-800"
                }`}
            >
              {isLocked ? "LIMIT REACHED" : "AVAILABLE"}
            </div>
          </div>
        )}

      {pauseMessage && (
        <p className="text-sm text-orange-600 font-roboto mt-1">
          {pauseMessage}
        </p>
      )}
    </div>

    {/* TIMELINE */}
    <div className="bg-white/90 rounded-2xl p-4 sm:p-6 shadow">
      <h2 className="text-[#4a7f34] font-cinzel font-semibold text-lg mb-2">
        Timeline
      </h2>

      {finalStatus === "UNDER_PROCESS" && (
        <p className="text-sm lg:text-base font-roboto text-orange-400">
          ⏳ Your subscription will be activated within 48 hours following
          confirmation of payment.
        </p>
      )}

      {finalStatus === "ACTIVE" && (
        <>
          <p className="text-sm lg:text-base font-roboto">
            <b>Activation Date:</b>{" "}
            {formatDate(subscription.activationAt)}
          </p>

          <p className="text-sm lg:text-base font-roboto">
            <b>Expiry Date:</b> {formatDate(subscription.endDate)}
          </p>
        </>
      )}

      {finalStatus === "EXPIRED" && (
        <p className="text-sm lg:text-base font-roboto text-gray-500">
          ⚠️ Your subscription has expired.
        </p>
      )}
    </div>
  </>
)}

      </div>

      {/* 🛑 PAUSE MODAL */}
      {/* 🛑 PAUSE MODAL */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-4 sm:p-6 
  w-[95%]  shadow-2xl relative"
          >
            {/* ❌ Close Button */}
            <button
              onClick={() => setShowPauseModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* 🟢 Title */}
            <h2 className="text-lg sm:text-xl font-cinzel font-bold text-[#2c511f] mb-1">
              Pause Subscription
            </h2>
            <p className="text-sm text-gray-500 mb-5 font-roboto">
              Choose when you want to pause and resume your deliveries
            </p>

            {/* 📅 Pause Start Date */}
            {/* 📅 Pause From Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pause From
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={pauseFromDate}
                onChange={(e) => setPauseFromDate(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* 📅 Pause To Date */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pause To
              </label>
              <input
                type="date"
                min={pauseFromDate || new Date().toISOString().split("T")[0]}
                max={getMaxToDate()}
                value={pauseToDate}
                onChange={(e) => setPauseToDate(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* ⏳ Auto Calculated Duration */}
            {pauseDays > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Pause Duration
                </label>
                <div className="w-full border rounded-xl p-3 bg-gray-50 font-semibold text-green-700">
                  {pauseDays} Day{pauseDays > 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* 📆 Summary */}
            {pauseFromDate && pauseToDate && pauseDays > 0 && (
              <div className="bg-green-50 rounded-xl p-4 text-sm font-roboto mb-5">
                <p className="text-gray-700">
                  <b>Pause From:</b>{" "}
                  {new Date(pauseFromDate).toLocaleDateString("en-IN")}
                </p>
                <p className="text-gray-700">
                  <b>Pause To:</b>{" "}
                  {new Date(pauseToDate).toLocaleDateString("en-IN")}
                </p>
                <p className="text-green-700 font-semibold">
                  Service resumes on {getResumeNextDay()}
                </p>
              </div>
            )}

            {/* ✅ Confirm Button */}
            <button
              onClick={confirmPause}
              className="w-full bg-[#2c511f] hover:bg-[#24461a]
                   text-white py-3 rounded-full font-semibold tracking-wide"
            >
              Confirm Pause
            </button>
          </div>
        </div>
      )}


{showRenewModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-3xl p-8 w-full max-w-6xl shadow-2xl relative overflow-y-auto max-h-[95vh]">

      {/* Close Button */}
      <button
        onClick={() => setShowRenewModal(false)}
        className="absolute top-5 right-5 text-gray-400 hover:text-black text-lg"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold font-manrope text-gray-800 mb-1">
        Renew Your Subscription
      </h2>

      <p className="text-sm font-roboto text-gray-500 mb-6">
        Current Plan:{" "}
        <span className="font-semibold text-green-700">
          RYVIVE {subscription.plan}
        </span>
      </p>

    <div className="grid grid-cols-1 gap-8">

        {/* LEFT – PLAN CARDS */}
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {PLAN_ORDER.map((plan) => {
              const prices = RENEWAL_PRICING[plan];
              const isActive = selectedPlan === plan;
              const isPremium = plan === "PLATINUM";

              return (
                <div
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative cursor-pointer rounded-2xl border p-6 transition-all duration-300
                    ${isActive
                      ? "border-green-600 bg-green-50 shadow-xl"
                      : "border-gray-200 bg-white hover:shadow-md"}
                    ${isPremium ? "ring-2 ring-yellow-400" : ""}
                  `}
                >

                  {isPremium && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                      bg-yellow-500 font-merriweather text-center text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-lg font-roboto font-semibold mb-3">
                    Ryvive {plan}
                    {plan === subscription.plan && (
                      <span className="ml-2 text-xs text-green-700">
                        (Current)
                      </span>
                    )}
                  </h3>

                <div className="text-sm mb-5 space-y-4">

<div className="space-y-3">

  {/* 1 Month */}
  <div
    onClick={() => setRenewDuration("1")}
    className={`flex font-manrope justify-between items-center rounded-xl border p-4 cursor-pointer transition
      ${selectedPlan === plan && renewDuration === "1"
        ? "border-green-600 bg-green-50"
        : "border-gray-200 bg-white hover:border-green-300"}
    `}
  >
    <div className="flex items-start gap-3">

      {/* radio */}
      <div
        className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
          ${selectedPlan === plan && renewDuration === "1" ? "border-green-600" : "border-gray-400"}
        `}
      >
        {selectedPlan === plan && renewDuration === "1" && (
          <div className="w-2 h-2 bg-green-600 rounded-full" />
        )}
      </div>

      <div>
        <p className="font-medium text-gray-800">1 Month</p>

        {prices["1"].discount > 0 && (
          <>
            <p className="text-xs line-through text-gray-400">
              ₹{prices["1"].original.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-700 font-medium">
              Save ₹{prices["1"].discount.toLocaleString()}
            </p>
          </>
        )}
      </div>
    </div>

    <p className="font-semibold">
      ₹{prices["1"].final.toLocaleString()}
    </p>
  </div>

  {/* 3 Months */}
  <div
    onClick={() => setRenewDuration("3")}
    className={`relative flex font-manrope justify-between items-center rounded-xl border p-4 cursor-pointer transition
      ${selectedPlan === plan && renewDuration === "3"
        ? "border-green-600 bg-green-50"
        : "border-gray-200 bg-white hover:border-green-300"}
    `}
  >
    {/* badge */}
    <div className="absolute -top-2 left-4 font-fredoka bg-green-600 text-white text-[10px] px-2 py-1 rounded-full">
      SAVE MORE
    </div>

    <div className="flex items-start gap-3">

      {/* radio */}
      <div
        className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
          ${selectedPlan === plan && renewDuration === "3" ? "border-green-600" : "border-gray-400"}
        `}
      >
        {selectedPlan === plan && renewDuration === "3" && (
          <div className="w-2 h-2 bg-green-600 rounded-full" />
        )}
      </div>

      <div>
        <p className="font-semibold text-green-700">3 Months</p>
        <p className="text-xs line-through text-black/90">
          ₹{prices["3"].original.toLocaleString()}
        </p>
        <p className="text-xs text-emerald-700 font-medium">
          Save ₹{prices["3"].discount.toLocaleString()}
        </p>
      </div>
    </div>

    <p className="font-bold text-green-700">
      ₹{prices["3"].final.toLocaleString()}
    </p>
  </div>

</div>

<div className="my-5 flex justify-center">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedPlan(plan);
      setShowSummary(true);
    }}
    className="px-5 py-2 rounded-xl font-roboto font-semibold transition shadow
      bg-green-700 text-white"
  >
    Select & Continue
  </button>
</div>

</div>


                  <div className="text-sm font-roboto space-y-2">
                  {[
  PLAN_FEATURES[plan][0], // first feature

  getDynamicPauseFeature(plan, renewDuration), // ⭐ pause second

  ...PLAN_FEATURES[plan].slice(1) // rest features
].map((feature, i) => (
  <div key={i} className="flex items-start gap-2">
    <span className="text-green-600">•</span>

    <span className={feature.includes("pause") ? "font-semibold text-black" : ""}>
      {feature}
    </span>
  </div>
))}
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT – PRICE SUMMARY */}
        
      </div>
    </div>

)}

{showSummary && selectedPlan && (() => {
  const planPrices = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
  if (!planPrices) return null;

  return (
    <div className="fixed inset-0 font-roboto bg-black/60 flex items-center justify-center z-[60] px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={() => setShowSummary(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-4">
          Renewal Summary — {selectedPlan}
        </h3>

        {/* Duration */}
        <select
          value={renewDuration}
          onChange={(e) => setRenewDuration(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4"
        >
          <option value="1">1 Month</option>
          <option value="3">3 Months (Best Value)</option>
        </select>

        {planPrices.discount > 0 ? (
          <>
            <div className="flex justify-between text-sm mb-1">
              <span>Actual Price</span>
              <span className="line-through">
                ₹{planPrices.original.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm font-semibold text-green-700 mb-1">
              <span>Offer Price</span>
              <span>₹{planPrices.final.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm text-emerald-700 mb-4">
              <span>You Save</span>
              <span>₹{planPrices.discount.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-sm font-semibold mb-4">
            <span>Price</span>
            <span>₹{planPrices.final.toLocaleString()}</span>
          </div>
        )}
       <div className="bg-green-100 rounded-xl p-4 text-sm text-green-900">
  <p className="font-semibold mb-2">🌿 Why Renew Now?</p>

  <ul className="list-disc pl-5 space-y-1">
    <li>Stay consistent — Gaps in your routine can set back your progress</li>
    <li>Keep your savings — Renewal pricing is lower than starting fresh</li>
    <li>Maintain your wellness streak — Continuity is key to real results</li>
    <li>Seamless experience — Pick up right where you left off</li>
  </ul>
</div>

        <button
          onClick={handleRenewPayment}
          className="w-full bg-[#2c511f] text-white py-3 rounded-xl font-semibold"
        >
          Renew Now
        </button>
      </div>
    </div>
  );
})()}



    </div>
  );
};

export default UserDashboard;
