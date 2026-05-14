import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Plus, Lock, Eye, Edit, Clock, Activity, Search, X, Send } from 'lucide-react';
import axios from 'axios';

const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  { code: "421202", area: "Dombivli West" },
  { code: "421203", area: "Dombivli East" },
  { code: "421204", area: "Khoni" },
  { code: "421301", area: "Kalyan" },
];

export default function RyviveAdminDashboard() {
  const [activeView, setActiveView] = useState('customers');
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showIndividualMessage, setShowIndividualMessage] = useState(false);
  const [showRenew, setShowRenew] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [passkeyAction, setPasskeyAction] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [individualMessage, setIndividualMessage] = useState('');


  // Renew state
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [renewStartDate, setRenewStartDate] = useState("");
  const [renewPrice, setRenewPrice] = useState("");

  // Edit state
  const [editData, setEditData] = useState({
    firstName: "", lastName: "", phone: "", email: "", dob: "",
    allergies: "", medicalConditions: "", remarks: "",
    house: "", street: "", landmark: "", city: "",
  });

  // Create customer state
  const [manualUser, setManualUser] = useState({
    firstName: "", lastName: "", phone: "", email: "", dob: "",
    totalPrice: "", plan: "", slot: "", paymentMethod: "CASH", startDate: "",
    healthInfo: { allergies: "", medicalConditions: "" },
    remarks: "",
    address: { pincode: "", area: "", house: "", street: "", landmark: "", city: "Dombivli", state: "Maharashtra", country: "India" },
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/";
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const getPauseStatusText = (order) => {
    if (order.subscription?.status === "EXPIRED") return "🔴 EXPIRED";
    if (order.subscription?.status === "UNDER_PROCESS") return "🟡 UNDER PROCESS";
    const pause = order.subscription?.pause;
    if (!pause?.history?.length) return "🟢 ACTIVE";
    const latest = pause.history[pause.history.length - 1];
    const start = new Date(latest.startDate);
    const resume = new Date(latest.resumeDate);
    const days = latest.days || 1;
    const today = new Date();
    const startText = start.toLocaleDateString("en-IN");
    const resumeText = resume.toLocaleDateString("en-IN");
    if (today >= start && today <= resume) {
      return days === 1 ? `⏸ PAUSED • ${startText} (1 day)` : `⏸ PAUSED • ${startText} → ${resumeText}`;
    }
    if (today < start) {
      return days === 1 ? `🟢 ACTIVE • ⏳ Pause scheduled ${startText} (1 day)` : `🟢 ACTIVE • ⏳ Pause scheduled ${startText} → ${resumeText}`;
    }
    return "🟢 ACTIVE";
  };

  const canShowRenew = (order) => {
    if (!order?.subscription?.endDate) return false;
    const today = new Date();
    const expiry = new Date(order.subscription.endDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 10 || order.subscription.status === "EXPIRED";
  };

  const daysLeft = (order) => {
    const today = new Date();
    const expiry = new Date(order.subscription.endDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const handleSaveEdit = async (orderId) => {
    try {
      const res = await fetch(`https://api.ryviveroots.com/api/admin/order/${orderId}/health`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { firstName: editData.firstName, lastName: editData.lastName, phone: editData.phone, email: editData.email, dob: editData.dob },
          healthInfo: { allergies: editData.allergies, medicalConditions: editData.medicalConditions },
          remarks: editData.remarks,
          address: { house: editData.house, street: editData.street, landmark: editData.landmark, city: editData.city },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Updated successfully");
      setEditingRow(null);
      setShowCustomerDetail(false);
      fetchOrders();
    } catch (err) {
      alert("❌ Failed to update details");
    }
  };

  const handleRenew = async () => {
    try {
      const response = await axios.post("https://api.ryviveroots.com/api/admin/renew", {
        membershipId: selectedCustomer.membershipId,
        durationMonths: duration,
        paymentMethod,
        startDate: renewStartDate,
        totalPrice: renewPrice,
      });
      if (response.data.success) {
        alert("✅ Renewal Successful!");
        setShowRenew(false);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "❌ Renewal failed.");
    }
  };

  const handleManualSubmit = async () => {
    if (saving) return;
    if (!manualUser.firstName || !manualUser.phone || !manualUser.plan || !manualUser.slot || !manualUser.address.pincode) {
      alert("Please fill all required fields");
      return;
    }
    const payload = {
      user: { firstName: manualUser.firstName, lastName: manualUser.lastName, phone: manualUser.phone, email: manualUser.email, dob: manualUser.dob },
      address: manualUser.address,
      healthInfo: manualUser.healthInfo,
      remarks: manualUser.remarks,
      plan: manualUser.plan,
      slot: manualUser.slot,
      paymentMethod: manualUser.paymentMethod,
      startDate: manualUser.startDate,
      totalPrice: manualUser.totalPrice,
    };
    try {
      setSaving(true);
      const res = await fetch("https://api.ryviveroots.com/api/admin/manual-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add member");
      if (data.success) {
        alert("✅ Member added successfully!");
        setActiveView('customers');
        resetForm();
        fetchOrders();
      }
    } catch (error) {
      alert(error.message || "❌ Server error.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setManualUser({
      firstName: "", lastName: "", phone: "", email: "", dob: "",
      totalPrice: "", plan: "", slot: "", paymentMethod: "CASH", startDate: "",
      healthInfo: { allergies: "", medicalConditions: "" },
      remarks: "",
      address: { pincode: "", area: "", house: "", street: "", landmark: "", city: "Dombivli", state: "Maharashtra", country: "India" },
    });
  };

  const handlePasskeySubmit = () => {
    if (passkey === '1234') {
      if (passkeyAction === 'view') setShowCustomerDetail(true);
      else if (passkeyAction === 'message') setShowIndividualMessage(true);
      else if (passkeyAction === 'edit') {
        setEditingRow(selectedCustomer._id);
        setEditData({
          firstName: selectedCustomer.user?.firstName || "",
          lastName: selectedCustomer.user?.lastName || "",
          phone: selectedCustomer.user?.phone || "",
          email: selectedCustomer.user?.email || "",
          dob: selectedCustomer.user?.dob ? selectedCustomer.user.dob.split("T")[0] : "",
          allergies: selectedCustomer.healthInfo?.allergies || "",
          medicalConditions: selectedCustomer.healthInfo?.medicalConditions || "",
          remarks: selectedCustomer.remarks || "",
          house: selectedCustomer.address?.house || "",
          street: selectedCustomer.address?.street || "",
          landmark: selectedCustomer.address?.landmark || "",
          city: selectedCustomer.address?.city || "",
        });
        setShowCustomerDetail(true);
      }
      setShowPasskeyModal(false);
      setPasskey('');
    } else {
      alert('Invalid passkey');
    }
  };

  const requestPasskey = (order, action) => {
    setSelectedCustomer(order);
    setPasskeyAction(action);
    setShowPasskeyModal(true);
  };

  const openRenewModal = (order) => {
    setSelectedCustomer(order);
    setDuration(1);
    setPaymentMethod("CASH");
    setRenewStartDate("");
    setRenewPrice("");
    setShowRenew(true);
  };

  const sendIndividualMessage = async () => {
  try {
    const res = await fetch(
      "https://api.ryviveroots.com/api/admin/send-message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membershipId: selectedCustomer.membershipId,
          message: individualMessage,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("✅ Message sent successfully");

      setIndividualMessage("");
      setShowIndividualMessage(false);
    }

  } catch (err) {
    console.log(err);
    alert("❌ Failed to send");
  }
};

const sendBroadcastMessage = async () => {
  try {
    const res = await fetch(
      "https://api.ryviveroots.com/api/admin/broadcast",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: broadcastMessage,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("✅ Broadcast sent");

      setBroadcastMessage("");
      setShowBroadcastModal(false);
    }

  } catch (err) {
    console.log(err);
    alert("❌ Failed");
  }
};

  const filteredOrders = orders.filter((order) => {
    const text = searchQuery.toLowerCase();
    const matchesSearch =
      order.membershipId?.toLowerCase().includes(text) ||
      `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(text) ||
      order.user?.phone?.includes(text);
    const matchesPlan = filterPlan === "ALL" || order.subscription?.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // ─── STYLES ───
  const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)', fontFamily: "'Inter', sans-serif" },
    header: { background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', padding: '1.5rem 2rem', boxShadow: '0 4px 20px rgba(45,80,22,0.15)', position: 'sticky', top: 0, zIndex: 100 },
    logo: { width: 45, height: 45, background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: '#2d5016' },
    broadcastBtn: { background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    sidebar: { width: 260, background: 'white', minHeight: 'calc(100vh - 90px)', boxShadow: '4px 0 20px rgba(0,0,0,0.05)', padding: '2rem 0' },
    navBtn: (active) => ({ width: '100%', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: active ? 'linear-gradient(90deg, rgba(45,80,22,0.1) 0%, transparent 100%)' : 'transparent', border: 'none', borderLeft: active ? '4px solid #d4af37' : '4px solid transparent', cursor: 'pointer', color: active ? '#2d5016' : '#666', fontSize: '0.95rem', fontWeight: active ? 600 : 500, textAlign: 'left' }),
    card: { background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' },
    th: { padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#2d5016' },
    td: { padding: '1.25rem 1rem' },
    greenBtn: { background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    goldBtn: { background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 480, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    input: { width: '100%', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: '0.95rem', fontWeight: 500, boxSizing: 'border-box' },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2d5016', marginBottom: '0.5rem' },
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={s.logo}>R</div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '1.4rem', fontWeight: 700 }}>Ryvive Roots Admin</h1>
              <p style={{ margin: 0, color: '#d4af37', fontSize: '0.85rem', fontWeight: 500 }}>Operations Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
         <button
  onClick={() => setShowBroadcastModal(true)}
  style={s.broadcastBtn}
>
  <MessageSquare size={18} />
  Send Broadcast
</button>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 8, color: 'white', fontSize: '0.9rem' }}>
              Admin
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* SIDEBAR */}
        <aside style={s.sidebar}>
          <nav>
            {[
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'create', icon: Plus, label: 'Create Account' },
              { id: 'audit', icon: Activity, label: 'Audit Logs' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveView(item.id)} style={s.navBtn(activeView === item.id)}>
                <item.icon size={20} strokeWidth={activeView === item.id ? 2.5 : 2} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '2rem' }}>

          {/* ── CUSTOMERS VIEW ── */}
          {activeView === 'customers' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Customer Management</h2>
                <p style={{ margin: 0, color: '#666' }}>{filteredOrders.length} members</p>
              </div>

              {/* Search + Filter */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.75rem 1.25rem', borderRadius: 12, border: '2px solid rgba(45,80,22,0.1)', flex: 1, maxWidth: 400 }}>
                  <Search size={20} color="#666" />
                  <input type="text" placeholder="Search by name, phone, or ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', flex: 1, background: 'transparent' }} />
                </div>
                <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ border: '2px solid rgba(45,80,22,0.1)', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem', background: 'white', color: '#333' }}>
                  <option value="ALL">All Plans</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
                <button onClick={fetchOrders} style={{ ...s.greenBtn, padding: '0.75rem 1.25rem' }}>🔄 Refresh</button>
              </div>

              {loading ? (
                <p style={{ color: '#666' }}>Loading members...</p>
              ) : (
                <div style={s.card}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)' }}>
                        {['Membership ID', 'Full Name', 'Plan', 'Status', 'Subscription Ends', 'Actions'].map(h => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, idx) => (
                        <tr key={order._id} style={{ borderBottom: idx < filteredOrders.length - 1 ? '1px solid rgba(45,80,22,0.08)' : 'none' }}>
                          <td style={{ ...s.td, fontWeight: 600, color: '#2d5016', fontSize: '0.9rem' }}>
                            {order.membershipId}
                            {order.isTest && <span style={{ marginLeft: 6, background: '#fff8dc', color: '#b8860b', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>TEST</span>}
                          </td>
                          <td style={{ ...s.td, fontSize: '0.95rem', color: '#333' }}>
                            <div style={{ fontWeight: 600 }}>{order.user?.firstName} {order.user?.lastName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>📞 {order.user?.phone}</div>
                          </td>
                          <td style={{ ...s.td }}>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>
                              {order.subscription?.plan || '—'}
                            </span>
                            {canShowRenew(order) && (
                              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: '0.75rem', color: '#c62828', fontWeight: 600 }}>{daysLeft(order)} days left</span>
                                <button onClick={() => openRenewModal(order)} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Renew</button>
                              </div>
                            )}
                          </td>
                          <td style={s.td}>
                            <span style={{ background: getPauseStatusText(order).includes('ACTIVE') ? '#e8f5e9' : getPauseStatusText(order).includes('PAUSED') ? '#fff4e5' : '#fce4ec', color: getPauseStatusText(order).includes('ACTIVE') ? '#2e7d32' : getPauseStatusText(order).includes('PAUSED') ? '#e65100' : '#c62828', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {getPauseStatusText(order)}
                            </span>
                          </td>
                          <td style={{ ...s.td, fontSize: '0.85rem', color: '#555' }}>
                            {order.subscription?.endDate ? new Date(order.subscription.endDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td style={{ ...s.td }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button onClick={() => requestPasskey(order, 'view')} style={s.greenBtn}>
                                <Eye size={14} /> View
                              </button>
                              <button onClick={() => requestPasskey(order, 'message')} style={s.goldBtn}>
                                <MessageSquare size={14} /> Message
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── CREATE ACCOUNT ── */}
          {activeView === 'create' && (
            <div>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Create New Customer Account</h2>
              <div style={{ ...s.card, padding: '2.5rem', maxWidth: 800, overflow: 'visible' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  {[
                    { label: 'First Name', key: 'firstName', type: 'text', required: true },
                    { label: 'Last Name', key: 'lastName', type: 'text' },
                    { label: 'Phone', key: 'phone', type: 'tel', required: true },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Date of Birth', key: 'dob', type: 'date' },
                    { label: 'Total Price (optional)', key: 'totalPrice', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={s.label}>{f.label} {f.required && <span style={{ color: '#d32f2f' }}>*</span>}</label>
                      <input type={f.type} value={manualUser[f.key]} onChange={e => setManualUser({ ...manualUser, [f.key]: e.target.value })} style={s.input} />
                    </div>
                  ))}

                  <div>
                    <label style={s.label}>Start Date</label>
                    <input type="date" value={manualUser.startDate} onChange={e => setManualUser({ ...manualUser, startDate: e.target.value })} style={s.input} />
                  </div>

                  <div>
                    <label style={s.label}>Plan <span style={{ color: '#d32f2f' }}>*</span></label>
                    <select value={manualUser.plan} onChange={e => setManualUser({ ...manualUser, plan: e.target.value })} style={s.input}>
                      <option value="">Select Plan</option>
                      <option value="SILVER_1MONTH">Silver – 1 Month</option>
                      <option value="GOLD_1MONTH">Gold – 1 Month</option>
                      <option value="PLATINUM_1MONTH">Platinum – 1 Month</option>
                      <option value="SILVER_3MONTH">Silver – 3 Months</option>
                      <option value="GOLD_3MONTH">Gold – 3 Months</option>
                      <option value="PLATINUM_3MONTH">Platinum – 3 Months</option>
                    </select>
                  </div>

                  <div>
                    <label style={s.label}>Delivery Slot <span style={{ color: '#d32f2f' }}>*</span></label>
                    <select value={manualUser.slot} onChange={e => setManualUser({ ...manualUser, slot: e.target.value })} style={s.input}>
                      <option value="">Select Slot</option>
                      <optgroup label="🌅 Morning">
                        <option value="Morning - 08:00 – 09:00 AM">08:00 – 09:00 AM</option>
                        <option value="Morning - 09:00 – 10:00 AM">09:00 – 10:00 AM</option>
                        <option value="Morning - 10:00 – 11:00 AM">10:00 – 11:00 AM</option>
                      </optgroup>
                      <optgroup label="🌙 Evening">
                        <option value="Evening - 05:00 – 06:00 PM">05:00 – 06:00 PM</option>
                        <option value="Evening - 06:00 – 07:00 PM">06:00 – 07:00 PM</option>
                        <option value="Evening - 07:00 – 08:00 PM">07:00 – 08:00 PM</option>
                        <option value="Evening - 08:00 – 09:00 PM">08:00 – 09:00 PM</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label style={s.label}>Payment Method</label>
                    <select value={manualUser.paymentMethod} onChange={e => setManualUser({ ...manualUser, paymentMethod: e.target.value })} style={s.input}>
                      <option value="CASH">Cash</option>
                      <option value="ONLINE">Online</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={s.label}>Allergies</label>
                    <textarea rows={2} value={manualUser.healthInfo.allergies} onChange={e => setManualUser({ ...manualUser, healthInfo: { ...manualUser.healthInfo, allergies: e.target.value } })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={s.label}>Medical Conditions</label>
                    <textarea rows={2} value={manualUser.healthInfo.medicalConditions} onChange={e => setManualUser({ ...manualUser, healthInfo: { ...manualUser.healthInfo, medicalConditions: e.target.value } })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={s.label}>Remarks</label>
                    <textarea rows={2} value={manualUser.remarks} onChange={e => setManualUser({ ...manualUser, remarks: e.target.value })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
                  </div>

                  {/* ADDRESS */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ ...s.label, fontSize: '1rem', color: '#2d5016', borderBottom: '2px solid rgba(45,80,22,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📍 Address</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                      <div>
                        <label style={s.label}>Pincode <span style={{ color: '#d32f2f' }}>*</span></label>
                        <select value={manualUser.address.pincode} onChange={e => {
                          const selected = allowedPincodes.find(p => p.code === e.target.value);
                          setManualUser({ ...manualUser, address: { ...manualUser.address, pincode: e.target.value, area: selected?.area || '' } });
                        }} style={s.input}>
                          <option value="">Select Pincode</option>
                          {allowedPincodes.map(p => <option key={p.code} value={p.code}>{p.code} — {p.area}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={s.label}>Area</label>
                        <input value={manualUser.address.area} readOnly style={{ ...s.input, background: '#f5f5f5', cursor: 'not-allowed' }} />
                      </div>
                      <div>
                        <label style={s.label}>House / Flat</label>
                        <input value={manualUser.address.house} onChange={e => setManualUser({ ...manualUser, address: { ...manualUser.address, house: e.target.value } })} style={s.input} />
                      </div>
                      <div>
                        <label style={s.label}>Street</label>
                        <input value={manualUser.address.street} onChange={e => setManualUser({ ...manualUser, address: { ...manualUser.address, street: e.target.value } })} style={s.input} />
                      </div>
                      <div>
                        <label style={s.label}>Landmark</label>
                        <input value={manualUser.address.landmark} onChange={e => setManualUser({ ...manualUser, address: { ...manualUser.address, landmark: e.target.value } })} style={s.input} placeholder="Optional" />
                      </div>
                      <div>
                        <label style={s.label}>City</label>
                        <select value={manualUser.address.city} onChange={e => setManualUser({ ...manualUser, address: { ...manualUser.address, city: e.target.value } })} style={s.input}>
                          <option value="Dombivli">Dombivli</option>
                          <option value="Kalyan">Kalyan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button onClick={handleManualSubmit} disabled={saving} style={{ ...s.greenBtn, padding: '1rem 2.5rem', fontSize: '1rem', opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Saving...' : 'Create Account'}
                  </button>
                  <button onClick={resetForm} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2.5rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── AUDIT LOGS ── */}
          {activeView === 'audit' && (
            <div>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Audit Logs & Activity Tracking</h2>
              <div style={s.card}>
                {orders.slice(0, 20).map((order, idx) => (
                  <div key={order._id} style={{ padding: '1.5rem 2rem', borderBottom: idx < 19 ? '1px solid rgba(45,80,22,0.08)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#2d5016' }}>
                            {order.user?.firstName} {order.user?.lastName}
                          </h4>
                          <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                            {order.subscription?.plan}
                          </span>
                          <span style={{ background: getPauseStatusText(order).includes('ACTIVE') ? '#e8f5e9' : '#fff4e5', color: getPauseStatusText(order).includes('ACTIVE') ? '#2e7d32' : '#e65100', padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
                            {getPauseStatusText(order)}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#666' }}>
                          ID: <strong>{order.membershipId}</strong> · 📞 {order.user?.phone}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>Payment: {order.paymentMethod || 'CASH'}</p>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 160 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Clock size={14} color="#666" />
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
                            {order.subscription?.startDate ? new Date(order.subscription.startDate).toLocaleDateString('en-GB') : '—'}
                          </p>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#999' }}>
                          Ends: {order.subscription?.endDate ? new Date(order.subscription.endDate).toLocaleDateString('en-GB') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && !loading && (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No records found.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── PASSKEY MODAL ── */}
      {showPasskeyModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #fff4e5, #ffe8cc)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Lock size={28} color="#d4af37" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Passkey Required</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                Enter your passkey to {passkeyAction === 'view' ? 'view customer details' : passkeyAction === 'edit' ? 'edit customer' : 'send message'}
              </p>
            </div>
            <input type="password" value={passkey} onChange={e => setPasskey(e.target.value)} placeholder="Enter passkey" onKeyPress={e => e.key === 'Enter' && handlePasskeySubmit()} style={{ ...s.input, marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700 }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePasskeySubmit} style={{ ...s.greenBtn, flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>Verify</button>
              <button onClick={() => { setShowPasskeyModal(false); setPasskey(''); }} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── BROADCAST MODAL ── */}
      {showBroadcastModal && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Broadcast Message</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Send notification to all {orders.length} customers</p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={24} color="#666" /></button>
            </div>
            <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="Type your message here..." style={{ ...s.input, minHeight: 150, resize: 'vertical', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }} />
          <button
  onClick={sendBroadcastMessage}
  style={{
    width: '100%',
    ...s.broadcastBtn,
    justifyContent: 'center',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 700
  }}
>
  <Send size={20} />
  Send to All Customers
</button>
          </div>
        </div>
      )}

      {/* ── CUSTOMER DETAIL MODAL ── */}
      {showCustomerDetail && selectedCustomer && (
        <div style={{ ...s.overlay, padding: '2rem', overflowY: 'auto', alignItems: 'flex-start' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', maxWidth: 900, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', margin: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Customer Profile</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedCustomer.membershipId}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {editingRow !== selectedCustomer._id && (
                  <button onClick={() => requestPasskey(selectedCustomer, 'edit')} style={{ ...s.goldBtn, padding: '0.75rem 1.25rem' }}>
                    <Edit size={16} /> Edit
                  </button>
                )}
                <button onClick={() => { setShowCustomerDetail(false); setEditingRow(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={24} color="#666" /></button>
              </div>
            </div>

            {editingRow === selectedCustomer._id ? (
              // EDIT MODE
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {[
                  { label: 'First Name', key: 'firstName' },
                  { label: 'Last Name', key: 'lastName' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Date of Birth', key: 'dob', type: 'date' },
                  { label: 'House / Flat', key: 'house' },
                  { label: 'Street', key: 'street' },
                  { label: 'Landmark', key: 'landmark' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={s.label}>{f.label}</label>
                    <input type={f.type || 'text'} value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} style={{ ...s.input, border: '2px solid #d4af37' }} />
                  </div>
                ))}
                <div>
                  <label style={s.label}>City</label>
                  <select value={editData.city} onChange={e => setEditData({ ...editData, city: e.target.value })} style={{ ...s.input, border: '2px solid #d4af37' }}>
                    <option value="Dombivli">Dombivli</option>
                    <option value="Kalyan">Kalyan</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={s.label}>Allergies</label>
                  <textarea rows={2} value={editData.allergies} onChange={e => setEditData({ ...editData, allergies: e.target.value })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif', border: '2px solid #d4af37' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={s.label}>Medical Conditions</label>
                  <textarea rows={2} value={editData.medicalConditions} onChange={e => setEditData({ ...editData, medicalConditions: e.target.value })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif', border: '2px solid #d4af37' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={s.label}>Remarks</label>
                  <textarea rows={2} value={editData.remarks} onChange={e => setEditData({ ...editData, remarks: e.target.value })} style={{ ...s.input, resize: 'vertical', fontFamily: 'Inter, sans-serif', border: '2px solid #d4af37' }} />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleSaveEdit(selectedCustomer._id)} style={{ ...s.greenBtn, padding: '1rem 2rem', fontSize: '1rem' }}>💾 Save Changes</button>
                  <button onClick={() => setEditingRow(null)} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              // VIEW MODE
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {[
                  { label: 'Full Name', value: `${selectedCustomer.user?.firstName || ''} ${selectedCustomer.user?.lastName || ''}` },
                  { label: 'Phone', value: selectedCustomer.user?.phone },
                  { label: 'Email', value: selectedCustomer.user?.email || '—' },
                  { label: 'Date of Birth', value: selectedCustomer.user?.dob ? new Date(selectedCustomer.user.dob).toLocaleDateString('en-GB') : '—' },
                  { label: 'Plan', value: selectedCustomer.subscription?.plan },
                  { label: 'Status', value: getPauseStatusText(selectedCustomer) },
                  { label: 'Start Date', value: selectedCustomer.subscription?.startDate ? new Date(selectedCustomer.subscription.startDate).toLocaleDateString('en-GB') : '—' },
                  { label: 'End Date', value: selectedCustomer.subscription?.endDate ? new Date(selectedCustomer.subscription.endDate).toLocaleDateString('en-GB') : '—' },
                  { label: 'Delivery Slot', value: selectedCustomer.deliverySlot || '—' },
                  { label: 'Payment', value: selectedCustomer.paymentMethod || 'CASH' },
                  { label: 'Allergies', value: selectedCustomer.healthInfo?.allergies || 'None' },
                  { label: 'Medical Conditions', value: selectedCustomer.healthInfo?.medicalConditions || 'None' },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ ...s.label, color: '#888' }}>{f.label}</label>
                    <div style={{ ...s.input, background: '#f8f8f8', cursor: 'default', display: 'flex', alignItems: 'center', fontSize: '0.95rem', color: '#333' }}>{f.value}</div>
                  </div>
                ))}
                {selectedCustomer.address && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ ...s.label, color: '#888' }}>Address</label>
                    <div style={{ ...s.input, background: '#f8f8f8', cursor: 'default', fontSize: '0.95rem', color: '#333' }}>
                      {[selectedCustomer.address.house, selectedCustomer.address.street, selectedCustomer.address.landmark, selectedCustomer.address.city, selectedCustomer.address.pincode].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
                {selectedCustomer.remarks && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ ...s.label, color: '#888' }}>Remarks</label>
                    <div style={{ ...s.input, background: '#fffde7', cursor: 'default', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>{selectedCustomer.remarks}</div>
                  </div>
                )}
              </div>
            )}

            {!editingRow && canShowRenew(selectedCustomer) && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff4e5', borderRadius: 12, border: '1px solid #ffe0b2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#e65100', fontWeight: 600, fontSize: '0.9rem' }}>⚠️ Subscription expires in {daysLeft(selectedCustomer)} days</span>
                <button onClick={() => { setShowCustomerDetail(false); openRenewModal(selectedCustomer); }} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Renew Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── RENEW MODAL ── */}
      {showRenew && selectedCustomer && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Renew Membership</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#666', fontSize: '0.9rem' }}>
              {selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName} · {selectedCustomer.membershipId}
            </p>

            <label style={s.label}>Duration</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ ...s.input, marginBottom: '1.25rem' }}>
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
            </select>

            <label style={s.label}>Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...s.input, marginBottom: '1.25rem' }}>
              <option value="CASH">Cash</option>
              <option value="ONLINE">Online</option>
            </select>

            <label style={s.label}>Start Date</label>
            <input type="date" value={renewStartDate} onChange={e => setRenewStartDate(e.target.value)} style={{ ...s.input, marginBottom: '1.25rem' }} />

            <label style={s.label}>Total Price</label>
            <input type="number" placeholder="Enter total price" value={renewPrice} onChange={e => setRenewPrice(e.target.value)} style={{ ...s.input, marginBottom: '1.75rem' }} />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleRenew} style={{ ...s.greenBtn, flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}>✅ Confirm Renew</button>
              <button onClick={() => setShowRenew(false)} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── INDIVIDUAL MESSAGE MODAL ── */}
      {showIndividualMessage && selectedCustomer && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: 550 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700, color: '#2d5016' }}>Send Message</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>To: {selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}</p>
              </div>
              <button onClick={() => setShowIndividualMessage(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#666" /></button>
            </div>
            <textarea value={individualMessage} onChange={e => setIndividualMessage(e.target.value)} placeholder="Type your message..." rows={5} style={{ ...s.input, resize: 'vertical', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }} />
           <button
  onClick={sendIndividualMessage}
  style={s.greenBtn}
>
  <Send size={16} />
  Send Message
</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        button:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.2s ease; }
        input:focus, textarea:focus, select:focus { outline: none !important; border-color: #d4af37 !important; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15) !important; }
      `}</style>
    </div>
  );
}
