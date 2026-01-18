import React, { useEffect, useState } from "react";
import Bg from "../assets/dashboard_Img.png";
import { Lock } from "lucide-react";


const UserDashboard = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseFromDate, setPauseFromDate] = useState("");
  const [pauseToDate, setPauseToDate] = useState("");

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

    const res = await fetch("http://localhost:4000/api/subscription/pause", {
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
         `http://localhost:4000/api/user/orders?membershipId=${membershipId}`,
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

          {["GOLD", "PLATINUM"].includes(subscription.plan) &&
            finalStatus !== "UNDER_PROCESS" && (
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
                    Used: {usedPauseCount} / {maxPauseCount} pauses
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
        {/* PLAN DATES */}
        <div className="bg-white/90 rounded-2xl p-4 sm:p-6 shadow">
          <h2 className="text-[#4a7f34] font-cinzel font-semibold text-lg mb-2">
            SUBSCRIPTION
          </h2>

          {/* UNDER PROCESS */}
          {finalStatus === "UNDER_PROCESS" && (
            <p className="text-sm lg:text-base font-roboto text-orange-400">
              ⏳ Your subscription will be activated within 48 hours following
              confirmation of payment.
            </p>
          )}

          {/* ACTIVE */}
          {finalStatus === "ACTIVE" && (
            <>
              <p className="text-sm lg:text-base font-roboto">
                <b>Activation Date:</b> {formatDate(subscription.activationAt)}
              </p>

              <p className="text-sm lg:text-base font-roboto">
                <b>Expiry Date:</b> {formatDate(subscription.endDate)}
              </p>

             
            </>
          )}

          {/* EXPIRED */}
          {finalStatus === "EXPIRED" && (
            <p className="text-sm lg:text-base font-roboto text-gray-500">
              ⚠️ Your subscription has expired.
            </p>
          )}
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
    </div>
  );
};;;

export default UserDashboard;
