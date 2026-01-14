import React, { useEffect, useState } from "react";
import Bg from "../assets/dashboard_Img.png";

const UserDashboard = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Pause states
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseDays, setPauseDays] = useState(1);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.replace("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.replace("/login");
          return;
        }

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

    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  // 🛑 Pause Plan API
  const pausePlan = async () => {
    if (!pauseStartDate) {
      alert("Please select pause start date");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:4000/api/subscription/pause", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pauseStartDate,
          pauseDays,
        }),
      });

      const data = await res.json();
      alert(data.message);
      setShowPauseModal(false);
      window.location.reload();
    } catch (error) {
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!order) return null;

  const { user, subscription, membershipId } = order;

  return (
    <div className="relative mt-50 min-h-screen">
      {/* 🌄 Background */}
      <img
        src={Bg}
        alt="Dashboard Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-5xl mx-auto p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6  max-w-md">
          {/* 👤 Profile */}
          <div className="bg-white/90 text-black rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-3">My Profile</h2>
            <p>
              <b>Name:</b> {user.firstName} {user.lastName}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
            <p>
              <b>Phone:</b> {user.phone}
            </p>
            <p>
              <b>Membership ID:</b> {membershipId}
            </p>
          </div>

          {/* 📦 Subscription */}
          <div className="bg-white/90 text-black rounded-2xl shadow p-5">
            <h2 className="text-lg font-semibold mb-2">My Subscription</h2>

            {["Gold", "Platinum"].includes(subscription.plan) && (
              <button
                onClick={() => setShowPauseModal(true)}
                className="mb-3 bg-orange-500 hover:bg-orange-600
                           text-white text-sm px-3 py-1 rounded-lg"
              >
                Modify / Pause Plan
              </button>
            )}

            <p>
              <b>Plan:</b> {subscription.plan}
            </p>
            <p>
              <b>Amount:</b> ₹{subscription.amount}
            </p>
            <p>
              <b>Status:</b>
              <span className="text-green-600 ml-1">{subscription.status}</span>
            </p>
          </div>

          {/* ⏳ Plan Dates */}
          <div className="bg-green-50 rounded-2xl p-5 text-black">
            <h2 className="text-lg font-semibold mb-2">
              Subscription Plan Details
            </h2>
            <p className="font-semibold text-green-700">
              Start:{" "}
              {new Date(subscription.startDate).toLocaleDateString("en-IN")}
            </p>
            <p className="font-semibold text-green-700">
              End: {new Date(subscription.endDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* 🗓️ Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-black">
            <h2 className="text-lg font-bold mb-4">Pause Subscription</h2>

            <label className="text-sm font-semibold">Pause Start Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={pauseStartDate}
              onChange={(e) => setPauseStartDate(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 mb-4"
            />

            <label className="text-sm font-semibold">Pause Days</label>
            <select
              value={pauseDays}
              onChange={(e) => setPauseDays(Number(e.target.value))}
              className="w-full border rounded-lg p-2 mt-1 mb-4"
            >
              {subscription.plan === "Gold" && (
                <>
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                </>
              )}
              {subscription.plan === "Platinum" && (
                <>
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                </>
              )}
            </select>

            {pauseStartDate && (
              <p className="text-sm mb-4">
                <b>Paused Till:</b>{" "}
                {new Date(
                  new Date(pauseStartDate).getTime() +
                    pauseDays * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-IN")}
              </p>
            )}

            <button
              onClick={pausePlan}
              className="w-full bg-green-600 hover:bg-green-700
                         text-white py-2 rounded-lg"
            >
              Confirm Pause
            </button>

            <button
              onClick={() => setShowPauseModal(false)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
