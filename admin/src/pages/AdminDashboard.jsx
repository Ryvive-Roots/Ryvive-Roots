import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [showRenew, setShowRenew] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);

const [duration, setDuration] = useState(1);
const [paymentMethod, setPaymentMethod] = useState("CASH");

const [editData, setEditData] = useState({
  phone: "",
  email: "",
  allergies: "",
  medicalConditions: "",
  remarks: "",
});

const openRenewModal = (order) => {
  setSelectedOrder(order);
  setDuration(1);
  setPaymentMethod("CASH");
  setShowRenew(true);
};


 
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const isTestOrder = (order) => order.isTest === true;


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

  healthInfo: {
    allergies: "",
    medicalConditions: "",
  },

  remarks: "",

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
  },

  address: manualUser.address,

  healthInfo: manualUser.healthInfo,
  remarks: manualUser.remarks,

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

const handleSaveEdit = async (orderId) => {
  try {
    const res = await fetch(
      `https://api.ryviveroots.com/api/admin/order/${orderId}/health`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            phone: editData.phone,
            email: editData.email,
          },
          healthInfo: {
            allergies: editData.allergies,
            medicalConditions: editData.medicalConditions,
          },
          remarks: editData.remarks,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert("✅ Updated successfully");

    setEditingRow(null);
    fetchOrders();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update details");
  }
};

const handleRenew = async () => {
  if (!selectedOrder?.membershipId) {
    alert("Member not selected");
    return;
  }

  try {
    await axios.post("https://api.ryviveroots.com/api/admin/renew", {
      membershipId: selectedOrder.membershipId,
      durationMonths: duration,
      paymentMethod,
    });

    alert("Renewal triggered ✅");
    setShowRenew(false);
    fetchOrders();
  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Renew failed");
  }
};
 
const canShowRenew = (order) => {
  if (!order?.subscription?.endDate) return false;
  if (order.subscription.status !== "ACTIVE") return false;

  const today = new Date();
  const expiry = new Date(order.subscription.endDate);

  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  return diffDays <= 10;
};

const daysLeft = (order) => {
  const today = new Date();
  const expiry = new Date(order.subscription.endDate);

  return Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );
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
              placeholder="Customer Email"
              className="border p-2 w-full rounded"
              value={manualUser.email || ""}
              onChange={(e) =>
                setManualUser({ ...manualUser, email: e.target.value })
              }
            />
            {/* 🩺 HEALTH INFORMATION */}
<textarea
  placeholder="Allergies (if any)"
  className="border p-2 w-full rounded"
  value={manualUser.healthInfo.allergies}
  onChange={(e) =>
    setManualUser({
      ...manualUser,
      healthInfo: {
        ...manualUser.healthInfo,
        allergies: e.target.value,
      },
    })
  }
/>

<textarea
  placeholder="Medical Conditions (if any)"
  className="border p-2 w-full rounded"
  value={manualUser.healthInfo.medicalConditions}
  onChange={(e) =>
    setManualUser({
      ...manualUser,
      healthInfo: {
        ...manualUser.healthInfo,
        medicalConditions: e.target.value,
      },
    })
  }
/>

{/* 📝 REMARKS */}
<textarea
  placeholder="Remarks (Admin notes)"
  className="border p-2 w-full rounded"
  value={manualUser.remarks}
  onChange={(e) =>
    setManualUser({ ...manualUser, remarks: e.target.value })
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
    <div className="hidden md:block rounded-xl border shadow overflow-x-auto">

     <table className="min-w-[1400px] text-sm table-fixed">


          <thead className="bg-gray-100 sticky top-0 z-10">
  <tr>
    {[
      "Membership ID",
      "Personal Details",
      "Plan",
      "Slot",
      "Address",
      "Start",
      "End",
      "Status",
      "Payment",
    ].map((h) => (
      <th
        key={h}
        className="p-3 border text-left whitespace-nowrap font-semibold"
      >
        {h}
      </th>
    ))}
  </tr>
</thead>


          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
               <td className="p-3 border">
  <div className="flex items-center gap-2">
    <span>{order.membershipId}</span>

    {isTestOrder(order) && (
      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-semibold">
        TEST
      </span>
    )}
  </div>
</td>


              <td className="p-3 border text-sm w-[300px] max-w-[300px]">
  <div className="font-semibold">
    {order.user?.firstName} {order.user?.lastName}
  </div>

  <div className="text-xs mt-1">📞 {order.user?.phone}</div>
  <div className="text-xs break-words">
    📧 {order.user?.email || "-"}
  </div>

  {/* TOGGLE BUTTON */}
  <button
    onClick={() =>
      setExpandedRow(expandedRow === order._id ? null : order._id)
    }
    className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
  >
    {expandedRow === order._id ? "▲ Show less" : "▼ Show more"}
  </button>

  {/* EXPANDED CONTENT */}
 {expandedRow === order._id && (
  <div className="mt-2 space-y-2 text-xs">

    {editingRow === order._id ? (
      
      <>
      <input
  type="text"
  className="border p-1 rounded w-full"
  placeholder="Phone"
  value={editData.phone}
  onChange={(e) =>
    setEditData({ ...editData, phone: e.target.value })
  }
/>

<input
  type="email"
  className="border p-1 rounded w-full"
  placeholder="Email"
  value={editData.email}
  onChange={(e) =>
    setEditData({ ...editData, email: e.target.value })
  }
/>

        <textarea
          className="border p-1 rounded w-full"
          placeholder="Allergies"
          value={editData.allergies}
          onChange={(e) =>
            setEditData({ ...editData, allergies: e.target.value })
          }
        />

        <textarea
          className="border p-1 rounded w-full"
          placeholder="Medical Conditions"
          value={editData.medicalConditions}
          onChange={(e) =>
            setEditData({ ...editData, medicalConditions: e.target.value })
          }
        />

        <textarea
          className="border p-1 rounded w-full"
          placeholder="Remarks"
          value={editData.remarks}
          onChange={(e) =>
            setEditData({ ...editData, remarks: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={() => handleSaveEdit(order._id)}
            className="text-green-600 text-xs font-semibold"
          >
            💾 Save
          </button>

          <button
            onClick={() => setEditingRow(null)}
            className="text-gray-500 text-xs"
          >
            ✖ Cancel
          </button>
        </div>
      </>
    ) : (
      <>
      
        <div className="text-red-600">
          Allergies: {order.healthInfo?.allergies || "N/A"}
        </div>

        <div className="text-red-600">
          Medical Conditions: {order.healthInfo?.medicalConditions || "N/A"}
        </div>

        <div className="italic text-gray-600">
          📝 Remarks: {order.remarks || "—"}
        </div>

       <button
  onClick={() => {
    setEditingRow(order._id);
    setEditData({
      phone: order.user?.phone || "",
      email: order.user?.email || "",
      allergies: order.healthInfo?.allergies || "",
      medicalConditions: order.healthInfo?.medicalConditions || "",
      remarks: order.remarks || "",
    });
  }}
  className="text-blue-600 text-xs hover:underline"
>
  ✏️ Edit
</button>

      </>
    )}
  </div>
)}

</td>


                <td className="p-3 border font-semibold text-green-700">
                  {order.subscription?.plan}
                {canShowRenew(order) && (
  <div className="flex items-center gap-2">
    <span className="text-xs text-red-600">
      {daysLeft(order)} days left
    </span>

    <button
      onClick={() => openRenewModal(order)}
      className="px-3 py-1 bg-green-600 text-white rounded"
    >
      Renew
    </button>
  </div>
)}
                </td>

                <td className="p-3 border">{order.deliverySlot}</td>

               <td className="p-3 border text-xs w-[260px] max-w-[260px] break-words">
  {order.address?.house || "-"},
  {order.address?.street || "-"},
  {order.address?.landmark || "-"},
  {order.address?.city || "-"} - 
  <b>{order.address?.pincode || "-"}</b>
</td>


                <td className="p-3 border">
                  {order.subscription?.startDate
                    ? new Date(
                        order.subscription?.startDate
                      ).toLocaleDateString("en-GB")
                    : "-"}
                </td>

                <td className="p-3 border">
                  {order.subscription?.endDate
                    ? new Date(order.subscription?.endDate).toLocaleDateString("en-GB")
                    : "-"}
                </td>
                <td className="px-4 py-2 text-sm font-medium">
                  {getPauseStatusText(order)}
                </td>

                <td className="p-3 border font-semibold">
                  {order.paymentMethod || "CASH"}
                </td>
                <td></td>
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
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {order.user?.firstName} {order.user?.lastName}
        </h3>

        <button
          onClick={() => {
            setEditingRow(order._id);
            setEditData({
              phone: order.user?.phone || "",
              email: order.user?.email || "",
              allergies: order.healthInfo?.allergies || "",
              medicalConditions: order.healthInfo?.medicalConditions || "",
              remarks: order.remarks || "",
            });
          }}
          className="text-xs text-blue-600 underline"
        >
          ✏️ Edit
        </button>
      </div>

      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
        {order.subscription?.plan}
      </span>

      <p>
        <b>ID:</b> {order.membershipId}{" "}
        {isTestOrder(order) && (
          <span className="inline-block text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold">
            🧪 TEST MODE
          </span>
        )}
      </p>

      {/* PHONE */}
      {editingRow === order._id ? (
        <input
          className="border p-2 w-full rounded text-sm"
          value={editData.phone}
          onChange={(e) =>
            setEditData({ ...editData, phone: e.target.value })
          }
        />
      ) : (
        <p>
          <b>📞 Phone:</b> {order.user?.phone}
        </p>
      )}

      {/* EMAIL */}
      {editingRow === order._id ? (
        <input
          className="border p-2 w-full rounded text-sm"
          value={editData.email}
          onChange={(e) =>
            setEditData({ ...editData, email: e.target.value })
          }
        />
      ) : (
        <p className="text-sm break-all">
          <b>📧 Email:</b> {order.user?.email || "-"}
        </p>
      )}

      {/* ALLERGIES */}
      {editingRow === order._id ? (
        <textarea
          className="border p-2 w-full rounded text-sm"
          placeholder="Allergies"
          value={editData.allergies}
          onChange={(e) =>
            setEditData({ ...editData, allergies: e.target.value })
          }
        />
      ) : (
        <p className="text-sm text-red-600">
          <b> Allergies:</b> {order.healthInfo?.allergies || "N/A"}
        </p>
      )}

      {/* MEDICAL */}
      {editingRow === order._id ? (
        <textarea
          className="border p-2 w-full rounded text-sm"
          placeholder="Medical Conditions"
          value={editData.medicalConditions}
          onChange={(e) =>
            setEditData({
              ...editData,
              medicalConditions: e.target.value,
            })
          }
        />
      ) : (
        <p className="text-sm text-red-600">
          <b> Medical:</b>{" "}
          {order.healthInfo?.medicalConditions || "N/A"}
        </p>
      )}

      {/* REMARKS */}
      {editingRow === order._id ? (
        <textarea
          className="border p-2 w-full rounded text-sm"
          placeholder="Remarks"
          value={editData.remarks}
          onChange={(e) =>
            setEditData({ ...editData, remarks: e.target.value })
          }
        />
      ) : (
        <p className="text-sm italic text-gray-600">
          <b>📝 Remarks:</b> {order.remarks || "—"}
        </p>
      )}

      <p>
        <b>⏰ Slot:</b> {order.deliverySlot}
      </p>

      <p className="text-sm">
        <span className="font-bold text-black"> Address : </span>
        {order.address?.house || "-"},
        {order.address?.street || "-"},
        {order.address?.landmark || "-"},
        {order.address?.city || "-"} -{" "}
        <b>{order.address?.pincode || "-"}</b>

      </p>
  {canShowRenew(order) && (
  <div className="flex items-center gap-2">
    <span className="text-xs font-semibold text-red-600">
      {daysLeft(order)} days left
    </span>

    <button
      onClick={() => openRenewModal(order)}
      className="px-3 py-1 bg-green-600 text-white rounded"
    >
      Renew
    </button>
  </div>
)}
      <div className="flex justify-between text-sm">
        <span>
          <b>Start:</b>{" "}
          {order.subscription?.startDate
            ? new Date(order.subscription.startDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
        <span>
          <b>End:</b>{" "}
          {order.subscription?.endDate
            ? new Date(order.subscription.endDate).toLocaleDateString("en-GB")
            : "-"}
        </span>
        <span
          className={
            getPauseStatusText(order).includes("PAUSED")
              ? "text-orange-600"
              : getPauseStatusText(order).includes("UNDER PROCESS")
              ? "text-yellow-600"
              : "text-green-700"
          }
        >
          {getPauseStatusText(order)}
        </span>
      </div>

      <div className="text-right font-semibold text-green-700">
        <span className="font-bold text-black"> Payment Mode : </span>{" "}
        {order.paymentMethod || "CASH"}
      </div>

      {/* SAVE / CANCEL */}
      {editingRow === order._id && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleSaveEdit(order._id)}
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Save
          </button>
          <button
            onClick={() => setEditingRow(null)}
            className="border px-4 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  ))}
</div>


{showRenew && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[400px]">

      <h2 className="text-lg font-semibold mb-4">
        Renew Member
      </h2>

      {/* Duration */}
      <label className="block mb-2 text-sm">Duration</label>
      <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full border rounded p-2 mb-4"
      >
        <option value={1}>1 Month</option>
        <option value={3}>3 Months</option>
      </select>

      {/* Payment method */}
      <label className="block mb-2 text-sm">Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full border rounded p-2 mb-6"
      >
        <option value="CASH">Cash</option>
        <option value="ONLINE">Online</option>
      </select>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowRenew(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleRenew}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Confirm Renew
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
