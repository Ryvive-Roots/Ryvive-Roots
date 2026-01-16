import React, { useEffect, useState } from "react";
import Bg from "../assets/dashboard_Img.png";
import { Lock } from "lucide-react";


const UserDashboard = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseDays, setPauseDays] = useState(1);

  const getResumeDate = () => {
    if (!pauseStartDate) return "";

    const resume = new Date(pauseStartDate);
    resume.setDate(resume.getDate() + pauseDays);

    return resume.toLocaleDateString("en-IN");
  };

  const confirmPause = async () => {
    const membershipId = localStorage.getItem("membershipId");

    const res = await fetch("http://localhost:4000/api/subscription/pause", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        membershipId,
        pauseStartDate,
        pauseDays,
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
          `http://localhost:4000/api/user/orders?membershipId=${membershipId}`
        );

        const data = await res.json();

        if (data.success && data.orders.length > 0) {
          setOrder(data.orders[0]);
        } else {
          alert("No active subscription found");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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

  // ✅ Pause limits per plan
  // ✅ Max pause days allowed per plan
  const PAUSE_DAYS_LIMIT = {
    GOLD: 2, // 2 days pause allowed
    PLATINUM: 3, // 3 days pause allowed
  };

  // ✅ Calculate used pause days
 const usedPauseDays =
   subscription.pause?.history?.reduce(
     (total, item) => total + Number(item.days || 0),
     0
   ) || 0;

 const maxPauseDays = PAUSE_DAYS_LIMIT[subscription.plan] || 0;

 // ✅ Prevent UI overflow
 const safeUsedDays = Math.min(usedPauseDays, maxPauseDays);

 const remainingPauseDays = Math.max(maxPauseDays - safeUsedDays, 0);


  // ✅ Lock condition
  const isLocked = remainingPauseDays === 0;

  // ✅ Friendly label text
  const remainingLabel =
    remainingPauseDays === 0
      ? "No pause remaining"
      : remainingPauseDays === 1
      ? "1 pause remaining"
      : `${remainingPauseDays} Pauses`;

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

  const dynamicStatus = getSubscriptionStatus();

  const latestPause =
    subscription.pause?.history?.length > 0
      ? subscription.pause.history[subscription.pause.history.length - 1]
      : null;

  const pausedUntil = latestPause
    ? new Date(latestPause.resumeDate).toLocaleDateString("en-IN")
    : null;

  const pauseMessage = (() => {
    if (!latestPause) return null;

    const start = new Date(latestPause.startDate);
    const resume = new Date(latestPause.resumeDate);
    const days = latestPause.days || 1;

    if (days === 1) {
      return `⏸ Pause scheduled for ${start.toLocaleDateString(
        "en-IN"
      )}. Service will resume the next day.`;
    }

    return `⏸ Pause scheduled from ${start.toLocaleDateString(
      "en-IN"
    )} to ${resume.toLocaleDateString("en-IN")}`;
  })();

  return (
    <div className="relative min-h-screen px-6 md:px-20 mt-28 ">
      {/* 🌿 Background */}
      <img
        src={Bg}
        alt="Dashboard"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* CONTENT */}
      <div
        className="relative z-10 max-w-3xl
  px-4 sm:px-6 md:px-10
  py-6 sm:py-10
  space-y-5
  mx-0 sm:mx-auto lg:ml-16 xl:ml-24"
      >
        {/* PROFILE */}
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

        {/* SUBSCRIPTION */}
        <div className="bg-white/80 rounded-2xl p-4 sm:p-6 shadow">
          <h2 className="text-[#4a7f34] font-cinzel font-semibold text-lg mb-2">
            MY SUBSCRIPTION
          </h2>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Plan:</b> {subscription.plan}
          </p>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Amount:</b> ₹{subscription.amount}
          </p>
          <div className="flex  text-sm lg:text-base flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <b>
              Status:{" "}
              <span className="text-[#24461a] font-cinzel font-semibold">
                {dynamicStatus}
              </span>
            </b>{" "}
            {/* 🟢 MODIFICATION BUTTON (IMAGE STYLE) */}
            {["GOLD", "PLATINUM"].includes(subscription.plan) && (
              <button
                disabled={isLocked}
                onClick={() => !isLocked && setShowPauseModal(true)}
                className={`
      flex items-center justify-center gap-2 px-5 py-2 text-sm sm:text-base
 rounded-full shadow-lg font-fredoka
      ${
        isLocked
          ? "bg-gray-400 cursor-not-allowed opacity-70"
          : "bg-[#2c511f] text-white cursor-pointer opacity-90 hover:opacity-100"
      }
    `}
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

          {["GOLD", "PLATINUM"].includes(subscription.plan) && (
            <div
              className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between 
  gap-3 bg-green-50 rounded-xl px-4 py-3"
            >
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
                  Used: {safeUsedDays} / {maxPauseDays} pauses
                </p>
              </div>

              {/* RIGHT STATUS BADGE */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
      ${isLocked ? "bg-red-100 text-red-700" : "bg-green-200 text-green-800"}`}
              >
                {isLocked ? "LIMIT REACHED" : "AVAILABLE"}
              </div>
            </div>
          )}

          <div>
            {pauseMessage && (
              <p className="text-sm text-orange-600 font-roboto mt-1">
                {pauseMessage}
              </p>
            )}
          </div>
        </div>

        {/* PLAN DATES */}
        <div className="bg-white/80 rounded-2xl p-4 sm:p-6 shadow">
          <h2 className="text-[#4a7f34] font-cinzel font-semibold text-lg mb-2">
            SUBSCRIPTION
          </h2>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Activation Date:</b>{" "}
            {new Date(subscription.startDate).toLocaleDateString("en-IN")}
          </p>
          <p className="  text-sm lg:text-base font-roboto">
            <b>Expiry Date:</b>{" "}
            {new Date(subscription.endDate).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* 🛑 PAUSE MODAL */}
      {/* 🛑 PAUSE MODAL */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-4 sm:p-6 
  w-[95%] max-w-md shadow-2xl relative"
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
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pause Start Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={pauseStartDate}
                onChange={(e) => setPauseStartDate(e.target.value)}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* ⏳ Pause Duration */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pause Duration
              </label>
              <select
                value={pauseDays}
                onChange={(e) => setPauseDays(Number(e.target.value))}
                className="w-full border rounded-xl p-3 font-roboto focus:ring-2 focus:ring-green-600"
              >
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
              </select>
            </div>

            {/* 📆 Summary */}
            {pauseStartDate && (
              <div className="bg-green-50 rounded-xl p-4 text-sm font-roboto mb-5">
                <p className="text-gray-700">
                  <b>Pause On:</b>{" "}
                  {new Date(pauseStartDate).toLocaleDateString("en-IN")}
                </p>
                <p className="text-green-700 font-semibold">
                  <b>Resume On:</b> {getResumeDate()}
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
    </div>
  );
};

export default UserDashboard;
