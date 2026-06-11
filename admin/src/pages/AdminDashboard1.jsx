import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, MessageSquare, Plus, Lock, Eye, Edit, Clock, Activity,
  Mail, Search, X, Send, Package, Calendar,
  DollarSign, PauseCircle, BarChart3,
  AlertCircle, RefreshCcw, CalendarClock, ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  { code: "421202", area: "Dombivli West" },
  { code: "421203", area: "Dombivli East" },
  { code: "421204", area: "Khoni" },
  { code: "421301", area: "Kalyan" },
];

const teamMembers = [
  { id: 'saurabh', name: 'Saurabh Sir', role: 'Senior Manager' },
  { id: 'yashwant', name: 'Yashwant', role: 'Team Lead' },
  { id: 'shravani', name: 'Shravani', role: 'Web Developer' },
  { id: 'sakshi', name: 'Sakshi', role: 'Operations Associate' }
];

const packageFeatures = [
  'High-Protein Meals', 'Gut-Friendly Recipes', 'Detox Juices', 'Priority Support',
  'Flexible Pauses (3/month)', 'Menu Customization', 'Weekend Delivery', 'Nutrition Consultation'
];

// ── THEME HELPERS ──────────────────────────────────────────────────────────

const CARD_BORDER = 'rgba(42,37,32,0.08)';

const STATUS = {
  active: { bg: 'rgba(107,117,96,0.14)', fg: SAGE_DARK },
  paused: { bg: 'rgba(176,137,79,0.16)', fg: '#9a6a2e' },
  expired: { bg: 'rgba(150,70,60,0.14)', fg: '#9a4a3e' },
};

const cardStyle = {
  background: CREAM,
  borderRadius: 4,
  border: `1px solid ${CARD_BORDER}`,
  boxShadow: '0 1px 10px rgba(42,37,32,0.04)',
};

const inputStyle = { width: '100%', padding: '0.85rem', borderRadius: 4, border: `1px solid rgba(42,37,32,0.18)`, fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', color: INK, background: CREAM, outline: 'none' };
const selectStyle = { ...inputStyle };
const labelStyle = { display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: SAGE_DARK, marginBottom: '0.5rem' };
const eyebrowStyle = { fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: SAGE_DARK, fontWeight: 600 };
const h2Style = { margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, color: INK, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.01em' };
const primaryBtn = { background: INK, color: CREAM, border: `1px solid ${INK}`, padding: '0.7rem 1.4rem', borderRadius: 2, fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' };
const accentBtn = { background: SAGE, color: DARK_2, border: `1px solid ${SAGE}`, padding: '0.7rem 1.4rem', borderRadius: 2, fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' };
const ghostBtn = { background: 'transparent', color: INK, border: `1px solid rgba(42,37,32,0.25)`, padding: '0.7rem 1.4rem', borderRadius: 2, fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' };
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(20,17,15,0.7)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' };
const modalStyle = { background: CREAM, borderRadius: 4, padding: '2rem', maxWidth: 480, width: '100%', boxShadow: '0 24px 60px rgba(20,17,15,0.35)', border: `1px solid ${CARD_BORDER}` };

// ── STATIC MOCK DATA (fallback / customer queries) ─────────────────────────

const customerQueries = [
  { id: 'Q001', customer: 'Priya Sharma', customerId: 'RR001', type: 'Complaint', subject: 'Late Delivery', message: 'My meal was delivered 2 hours late today. This is affecting my schedule.', date: '2024-05-15', time: '10:30 AM', status: 'Open', priority: 'High', assignedTo: null, response: null },
  { id: 'Q002', customer: 'Amit Patel', customerId: 'RR002', type: 'Feedback', subject: 'Menu Suggestions', message: 'Would love to see more South Indian options in the menu.', date: '2024-05-14', time: '03:45 PM', status: 'In Progress', priority: 'Low', assignedTo: 'Sakshi', response: 'Thank you for the suggestion. We are working on expanding our menu.' },
  { id: 'Q003', customer: 'Sneha Desai', customerId: 'RR003', type: 'Complaint', subject: 'Wrong Order Delivered', message: 'I received a sandwich instead of the salad I ordered.', date: '2024-05-14', time: '11:20 AM', status: 'Resolved', priority: 'High', assignedTo: 'Sakshi', response: 'We sincerely apologize. A replacement salad has been sent and one free meal credited.' },
  { id: 'Q004', customer: 'Rahul Kumar', customerId: 'RR004', type: 'Query', subject: 'Pause Subscription', message: 'How do I pause my subscription for a week? I will be traveling.', date: '2024-05-13', time: '09:15 AM', status: 'Resolved', priority: 'Medium', assignedTo: 'Sakshi', response: 'You can pause from your dashboard. We have also paused it for you from May 20–27.' },
];

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function AdminDashboard1() {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  // ── API-backed state ──
  const [orders, setOrders] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingRow, setEditingRow] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [individualMessage, setIndividualMessage] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPending, setSelectedPending] = useState(null);
  const [paymentData, setPaymentData] = useState({ received: false, method: '', amount: '', transactionId: '', startDate: '', date: new Date().toISOString().split('T')[0], notes: '' });

  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [renewStartDate, setRenewStartDate] = useState("");
  const [renewPrice, setRenewPrice] = useState("");

  const [editData, setEditData] = useState({ firstName: "", lastName: "", phone: "", email: "", dob: "", allergies: "", medicalConditions: "", remarks: "", house: "", street: "", landmark: "", city: "" });

  const [createStep, setCreateStep] = useState(1);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [customPackage, setCustomPackage] = useState({ name: '', duration: '', mealsPerWeek: '', totalMeals: '', price: '', features: [] });
  const [createCustomerData, setCreateCustomerData] = useState({ fullName: '', phone: '', email: '', dob: '', timeSlot: '', startDate: '', allergies: '', medicalConditions: '', remarks: '', pincode: '', area: '', house: '', street: '', landmark: '', city: 'Dombivli' });
  const [createPaymentData, setCreatePaymentData] = useState({ received: null, method: '', amount: '', transactionId: '', date: new Date().toISOString().split('T')[0], notes: '' });

  const [pauseRequests, setPauseRequests] = useState([
    { id: 'P001', customer: 'Sneha Desai', memberId: 'RR003', requestDate: 'May 10, 2024', pauseFrom: 'May 15', pauseTo: 'May 20', reason: 'Traveling', status: 'Approved' },
    { id: 'P002', customer: 'Rohan Mehta', memberId: 'RR007', requestDate: 'May 14, 2024', pauseFrom: 'May 18', pauseTo: 'May 22', reason: 'Family function', status: 'Pending' },
    { id: 'P003', customer: 'Kavya Iyer', memberId: 'RR008', requestDate: 'May 13, 2024', pauseFrom: 'May 20', pauseTo: 'May 25', reason: 'Out of station', status: 'Pending' },
  ]);

  // ── Lifecycle ──
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) window.location.href = "/";
    fetchOrders();
    fetchPendingPayments();
    fetchAuditLogs();
  }, []);

  useEffect(() => { setMobileNavOpen(false); }, [activeView]);

  useEffect(() => {
    const anyModal = showPasskeyModal || showBroadcastModal || showCustomerDetail || showIndividualMessage || showRenew || showPaymentModal || mobileNavOpen;
    document.body.style.overflow = anyModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showPasskeyModal, showBroadcastModal, showCustomerDetail, showIndividualMessage, showRenew, showPaymentModal, mobileNavOpen]);

  // ── API calls ──
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
      const res = await fetch("https://api.ryviveroots.com/api/admin/pending-payments");
      const data = await res.json();
      if (data.success) setPendingCustomers(data.pendingPayments);
    } catch (err) {
      console.error("Failed to fetch pending payments", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) setAuditLogs(data.logs);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  // ── Helpers ──
  const getPauseStatusText = (order) => {
    if (order.subscription?.status === "EXPIRED") return "EXPIRED";
    if (order.subscription?.status === "UNDER_PROCESS") return "UNDER PROCESS";
    const pause = order.subscription?.pause;
    if (!pause?.history?.length) return "ACTIVE";
    const latest = pause.history[pause.history.length - 1];
    const start = new Date(latest.startDate);
    const resume = new Date(latest.resumeDate);
    const days = latest.days || 1;
    const today = new Date();
    const startText = start.toLocaleDateString("en-IN");
    const resumeText = resume.toLocaleDateString("en-IN");
    if (today >= start && today <= resume) return days === 1 ? `PAUSED • ${startText} (1 day)` : `PAUSED • ${startText} → ${resumeText}`;
    if (today < start) return days === 1 ? `ACTIVE • Pause scheduled ${startText} (1 day)` : `ACTIVE • Pause scheduled ${startText} → ${resumeText}`;
    return "ACTIVE";
  };

  const statusTone = (text) => text.includes('PAUSED') ? STATUS.paused : text.includes('EXPIRED') ? STATUS.expired : STATUS.active;

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
    setCreateStep(1); setSelectedTeamMember('');
    setCustomPackage({ name: '', duration: '', mealsPerWeek: '', totalMeals: '', price: '', features: [] });
    setCreateCustomerData({ fullName: '', phone: '', email: '', dob: '', timeSlot: '', startDate: '', allergies: '', medicalConditions: '', remarks: '', pincode: '', area: '', house: '', street: '', landmark: '', city: 'Dombivli' });
    setCreatePaymentData({ received: null, method: '', amount: '', transactionId: '', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const dashboardStats = {
    totalCustomers: orders.length,
    activeSubscriptions: orders.filter(o => o.subscription?.status !== 'EXPIRED' && o.subscription?.status !== 'UNDER_PROCESS').length,
    pendingQueries: customerQueries.filter(q => q.status === 'Open').length,
    pausedSubscriptions: orders.filter(o => getPauseStatusText(o).includes('PAUSED')).length,
    upcomingRenewals: orders.filter(o => canShowRenew(o)).length,
    pendingRenewals: orders.filter(o => o.subscription?.status === 'EXPIRED').length,
    pendingPayments: pendingCustomers.length,
  };

  // ── Action handlers ──
  const handlePasskeySubmit = () => {
    if (passkey === '1234') {
      if (passkeyAction === 'view') setShowCustomerDetail(true);
      else if (passkeyAction === 'message') setShowIndividualMessage(true);
      else if (passkeyAction === 'edit') {
        setEditingRow(selectedCustomer._id);
        setEditData({
          firstName: selectedCustomer.user?.firstName || "", lastName: selectedCustomer.user?.lastName || "",
          phone: selectedCustomer.user?.phone || "", email: selectedCustomer.user?.email || "",
          dob: selectedCustomer.user?.dob ? selectedCustomer.user.dob.split("T")[0] : "",
          allergies: selectedCustomer.healthInfo?.allergies || "", medicalConditions: selectedCustomer.healthInfo?.medicalConditions || "",
          remarks: selectedCustomer.remarks || "", house: selectedCustomer.address?.house || "",
          street: selectedCustomer.address?.street || "", landmark: selectedCustomer.address?.landmark || "",
          city: selectedCustomer.address?.city || "",
        });
        setShowCustomerDetail(true);
      }
      setShowPasskeyModal(false); setPasskey('');
    } else {
      alert('Invalid passkey. Hint: 1234');
    }
  };

  const requestPasskey = (order, action) => { setSelectedCustomer(order); setPasskeyAction(action); setShowPasskeyModal(true); };
  const openRenewModal = (order) => { setSelectedCustomer(order); setDuration(1); setPaymentMethod("CASH"); setRenewStartDate(""); setRenewPrice(""); setShowRenew(true); };

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
      alert("Updated successfully");
      setEditingRow(null); setShowCustomerDetail(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to update details");
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
        alert("Renewal Successful!");
        setShowRenew(false);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Renewal failed.");
    }
  };

  const handleCreateAccount = async () => {
    const member = teamMembers.find(t => t.id === selectedTeamMember);
    const payload = {
      user: {
        firstName: createCustomerData.fullName.split(' ')[0] || createCustomerData.fullName,
        lastName: createCustomerData.fullName.split(' ').slice(1).join(' ') || '',
        phone: createCustomerData.phone, email: createCustomerData.email, dob: createCustomerData.dob
      },
      address: { pincode: createCustomerData.pincode, area: createCustomerData.area, house: createCustomerData.house, street: createCustomerData.street, landmark: createCustomerData.landmark, city: createCustomerData.city, state: 'Maharashtra', country: 'India' },
      healthInfo: { allergies: createCustomerData.allergies, medicalConditions: createCustomerData.medicalConditions },
      remarks: createCustomerData.remarks, plan: customPackage.name, slot: createCustomerData.timeSlot,
      paymentMethod: createPaymentData.method?.toUpperCase() || 'CASH',
      startDate: createCustomerData.startDate, totalPrice: customPackage.price, createdBy: member?.name,
    };

    if (createPaymentData.received) {
      try {
        setSaving(true);
        const res = await fetch("https://api.ryviveroots.com/api/admin/manual-order", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add member");
        if (data.success) {
          alert("Member added successfully!");
          resetCreateForm(); setActiveView('customers'); fetchOrders();
        }
      } catch (error) {
        alert(error.message || "Server error.");
      } finally {
        setSaving(false);
      }
    } else {
      try {
        setSaving(true);
        const pendingPayload = {
          user: { firstName: createCustomerData.fullName.split(' ')[0] || createCustomerData.fullName, lastName: createCustomerData.fullName.split(' ').slice(1).join(' ') || '', phone: createCustomerData.phone, email: createCustomerData.email, dob: createCustomerData.dob },
          address: { pincode: createCustomerData.pincode, area: createCustomerData.area, house: createCustomerData.house, street: createCustomerData.street, landmark: createCustomerData.landmark, city: createCustomerData.city, state: 'Maharashtra', country: 'India' },
          healthInfo: { allergies: createCustomerData.allergies, medicalConditions: createCustomerData.medicalConditions },
          remarks: createCustomerData.remarks, deliverySlot: createCustomerData.timeSlot,
          subscription: { plan: customPackage.name, amount: Number(customPackage.price), durationMonths: customPackage.name?.includes("3MONTH") ? 3 : 1, startDate: createCustomerData.startDate },
          paymentMethod: createPaymentData.method?.toUpperCase() || 'CASH',
          createdBy: member?.name || 'Admin',
        };
        const res = await fetch("https://api.ryviveroots.com/api/admin/pending-payment", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingPayload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save pending payment");
        alert("Customer saved as Pending Payment!");
        resetCreateForm(); setActiveView('pending'); fetchPendingPayments();
      } catch (error) {
        alert(error.message || "Failed to create pending payment");
      } finally {
        setSaving(false);
      }
    }
  };

  const sendIndividualMessage = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/send-message", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: selectedCustomer.membershipId, message: individualMessage }),
      });
      const data = await res.json();
      if (data.success) { alert("Message sent successfully"); setIndividualMessage(''); setShowIndividualMessage(false); }
    } catch (err) { alert("Failed to send"); }
  };

  const sendBroadcastMessage = async () => {
    try {
      const res = await fetch("https://api.ryviveroots.com/api/admin/broadcast", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage }),
      });
      const data = await res.json();
      if (data.success) { alert("Broadcast sent"); setBroadcastMessage(''); setShowBroadcastModal(false); }
    } catch (err) { alert("Failed"); }
  };

  const handlePauseAction = (id, action) => {
    setPauseRequests(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
  };

  const handleVerifyPayment = (pending) => {
    setSelectedPending(pending);
    setPaymentData({
      received: false, method: pending.paymentMethod || "CASH",
      amount: pending.subscription?.amount || "", transactionId: "",
      startDate: pending.subscription?.startDate ? new Date(pending.subscription.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      date: new Date().toISOString().split("T")[0], notes: ""
    });
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    try {
      if (!selectedPending) { alert("No customer selected"); return; }
      const res = await fetch(`https://api.ryviveroots.com/api/admin/verify-pending-payment/${selectedPending._id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: paymentData.method, transactionId: paymentData.transactionId, amount: Number(paymentData.amount), startDate: paymentData.startDate }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to activate customer");
      alert("Customer activated successfully");
      setShowPaymentModal(false); setSelectedPending(null);
      await fetchPendingPayments(); await fetchOrders();
    } catch (error) {
      alert(error.message || "Activation failed");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const text = searchQuery.toLowerCase();
    const matchesSearch = order.membershipId?.toLowerCase().includes(text) || `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(text) || order.user?.phone?.includes(text);
    const matchesPlan = filterPlan === "ALL" || order.subscription?.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const upcomingRenewals = orders.filter(o => canShowRenew(o)).map(o => ({
    id: o._id, customer: `${o.user?.firstName} ${o.user?.lastName}`, memberId: o.membershipId,
    plan: o.subscription?.plan, expiryDate: o.subscription?.endDate ? new Date(o.subscription.endDate).toLocaleDateString('en-GB') : '—',
    daysLeft: daysLeft(o), order: o,
  }));

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'pending', icon: DollarSign, label: 'Pending Payments', badge: pendingCustomers.length },
    { id: 'pause', icon: PauseCircle, label: 'Pause Requests' },
    { id: 'queries', icon: MessageSquare, label: 'Customer Queries' },
    { id: 'renewals', icon: Calendar, label: 'Renewals' },
    { id: 'create', icon: Plus, label: 'Create Account' },
    { id: 'audit', icon: Activity, label: 'Audit Logs' },
  ];

  return (
    <div data-tone="light" className="admin-root" style={{ minHeight: '100vh', background: CREAM_2, fontFamily: "'Inter', sans-serif", color: INK }}>
      <style>{`
        .admin-root .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .admin-sidebar-btn { transition: background 0.25s ease, color 0.2s ease; }
        .admin-sidebar-btn:hover { background: rgba(244,239,230,0.08) !important; }
        .admin-root input:focus, .admin-root textarea:focus, .admin-root select:focus { border-color: ${SAGE_DARK} !important; box-shadow: 0 0 0 3px rgba(139,149,121,0.16) !important; }
        .admin-root table td, .admin-root table th { white-space: nowrap; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: DARK_2, padding: '0 1.25rem', height: 72, display: 'flex', alignItems: 'center', boxShadow: '0 1px 0 rgba(244,239,230,0.06)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 42, height: 42, background: SAGE, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.2rem', color: DARK_2, fontFamily: "'Cormorant Garamond', serif" }}>R</div>
            <div>
              <h1 className="font-serif" style={{ margin: 0, color: CREAM, fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.1 }}>Ryvive Roots</h1>
              <p style={{ margin: 0, color: SAGE, fontSize: '9px', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase' }}>Master Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setShowBroadcastModal(true)} style={{ ...accentBtn, padding: '0.6rem 1.1rem' }}>
              <MessageSquare size={15} /> <span className="hidden sm:inline">Broadcast</span>
            </button>
            <div style={{ background: 'rgba(244,239,230,0.07)', padding: '0.5rem 0.9rem', borderRadius: 2, color: CREAM, fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={14} color={SAGE} /> <span className="hidden sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NAV TRIGGER */}
      <button type="button" onClick={() => setMobileNavOpen(true)} className="lg:hidden" aria-label="Open admin menu" style={{ position: 'fixed', top: '80px', left: 0, zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 56, borderRadius: '0 999px 999px 0', background: DARK_2, color: CREAM, border: `1px solid rgba(244,239,230,0.18)`, borderLeft: 'none', boxShadow: '0 4px 12px -4px rgba(20,17,15,0.35)', cursor: 'pointer' }}>
        <ChevronRight size={16} strokeWidth={1.8} />
      </button>

      {/* MOBILE BACKDROP */}
      {mobileNavOpen && (
        <button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close admin menu" className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(20,17,15,0.55)', backdropFilter: 'blur(2px)', border: 'none' }} />
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 z-[160] h-screen w-[260px] transform transition-transform duration-500 lg:sticky lg:top-[72px] lg:z-10 lg:h-[calc(100vh-72px)] lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ background: DARK, overflowY: 'auto' }}
        >
          <div className="lg:hidden flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(244,239,230,0.08)' }}>
            <span className="font-serif" style={{ color: CREAM, fontSize: '1.1rem' }}>Menu</span>
            <button onClick={() => setMobileNavOpen(false)} style={{ background: 'rgba(244,239,230,0.06)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={17} color={CREAM} />
            </button>
          </div>

          <nav style={{ padding: '1.25rem 0' }}>
            {navItems.map(item => {
              const active = activeView === item.id;
              return (
                <button key={item.id} className="admin-sidebar-btn" onClick={() => { setActiveView(item.id); if (item.id === 'create') resetCreateForm(); }} style={{
                  width: '100%', padding: '0.85rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: active ? 'rgba(244,239,230,0.09)' : 'transparent', border: 'none',
                  borderLeft: active ? `2px solid ${SAGE}` : '2px solid transparent',
                  cursor: 'pointer', color: active ? CREAM : 'rgba(244,239,230,0.6)',
                  fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: active ? 600 : 400, textAlign: 'left', fontFamily: 'Inter, sans-serif',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <item.icon size={17} strokeWidth={active ? 2 : 1.6} /> {item.label}
                  </span>
                  {item.badge > 0 && <span style={{ background: SAGE, color: DARK_2, borderRadius: 999, padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0" style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem)', overflowX: 'hidden' }}>

          {/* ── DASHBOARD ── */}
          {activeView === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={eyebrowStyle}>— Overview</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Dashboard</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Customers', value: dashboardStats.totalCustomers, icon: Users },
                  { label: 'Active Subscriptions', value: dashboardStats.activeSubscriptions, icon: Package },
                  { label: 'Pending Queries', value: dashboardStats.pendingQueries, icon: MessageSquare },
                  { label: 'Paused Subscriptions', value: dashboardStats.pausedSubscriptions, icon: PauseCircle },
                  { label: 'Upcoming Renewals', value: dashboardStats.upcomingRenewals, icon: CalendarClock },
                  { label: 'Expired / Pending Renewals', value: dashboardStats.pendingRenewals, icon: RefreshCcw },
                  { label: 'Pending Payments', value: dashboardStats.pendingPayments, icon: DollarSign },
                ].map((stat, idx) => (
                  <div key={idx} style={{ ...cardStyle, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: SAGE_DARK, fontWeight: 500 }}>{stat.label}</p>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(107,117,96,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <stat.icon size={18} color={SAGE_DARK} />
                      </div>
                    </div>
                    <p className="font-serif" style={{ margin: 0, fontSize: '2.4rem', fontWeight: 300, color: INK, lineHeight: 1 }}>{loading ? '—' : stat.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ ...cardStyle, padding: '2rem', marginBottom: '2rem' }}>
                <h3 className="font-serif" style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: 400, color: INK }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Customer Management', action: 'customers', icon: Users },
                    { label: 'Pending Payments', action: 'pending', icon: DollarSign },
                    { label: 'Pause Requests', action: 'pause', icon: PauseCircle },
                    { label: 'Renewals', action: 'renewals', icon: Calendar },
                    { label: 'Create Account', action: 'create', icon: Plus },
                  ].map(item => (
                    <button key={item.action} onClick={() => setActiveView(item.action)} style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}`, padding: '1.15rem', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', letterSpacing: '0.08em', fontWeight: 500, color: INK, fontFamily: 'Inter, sans-serif' }}>
                      <item.icon size={18} color={SAGE_DARK} /> {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ ...cardStyle, padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="font-serif" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 400, color: INK }}>Pending Pause Requests</h3>
                  <button onClick={() => setActiveView('pause')} style={{ background: 'transparent', border: 'none', color: SAGE_DARK, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>View All →</button>
                </div>
                {pauseRequests.filter(r => r.status === 'Pending').length === 0 && <p style={{ color: 'rgba(42,37,32,0.5)' }}>No pending pause requests.</p>}
                {pauseRequests.filter(r => r.status === 'Pending').slice(0, 3).map((request, idx, arr) => (
                  <div key={request.id} style={{ padding: '1rem 0', borderBottom: idx < arr.length - 1 ? `1px solid ${CARD_BORDER}` : 'none' }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600, color: INK }}>{request.customer}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(42,37,32,0.6)' }}>Pause: {request.pauseFrom} to {request.pauseTo} · {request.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── CUSTOMERS ── */}
          {activeView === 'customers' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Members</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Customer Management</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>{filteredOrders.length} members</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: CREAM, padding: '0.7rem 1.1rem', borderRadius: 3, border: `1px solid ${CARD_BORDER}`, flex: 1, minWidth: 220, maxWidth: 400 }}>
                  <Search size={18} color={SAGE_DARK} />
                  <input type="text" placeholder="Search by name, phone, or ID…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.9rem', flex: 1, background: 'transparent', color: INK }} />
                </div>
                <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} style={{ border: `1px solid ${CARD_BORDER}`, padding: '0.7rem 1rem', borderRadius: 3, fontSize: '0.85rem', background: CREAM, color: INK }}>
                  <option value="ALL">All Plans</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD">GOLD</option>
                  <option value="PLATINUM">PLATINUM</option>
                </select>
                <button onClick={fetchOrders} style={{ ...ghostBtn, padding: '0.7rem 1rem' }}>
                  <RefreshCcw size={15} /> Refresh
                </button>
              </div>
              {loading ? (
                <p style={{ color: 'rgba(42,37,32,0.5)', padding: '1rem' }}>Loading members…</p>
              ) : (
                <div style={{ ...cardStyle, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                      <thead>
                        <tr style={{ background: CREAM_2 }}>
                          {['Membership ID', 'Full Name', 'Plan', 'Status', 'Subscription Ends', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '0.95rem 1rem', textAlign: 'left', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: SAGE_DARK }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order, idx) => {
                          const st = getPauseStatusText(order); const tone = statusTone(st);
                          return (
                            <tr key={order._id} style={{ borderBottom: idx < filteredOrders.length - 1 ? `1px solid ${CARD_BORDER}` : 'none' }}>
                              <td style={{ padding: '1.1rem 1rem', fontWeight: 600, color: INK, fontSize: '0.88rem' }}>
                                {order.membershipId}
                                {order.isTest && <span style={{ marginLeft: 6, background: 'rgba(176,137,79,0.14)', color: '#9a6a2e', fontSize: '0.65rem', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>TEST</span>}
                              </td>
                              <td style={{ padding: '1.1rem 1rem' }}>
                                <div style={{ fontWeight: 600, color: INK, fontSize: '0.9rem' }}>{order.user?.firstName} {order.user?.lastName}</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(42,37,32,0.5)', marginTop: 2 }}>{order.user?.phone}</div>
                              </td>
                              <td style={{ padding: '1.1rem 1rem' }}>
                                <span style={{ background: 'rgba(107,117,96,0.12)', color: SAGE_DARK, padding: '0.25rem 0.7rem', borderRadius: 3, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em' }}>{order.subscription?.plan || '—'}</span>
                                {canShowRenew(order) && (
                                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: '0.72rem', color: '#9a4a3e', fontWeight: 600 }}>{daysLeft(order)} days left</span>
                                    <button onClick={() => openRenewModal(order)} style={{ background: SAGE_DARK, color: CREAM, border: 'none', padding: '3px 10px', borderRadius: 2, fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>Renew</button>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '1.1rem 1rem' }}>
                                <span style={{ background: tone.bg, color: tone.fg, padding: '0.35rem 0.75rem', borderRadius: 3, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{st}</span>
                              </td>
                              <td style={{ padding: '1.1rem 1rem', fontSize: '0.84rem', color: 'rgba(42,37,32,0.7)' }}>
                                {order.subscription?.endDate ? new Date(order.subscription.endDate).toLocaleDateString('en-GB') : '—'}
                              </td>
                              <td style={{ padding: '1.1rem 1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <button onClick={() => requestPasskey(order, 'view')} style={{ ...primaryBtn, padding: '0.45rem 0.9rem', fontSize: '0.72rem' }}><Eye size={13} /> View</button>
                                  <button onClick={() => requestPasskey(order, 'message')} style={{ ...accentBtn, padding: '0.45rem 0.9rem', fontSize: '0.72rem' }}><MessageSquare size={13} /> Message</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredOrders.length === 0 && <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(42,37,32,0.5)' }}>No members found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── PENDING PAYMENTS ── */}
          {activeView === 'pending' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Awaiting Verification</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Pending Payments</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>{pendingCustomers.length} customer{pendingCustomers.length !== 1 ? 's' : ''} awaiting payment verification</p>
              </div>
              {pendingCustomers.length === 0 ? (
                <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
                  <h3 className="font-serif" style={{ margin: '0 0 0.5rem', color: INK, fontWeight: 400, fontSize: '1.4rem' }}>All Caught Up</h3>
                  <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)' }}>No pending payments at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {pendingCustomers.map(pending => (
                    <div key={pending._id} style={{ ...cardStyle, padding: '1.75rem', borderLeft: `3px solid ${SAGE}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <h4 className="font-serif" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 400, color: INK }}>{pending.user?.firstName} {pending.user?.lastName}</h4>
                            <span style={{ background: STATUS.paused.bg, color: STATUS.paused.fg, padding: '0.3rem 0.75rem', borderRadius: 3, fontSize: '0.72rem', fontWeight: 600 }}>Awaiting Payment</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(42,37,32,0.65)' }}>{pending.user?.phone}</p>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(42,37,32,0.65)' }}>{pending.user?.email}</p>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(42,37,32,0.65)' }}>{pending.subscription?.plan}</p>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: SAGE_DARK }}>₹{pending.subscription?.amount}</p>
                          </div>
                          <div style={{ background: CREAM_2, padding: '0.6rem 1rem', borderRadius: 3, display: 'inline-block', fontSize: '0.82rem', color: 'rgba(42,37,32,0.65)' }}>
                            Added by: <strong style={{ color: INK }}>{pending.createdBy || 'Admin'}</strong> · {new Date(pending.createdAt).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <button onClick={() => handleVerifyPayment(pending)} style={{ ...accentBtn, padding: '0.85rem 1.6rem' }}>Verify Payment</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── PAUSE REQUESTS ── */}
          {activeView === 'pause' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Requests</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Pause Requests</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>{pauseRequests.filter(r => r.status === 'Pending').length} pending requests</p>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pauseRequests.map(request => {
                  const tone = request.status === 'Approved' ? STATUS.active : request.status === 'Rejected' ? STATUS.expired : STATUS.paused;
                  return (
                    <div key={request.id} style={{ ...cardStyle, padding: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            <h4 className="font-serif" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 400, color: INK }}>{request.customer}</h4>
                            <span style={{ background: tone.bg, color: tone.fg, padding: '0.3rem 0.75rem', borderRadius: 3, fontSize: '0.72rem', fontWeight: 600 }}>{request.status}</span>
                          </div>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: 'rgba(42,37,32,0.6)' }}>Member ID: {request.memberId}</p>
                          <div style={{ background: CREAM_2, padding: '1rem', borderRadius: 3, marginTop: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1rem' }}>
                              {[{ label: 'Requested', value: request.requestDate }, { label: 'From', value: request.pauseFrom }, { label: 'To', value: request.pauseTo }, { label: 'Reason', value: request.reason }].map(f => (
                                <div key={f.label}>
                                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: SAGE_DARK, fontWeight: 600 }}>{f.label}</p>
                                  <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: INK }}>{f.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {request.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button onClick={() => handlePauseAction(request.id, 'approve')} style={{ ...primaryBtn }}>Approve</button>
                            <button onClick={() => handlePauseAction(request.id, 'reject')} style={{ ...ghostBtn, color: '#9a4a3e', borderColor: '#9a4a3e' }}>Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── CUSTOMER QUERIES ── */}
          {activeView === 'queries' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Support</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Customer Queries &amp; Tickets</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>{customerQueries.filter(q => q.status === 'Open').length} open queries • {customerQueries.length} total</p>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {customerQueries.map(query => {
                  const typeTone = query.type === 'Complaint' ? STATUS.expired : query.type === 'Feedback' ? STATUS.active : { bg: 'rgba(107,117,96,0.12)', fg: SAGE_DARK };
                  const statTone = query.status === 'Open' ? STATUS.paused : query.status === 'In Progress' ? { bg: 'rgba(107,117,96,0.12)', fg: SAGE_DARK } : STATUS.active;
                  return (
                    <div key={query.id} style={{ ...cardStyle, padding: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            <h4 className="font-serif" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 400, color: INK }}>{query.subject}</h4>
                            <span style={{ background: typeTone.bg, color: typeTone.fg, padding: '0.28rem 0.7rem', borderRadius: 3, fontSize: '0.7rem', fontWeight: 600 }}>{query.type}</span>
                            <span style={{ background: statTone.bg, color: statTone.fg, padding: '0.28rem 0.7rem', borderRadius: 3, fontSize: '0.7rem', fontWeight: 600 }}>{query.status}</span>
                            {query.priority === 'High' && <span style={{ background: STATUS.expired.bg, color: STATUS.expired.fg, padding: '0.28rem 0.7rem', borderRadius: 3, fontSize: '0.7rem', fontWeight: 600 }}>High Priority</span>}
                          </div>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem', color: 'rgba(42,37,32,0.6)' }}>Customer: <strong style={{ color: INK }}>{query.customer}</strong> ({query.customerId})</p>
                          <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: 'rgba(42,37,32,0.7)', lineHeight: 1.6 }}>{query.message}</p>
                          {query.assignedTo && <div style={{ background: CREAM_2, padding: '0.65rem 1rem', borderRadius: 3, marginBottom: '0.75rem' }}><p style={{ margin: 0, fontSize: '0.82rem', color: SAGE_DARK, fontWeight: 500 }}>Assigned to: {query.assignedTo}</p></div>}
                          {query.response && <div style={{ background: 'rgba(107,117,96,0.1)', padding: '0.75rem 1rem', borderRadius: 3 }}><p style={{ margin: '0 0 0.25rem', fontSize: '0.68rem', color: SAGE_DARK, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Response</p><p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(42,37,32,0.75)', lineHeight: 1.5 }}>{query.response}</p></div>}
                        </div>
                        <div style={{ textAlign: 'right', minWidth: 130 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
                            <Clock size={13} color={SAGE_DARK} /><p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(42,37,32,0.65)', fontWeight: 500 }}>{query.date}</p>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(42,37,32,0.45)' }}>{query.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── RENEWALS ── */}
          {activeView === 'renewals' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Renewals</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Upcoming Renewals</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>{upcomingRenewals.filter(r => r.daysLeft <= 10).length} renewals due in next 10 days</p>
              </div>
              {upcomingRenewals.length === 0 && !loading && <p style={{ color: 'rgba(42,37,32,0.5)' }}>No upcoming renewals.</p>}
              <div style={{ display: 'grid', gap: '1rem' }}>
                {upcomingRenewals.map(renewal => (
                  <div key={renewal.id} style={{ ...cardStyle, padding: '1.75rem', borderLeft: renewal.daysLeft <= 7 ? `3px solid ${SAGE}` : `1px solid ${CARD_BORDER}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <h4 className="font-serif" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 400, color: INK }}>{renewal.customer}</h4>
                          {renewal.daysLeft <= 7 && <span style={{ background: STATUS.paused.bg, color: STATUS.paused.fg, padding: '0.28rem 0.7rem', borderRadius: 3, fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={13} /> Due Soon</span>}
                        </div>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: 'rgba(42,37,32,0.6)' }}>{renewal.memberId} · {renewal.plan}</p>
                        <div style={{ background: CREAM_2, padding: '1rem', borderRadius: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                          <div><p style={{ margin: '0 0 0.25rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: SAGE_DARK, fontWeight: 600 }}>Expiry Date</p><p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: INK }}>{renewal.expiryDate}</p></div>
                          <div><p style={{ margin: '0 0 0.25rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: SAGE_DARK, fontWeight: 600 }}>Days Left</p><p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: renewal.daysLeft <= 7 ? '#9a6a2e' : INK }}>{renewal.daysLeft} days</p></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button onClick={() => openRenewModal(renewal.order)} style={{ ...primaryBtn }}><RefreshCcw size={15} /> Renew</button>
                        <button onClick={() => requestPasskey(renewal.order, 'message')} style={{ ...accentBtn }}><Mail size={15} /> Remind</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── AUDIT LOGS ── */}
          {activeView === 'audit' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Activity</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Audit Logs</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>Track all admin activities and customer actions</p>
              </div>
              {loading && <p style={{ color: 'rgba(42,37,32,0.5)', padding: '1rem' }}>Loading audit logs…</p>}
              {!loading && auditLogs.length === 0 && (
                <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: 'rgba(42,37,32,0.5)' }}>No audit logs found.</p>
                </div>
              )}
              <div style={{ display: 'grid', gap: '1rem' }}>
                {auditLogs.map(log => (
                  <div key={log._id} style={{ ...cardStyle, padding: '1.5rem 1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                          <h4 className="font-serif" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, color: INK }}>{log.customerName}</h4>
                          <span style={{ background: 'rgba(107,117,96,0.12)', color: SAGE_DARK, padding: '0.28rem 0.7rem', borderRadius: 3, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em' }}>{log.action}</span>
                        </div>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: 'rgba(42,37,32,0.7)', lineHeight: 1.6 }}>{log.details}</p>
                        <div style={{ fontSize: '0.82rem', color: 'rgba(42,37,32,0.55)' }}>by <strong style={{ color: INK }}>{log.performedBy}</strong></div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 150 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <Clock size={13} color={SAGE_DARK} />
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(42,37,32,0.65)', fontWeight: 500 }}>{new Date(log.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'rgba(42,37,32,0.45)' }}>{new Date(log.createdAt).toLocaleTimeString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── CREATE ACCOUNT ── */}
          {activeView === 'create' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={eyebrowStyle}>— Onboarding</div>
                <h2 className="font-serif" style={{ ...h2Style, marginTop: '0.5rem' }}>Create New Customer Account</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'rgba(42,37,32,0.6)', fontSize: '0.9rem' }}>Follow the steps to onboard a new member</p>
              </div>

              {/* Step Progress */}
              <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '2rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 520 }}>
                  {[{ step: 1, label: 'Team Member' }, { step: 2, label: 'Package' }, { step: 3, label: 'Customer Details' }, { step: 4, label: 'Payment' }].map((item, idx) => (
                    <React.Fragment key={item.step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 110 }}>
                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: createStep >= item.step ? INK : 'rgba(42,37,32,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', color: createStep >= item.step ? CREAM : 'rgba(42,37,32,0.5)', fontWeight: 600, fontSize: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>
                          {createStep > item.step ? '✓' : item.step}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: createStep === item.step ? 700 : 500, color: createStep >= item.step ? INK : 'rgba(42,37,32,0.45)', textAlign: 'center' }}>{item.label}</p>
                      </div>
                      {idx < 3 && <div style={{ flex: 1, maxWidth: 60, height: 2, background: createStep > item.step ? INK : 'rgba(42,37,32,0.12)', marginBottom: 24 }} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step 1 */}
              {createStep === 1 && (
                <div style={{ ...cardStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h3 className="font-serif" style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Who is creating this account?</h3>
                    <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)' }}>Select the team member responsible for onboarding</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {teamMembers.map(member => {
                      const sel = selectedTeamMember === member.id;
                      return (
                        <div key={member.id} onClick={() => setSelectedTeamMember(member.id)} style={{ padding: '1.75rem 1.25rem', borderRadius: 4, border: sel ? `2px solid ${SAGE}` : `1px solid ${CARD_BORDER}`, background: sel ? 'rgba(107,117,96,0.08)' : CREAM, cursor: 'pointer', textAlign: 'center' }}>
                          <div style={{ width: 60, height: 60, borderRadius: '50%', background: sel ? SAGE : CREAM_2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 500, color: sel ? DARK_2 : SAGE_DARK, margin: '0 auto 1rem', fontFamily: "'Cormorant Garamond', serif" }}>{member.name.charAt(0)}</div>
                          <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem', fontWeight: 600, color: INK }}>{member.name}</h4>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(42,37,32,0.5)' }}>{member.role}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ background: CREAM_2, padding: '0.85rem 1.25rem', borderRadius: 3, marginBottom: '1.5rem', fontSize: '0.85rem', color: 'rgba(42,37,32,0.6)' }}>
                    This selection will be recorded in audit logs and the team member will be notified.
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => selectedTeamMember && setCreateStep(2)} disabled={!selectedTeamMember} style={{ ...primaryBtn, padding: '0.85rem 1.8rem', opacity: selectedTeamMember ? 1 : 0.45, cursor: selectedTeamMember ? 'pointer' : 'not-allowed' }}>Next: Customize Package →</button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {createStep === 2 && (
                <div style={{ ...cardStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  <h3 className="font-serif" style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Create Custom Package</h3>
                  <p style={{ margin: '0 0 2rem', color: 'rgba(42,37,32,0.6)' }}>Design a personalized package for this customer</p>
                  <div style={{ background: CREAM_2, padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: 4, marginBottom: '2rem' }}>
                    <h4 className="font-serif" style={{ margin: '0 0 1.25rem', color: INK, fontSize: '1.2rem', fontWeight: 400 }}>Package Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
                      <div>
                        <label style={labelStyle}>Package Name *</label>
                        <select value={customPackage.name} onChange={e => setCustomPackage({ ...customPackage, name: e.target.value })} style={selectStyle}>
                          <option value="">Select Package</option>
                          <option value="SILVER_1MONTH">Silver – 1 Month</option>
                          <option value="GOLD_1MONTH">Gold – 1 Month</option>
                          <option value="PLATINUM_1MONTH">Platinum – 1 Month</option>
                          <option value="SILVER_3MONTH">Silver – 3 Months</option>
                          <option value="GOLD_3MONTH">Gold – 3 Months</option>
                          <option value="PLATINUM_3MONTH">Platinum – 3 Months</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Duration *</label>
                        <select value={customPackage.duration} onChange={e => { const total = calculateTotalMeals(e.target.value, customPackage.mealsPerWeek); setCustomPackage({ ...customPackage, duration: e.target.value, totalMeals: total.toString() }); }} style={selectStyle}>
                          <option value="">Select duration</option>
                          <option value="1-month">1 Month</option>
                          <option value="2-month">2 Months</option>
                          <option value="3-month">3 Months</option>
                          <option value="6-month">6 Months</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Meals Per Week *</label>
                        <select value={customPackage.mealsPerWeek} onChange={e => { const total = calculateTotalMeals(customPackage.duration, e.target.value); setCustomPackage({ ...customPackage, mealsPerWeek: e.target.value, totalMeals: total.toString() }); }} style={selectStyle}>
                          <option value="">Select meals/week</option>
                          {[3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} meals/week</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Total Meals (auto)</label>
                        <input type="text" value={customPackage.totalMeals || '0'} readOnly style={{ ...inputStyle, background: 'rgba(42,37,32,0.04)', cursor: 'not-allowed' }} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Package Price (₹) *</label>
                        <input type="number" placeholder="Enter price" value={customPackage.price} onChange={e => setCustomPackage({ ...customPackage, price: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 className="font-serif" style={{ margin: '0 0 1rem', color: INK, fontSize: '1.2rem', fontWeight: 400 }}>Select Features</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.75rem' }}>
                      {packageFeatures.map((feature, idx) => {
                        const on = customPackage.features.includes(feature);
                        return (
                          <div key={idx} onClick={() => handleFeatureToggle(feature)} style={{ padding: '0.85rem 1rem', borderRadius: 3, border: on ? `2px solid ${SAGE}` : `1px solid ${CARD_BORDER}`, background: on ? 'rgba(107,117,96,0.08)' : CREAM, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: INK }}>{feature}</span>
                            {on && <span style={{ color: SAGE_DARK, fontWeight: 700 }}>✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {customPackage.name && customPackage.price && (
                    <div style={{ background: CREAM_2, padding: '1.25rem', borderRadius: 3, border: `1px solid ${CARD_BORDER}`, marginBottom: '2rem' }}>
                      <h4 className="font-serif" style={{ margin: '0 0 0.75rem', color: INK, fontSize: '1.1rem', fontWeight: 400 }}>Package Summary</h4>
                      {[['Package', customPackage.name], ['Duration', customPackage.duration || '—'], ['Meals/week', customPackage.mealsPerWeek || '—'], ['Total meals', customPackage.totalMeals || '0'], ['Features', `${customPackage.features.length} selected`]].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem' }}>
                          <span style={{ color: 'rgba(42,37,32,0.6)' }}>{label}:</span><strong style={{ color: INK }}>{value}</strong>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: `1px solid ${CARD_BORDER}`, marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: INK }}>Price:</span>
                        <strong style={{ fontSize: '1.1rem', color: SAGE_DARK }}>₹{customPackage.price}</strong>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setCreateStep(1)} style={ghostBtn}>← Back</button>
                    <button onClick={() => (customPackage.name && customPackage.duration && customPackage.mealsPerWeek && customPackage.price) && setCreateStep(3)} disabled={!(customPackage.name && customPackage.duration && customPackage.mealsPerWeek && customPackage.price)} style={{ ...primaryBtn, padding: '0.85rem 1.8rem', opacity: (customPackage.name && customPackage.duration && customPackage.mealsPerWeek && customPackage.price) ? 1 : 0.45, cursor: (customPackage.name && customPackage.duration && customPackage.mealsPerWeek && customPackage.price) ? 'pointer' : 'not-allowed' }}>Next: Customer Details →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {createStep === 3 && (
                <div style={{ ...cardStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  <h3 className="font-serif" style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Customer Details</h3>
                  <p style={{ margin: '0 0 2rem', color: 'rgba(42,37,32,0.6)' }}>Enter the customer's personal and delivery information</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
                    {[{ label: 'Full Name *', key: 'fullName' }, { label: 'Phone *', key: 'phone' }, { label: 'Email *', key: 'email', type: 'email' }, { label: 'Date of Birth', key: 'dob', type: 'date' }].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label}</label>
                        <input type={f.type || 'text'} value={createCustomerData[f.key]} onChange={e => setCreateCustomerData({ ...createCustomerData, [f.key]: e.target.value })} style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label style={labelStyle}>Delivery Time Slot</label>
                      <select value={createCustomerData.timeSlot} onChange={e => setCreateCustomerData({ ...createCustomerData, timeSlot: e.target.value })} style={selectStyle}>
                        <option value="">Select time slot</option>
                        <optgroup label="Morning">
                          <option value="Morning - 08:00 – 09:00 AM">08:00 – 09:00 AM</option>
                          <option value="Morning - 09:00 – 10:00 AM">09:00 – 10:00 AM</option>
                          <option value="Morning - 10:00 – 11:00 AM">10:00 – 11:00 AM</option>
                        </optgroup>
                        <optgroup label="Evening">
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
                    {[{ label: 'Allergies', key: 'allergies' }, { label: 'Medical Conditions', key: 'medicalConditions' }].map(f => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label}</label>
                        <textarea rows={2} value={createCustomerData[f.key]} onChange={e => setCreateCustomerData({ ...createCustomerData, [f.key]: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                    ))}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Remarks</label>
                      <textarea rows={2} value={createCustomerData.remarks} onChange={e => setCreateCustomerData({ ...createCustomerData, remarks: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ ...labelStyle, fontSize: '0.85rem', borderBottom: `1px solid ${CARD_BORDER}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>Address</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={labelStyle}>Pincode *</label>
                          <select value={createCustomerData.pincode} onChange={e => { const selected = allowedPincodes.find(p => p.code === e.target.value); setCreateCustomerData({ ...createCustomerData, pincode: e.target.value, area: selected?.area || '' }); }} style={selectStyle}>
                            <option value="">Select Pincode</option>
                            {allowedPincodes.map(p => <option key={p.code} value={p.code}>{p.code} — {p.area}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Area</label>
                          <input value={createCustomerData.area} readOnly style={{ ...inputStyle, background: 'rgba(42,37,32,0.04)', cursor: 'not-allowed' }} />
                        </div>
                        {[{ label: 'House / Flat', key: 'house' }, { label: 'Street', key: 'street' }, { label: 'Landmark', key: 'landmark' }].map(f => (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setCreateStep(2)} style={ghostBtn}>← Back</button>
                    <button onClick={() => setCreateStep(4)} disabled={!createCustomerData.fullName || !createCustomerData.phone || !createCustomerData.email} style={{ ...primaryBtn, padding: '0.85rem 1.8rem', opacity: (createCustomerData.fullName && createCustomerData.phone && createCustomerData.email) ? 1 : 0.45, cursor: (createCustomerData.fullName && createCustomerData.phone && createCustomerData.email) ? 'pointer' : 'not-allowed' }}>Next: Payment Verification →</button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {createStep === 4 && (
                <div style={{ ...cardStyle, padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  <h3 className="font-serif" style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Payment Verification</h3>
                  <p style={{ margin: '0 0 2rem', color: 'rgba(42,37,32,0.6)' }}>Verify payment to activate customer account</p>
                  <div style={{ background: CREAM_2, padding: '1.5rem', borderRadius: 4, marginBottom: '2rem' }}>
                    <h4 className="font-serif" style={{ margin: '0 0 1rem', color: INK, fontSize: '1.15rem', fontWeight: 400 }}>Customer Summary</h4>
                    {[['Team Member', teamMembers.find(t => t.id === selectedTeamMember)?.name], ['Customer', createCustomerData.fullName], ['Phone', createCustomerData.phone], ['Package', customPackage.name], ['Duration', customPackage.duration]].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'rgba(42,37,32,0.6)' }}>{label}:</span><strong style={{ color: INK }}>{value || '—'}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: `1px solid ${CARD_BORDER}`, marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: INK }}>Amount Due:</span><strong style={{ fontSize: '1.15rem', color: SAGE_DARK }}>₹{customPackage.price}</strong>
                    </div>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ ...labelStyle, fontSize: '0.85rem', marginBottom: '1rem' }}>Has payment been received? *</label>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {[{ val: true, title: 'Yes, payment received', sub: 'Account will be created and activated immediately' }, { val: false, title: 'No, waiting for payment', sub: 'Save details as pending for later activation' }].map(opt => {
                        const on = createPaymentData.received === opt.val;
                        return (
                          <div key={String(opt.val)} onClick={() => setCreatePaymentData({ ...createPaymentData, received: opt.val })} style={{ padding: '1.15rem 1.4rem', borderRadius: 4, border: on ? `2px solid ${SAGE}` : `1px solid ${CARD_BORDER}`, background: on ? 'rgba(107,117,96,0.08)' : CREAM, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${on ? SAGE_DARK : 'rgba(42,37,32,0.25)'}`, background: on ? SAGE_DARK : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: CREAM, fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}>{on ? '✓' : ''}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem', color: INK }}>{opt.title}</div>
                              <div style={{ fontSize: '0.82rem', color: 'rgba(42,37,32,0.6)' }}>{opt.sub}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {createPaymentData.received === true && (
                    <div style={{ background: CREAM_2, padding: '1.5rem', borderRadius: 4, marginBottom: '2rem' }}>
                      <h4 className="font-serif" style={{ margin: '0 0 1.25rem', color: INK, fontSize: '1.15rem', fontWeight: 400 }}>Payment Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
                        <div>
                          <label style={labelStyle}>Payment Method *</label>
                          <select value={createPaymentData.method} onChange={e => setCreatePaymentData({ ...createPaymentData, method: e.target.value })} style={selectStyle}>
                            <option value="">Select method</option>
                            <option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Bank Transfer">Bank Transfer</option><option value="Card">Card</option><option value="Cheque">Cheque</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Amount Received *</label>
                          <input type="number" value={createPaymentData.amount} placeholder={customPackage.price} onChange={e => setCreatePaymentData({ ...createPaymentData, amount: e.target.value })} style={inputStyle} />
                        </div>
                        {createPaymentData.method && createPaymentData.method !== 'Cash' && (
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>Transaction ID / Reference</label>
                            <input type="text" value={createPaymentData.transactionId} onChange={e => setCreatePaymentData({ ...createPaymentData, transactionId: e.target.value })} placeholder="Enter transaction reference" style={inputStyle} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setCreateStep(3)} style={ghostBtn}>← Back</button>
                    {createPaymentData.received === true ? (
                      <button onClick={handleCreateAccount} disabled={saving || !createPaymentData.method || !createPaymentData.amount} style={{ ...primaryBtn, padding: '0.85rem 1.8rem', opacity: (!saving && createPaymentData.method && createPaymentData.amount) ? 1 : 0.45, cursor: (!saving && createPaymentData.method && createPaymentData.amount) ? 'pointer' : 'not-allowed' }}>{saving ? 'Saving…' : '✓ Confirm & Create Account'}</button>
                    ) : createPaymentData.received === false ? (
                      <button onClick={handleCreateAccount} disabled={saving} style={{ ...accentBtn, padding: '0.85rem 1.8rem', opacity: saving ? 0.45 : 1 }}>{saving ? 'Saving…' : 'Save as Pending'}</button>
                    ) : (
                      <button disabled style={{ ...primaryBtn, padding: '0.85rem 1.8rem', opacity: 0.45, cursor: 'not-allowed' }}>Select payment status above</button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </main>
      </div>

      {/* ── PASSKEY MODAL ── */}
      <AnimatePresence>
        {showPasskeyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={modalStyle}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 56, height: 56, background: 'rgba(107,117,96,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><Lock size={26} color={SAGE_DARK} /></div>
                <h3 className="font-serif" style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Passkey Required</h3>
                <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)', fontSize: '0.92rem' }}>Enter passkey to {passkeyAction === 'view' ? 'view customer details' : passkeyAction === 'edit' ? 'edit customer' : 'send message'}</p>
                <p style={{ margin: '0.5rem 0 0', color: 'rgba(42,37,32,0.4)', fontSize: '0.78rem' }}>Hint: 1234</p>
              </div>
              <input type="password" value={passkey} onChange={e => setPasskey(e.target.value)} placeholder="Enter passkey" onKeyDown={e => e.key === 'Enter' && handlePasskeySubmit()} style={{ ...inputStyle, marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700 }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handlePasskeySubmit} style={{ ...primaryBtn, flex: 1, justifyContent: 'center', padding: '0.9rem' }}>Verify</button>
                <button onClick={() => { setShowPasskeyModal(false); setPasskey(''); }} style={{ ...ghostBtn, flex: 1, padding: '0.9rem' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BROADCAST MODAL ── */}
      <AnimatePresence>
        {showBroadcastModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={{ ...modalStyle, maxWidth: 600 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ margin: '0 0 0.35rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Broadcast Message</h3>
                  <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)', fontSize: '0.88rem' }}>Send notification to all {orders.length} customers</p>
                </div>
                <button onClick={() => setShowBroadcastModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem' }}><X size={22} color={SAGE_DARK} /></button>
              </div>
              <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="Type your message here…" style={{ ...inputStyle, minHeight: 150, resize: 'vertical', marginBottom: '1.5rem' }} />
              <button onClick={sendBroadcastMessage} style={{ ...accentBtn, width: '100%', justifyContent: 'center', padding: '0.9rem' }}><Send size={16} /> Send to All Customers</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CUSTOMER DETAIL MODAL ── */}
      <AnimatePresence>
        {showCustomerDetail && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ ...overlayStyle, alignItems: 'flex-start', padding: '1.5rem', overflowY: 'auto' }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={{ ...modalStyle, maxWidth: 880, padding: 'clamp(1.5rem, 4vw, 2.5rem)', margin: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem', gap: '1rem' }}>
                <div>
                  <h3 className="font-serif" style={{ margin: '0 0 0.35rem', fontSize: '1.7rem', fontWeight: 400, color: INK }}>Customer Profile</h3>
                  <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)' }}>{selectedCustomer.membershipId}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingRow !== selectedCustomer._id && (
                    <button onClick={() => requestPasskey(selectedCustomer, 'edit')} style={{ ...accentBtn, padding: '0.6rem 1.1rem' }}><Edit size={15} /> Edit</button>
                  )}
                  <button onClick={() => { setShowCustomerDetail(false); setEditingRow(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.4rem' }}><X size={22} color={SAGE_DARK} /></button>
                </div>
              </div>
              {editingRow === selectedCustomer._id ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                  {[{ label: 'First Name', key: 'firstName' }, { label: 'Last Name', key: 'lastName' }, { label: 'Phone', key: 'phone' }, { label: 'Email', key: 'email', type: 'email' }, { label: 'Date of Birth', key: 'dob', type: 'date' }, { label: 'House / Flat', key: 'house' }, { label: 'Street', key: 'street' }, { label: 'Landmark', key: 'landmark' }].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type={f.type || 'text'} value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} style={{ ...inputStyle, borderColor: SAGE }} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>City</label>
                    <select value={editData.city} onChange={e => setEditData({ ...editData, city: e.target.value })} style={{ ...selectStyle, borderColor: SAGE }}>
                      <option value="Dombivli">Dombivli</option><option value="Kalyan">Kalyan</option>
                    </select>
                  </div>
                  {[{ label: 'Allergies', key: 'allergies' }, { label: 'Medical Conditions', key: 'medicalConditions' }, { label: 'Remarks', key: 'remarks' }].map(f => (
                    <div key={f.key} style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>{f.label}</label>
                      <textarea rows={2} value={editData[f.key]} onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} style={{ ...inputStyle, resize: 'vertical', borderColor: SAGE }} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSaveEdit(selectedCustomer._id)} style={{ ...primaryBtn, padding: '0.85rem 1.8rem' }}>Save Changes</button>
                    <button onClick={() => setEditingRow(null)} style={ghostBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
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
                      <label style={labelStyle}>{f.label}</label>
                      <div style={{ padding: '0.85rem', borderRadius: 3, border: `1px solid ${CARD_BORDER}`, background: CREAM_2, fontSize: '0.92rem', color: INK }}>{f.value}</div>
                    </div>
                  ))}
                  {selectedCustomer.address && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Address</label>
                      <div style={{ padding: '0.85rem', borderRadius: 3, border: `1px solid ${CARD_BORDER}`, background: CREAM_2, fontSize: '0.92rem', color: INK }}>
                        {[selectedCustomer.address.house, selectedCustomer.address.street, selectedCustomer.address.landmark, selectedCustomer.address.city, selectedCustomer.address.pincode].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  {selectedCustomer.remarks && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Remarks</label>
                      <div style={{ padding: '0.85rem', borderRadius: 3, border: `1px solid ${CARD_BORDER}`, background: 'rgba(176,137,79,0.08)', fontSize: '0.9rem', color: 'rgba(42,37,32,0.75)', fontStyle: 'italic' }}>{selectedCustomer.remarks}</div>
                    </div>
                  )}
                </div>
              )}
              {!editingRow && canShowRenew(selectedCustomer) && (
                <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(176,137,79,0.1)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#9a6a2e', fontWeight: 600, fontSize: '0.9rem' }}>Subscription expires in {daysLeft(selectedCustomer)} days</span>
                  <button onClick={() => { setShowCustomerDetail(false); openRenewModal(selectedCustomer); }} style={{ ...primaryBtn, padding: '0.6rem 1.2rem' }}>Renew Now</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RENEW MODAL ── */}
      <AnimatePresence>
        {showRenew && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={modalStyle}>
              <h3 className="font-serif" style={{ margin: '0 0 0.35rem', fontSize: '1.5rem', fontWeight: 400, color: INK }}>Renew Membership</h3>
              <p style={{ margin: '0 0 1.5rem', color: 'rgba(42,37,32,0.6)', fontSize: '0.88rem' }}>{selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName} · {selectedCustomer.membershipId}</p>
              <label style={labelStyle}>Duration</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ ...selectStyle, marginBottom: '1.25rem' }}><option value={1}>1 Month</option><option value={3}>3 Months</option></select>
              <label style={labelStyle}>Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...selectStyle, marginBottom: '1.25rem' }}><option value="CASH">Cash</option><option value="ONLINE">Online</option></select>
              <label style={labelStyle}>Start Date</label>
              <input type="date" value={renewStartDate} onChange={e => setRenewStartDate(e.target.value)} style={{ ...inputStyle, marginBottom: '1.25rem' }} />
              <label style={labelStyle}>Total Price</label>
              <input type="number" placeholder="Enter total price" value={renewPrice} onChange={e => setRenewPrice(e.target.value)} style={{ ...inputStyle, marginBottom: '1.75rem' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleRenew} style={{ ...primaryBtn, flex: 1, justifyContent: 'center', padding: '0.9rem' }}>Confirm Renewal</button>
                <button onClick={() => setShowRenew(false)} style={{ ...ghostBtn, flex: 1, padding: '0.9rem' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INDIVIDUAL MESSAGE MODAL ── */}
      <AnimatePresence>
        {showIndividualMessage && selectedCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={{ ...modalStyle, maxWidth: 550 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 className="font-serif" style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 400, color: INK }}>Send Message</h3>
                  <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)', fontSize: '0.88rem' }}>To: {selectedCustomer.user?.firstName} {selectedCustomer.user?.lastName}</p>
                </div>
                <button onClick={() => setShowIndividualMessage(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={22} color={SAGE_DARK} /></button>
              </div>
              <textarea value={individualMessage} onChange={e => setIndividualMessage(e.target.value)} placeholder="Type your message…" rows={5} style={{ ...inputStyle, resize: 'vertical', marginBottom: '1.5rem' }} />
              <button onClick={sendIndividualMessage} style={{ ...primaryBtn, width: '100%', justifyContent: 'center', padding: '0.9rem' }}><Send size={16} /> Send Message</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAYMENT VERIFICATION MODAL ── */}
      <AnimatePresence>
        {showPaymentModal && selectedPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ ...overlayStyle, padding: '1.5rem' }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} style={{ ...modalStyle, maxWidth: 600, padding: 'clamp(1.5rem, 4vw, 2.5rem)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 className="font-serif" style={{ margin: '0 0 0.35rem', fontSize: '1.6rem', fontWeight: 400, color: INK }}>Verify Payment</h3>
                <p style={{ margin: 0, color: 'rgba(42,37,32,0.6)' }}>Complete payment verification to activate account</p>
              </div>
              <div style={{ background: CREAM_2, padding: '1.5rem', borderRadius: 4, marginBottom: '2rem' }}>
                <h4 className="font-serif" style={{ margin: '0 0 1rem', color: INK, fontSize: '1.15rem', fontWeight: 400 }}>Customer Details</h4>
                {[['Name', `${selectedPending?.user?.firstName || ''} ${selectedPending?.user?.lastName || ''}`], ['Package', selectedPending?.subscription?.plan || 'N/A'], ['Amount Due', `₹${selectedPending?.subscription?.amount || 0}`]].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'rgba(42,37,32,0.6)' }}>{label}:</span>
                    <strong style={{ fontSize: label === 'Amount Due' ? '1.15rem' : '0.95rem', color: label === 'Amount Due' ? SAGE_DARK : INK }}>{value}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Payment Method *</label>
                  <select value={paymentData.method} onChange={e => setPaymentData({ ...paymentData, method: e.target.value })} style={selectStyle}>
                    <option value="">Select method</option>
                    <option value="CASH">Cash</option><option value="GPAY">GPay</option><option value="ONLINE">Online Transfer</option><option value="CARD">Card</option><option value="EASEBUZZ">Easebuzz</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Amount Received *</label>
                  <input type="number" value={paymentData.amount} onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })} style={inputStyle} />
                </div>
                {paymentData.method && paymentData.method !== 'CASH' && (
                  <div>
                    <label style={labelStyle}>Transaction ID / Reference</label>
                    <input type="text" value={paymentData.transactionId} onChange={e => setPaymentData({ ...paymentData, transactionId: e.target.value })} placeholder="Enter transaction reference" style={inputStyle} />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Subscription Start Date *</label>
                  <input type="date" value={paymentData.startDate} onChange={e => setPaymentData({ ...paymentData, startDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleConfirmPayment} disabled={!paymentData.method || !paymentData.amount || !paymentData.startDate} style={{ ...primaryBtn, flex: 1, justifyContent: 'center', padding: '0.9rem', minWidth: 180, opacity: (paymentData.method && paymentData.amount && paymentData.startDate) ? 1 : 0.45, cursor: (paymentData.method && paymentData.amount && paymentData.startDate) ? 'pointer' : 'not-allowed' }}>✓ Confirm &amp; Activate</button>
                <button onClick={() => { setShowPaymentModal(false); setSelectedPending(null); }} style={{ ...ghostBtn, padding: '0.9rem 1.5rem' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
