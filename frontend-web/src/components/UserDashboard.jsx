import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      // 🔐 Redirect if not logged in
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

        // 🔐 Token expired / invalid
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.replace("/login");
          return;
        }

        const data = await res.json();

        if (data.success && data.orders.length > 0) {
          setOrder(data.orders[0]); // latest order
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const { user, subscription, membershipId } = order;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* 👤 USER DETAILS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
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

      {/* 📦 SUBSCRIPTION DETAILS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Subscription</h2>
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

      {/* ⏳ EXPIRY */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-2">Subscription Valid Till</h2>
        <p className="text-2xl font-bold text-green-700">
          {new Date(subscription.endDate).toLocaleDateString("en-IN")}
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
