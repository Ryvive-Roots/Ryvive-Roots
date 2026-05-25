import React, { useState, useEffect } from 'react';
import {
  Users, MessageSquare, Plus, Lock, Eye, Edit, Clock, Activity,
  Mail, Search, X, Send, FileText, Package, TrendingUp, Calendar,
  DollarSign, Truck, PauseCircle, Settings, BarChart3, ShoppingBag,
  AlertCircle, RefreshCcw, CalendarClock
} from 'lucide-react';
import axios from 'axios';

const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  { code: "421202", area: "Dombivli West" },
  { code: "421203", area: "Dombivli East" },
  { code: "421204", area: "Khoni" },
  { code: "421301", area: "Kalyan" },
];

// ── Team Members (from doc 2) ──
const teamMembers = [
  { id: 'saurabh', name: 'Saurabh Sir', role: 'Senior Manager' },
  { id: 'yashwant', name: 'Yashwant', role: 'Team Lead' },
  { id: 'shravani', name: 'Shravani', role: 'Web Developer' },
  { id: 'sakshi', name: 'Sakshi', role: 'Operations Associate' }
];
 
// ── Package Features (from doc 2) ──
const packageFeatures = [
  'High-Protein Meals',
  'Gut-Friendly Recipes',
  'Detox Juices',
  'Priority Support',
  'Flexible Pauses (3/month)',
  'Menu Customization',
  'Weekend Delivery',
  'Nutrition Consultation'
];

export default function AdminD() {
  const [activeView, setActiveView] = useState('dashboard');
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
  const [editingRow, setEditingRow] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [individualMessage, setIndividualMessage] = useState('');
  const [auditLogs, setAuditLogs] =
  useState([]);
const [pendingCustomers, setPendingCustomers] =
  useState([]);

  // ── Pending Payments state ──
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPending, setSelectedPending] = useState(null);
  const [paymentData, setPaymentData] = useState({
    received: false,
    method: '',
    amount: '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
 

  // Renew state
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [renewStartDate, setRenewStartDate] = useState("");
  const [renewPrice, setRenewPrice] = useState("");

  // Customer queries/tickets
  const customerQueries = [
    {
      id: 'Q001',
      customer: 'Priya Sharma',
      customerId: 'RR001',
      type: 'Complaint',
      subject: 'Late Delivery',
      message: 'My meal was delivered 2 hours late today. This is affecting my schedule.',
      date: '2024-05-15',
      time: '10:30 AM',
      status: 'Open',
      priority: 'High',
      assignedTo: null,
      response: null
    },
    {
      id: 'Q002',
      customer: 'Amit Patel',
      customerId: 'RR002',
      type: 'Feedback',
      subject: 'Menu Suggestions',
      message: 'Would love to see more South Indian options in the menu.',
      date: '2024-05-14',
      time: '03:45 PM',
      status: 'In Progress',
      priority: 'Low',
      assignedTo: 'Sakshi Ughade',
      response: 'Thank you for the suggestion. We are working on expanding our menu.'
    },
    {
      id: 'Q003',
      customer: 'Sneha Desai',
      customerId: 'RR003',
      type: 'Complaint',
      subject: 'Wrong Order Delivered',
      message: 'I received a sandwich instead of the salad I ordered.',
      date: '2024-05-14',
      time: '11:20 AM',
      status: 'Resolved',
      priority: 'High',
      assignedTo: 'Sakshi Ughade',
      response: 'We sincerely apologize. A replacement salad has been sent and one free meal credited.'
    },
    {
      id: 'Q004',
      customer: 'Rahul Kumar',
      customerId: 'RR004',
      type: 'Query',
      subject: 'Pause Subscription',
      message: 'How do I pause my subscription for a week? I will be traveling.',
      date: '2024-05-13',
      time: '09:15 AM',
      status: 'Resolved',
      priority: 'Medium',
      assignedTo: 'Sakshi Ughade',
      response: 'You can pause from your dashboard. We have also paused it for you from May 20-27.'
    }
  ];

  // Edit state
  const [editData, setEditData] = useState({
    firstName: "", lastName: "", phone: "", email: "", dob: "",
    allergies: "", medicalConditions: "", remarks: "",
    house: "", street: "", landmark: "", city: "",
  });

  // ── CREATE ACCOUNT: multi-step state (from doc 2) ──
  const [createStep, setCreateStep] = useState(1);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [customPackage, setCustomPackage] = useState({
    name: '', duration: '', mealsPerWeek: '', totalMeals: '', price: '', features: []
  });
  const [createCustomerData, setCreateCustomerData] = useState({
    fullName: '', phone: '', email: '', dob: '', address: '', timeSlot: '', startDate: '',
    allergies: '', medicalConditions: '', remarks: '',
    pincode: '', area: '', house: '', street: '', landmark: '', city: 'Dombivli'
  });
  const [createPaymentData, setCreatePaymentData] = useState({
    received: null,
    method: '',
    amount: '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Pause requests state
  const [pauseRequests, setPauseRequests] = useState([
    { id: 'P001', customer: 'Sneha Desai', memberId: 'RR003', requestDate: 'May 10, 2024', pauseFrom: 'May 15', pauseTo: 'May 20', reason: 'Traveling', status: 'Approved' },
    { id: 'P002', customer: 'Rohan Mehta', memberId: 'RR007', requestDate: 'May 14, 2024', pauseFrom: 'May 18', pauseTo: 'May 22', reason: 'Family function', status: 'Pending' },
    { id: 'P003', customer: 'Kavya Iyer', memberId: 'RR008', requestDate: 'May 13, 2024', pauseFrom: 'May 20', pauseTo: 'May 25', reason: 'Out of station', status: 'Pending' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/";
    fetchOrders();
    fetchPendingPayments();
    fetchAuditLogs();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
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
  const fetchPendingPayments = async () => {

  try {

    const res = await fetch(
      "https://api.ryviveroots.com/api/admin/pending-payments"
    );

    const data = await res.json();

    if (data.success) {

      setPendingCustomers(
        data.pendingPayments
      );
    }

  } catch (err) {

    console.error(
      "Failed to fetch pending payments",
      err
    );
  }
};

const fetchAuditLogs =
  async () => {

    try {

      const res = await fetch(
        "https://api.ryviveroots.com/api/admin/audit-logs"
      );

      const data = await res.json();

      if (data.success) {

        setAuditLogs(data.logs);
      }

    } catch (err) {

      console.error(
        "Failed to fetch audit logs",
        err
      );
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
    return diffDays <= 10 || order.subscription?.status === "EXPIRED";
  };

  const daysLeft = (order) => {
    const today = new Date();
    const expiry = new Date(order.subscription.endDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const dashboardStats = {
    totalCustomers: orders.length,
    activeSubscriptions: orders.filter(o => o.subscription?.status !== 'EXPIRED' && o.subscription?.status !== 'UNDER_PROCESS').length,
    pendingQueries: 8,
    pausedSubscriptions: orders.filter(o => getPauseStatusText(o).includes('PAUSED')).length,
    upcomingRenewals: orders.filter(o => canShowRenew(o)).length,
    pendingRenewals: orders.filter(o => o.subscription?.status === 'EXPIRED').length,
    pendingPayments: pendingCustomers.length,
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

  // ── CREATE ACCOUNT helpers (from doc 2) ──
  const calculateTotalMeals = (dur, mealsPerWeek) => {
    const weeks = dur === '1-month' ? 4 : dur === '2-month' ? 8 : dur === '3-month' ? 12 : dur === '6-month' ? 24 : 0;
    return weeks * parseInt(mealsPerWeek || 0);
  };

  const handleFeatureToggle = (feature) => {
    const updated = customPackage.features.includes(feature)
      ? customPackage.features.filter(f => f !== feature)
      : [...customPackage.features, feature];
    setCustomPackage({ ...customPackage, features: updated });
  };

  const resetCreateForm = () => {
    setCreateStep(1);
    setSelectedTeamMember('');
    setCustomPackage({ name: '', duration: '', mealsPerWeek: '', totalMeals: '', price: '', features: [] });
    setCreateCustomerData({ fullName: '', phone: '', email: '', dob: '', address: '', timeSlot: '', startDate: '', allergies: '', medicalConditions: '', remarks: '', pincode: '', area: '', house: '', street: '', landmark: '', city: 'Dombivli' });
    setCreatePaymentData({ received: null, method: '', amount: '', transactionId: '', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleCreateAccount = async () => {
    const member = teamMembers.find(t => t.id === selectedTeamMember);
    const payload = {
      user: {
        firstName: createCustomerData.fullName.split(' ')[0] || createCustomerData.fullName,
        lastName: createCustomerData.fullName.split(' ').slice(1).join(' ') || '',
        phone: createCustomerData.phone,
        email: createCustomerData.email,
        dob: createCustomerData.dob
      },
      address: {
        pincode: createCustomerData.pincode,
        area: createCustomerData.area,
        house: createCustomerData.house,
        street: createCustomerData.street,
        landmark: createCustomerData.landmark,
        city: createCustomerData.city,
        state: 'Maharashtra',
        country: 'India'
      },
      healthInfo: {
        allergies: createCustomerData.allergies,
        medicalConditions: createCustomerData.medicalConditions
      },
      remarks: createCustomerData.remarks,
      plan: customPackage.name,
      slot: createCustomerData.timeSlot,
      paymentMethod: createPaymentData.method?.toUpperCase() || 'CASH',
      startDate: createCustomerData.startDate,
      totalPrice: customPackage.price,
      createdBy: member?.name,
    };

    if (createPaymentData.received) {
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
          resetCreateForm();
          setActiveView('customers');
          fetchOrders();
        }
      } catch (error) {
        alert(error.message || "❌ Server error.");
      } finally {
        setSaving(false);
      }
    } else {

  try {

    setSaving(true);

    const pendingPayload = {
      user: {
        firstName:
          createCustomerData.fullName.split(" ")[0] ||
          createCustomerData.fullName,

        lastName:
          createCustomerData.fullName
            .split(" ")
            .slice(1)
            .join(" ") || "",

        phone: createCustomerData.phone,

        email: createCustomerData.email,

        dob: createCustomerData.dob,
      },

      address: {
        pincode: createCustomerData.pincode,

        area: createCustomerData.area,

        house: createCustomerData.house,

        street: createCustomerData.street,

        landmark: createCustomerData.landmark,

        city: createCustomerData.city,

        state: "Maharashtra",

        country: "India",
      },

      healthInfo: {
        allergies: createCustomerData.allergies,

        medicalConditions:
          createCustomerData.medicalConditions,
      },

      remarks: createCustomerData.remarks,

      deliverySlot: createCustomerData.timeSlot,

      subscription: {
        plan: customPackage.name,

        amount: Number(customPackage.price),

        durationMonths:
          customPackage.name?.includes("3MONTH")
            ? 3
            : 1,

        startDate: createCustomerData.startDate,
      },

      paymentMethod:
        createPaymentData.method?.toUpperCase() ||
        "CASH",

      createdBy: member?.name || "Admin",
    };



    const res = await fetch(
      "https://api.ryviveroots.com/api/admin/pending-payment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(pendingPayload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Failed to save pending payment"
      );
    }

    alert(
      "✅ Customer saved as Pending Payment!"
    );

    resetCreateForm();

    setActiveView("pending");

    fetchPendingPayments();

  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "❌ Failed to create pending payment"
    );

  } finally {

    setSaving(false);
  }
}
  };

  const sendIndividualMessage = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: selectedCustomer.membershipId, message: individualMessage }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Message sent successfully");
        setIndividualMessage("");
        setShowIndividualMessage(false);
      }
    } catch (err) {
      alert("❌ Failed to send");
    }
  };

  const sendBroadcastMessage = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Broadcast sent");
        setBroadcastMessage("");
        setShowBroadcastModal(false);
      }
    } catch (err) {
      alert("❌ Failed");
    }
  };

  const handlePauseAction = (id, action) => {
    setPauseRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r)
    );
  };

  const handleVerifyPayment = (pending) => {
    setSelectedPending(pending);
    setPaymentData({
      received: false,
      method: '',
      amount: pending.amount,
      transactionId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedPending) return;
    setPendingCustomers(prev => prev.filter(p => p.id !== selectedPending.id));
    alert(`✅ Payment Verified!\n\nCustomer: ${selectedPending.name}\nPayment: ₹${paymentData.amount} via ${paymentData.method}\n\nAccount activated successfully!`);
    setShowPaymentModal(false);
    setSelectedPending(null);
    setPaymentData({ received: false, method: '', amount: '', transactionId: '', date: new Date().toISOString().split('T')[0], notes: '' });
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

  const upcomingRenewals = orders
    .filter(o => canShowRenew(o))
    .map(o => ({
      id: o._id,
      customer: `${o.user?.firstName} ${o.user?.lastName}`,
      memberId: o.membershipId,
      plan: o.subscription?.plan,
      expiryDate: o.subscription?.endDate ? new Date(o.subscription.endDate).toLocaleDateString('en-GB') : '—',
      daysLeft: daysLeft(o),
      order: o,
    }));

  // ── Shared input style ──
  const inputStyle = { width: '100%', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' };
  const selectStyle = { ...inputStyle };
  const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2d5016', marginBottom: '0.5rem' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fdf5 0%, #fef9f3 100%)', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)',
        padding: '1.5rem 2rem', boxShadow: '0 4px 20px rgba(45, 80, 22, 0.15)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 45, height: 45, background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: '#2d5016' }}>R</div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '1.4rem', fontWeight: 700 }}>Ryvive Roots Admin</h1>
              <p style={{ margin: 0, color: '#d4af37', fontSize: '0.85rem', fontWeight: 500 }}>Master Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setShowBroadcastModal(true)} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)' }}>
              <MessageSquare size={18} /> Broadcast
            </button>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 8, color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} color="#d4af37" /> Admin
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* ── SIDEBAR ── */}
        <aside style={{ width: 260, background: 'white', minHeight: 'calc(100vh - 90px)', boxShadow: '4px 0 20px rgba(0,0,0,0.05)', padding: '1rem 0', position: 'sticky', top: 90, height: 'calc(100vh - 90px)', overflowY: 'auto' }}>
          <nav>
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'pending', icon: DollarSign, label: 'Pending Payments', badge: pendingCustomers.length },
              { id: 'pause', icon: PauseCircle, label: 'Pause Requests' },
              { id: 'queries', icon: MessageSquare, label: 'Customer Queries' },
              { id: 'renewals', icon: Calendar, label: 'Renewals' },
              { id: 'create', icon: Plus, label: 'Create Account' },
              { id: 'audit', icon: Activity, label: 'Audit Logs' },
            ].map(item => (
              <button key={item.id} onClick={() => { setActiveView(item.id); if (item.id === 'create') resetCreateForm(); }} style={{
                width: '100%', padding: '0.65rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: activeView === item.id ? 'linear-gradient(90deg, rgba(45,80,22,0.1) 0%, transparent 100%)' : 'transparent',
                border: 'none',
                borderLeft: activeView === item.id ? '4px solid #d4af37' : '4px solid transparent',
                cursor: 'pointer', transition: 'all 0.3s ease',
                color: activeView === item.id ? '#2d5016' : '#666',
                fontSize: '0.95rem', fontWeight: activeView === item.id ? 600 : 500, textAlign: 'left'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <item.icon size={20} strokeWidth={activeView === item.id ? 2.5 : 2} />
                  {item.label}
                </span>
                {item.badge > 0 && (
                  <span style={{ background: '#d4af37', color: 'white', borderRadius: 12, padding: '0.2rem 0.55rem', fontSize: '0.75rem', fontWeight: 700 }}>{item.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>

          {/* ──────────────── DASHBOARD ──────────────── */}
          {activeView === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Dashboard Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Customers', value: dashboardStats.totalCustomers, icon: Users, color: '#2d5016' },
                  { label: 'Active Subscriptions', value: dashboardStats.activeSubscriptions, icon: Package, color: '#3d6b1f' },
                  { label: 'Pending Queries', value: dashboardStats.pendingQueries, icon: MessageSquare, color: '#c62828' },
                  { label: 'Paused Subscriptions', value: dashboardStats.pausedSubscriptions, icon: PauseCircle, color: '#1976d2' },
                  { label: 'Upcoming Renewals', value: dashboardStats.upcomingRenewals, icon: CalendarClock, color: '#7b1fa2' },
                  { label: 'Expired / Pending Renewals', value: dashboardStats.pendingRenewals, icon: RefreshCcw, color: '#e65100' },
                  { label: 'Pending Payments', value: dashboardStats.pendingPayments, icon: DollarSign, color: '#f57c00' },
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: 'white', borderRadius: 16, padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45, 80, 22, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>{stat.label}</p>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon size={20} color={stat.color} />
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: stat.color }}>{loading ? '...' : stat.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 600, color: '#2d5016' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Customer Management', action: 'customers', icon: Users },
                    { label: 'Pending Payments', action: 'pending', icon: DollarSign },
                    { label: 'Pause Requests', action: 'pause', icon: PauseCircle },
                    { label: 'Renewals', action: 'renewals', icon: Calendar },
                    { label: 'Create Account', action: 'create', icon: Plus },
                  ].map(item => (
                    <button key={item.action} onClick={() => setActiveView(item.action)} style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)', border: '1px solid rgba(45, 80, 22, 0.1)', padding: '1.25rem', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: '#2d5016', transition: 'all 0.3s ease' }}>
                      <item.icon size={20} /> {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#2d5016' }}>Pending Pause Requests</h3>
                  <button onClick={() => setActiveView('pause')} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>View All →</button>
                </div>
                {pauseRequests.filter(r => r.status === 'Pending').length === 0 && <p style={{ color: '#999', fontSize: '0.9rem' }}>No pending pause requests.</p>}
                {pauseRequests.filter(r => r.status === 'Pending').slice(0, 3).map((request, idx, arr) => (
                  <div key={request.id} style={{ padding: '1rem', borderBottom: idx < arr.length - 1 ? '1px solid rgba(45, 80, 22, 0.08)' : 'none' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600, color: '#2d5016' }}>{request.customer}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Pause: {request.pauseFrom} to {request.pauseTo} · {request.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── CUSTOMERS ──────────────── */}
          {activeView === 'customers' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Customer Management</h2>
                <p style={{ margin: 0, color: '#666' }}>{filteredOrders.length} members</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.75rem 1.25rem', borderRadius: 12, border: '2px solid rgba(45,80,22,0.1)', flex: 1, maxWidth: 400 }}>
                  <Search size={20} color="#666" />
                  <input type="text" placeholder="Search by name, phone, or ID…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', flex: 1, background: 'transparent' }} />
                </div>
                <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ border: '2px solid rgba(45,80,22,0.1)', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem', background: 'white', color: '#333' }}>
                  <option value="ALL">All Plans</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
                <button onClick={fetchOrders} style={{ background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>🔄 Refresh</button>
              </div>
              {loading ? <p style={{ color: '#666' }}>Loading members…</p> : (
                <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)' }}>
                        {['Membership ID', 'Full Name', 'Plan', 'Status', 'Subscription Ends', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700, color: '#2d5016' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, idx) => (
                        <tr key={order._id} style={{ borderBottom: idx < filteredOrders.length - 1 ? '1px solid rgba(45,80,22,0.08)' : 'none' }}>
                          <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#2d5016', fontSize: '0.9rem' }}>
                            {order.membershipId}
                            {order.isTest && <span style={{ marginLeft: 6, background: '#fff8dc', color: '#b8860b', fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>TEST</span>}
                          </td>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#333' }}>{order.user?.firstName} {order.user?.lastName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>📞 {order.user?.phone}</div>
                          </td>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>{order.subscription?.plan || '—'}</span>
                            {canShowRenew(order) && (
                              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: '0.75rem', color: '#c62828', fontWeight: 600 }}>{daysLeft(order)} days left</span>
                                <button onClick={() => openRenewModal(order)} style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Renew</button>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <span style={{ background: getPauseStatusText(order).includes('ACTIVE') ? '#e8f5e9' : getPauseStatusText(order).includes('PAUSED') ? '#fff4e5' : '#fce4ec', color: getPauseStatusText(order).includes('ACTIVE') ? '#2e7d32' : getPauseStatusText(order).includes('PAUSED') ? '#e65100' : '#c62828', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {getPauseStatusText(order)}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: '#555' }}>
                            {order.subscription?.endDate ? new Date(order.subscription.endDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                          <td style={{ padding: '1.25rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button onClick={() => requestPasskey(order, 'view')} style={{ background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Eye size={14} /> View</button>
                              <button onClick={() => requestPasskey(order, 'message')} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={14} /> Message</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No members found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── PENDING PAYMENTS ──────────────── */}
          {activeView === 'pending' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Pending Payments</h2>
                <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>{pendingCustomers.length} customer{pendingCustomers.length !== 1 ? 's' : ''} awaiting payment verification</p>
              </div>
              {pendingCustomers.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 16, padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d5016' }}>All Caught Up!</h3>
                  <p style={{ margin: 0, color: '#666' }}>No pending payments at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {pendingCustomers.map(pending => (
                    <div key={pending.id} style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #fff4e5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600, color: '#2d5016' }}>{pending.user?.firstName} {pending.user?.lastName}</h4>
                            <span style={{ background: '#fff4e5', color: '#d4af37', padding: '0.4rem 0.85rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>⏳ Awaiting Payment</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}> {pending.user?.phone}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}> {pending.user?.email}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{pending.subscription?.plan}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#2e7d32' }}>₹{pending.subscription?.amount}</p>
                          </div>
                         <div
  style={{
    background: '#f0f7ec',
    padding: '0.75rem 1rem',
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#666'
  }}
>
  👤 Added by:

  <strong>
    {pending.createdBy || "Admin"}
  </strong>

  

  {new Date(
    pending.createdAt
  ).toLocaleDateString("en-IN")}
</div>
                        </div>
                        <button onClick={() => handleVerifyPayment(pending)} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '1rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginLeft: '2rem', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>
                          💰 Verify Payment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ──────────────── PAUSE REQUESTS ──────────────── */}
          {activeView === 'pause' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Pause Requests</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>{pauseRequests.filter(r => r.status === 'Pending').length} pending requests</p>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pauseRequests.map(request => (
                  <div key={request.id} style={{ background: 'white', borderRadius: 16, padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45, 80, 22, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#2d5016' }}>{request.customer}</h4>
                          <span style={{ background: request.status === 'Approved' ? '#e8f5e9' : request.status === 'Rejected' ? '#fce4ec' : '#fff4e5', color: request.status === 'Approved' ? '#2e7d32' : request.status === 'Rejected' ? '#c62828' : '#d4af37', padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{request.status}</span>
                        </div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Member ID: {request.memberId}</p>
                        <div style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)', padding: '1rem', borderRadius: 10, marginTop: '1rem', border: '1px solid rgba(45, 80, 22, 0.1)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[{ label: 'Requested', value: request.requestDate }, { label: 'From', value: request.pauseFrom }, { label: 'To', value: request.pauseTo }, { label: 'Reason', value: request.reason }].map(f => (
                              <div key={f.label}>
                                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', fontWeight: 500 }}>{f.label}</p>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#2d5016' }}>{f.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {request.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                          <button onClick={() => handlePauseAction(request.id, 'approve')} style={{ background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handlePauseAction(request.id, 'reject')} style={{ background: 'transparent', color: '#c62828', border: '1px solid #c62828', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── CUSTOMER QUERIES ──────────────── */}
          {activeView === 'queries' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '700', color: '#2d5016' }}>Customer Queries & Support Tickets</h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '1rem' }}>{customerQueries.filter(q => q.status === 'Open').length} open queries • {customerQueries.length} total</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {['All', 'Open', 'In Progress', 'Resolved'].map(filter => (
                    <button key={filter} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(45, 80, 22, 0.15)', background: 'white', color: '#666', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' }}>{filter}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {customerQueries.map((query) => (
                  <div key={query.id} style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', border: '1px solid rgba(45, 80, 22, 0.08)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600', color: '#2d5016' }}>{query.subject}</h4>
                          <span style={{ background: query.type === 'Complaint' ? '#ffebee' : query.type === 'Feedback' ? '#e8f5e9' : '#e3f2fd', color: query.type === 'Complaint' ? '#c62828' : query.type === 'Feedback' ? '#2e7d32' : '#1976d2', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>{query.type}</span>
                          <span style={{ background: query.status === 'Open' ? '#fff4e5' : query.status === 'In Progress' ? '#e3f2fd' : '#e8f5e9', color: query.status === 'Open' ? '#d4af37' : query.status === 'In Progress' ? '#1976d2' : '#2e7d32', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>{query.status}</span>
                          {query.priority === 'High' && <span style={{ background: '#ffebee', color: '#c62828', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>High Priority</span>}
                        </div>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Customer: <strong style={{ color: '#2d5016' }}>{query.customer}</strong> ({query.customerId})</p>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>{query.message}</p>
                        {query.assignedTo && <div style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(45, 80, 22, 0.1)', marginBottom: '0.75rem' }}><p style={{ margin: 0, fontSize: '0.85rem', color: '#3d6b1f', fontWeight: '500' }}>Assigned to: {query.assignedTo}</p></div>}
                        {query.response && <div style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(46, 125, 50, 0.2)' }}><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#2e7d32', fontWeight: '700', textTransform: 'uppercase' }}>Response:</p><p style={{ margin: 0, fontSize: '0.85rem', color: '#2e7d32', lineHeight: '1.5' }}>{query.response}</p></div>}
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '150px', marginLeft: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                          <Clock size={14} color="#666" />
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: '500' }}>{query.date}</p>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#999' }}>{query.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── RENEWALS ──────────────── */}
          {activeView === 'renewals' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Upcoming Renewals</h2>
              <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '1rem' }}>{upcomingRenewals.filter(r => r.daysLeft <= 10).length} renewals due in next 10 days</p>
              {upcomingRenewals.length === 0 && !loading && <p style={{ color: '#999' }}>No upcoming renewals.</p>}
              <div style={{ display: 'grid', gap: '1rem' }}>
                {upcomingRenewals.map(renewal => (
                  <div key={renewal.id} style={{ background: 'white', borderRadius: 16, padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: renewal.daysLeft <= 7 ? '2px solid #d4af37' : '1px solid rgba(45,80,22,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#2d5016' }}>{renewal.customer}</h4>
                          {renewal.daysLeft <= 7 && <span style={{ background: '#fff4e5', color: '#d4af37', padding: '0.3rem 0.75rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14} /> Due Soon</span>}
                        </div>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>{renewal.memberId} · {renewal.plan}</p>
                        <div style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)', padding: '1rem', borderRadius: 10, border: '1px solid rgba(45, 80, 22, 0.1)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', fontWeight: 500 }}>Expiry Date</p><p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#2d5016' }}>{renewal.expiryDate}</p></div>
                          <div><p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', fontWeight: 500 }}>Days Left</p><p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: renewal.daysLeft <= 7 ? '#d4af37' : '#2d5016' }}>{renewal.daysLeft} days</p></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                        <button onClick={() => openRenewModal(renewal.order)} style={{ background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><RefreshCcw size={16} /> Renew</button>
                        <button onClick={() => requestPasskey(renewal.order, 'message')} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Remind</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* ──────────────── CREATE ACCOUNT (multi-step) ──────────────── */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeView === 'create' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Create New Customer Account</h2>
                <p style={{ margin: 0, color: '#666' }}>Follow the steps to onboard a new member</p>
              </div>

              {/* ── Step Progress Bar ── */}
              <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem 2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {[
                    { step: 1, label: 'Select Team Member' },
                    { step: 2, label: 'Customize Package' },
                    { step: 3, label: 'Customer Details' },
                    { step: 4, label: 'Payment Verification' }
                  ].map((item, idx) => (
                    <React.Fragment key={item.step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '140px' }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: '50%',
                          background: createStep >= item.step
                            ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)'
                            : '#e0e0e0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: '0.6rem', color: 'white', fontWeight: 700, fontSize: '1.1rem',
                          boxShadow: createStep >= item.step ? '0 4px 12px rgba(45,80,22,0.3)' : 'none',
                          transition: 'all 0.3s'
                        }}>
                          {createStep > item.step ? '✓' : item.step}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: createStep === item.step ? 700 : 500, color: createStep >= item.step ? '#2d5016' : '#999', textAlign: 'center' }}>{item.label}</p>
                      </div>
                      {idx < 3 && (
                        <div style={{ width: 60, height: 3, background: createStep > item.step ? 'linear-gradient(90deg, #2d5016, #3d6b1f)' : '#e0e0e0', marginBottom: 28, borderRadius: 2, transition: 'all 0.3s' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* ── STEP 1: Team Member ── */}
              {createStep === 1 && (
                <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>👤 Who is creating this account?</h3>
                    <p style={{ margin: 0, color: '#666' }}>Select the team member responsible for this customer onboarding</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {teamMembers.map(member => (
                      <div key={member.id} onClick={() => setSelectedTeamMember(member.id)} style={{
                        padding: '1.75rem 1.25rem', borderRadius: 14,
                        border: selectedTeamMember === member.id ? '3px solid #d4af37' : '2px solid #e0e0e0',
                        background: selectedTeamMember === member.id ? 'linear-gradient(135deg, #fff9e6 0%, #fef9f3 100%)' : 'white',
                        cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
                        boxShadow: selectedTeamMember === member.id ? '0 4px 16px rgba(212,175,55,0.2)' : 'none'
                      }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: '50%',
                          background: selectedTeamMember === member.id ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)' : '#f0f7ec',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.5rem', fontWeight: 700,
                          color: selectedTeamMember === member.id ? '#2d5016' : '#666',
                          margin: '0 auto 1rem'
                        }}>{member.name.charAt(0)}</div>
                        <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', fontWeight: 600, color: '#2d5016' }}>{member.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>{member.role}</p>
                        {selectedTeamMember === member.id && (
                          <div style={{ marginTop: '0.75rem', width: 26, height: 26, borderRadius: '50%', background: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', margin: '0.75rem auto 0' }}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#e3f2fd', padding: '1rem 1.5rem', borderRadius: 10, marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>ℹ️ <strong>Note:</strong> This selection will be recorded in audit logs and the team member will be notified.</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => selectedTeamMember && setCreateStep(2)} disabled={!selectedTeamMember} style={{ background: selectedTeamMember ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)' : '#ccc', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: selectedTeamMember ? 'pointer' : 'not-allowed', boxShadow: selectedTeamMember ? '0 4px 15px rgba(45,80,22,0.3)' : 'none' }}>
                      Next: Customize Package →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Customize Package ── */}
              {createStep === 2 && (
                <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>📦 Create Custom Package</h3>
                    <p style={{ margin: 0, color: '#666' }}>Design a personalized package for this customer</p>
                  </div>

                  {/* Package Info */}
                  <div style={{ background: 'linear-gradient(135deg, #f0f7ec 0%, #fef9f3 100%)', padding: '2rem', borderRadius: 12, marginBottom: '2rem', border: '1px solid rgba(45,80,22,0.08)' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d5016' }}>Package Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                     <div>
  <label style={labelStyle}>
    Package Name <span style={{ color: '#d32f2f' }}>*</span>
  </label>

  <select
    value={customPackage.name}
    onChange={(e) =>
      setCustomPackage({
        ...customPackage,
        name: e.target.value,
      })
    }
    style={selectStyle}
  >
    <option value="">Select Package</option>

    <option value="SILVER_1MONTH">
      Silver – 1 Month
    </option>

    <option value="GOLD_1MONTH">
      Gold – 1 Month
    </option>

    <option value="PLATINUM_1MONTH">
      Platinum – 1 Month
    </option>

    <option value="SILVER_3MONTH">
      Silver – 3 Months
    </option>

    <option value="GOLD_3MONTH">
      Gold – 3 Months
    </option>

    <option value="PLATINUM_3MONTH">
      Platinum – 3 Months
    </option>
  </select>
</div>
                      <div>
                        <label style={labelStyle}>Duration <span style={{ color: '#d32f2f' }}>*</span></label>
                        <select value={customPackage.duration} onChange={e => {
                          const total = calculateTotalMeals(e.target.value, customPackage.mealsPerWeek);
                          setCustomPackage({ ...customPackage, duration: e.target.value, totalMeals: total.toString() });
                        }} style={selectStyle}>
                          <option value="">Select duration</option>
                          <option value="1-month">1 Month</option>
                          <option value="2-month">2 Months</option>
                          <option value="3-month">3 Months</option>
                          <option value="6-month">6 Months</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Meals Per Week <span style={{ color: '#d32f2f' }}>*</span></label>
                        <select value={customPackage.mealsPerWeek} onChange={e => {
                          const total = calculateTotalMeals(customPackage.duration, e.target.value);
                          setCustomPackage({ ...customPackage, mealsPerWeek: e.target.value, totalMeals: total.toString() });
                        }} style={selectStyle}>
                          <option value="">Select meals/week</option>
                          {[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} meals/week</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Total Meals (auto-calculated)</label>
                        <input type="text" value={customPackage.totalMeals || '0'} readOnly style={{ ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed' }} />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Package Price (₹) <span style={{ color: '#d32f2f' }}>*</span></label>
                        <input type="number" placeholder="Enter price" value={customPackage.price} onChange={e => setCustomPackage({ ...customPackage, price: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#2d5016' }}>Select Features</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                      {packageFeatures.map((feature, idx) => (
                        <div key={idx} onClick={() => handleFeatureToggle(feature)} style={{
                          padding: '0.9rem 1rem', borderRadius: 8,
                          border: customPackage.features.includes(feature) ? '2px solid #2e7d32' : '2px solid #ddd',
                          background: customPackage.features.includes(feature) ? '#e8f5e9' : 'white',
                          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s'
                        }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{feature}</span>
                          {customPackage.features.includes(feature) && (
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {customPackage.name && customPackage.price && (
                    <div style={{ background: 'linear-gradient(135deg, #fff4e5 0%, #fef9f3 100%)', padding: '1.5rem', borderRadius: 12, border: '2px solid #d4af37', marginBottom: '2rem' }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#2d5016' }}>📋 Package Summary</h4>
                      {[
                        ['Package', customPackage.name],
                        ['Duration', customPackage.duration || '—'],
                        ['Meals/week', customPackage.mealsPerWeek || '—'],
                        ['Total meals', customPackage.totalMeals || '0'],
                        ['Features', `${customPackage.features.length} selected`],
                      ].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ color: '#666' }}>{label}:</span><strong>{value}</strong>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #d4af37', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 700 }}>Price:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2e7d32' }}>₹{customPackage.price}</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => setCreateStep(1)} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                    <button onClick={() => setCreateStep(3)} disabled={!customPackage.name || !customPackage.price || !customPackage.duration} style={{ background: (customPackage.name && customPackage.price && customPackage.duration) ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)' : '#ccc', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: (customPackage.name && customPackage.price && customPackage.duration) ? 'pointer' : 'not-allowed' }}>
                      Next: Customer Details →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Customer Details ── */}
              {createStep === 3 && (
                <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>👤 Customer Information</h3>
                    <p style={{ margin: 0, color: '#666' }}>Fill in customer details for account creation</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    {[
                      { label: 'Full Name', key: 'fullName', type: 'text', required: true },
                      { label: 'Phone Number', key: 'phone', type: 'tel', required: true },
                      { label: 'Email', key: 'email', type: 'email', required: true },
                      { label: 'Date of Birth', key: 'dob', type: 'date' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label} {f.required && <span style={{ color: '#d32f2f' }}>*</span>}</label>
                        <input type={f.type} value={createCustomerData[f.key]} onChange={e => setCreateCustomerData({ ...createCustomerData, [f.key]: e.target.value })} style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Delivery Time Slot <span style={{ color: '#d32f2f' }}>*</span></label>
                      <select value={createCustomerData.timeSlot} onChange={e => setCreateCustomerData({ ...createCustomerData, timeSlot: e.target.value })} style={selectStyle}>
                        <option value="">Select time slot</option>
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
                      <label style={labelStyle}>Start Date</label>
                      <input type="date" value={createCustomerData.startDate} onChange={e => setCreateCustomerData({ ...createCustomerData, startDate: e.target.value })} style={inputStyle} />
                    </div>

                    {/* Health Info */}
                    {[
                      { label: 'Allergies', key: 'allergies' },
                      { label: 'Medical Conditions', key: 'medicalConditions' },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label}</label>
                        <textarea rows={2} value={createCustomerData[f.key]} onChange={e => setCreateCustomerData({ ...createCustomerData, [f.key]: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                    ))}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Remarks</label>
                      <textarea rows={2} value={createCustomerData.remarks} onChange={e => setCreateCustomerData({ ...createCustomerData, remarks: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    {/* Address Section */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ ...labelStyle, fontSize: '1rem', borderBottom: '2px solid rgba(45,80,22,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>📍 Address</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Pincode <span style={{ color: '#d32f2f' }}>*</span></label>
                          <select value={createCustomerData.pincode} onChange={e => {
                            const selected = allowedPincodes.find(p => p.code === e.target.value);
                            setCreateCustomerData({ ...createCustomerData, pincode: e.target.value, area: selected?.area || '' });
                          }} style={selectStyle}>
                            <option value="">Select Pincode</option>
                            {allowedPincodes.map(p => <option key={p.code} value={p.code}>{p.code} — {p.area}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Area</label>
                          <input value={createCustomerData.area} readOnly style={{ ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed' }} />
                        </div>
                        {[
                          { label: 'House / Flat', key: 'house' },
                          { label: 'Street', key: 'street' },
                          { label: 'Landmark', key: 'landmark' },
                        ].map(f => (
                          <div key={f.key}>
                            <label style={labelStyle}>{f.label}</label>
                            <input value={createCustomerData[f.key]} onChange={e => setCreateCustomerData({ ...createCustomerData, [f.key]: e.target.value })} style={inputStyle} />
                          </div>
                        ))}
                        <div>
                          <label style={labelStyle}>City</label>
                          <select value={createCustomerData.city} onChange={e => setCreateCustomerData({ ...createCustomerData, city: e.target.value })} style={selectStyle}>
                            <option value="Dombivli">Dombivli</option>
                            <option value="Kalyan">Kalyan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button onClick={() => setCreateStep(2)} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                    <button onClick={() => setCreateStep(4)} disabled={!createCustomerData.fullName || !createCustomerData.phone || !createCustomerData.email} style={{ background: (createCustomerData.fullName && createCustomerData.phone && createCustomerData.email) ? 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)' : '#ccc', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: (createCustomerData.fullName && createCustomerData.phone && createCustomerData.email) ? 'pointer' : 'not-allowed' }}>
                      Next: Payment Verification →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Payment Verification ── */}
              {createStep === 4 && (
                <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid rgba(45,80,22,0.08)' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>💰 Payment Verification</h3>
                    <p style={{ margin: 0, color: '#666' }}>Verify payment to activate customer account</p>
                  </div>

                  {/* Summary */}
                  <div style={{ background: '#f0f7ec', padding: '1.5rem', borderRadius: 12, marginBottom: '2rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#2d5016' }}>Customer Summary</h4>
                    {[
                      ['Team Member', teamMembers.find(t => t.id === selectedTeamMember)?.name],
                      ['Customer', createCustomerData.fullName],
                      ['Phone', createCustomerData.phone],
                      ['Package', customPackage.name],
                      ['Duration', customPackage.duration],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#666' }}>{label}:</span><strong>{value || '—'}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(45,80,22,0.15)', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>Amount Due:</span>
                      <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>₹{customPackage.price}</strong>
                    </div>
                  </div>

                  {/* Payment status options */}
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ ...labelStyle, fontSize: '1rem', marginBottom: '1rem' }}>Has payment been received? <span style={{ color: '#d32f2f' }}>*</span></label>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {[
                        { val: true, icon: '✅', title: 'Yes, payment received', sub: 'Account will be created and activated immediately', border: '#2e7d32', bg: '#e8f5e9' },
                        { val: false, icon: '⏳', title: 'No, waiting for payment', sub: 'Save details as pending for later activation', border: '#d4af37', bg: '#fff4e5' },
                      ].map(opt => (
                        <div key={String(opt.val)} onClick={() => setCreatePaymentData({ ...createPaymentData, received: opt.val })} style={{
                          padding: '1.25rem 1.5rem', borderRadius: 12,
                          border: createPaymentData.received === opt.val ? `3px solid ${opt.border}` : '2px solid #ddd',
                          background: createPaymentData.received === opt.val ? opt.bg : 'white',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
                        }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${createPaymentData.received === opt.val ? opt.border : '#ccc'}`, background: createPaymentData.received === opt.val ? opt.border : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                            {createPaymentData.received === opt.val ? '✓' : ''}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>{opt.icon} {opt.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>{opt.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment details (only if received = true) */}
                  {createPaymentData.received === true && (
                    <div style={{ background: '#f0f7ec', padding: '1.75rem', borderRadius: 12, marginBottom: '2rem', border: '1px solid rgba(45,80,22,0.1)' }}>
                      <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d5016' }}>Payment Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        <div>
                          <label style={labelStyle}>Payment Method <span style={{ color: '#d32f2f' }}>*</span></label>
                          <select value={createPaymentData.method} onChange={e => setCreatePaymentData({ ...createPaymentData, method: e.target.value })} style={selectStyle}>
                            <option value="">Select method</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Card">Card</option>
                            <option value="Cheque">Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Amount Received <span style={{ color: '#d32f2f' }}>*</span></label>
                          <input type="number" value={createPaymentData.amount} placeholder={customPackage.price} onChange={e => setCreatePaymentData({ ...createPaymentData, amount: e.target.value })} style={inputStyle} />
                        </div>
                        {createPaymentData.method && createPaymentData.method !== 'Cash' && (
                          <div style={{ gridColumn: 'span 2' }}>
                            <label style={labelStyle}>Transaction ID / Reference</label>
                            <input type="text" value={createPaymentData.transactionId} onChange={e => setCreatePaymentData({ ...createPaymentData, transactionId: e.target.value })} placeholder="Enter transaction reference" style={inputStyle} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => setCreateStep(3)} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                    {createPaymentData.received === true ? (
                      <button onClick={handleCreateAccount} disabled={saving || !createPaymentData.method || !createPaymentData.amount} style={{ background: (!saving && createPaymentData.method && createPaymentData.amount) ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)' : '#ccc', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: (!saving && createPaymentData.method && createPaymentData.amount) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {saving ? 'Saving…' : '✓ Confirm Payment & Create Account'}
                      </button>
                    ) : createPaymentData.received === false ? (
                      <button onClick={handleCreateAccount} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                        💾 Save as Pending
                      </button>
                    ) : (
                      <button disabled style={{ background: '#ccc', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'not-allowed' }}>
                        Select payment status above
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── AUDIT LOGS ──────────────── */}
       {activeView === 'audit' && (
  <div style={{ animation: 'fadeIn 0.4s ease' }}>

    {/* HEADER */}
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#2d5016'
        }}
      >
        Audit Logs & Activity Tracking
      </h2>

      <p
        style={{
          margin: 0,
          color: '#666'
        }}
      >
        Track all admin activities and customer actions
      </p>
    </div>

    {/* LOADING */}
    {loading && (
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: 16,
          color: '#666'
        }}
      >
        Loading audit logs...
      </div>
    )}

    {/* EMPTY */}
    {!loading &&
      auditLogs.length === 0 && (
        <div
          style={{
            background: 'white',
            padding: '3rem',
            borderRadius: 16,
            textAlign: 'center',
            color: '#999',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.06)'
          }}
        >
          No audit logs found.
        </div>
      )}

    {/* LOGS */}
    <div
      style={{
        display: 'grid',
        gap: '1rem'
      }}
    >

      {auditLogs.map((log) => (

        <div
          key={log._id}
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '1.5rem 2rem',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.06)',
            border:
              '1px solid rgba(45,80,22,0.08)'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}
          >

            {/* LEFT */}
            <div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >

                <h4
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#2d5016'
                  }}
                >
                  {log.customerName}
                </h4>

                <span
                  style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {log.action}
                </span>
              </div>

              <p
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.92rem',
                  color: '#555',
                  lineHeight: 1.6
                }}
              >
                {log.details}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#777'
                }}
              >
                👤

                <strong>
                  {log.performedBy}
                </strong>
              </div>
            </div>

            {/* RIGHT */}
            <div
              style={{
                textAlign: 'right',
                minWidth: 180
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem'
                }}
              >
                <Clock
                  size={14}
                  color="#666"
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: '#666',
                    fontWeight: 500
                  }}
                >
                  {new Date(
                    log.createdAt
                  ).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
              </div>

              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.8rem',
                  color: '#999'
                }}
              >
                {new Date(
                  log.createdAt
                ).toLocaleTimeString(
                  "en-IN"
                )}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
)}
        </main>
      </div>

      {/* ── PASSKEY MODAL ── */}
      {showPasskeyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 480, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #fff4e5, #ffe8cc)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Lock size={28} color="#d4af37" /></div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Passkey Required</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>Enter your passkey to {passkeyAction === 'view' ? 'view customer details' : passkeyAction === 'edit' ? 'edit customer' : 'send message'}</p>
            </div>
            <input type="password" value={passkey} onChange={e => setPasskey(e.target.value)} placeholder="Enter passkey" onKeyPress={e => e.key === 'Enter' && handlePasskeySubmit()} style={{ width: '100%', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: '0.95rem', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handlePasskeySubmit} style={{ flex: 1, background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Verify</button>
              <button onClick={() => { setShowPasskeyModal(false); setPasskey(''); }} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── BROADCAST MODAL ── */}
      {showBroadcastModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 600, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Broadcast Message</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Send notification to all {orders.length} customers</p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={24} color="#666" /></button>
            </div>
            <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="Type your message here…" style={{ width: '100%', padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', fontSize: '0.95rem', minHeight: 150, resize: 'vertical', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
            <button onClick={sendBroadcastMessage} style={{ width: '100%', background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={20} /> Send to All Customers
            </button>
          </div>
        </div>
      )}

      {/* ── CUSTOMER DETAIL MODAL ── */}
      {showCustomerDetail && selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', maxWidth: 900, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', margin: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 700, color: '#2d5016' }}>Customer Profile</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedCustomer.membershipId}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {editingRow !== selectedCustomer._id && (
                  <button onClick={() => requestPasskey(selectedCustomer, 'edit')} style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)', color: '#2d5016', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Edit size={16} /> Edit</button>
                )}
                <button onClick={() => { setShowCustomerDetail(false); setEditingRow(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={24} color="#666" /></button>
              </div>
            </div>
            {editingRow === selectedCustomer._id ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                {[
                  { label: 'First Name', key: 'firstName' }, { label: 'Last Name', key: 'lastName' },
                  { label: 'Phone', key: 'phone' }, { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Date of Birth', key: 'dob', type: 'date' }, { label: 'House / Flat', key: 'house' },
                  { label: 'Street', key: 'street' }, { label: 'Landmark', key: 'landmark' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type || 'text'} value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} style={{ ...inputStyle, border: '2px solid #d4af37' }} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>City</label>
                  <select value={editData.city} onChange={e => setEditData({ ...editData, city: e.target.value })} style={{ ...selectStyle, border: '2px solid #d4af37' }}>
                    <option value="Dombivli">Dombivli</option>
                    <option value="Kalyan">Kalyan</option>
                  </select>
                </div>
                {[{ label: 'Allergies', key: 'allergies' }, { label: 'Medical Conditions', key: 'medicalConditions' }, { label: 'Remarks', key: 'remarks' }].map(f => (
                  <div key={f.key} style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>{f.label}</label>
                    <textarea rows={2} value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} style={{ ...inputStyle, resize: 'vertical', border: '2px solid #d4af37' }} />
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleSaveEdit(selectedCustomer._id)} style={{ background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>💾 Save Changes</button>
                  <button onClick={() => setEditingRow(null)} style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem 2rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
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
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem' }}>{f.label}</label>
                    <div style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', background: '#f8f8f8', fontSize: '0.95rem', color: '#333' }}>{f.value}</div>
                  </div>
                ))}
                {selectedCustomer.address && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem' }}>Address</label>
                    <div style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', background: '#f8f8f8', fontSize: '0.95rem', color: '#333' }}>
                      {[selectedCustomer.address.house, selectedCustomer.address.street, selectedCustomer.address.landmark, selectedCustomer.address.city, selectedCustomer.address.pincode].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
                {selectedCustomer.remarks && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem' }}>Remarks</label>
                    <div style={{ padding: '0.875rem', borderRadius: 10, border: '1px solid rgba(45,80,22,0.15)', background: '#fffde7', fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>{selectedCustomer.remarks}</div>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 480, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2d5016' }}>Renew Membership</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#666', fontSize: '0.9rem' }}>{selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName} · {selectedCustomer.membershipId}</p>
            <label style={labelStyle}>Duration</label>
            <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ ...selectStyle, marginBottom: '1.25rem' }}><option value={1}>1 Month</option><option value={3}>3 Months</option></select>
            <label style={labelStyle}>Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...selectStyle, marginBottom: '1.25rem' }}><option value="CASH">Cash</option><option value="ONLINE">Online</option></select>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={renewStartDate} onChange={e => setRenewStartDate(e.target.value)} style={{ ...inputStyle, marginBottom: '1.25rem' }} />
            <label style={labelStyle}>Total Price</label>
            <input type="number" placeholder="Enter total price" value={renewPrice} onChange={e => setRenewPrice(e.target.value)} style={{ ...inputStyle, marginBottom: '1.75rem' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleRenew} style={{ flex: 1, background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>✅ Confirm Renew</button>
              <button onClick={() => setShowRenew(false)} style={{ flex: 1, background: 'transparent', color: '#666', border: '1px solid #ddd', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── INDIVIDUAL MESSAGE MODAL ── */}
      {showIndividualMessage && selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 550, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 700, color: '#2d5016' }}>Send Message</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>To: {selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}</p>
              </div>
              <button onClick={() => setShowIndividualMessage(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#666" /></button>
            </div>
            <textarea value={individualMessage} onChange={e => setIndividualMessage(e.target.value)} placeholder="Type your message…" rows={5} style={{ ...inputStyle, resize: 'vertical', marginBottom: '1.5rem' }} />
            <button onClick={sendIndividualMessage} style={{ width: '100%', background: 'linear-gradient(135deg, #2d5016 0%, #3d6b1f 100%)', color: 'white', border: 'none', padding: '1rem', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Send Message
            </button>
          </div>
        </div>
      )}

    {/* ── PAYMENT VERIFICATION MODAL ── */}
{showPaymentModal && selectedPending && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}
  >
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '2.5rem',
        maxWidth: 600,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}
    >

      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            margin: '0 0 0.5rem',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#2d5016'
          }}
        >
          💰 Verify Payment
        </h3>

        <p style={{ margin: 0, color: '#666' }}>
          Complete payment verification to activate account
        </p>
      </div>

      {/* CUSTOMER DETAILS */}
      <div
        style={{
          background: '#f0f7ec',
          padding: '1.5rem',
          borderRadius: 12,
          marginBottom: '2rem'
        }}
      >
        <h4
          style={{
            margin: '0 0 1rem 0',
            color: '#2d5016'
          }}
        >
          Customer Details
        </h4>

        {[
          [
            'Name',
            `${selectedPending?.user?.firstName || ''} ${selectedPending?.user?.lastName || ''}`
          ],

          [
            'Package',
            selectedPending?.subscription?.plan || 'N/A'
          ],

          [
            'Amount Due',
            `₹${selectedPending?.subscription?.amount || 0}`
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}
          >
            <span style={{ color: '#666' }}>
              {label}:
            </span>

            <strong
              style={{
                fontSize:
                  label === 'Amount Due'
                    ? '1.2rem'
                    : '1rem',

                color:
                  label === 'Amount Due'
                    ? '#2e7d32'
                    : '#333'
              }}
            >
              {value}
            </strong>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >

        {/* PAYMENT METHOD */}
        <div>
          <label style={labelStyle}>
            Payment Method
            <span style={{ color: '#d32f2f' }}>
              *
            </span>
          </label>

          <select
            value={paymentData.method}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                method: e.target.value
              })
            }
            style={selectStyle}
          >
            <option value="">
              Select method
            </option>

            <option value="CASH">
              Cash
            </option>

            <option value="GPAY">
              GPay
            </option>

            <option value="ONLINE">
              Online Transfer
            </option>

            <option value="CARD">
              Card
            </option>

            <option value="EASEBUZZ">
              Easebuzz
            </option>
          </select>
        </div>

        {/* AMOUNT */}
        <div>
          <label style={labelStyle}>
            Amount Received
            <span style={{ color: '#d32f2f' }}>
              *
            </span>
          </label>

          <input
            type="number"
            value={paymentData.amount}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                amount: e.target.value
              })
            }
            style={inputStyle}
          />
        </div>

        {/* TRANSACTION ID */}
        {paymentData.method &&
          paymentData.method !== 'CASH' && (
            <div>
              <label style={labelStyle}>
                Transaction ID / Reference
              </label>

              <input
                type="text"
                value={paymentData.transactionId}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    transactionId:
                      e.target.value
                  })
                }
                placeholder="Enter transaction reference"
                style={inputStyle}
              />
            </div>
          )}
      </div>

      {/* BUTTONS */}
      <div
        style={{
          display: 'flex',
          gap: '1rem'
        }}
      >

        <button
          onClick={handleConfirmPayment}
          disabled={
            !paymentData.method ||
            !paymentData.amount
          }
          style={{
            flex: 1,

            background:
              paymentData.method &&
              paymentData.amount
                ? 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)'
                : '#ccc',

            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 600,

            cursor:
              paymentData.method &&
              paymentData.amount
                ? 'pointer'
                : 'not-allowed'
          }}
        >
          ✓ Confirm & Activate
        </button>

        <button
          onClick={() => {
            setShowPaymentModal(false);
            setSelectedPending(null);
          }}
          style={{
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            padding: '1rem 2rem',
            borderRadius: 12,
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { opacity: 0.9; transform: translateY(-1px); transition: all 0.2s ease; }
        input:focus, textarea:focus, select:focus { outline: none !important; border-color: #d4af37 !important; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15) !important; }
      `}</style>
    </div>
  );
}