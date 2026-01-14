import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [manualUser, setManualUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    plan: "SILVER",
    slot: "",
  });


  // Fetch Orders
  const fetchOrders = async () => {
    const res = await fetch("http://localhost:4000/api/admin/orders");
    const data = await res.json();
    if (data.success) setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Manual submit
  const handleManualSubmit = async () => {
    const res = await fetch("http://localhost:4000/api/admin/manual-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: manualUser,
        plan: manualUser.plan,
        slot: manualUser.slot,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Member added successfully!");
      setShowForm(false);
      setManualUser({
        firstName: "",
        lastName: "",
        phone: "",
        plan: "SILVER",
      });
      fetchOrders();
    } else {
      alert(data.message || "Failed to add member");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        ➕ Add Walk-in Member
      </button>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Add Walk-in Member</h2>

            <input
              placeholder="First Name"
              className="border p-2 w-full"
              value={manualUser.firstName}
              onChange={(e) =>
                setManualUser({
                  ...manualUser,
                  firstName: e.target.value,
                })
              }
            />

            <input
              placeholder="Last Name"
              className="border p-2 w-full"
              value={manualUser.lastName}
              onChange={(e) =>
                setManualUser({
                  ...manualUser,
                  lastName: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              className="border p-2 w-full"
              value={manualUser.phone}
              onChange={(e) =>
                setManualUser({
                  ...manualUser,
                  phone: e.target.value,
                })
              }
            />

            {/* SLOT SELECTION */}
            <select
              className="border p-2 w-full"
              value={manualUser.slot}
              onChange={(e) =>
                setManualUser({
                  ...manualUser,
                  slot: e.target.value,
                })
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

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleManualSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Membership ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">DOB</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Plan</th>
              <th className="p-3 border">Slot</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Payment Method</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="p-3 border">{order.membershipId}</td>

                <td className="p-3 border">
                  {order.user?.firstName} {order.user?.lastName}
                </td>

                <td className="p-3 border">
                  {order.user?.dob
                    ? new Date(order.user.dob).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="p-3 border">{order.user?.phone || "N/A"}</td>

                {/* ✅ FIXED PLAN */}
                <td className="p-3 border">
                  {order.subscription?.plan || "N/A"}
                </td>

                {/* ✅ FIXED SLOT */}
                <td className="p-3 border">
                  {order.deliverySlot || "WALK-IN"}
                </td>

                {/* ✅ FIXED STATUS */}
                <td className="p-3 border font-semibold">
                  {order.subscription?.status || "ACTIVE"}
                </td>
                <td className="p-3 border">{order.paymentMethod || "CASH"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
