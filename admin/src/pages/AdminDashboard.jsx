import React, { useEffect, useState } from "react";

const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  {
    code: "421202",
    area: "Dombivli West",
  },
  { code: "421203", area: "Dombivli East" },
  { code: "421204", area: "Khoni" },
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);


  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [manualUser, setManualUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    plan: "",
    slot: "",
    paymentMethod: "CASH", 
    address: {
      pincode: "",
      area: "",
      house: "",
      street: "",
      landmark: "",
      city: "Dombivli",
      state: "Maharashtra",
      country: "India",
    },
  });

  // Fetch Orders
  const fetchOrders = async () => {
    const res = await fetch("https://api.ryviveroots.com/api/admin/orders");
    const data = await res.json();
    if (data.success) setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

 const handleManualSubmit = async () => {
  if (saving) return; // 🛑 prevent double click

  if (
    !manualUser.firstName ||
    !manualUser.phone ||
    !manualUser.plan ||
    !manualUser.slot ||
    !manualUser.address.pincode
  ) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
    user: {
      firstName: manualUser.firstName,
      lastName: manualUser.lastName,
      phone: manualUser.phone,
      email: manualUser.email,
      address: manualUser.address,
    },
    plan: manualUser.plan,
    slot: manualUser.slot,
    paymentMethod: manualUser.paymentMethod,
  };

  try {
    setSaving(true); // 🔒 lock button

    const res = await fetch(
      "https://api.ryviveroots.com/api/admin/manual-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add member");
    }

    if (data.success) {
      alert("✅ Member added successfully!");
      setShowForm(false);
      resetForm();
      fetchOrders();
    } else {
      alert(data.message || "❌ Failed to add member");
    }
  } catch (error) {
    console.error("Manual order error:", error);
    alert(error.message || "❌ Server error. Please try again.");
  } finally {
    setSaving(false); // 🔓 unlock button
  }
};


  // 🔍 Search + Filter
  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();

    const matchesSearch =
      order.membershipId?.toLowerCase().includes(text) ||
      `${order.user?.firstName} ${order.user?.lastName}`
        .toLowerCase()
        .includes(text) ||
      order.user?.phone?.includes(text);

    const matchesPlan =
      filterPlan === "ALL" || order.subscription?.plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  if (loading) return <p className="p-6">Loading orders...</p>;

 const getPauseStatusText = (order) => {
  // 🟡 UNDER PROCESS CHECK (ADD THIS)
  if (order.subscription?.status === "UNDER_PROCESS") {
    return "🟡 UNDER PROCESS";
  }

  const pause = order.subscription?.pause;

  if (!pause || !pause.history || pause.history.length === 0) {
    return "🟢 ACTIVE";
  }

  const latest = pause.history[pause.history.length - 1];

  const start = new Date(latest.startDate);
  const resume = new Date(latest.resumeDate);
  const days = latest.days || 1;
  const today = new Date();

  const startText = start.toLocaleDateString("en-IN");
  const resumeText = resume.toLocaleDateString("en-IN");

  // 🟠 CURRENTLY PAUSED
  if (today >= start && today <= resume) {
    if (days === 1) {
      return `⏸ PAUSED • ${startText} (1 day)`;
    }
    return `⏸ PAUSED • ${startText} → ${resumeText}`;
  }

  // 🔵 PAUSE SCHEDULED (FUTURE)
  if (today < start) {
    if (days === 1) {
      return `🟢 ACTIVE • ⏳ Pause scheduled ${startText} (1 day)`;
    }
    return `🟢 ACTIVE • ⏳ Pause scheduled ${startText} → ${resumeText}`;
  }

  // 🟢 PAST PAUSE FINISHED
  return "🟢 ACTIVE";
};


 


  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* ✅ HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Total Members: {filteredOrders.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            ➕ Add Walk-in Member
          </button>

          <input
            placeholder="🔍 Search name / phone / ID"
            className="border px-3 py-2 rounded text-sm w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded text-sm"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="ALL">All Plans</option>
            <option value="SILVER">SILVER</option>
            <option value="GOLD">GOLD</option>
            <option value="PLATINUM">PLATINUM</option>
          </select>

          <button
            onClick={fetchOrders}
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ➕ ADD WALK-IN MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg w-full max-w-md space-y-3 overflow-y-auto max-h-[90vh]">
            <h2 className="font-semibold text-lg">Add Walk-in Member</h2>

            <input
              placeholder="First Name"
              className="border p-2 w-full rounded"
              value={manualUser.firstName}
              onChange={(e) =>
                setManualUser({ ...manualUser, firstName: e.target.value })
              }
            />

            <input
              placeholder="Last Name"
              className="border p-2 w-full rounded"
              value={manualUser.lastName}
              onChange={(e) =>
                setManualUser({ ...manualUser, lastName: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              className="border p-2 w-full rounded"
              value={manualUser.phone}
              onChange={(e) =>
                setManualUser({ ...manualUser, phone: e.target.value })
              }
            />
            <input
              placeholder="Customer Email (optional)"
              className="border p-2 w-full rounded"
              value={manualUser.email || ""}
              onChange={(e) =>
                setManualUser({ ...manualUser, email: e.target.value })
              }
            />

            {/* PLAN */}
            <select
              className="border p-2 w-full rounded"
              value={manualUser.plan}
              onChange={(e) =>
                setManualUser({ ...manualUser, plan: e.target.value })
              }
            >
              <option value="">Select Plan</option>
              <option>SILVER</option>
              <option>GOLD</option>
              <option>PLATINUM</option>
            </select>

            {/* SLOT */}
            {/* ⏰ DELIVERY SLOT */}
            <select
              className="border p-2 w-full rounded"
              value={manualUser.slot}
              onChange={(e) =>
                setManualUser({ ...manualUser, slot: e.target.value })
              }
            >
              <option value="">Select Delivery Slot</option>

              <optgroup label="🌅 Morning Slot">
                <option value="Morning - 08:00 – 09:00 AM">
                  08:00 – 09:00 AM
                </option>
                <option value="Morning - 09:00 – 10:00 AM">
                  09:00 – 10:00 AM
                </option>
                <option value="Morning - 10:00 – 11:00 AM">
                  10:00 – 11:00 AM
                </option>
              </optgroup>

              <optgroup label="🌙 Evening Slot">
                <option value="Evening - 05:00 – 06:00 PM">
                  05:00 – 06:00 PM
                </option>
                <option value="Evening - 06:00 – 07:00 PM">
                  06:00 – 07:00 PM
                </option>
                <option value="Evening - 07:00 – 08:00 PM">
                  07:00 – 08:00 PM
                </option>
                <option value="Evening - 08:00 – 09:00 PM">
                  08:00 – 09:00 PM
                </option>
              </optgroup>
            </select>

            {/* 💳 PAYMENT METHOD */}
<select
  className="border p-2 w-full rounded"
  value={manualUser.paymentMethod}
  onChange={(e) =>
    setManualUser({ ...manualUser, paymentMethod: e.target.value })
  }
>
  <option value="CASH"> Cash</option>
 <option value="ONLINE">Online</option>
</select>


            {/* 📍 ADDRESS */}
            <div className="border rounded p-2 space-y-2 bg-gray-50">
              {/* PINCODE */}
              <select
                className="border p-2 w-full rounded"
                value={manualUser.address.pincode}
                onChange={(e) => {
                  const selected = allowedPincodes.find(
                    (p) => p.code === e.target.value
                  );

                  setManualUser({
                    ...manualUser,
                    address: {
                      ...manualUser.address,
                      pincode: e.target.value,
                      area: selected?.area || "",
                    },
                  });
                }}
              >
                <option value="">Select Pincode</option>
                {allowedPincodes.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.area}
                  </option>
                ))}
              </select>

              {/* AREA */}
              <input
                value={manualUser.address.area}
                readOnly
                className="border p-2 w-full rounded bg-gray-100"
                placeholder="Area"
              />

              {/* HOUSE */}
              <input
                placeholder="House / Flat"
                className="border p-2 w-full rounded"
                value={manualUser.address.house}
                onChange={(e) =>
                  setManualUser({
                    ...manualUser,
                    address: { ...manualUser.address, house: e.target.value },
                  })
                }
              />

              {/* STREET */}
              <input
                placeholder="Street / Area"
                className="border p-2 w-full rounded"
                value={manualUser.address.street}
                onChange={(e) =>
                  setManualUser({
                    ...manualUser,
                    address: { ...manualUser.address, street: e.target.value },
                  })
                }
              />

              {/* LANDMARK */}
              <input
                placeholder="Landmark (Optional)"
                className="border p-2 w-full rounded"
                value={manualUser.address.landmark}
                onChange={(e) =>
                  setManualUser({
                    ...manualUser,
                    address: {
                      ...manualUser.address,
                      landmark: e.target.value,
                    },
                  })
                }
              />

              {/* CITY */}
              <input
                value="Dombivli"
                readOnly
                className="border p-2 w-full rounded bg-gray-100"
              />

              {/* STATE */}
              <input
                value="Maharashtra"
                readOnly
                className="border p-2 w-full rounded bg-gray-100"
              />

              {/* COUNTRY */}
              <input
                value="India"
                readOnly
                className="border p-2 w-full rounded bg-gray-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

             <button
  onClick={handleManualSubmit}
  disabled={saving}
  className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
>
  {saving ? "Saving..." : "Save"}
</button>

            </div>
          </div>
        </div>
      )}

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-xl border shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Membership ID",
                "Name",
                "Phone",
                "email",
                "Plan",
                "Slot",
                "Address",
                "Start",
                "End",
                "Status",
                "Payment",
              ].map((h) => (
                <th key={h} className="p-3 border text-left whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="p-3 border">{order.membershipId}</td>

                <td className="p-3 border font-medium">
                  {order.user?.firstName} {order.user?.lastName}
                </td>

                <td className="p-3 border">{order.user?.phone}</td>

                <td className="p-3 border text-sm break-all">
                  {order.user?.email || "-"}
                </td>

                <td className="p-3 border font-semibold text-green-700">
                  {order.subscription?.plan}
                </td>

                <td className="p-3 border">{order.deliverySlot}</td>

                <td className="p-3 border text-xs">
                  {order.address?.house || "-"},{order.address?.street || "-"},
                  {order.address?.landmark || "-"},{order.address?.city || "-"}{" "}
                  - <b>{order.address?.pincode || "-"}</b>
                </td>

                <td className="p-3 border">
                  {order.subscription?.startDate
                    ? new Date(
                        order.subscription?.startDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 border">
                  {order.subscription?.endDate
                    ? new Date(order.subscription?.endDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 text-sm font-medium">
                  {getPauseStatusText(order)}
                </td>

                <td className="p-3 border font-semibold">
                  {order.paymentMethod || "CASH"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE CARD VIEW */}
      <div className="grid gap-4 md:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {order.user?.firstName} {order.user?.lastName}
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {order.subscription?.plan}
              </span>
            </div>

            <p>
              <b>ID:</b> {order.membershipId}
            </p>
            <p>
              <b>📞 Phone:</b> {order.user?.phone}
            </p>
            <p className="text-sm break-all">
              <b>📧 Email:</b> {order.user?.email || "-"}
            </p>

            <p>
              <b>⏰ Slot:</b> {order.deliverySlot}
            </p>

            <p className="text-sm">
              {order.address?.house || "-"},{order.address?.street || "-"},
              {order.address?.landmark || "-"},{order.address?.city || "-"} -{" "}
              <b>{order.address?.pincode || "-"}</b>
            </p>

            <div className="flex justify-between text-sm">
              <span>
                <b>Start:</b>{" "}
                {order.subscription?.startDate
                  ? new Date(order.subscription.startDate).toLocaleDateString()
                  : "-"}
              </span>
              <span>
                <b>End:</b>{" "}
                {order.subscription?.endDate
                  ? new Date(order.subscription.endDate).toLocaleDateString()
                  : "-"}
              </span>
              <div className="text-sm font-medium">
                {getPauseStatusText(order).includes("PAUSED") ? (
                  <span className="text-orange-600">
                    {getPauseStatusText(order)}
                  </span>
                ) : (
                  <span className="text-green-700">ACTIVE</span>
                )}
              </div>
            </div>

            <div className="text-right font-semibold text-green-700">
              💳 {order.paymentMethod || "CASH"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
