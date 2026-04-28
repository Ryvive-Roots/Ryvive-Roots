import React, { useState, useEffect } from 'react';
import { User, Calendar, TrendingUp, Receipt, MessageCircle, Bell, LogOut, Edit3, Lock, Clock, CheckCircle, AlertCircle, Package, Pause, MapPin, RefreshCw } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const PLAN_PAUSES = {
  SILVER: { 1: 0, 3: 3 },
  GOLD:   { 1: 2, 3: 6 },
  PLATINUM: { 1: 3, 3: 9 },
};

const RENEWAL_PRICING = {
  SILVER:   { "1": { original: 4999,  final: 4999  }, "3": { original: 14997, final: 14997 } },
  GOLD:     { "1": { original: 5999,  final: 5999  }, "3": { original: 17997, final: 17997 } },
  PLATINUM: { "1": { original: 6999,  final: 6999  }, "3": { original: 20997, final: 20997 } },
};

const PLAN_FEATURES = {
  SILVER:   ["Clean meals", "Easy digestion", "Weekly variety", "Functional juices", "No calorie stress"],
  GOLD:     ["6 high-protein meals/week", "Gut & skin-friendly meals", "Advanced energy juices", "Boost energy levels", "Naturally detoxifying"],
  PLATINUM: ["Chef's signature menu", "Glow & recovery juices", "Guilt-free wraps & zoodle options", "Elite combinations", "Surprise upgrades"],
};

const PLAN_ORDER = ["PLATINUM", "GOLD", "SILVER"];

const WEEKLY_MENU = {
  1: { Mon: "Quinoa Bowl + Detox Juice", Tue: "Grilled Chicken Salad + Green Tea", Wed: "Buddha Bowl + Immunity Shot", Thu: "Protein Smoothie Bowl + Nuts", Fri: "Mediterranean Wrap + Fresh Juice", Sat: "Power Breakfast + Herbal Tea" },
  2: { Mon: "Avocado Toast + Protein Shake", Tue: "Veggie Wrap + Green Smoothie", Wed: "Greek Salad + Fresh Juice", Thu: "Energy Bowl + Immunity Booster", Fri: "Grilled Fish + Detox Water", Sat: "Weekend Brunch + Herbal Infusion" },
  3: { Mon: "Superfood Bowl + Matcha Latte", Tue: "Protein Wrap + Fresh Juice", Wed: "Buddha Bowl + Green Tea", Thu: "Wellness Salad + Immunity Shot", Fri: "Power Lunch + Detox Drink", Sat: "Weekend Special + Smoothie" },
  4: { Mon: "Energy Bowl + Power Smoothie", Tue: "Mediterranean Plate + Fresh Juice", Wed: "Protein Bowl + Wellness Shot", Thu: "Transformation Special + Green Tea", Fri: "Celebration Meal + Fresh Juice", Sat: "Weekend Treat + Smoothie Bowl" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentWeekNumber(activationDate, durationMonths = 1) {
  if (!activationDate) return 1;
  const start = new Date(activationDate);
  const diff = Date.now() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const maxWeeks = durationMonths === 3 ? 12 : 4;
  return Math.min(Math.floor(days / 7) + 1, maxWeeks);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
}

function getDayDate(activationDate, weekNumber, dayName) {
  if (!activationDate) return "";
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const dayIndex = days.indexOf(dayName);
  if (dayIndex === -1) return "";
  const start = new Date(activationDate);
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + dayIndex);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getRemainingDays(endDate) {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}

function getDynamicPauseFeature(plan, duration) {
  const perMonth = { SILVER: 1, GOLD: 2, PLATINUM: 3 }[plan] || 0;
  if (plan === "SILVER" && String(duration) === "1") return "No pause available";
  return `${perMonth} pause${perMonth > 1 ? "s" : ""} / month`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RyviveDashboard() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [order, setOrder]         = useState(null);
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", phone: "", deliverySlot: "" });

  // Pause modal
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseFromDate, setPauseFromDate]   = useState("");
  const [pauseToDate, setPauseToDate]       = useState("");

  // Renew modals
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showSummary, setShowSummary]       = useState(false);
  const [renewDuration, setRenewDuration]   = useState("3");
  const [selectedPlan, setSelectedPlan]     = useState(null);

  // ── Fetch dashboard data ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      const membershipId = localStorage.getItem("membershipId");
      if (!membershipId) { window.location.replace("/login"); return; }

      try {
        const res  = await fetch(`https://api.ryviveroots.com/api/user/orders?membershipId=${membershipId}`);
        const data = await res.json();
        if (data.success && data.orders.length > 0) {
          setOrder(data.orders[0]);
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Sync formData when order loads ─────────────────────────────────────────
  useEffect(() => {
    if (!order) return;
    setFormData({
      email:        order.user?.email       || "",
      phone:        order.user?.phone       || "",
      deliverySlot: order.deliverySlot      || "",
    });
    const plan = order.subscription?.plan?.split("_")[0]?.toUpperCase();
    if (["SILVER", "GOLD", "PLATINUM"].includes(plan)) setSelectedPlan(plan);
  }, [order]);

  // ── Lock body scroll when modals open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = (showPauseModal || showRenewModal || showSummary) ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showPauseModal, showRenewModal, showSummary]);

  // ── Loading / empty guard ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", color: "#3d6b1f" }}>
        Loading dashboard...
      </div>
    );
  }

  if (!order) return null;

  // ── Destructure order ───────────────────────────────────────────────────────
  const { user, subscription, membershipId } = order;
const basePlan        = subscription.plan.split("_")[0].toUpperCase();
const durationMonths  = subscription.durationMonths || 1;

// ── Fix totalDays based on duration ──────────────────────────────────────────
const totalDays = durationMonths === 3 ? 72 : 24;

// Calculate daysCompleted from activationAt if backend sends 0
const daysCompletedFromDate = subscription.activationAt
  ? Math.min(
      Math.max(Math.floor((Date.now() - new Date(subscription.activationAt).getTime()) / (1000 * 60 * 60 * 24)), 0),
      totalDays
    )
  : 0;
const daysCompleted = daysCompletedFromDate || subscription.daysCompleted || 0;

const weekNumber = getCurrentWeekNumber(subscription.activationAt, durationMonths);
  const weeklyMenu      = WEEKLY_MENU[weekNumber] || {};
  const remainingDays   = getRemainingDays(subscription.endDate);

  // ── Pause logic ─────────────────────────────────────────────────────────────
  const canModify     = basePlan === "GOLD" || basePlan === "PLATINUM" || (basePlan === "SILVER" && durationMonths === 3);
  const maxPauseCount = basePlan === "SILVER" && durationMonths === 1 ? 0 : (PLAN_PAUSES[basePlan]?.[durationMonths] || 0);
  const usedPauseCount      = subscription.pause?.history?.length || 0;
  const remainingPauseCount = Math.max(maxPauseCount - usedPauseCount, 0);
  const perMonth            = { SILVER: 1, GOLD: 2, PLATINUM: 3 }[basePlan] || 0;

  const calculatePauseDays = () => {
    if (!pauseFromDate || !pauseToDate) return 0;
    const diff = new Date(pauseToDate).getTime() - new Date(pauseFromDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  };
  const pauseDays = calculatePauseDays();

  const getMaxToDate = () => {
    if (!pauseFromDate) return "";
    const d = new Date(pauseFromDate);
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };

  const getResumeNextDay = () => {
    if (!pauseToDate) return "";
    const d = new Date(pauseToDate);
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("en-IN");
  };

  const hasOverlap = () =>
    subscription.pause?.history?.some((p) => {
      const eStart = new Date(p.startDate);
      const eEnd   = new Date(p.resumeDate);
      const nStart = new Date(pauseFromDate);
      const nEnd   = new Date(pauseToDate);
      return nStart <= eEnd && nEnd >= eStart;
    });

  const hasUpcomingPause = () =>
    subscription.pause?.history?.some((p) => new Date(p.startDate) > new Date());

  const confirmPause = async () => {
    if (!pauseFromDate || !pauseToDate) { alert("Please select pause dates."); return; }
    if (pauseDays <= 0)  { alert("Invalid date selection."); return; }
    if (pauseDays > 15)  { alert("Pause duration cannot exceed 15 days."); return; }
    if (remainingPauseCount === 0) { alert("No pauses remaining."); return; }
    if (hasOverlap())    { alert("Pause dates overlap with an existing pause."); return; }

    const mid = localStorage.getItem("membershipId");
    try {
      const res  = await fetch("https://api.ryviveroots.com/api/subscription/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: mid, pauseStartDate: pauseFromDate, pauseDays, pauseToDate }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Subscription paused successfully");
        setShowPauseModal(false);
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  // ── Status logic ────────────────────────────────────────────────────────────
  const getSubscriptionStatus = () => {
    const pause = subscription.pause;
    if (!pause || pause.history.length === 0) return "ACTIVE";
    const latest = pause.history[pause.history.length - 1];
    const now    = new Date();
    const start  = new Date(latest.startDate);
    const resume = new Date(latest.resumeDate);
    if (now >= start && now <= resume) return "PAUSED";
    return "ACTIVE";
  };

  const backendStatus = subscription.status;
  const pauseStatus   = getSubscriptionStatus();
  const isExpired     = new Date() > new Date(subscription.endDate);

  const finalStatus =
    backendStatus === "UNDER_PROCESS" ? "UNDER_PROCESS"
    : isExpired                       ? "EXPIRED"
    : pauseStatus === "PAUSED"        ? "PAUSED"
    : "ACTIVE";

  const isLocked = remainingPauseCount === 0 || finalStatus === "UNDER_PROCESS" || finalStatus === "EXPIRED";

  const remainingLabel =
    basePlan === "SILVER" && durationMonths === 1 ? "No pause available"
    : isLocked                                    ? "No pauses remaining"
    : durationMonths === 1                        ? `${remainingPauseCount} pause${remainingPauseCount > 1 ? "s" : ""} remaining`
    : `${perMonth} pause${perMonth > 1 ? "s" : ""} / month`;

  const latestPause   = subscription.pause?.history?.length > 0 ? subscription.pause.history[subscription.pause.history.length - 1] : null;
  const pauseMessage  = latestPause
    ? latestPause.days === 1
      ? `⏸ Pause scheduled for ${formatDate(latestPause.startDate)}. Service will resume the next day.`
      : `⏸ Pause scheduled from ${formatDate(latestPause.startDate)} to ${formatDate(latestPause.resumeDate)}`
    : null;

  // ── Renew payment ───────────────────────────────────────────────────────────
  const handleRenewPayment = async () => {
    if (!selectedPlan) { alert("Please select a plan"); return; }
    const planPrices = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
    if (!planPrices)  { return; }

    try {
      const res  = await fetch("https://api.ryviveroots.com/api/payment/easebuzz/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname:    user.firstName,
          email:        user.email,
          phone:        user.phone,
          plan:         `${selectedPlan}_${renewDuration}M`,
          isRenewal:    true,
          membershipId: order.membershipId,
        }),
      });
      const data = await res.json();
      if (!data.success || !data.access_key) { alert("Payment initiation failed"); return; }
      window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ── Save profile ────────────────────────────────────────────────────────────
const saveProfile = async () => {
  const membershipId = localStorage.getItem("membershipId");
  try {
    const res = await fetch("https://api.ryviveroots.com/api/user/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId,
        email: formData.email,
        phone: formData.phone,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEditMode(false);
      alert("Profile updated successfully!");
      // Refresh order data to reflect changes
      window.location.reload();
    } else {
      alert(data.message || "Update failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

const handleDownloadReceipt = async (receiptNumber) => {
  const membershipId = localStorage.getItem("membershipId");
  try {
    const response = await fetch(
      `https://api.ryviveroots.com/api/user/receipt?membershipId=${membershipId}&receiptNumber=${receiptNumber}`
    );

    if (!response.ok) {
      alert("Receipt not available.");
      return;
    }

    // Convert response to blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${receiptNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  // ── Unread notifications count ──────────────────────────────────────────────
  const notifications = [
    { id: 1, type: "delivery", message: "Your meal for tomorrow has been prepared", time: "2 hours ago", read: false },
    { id: 2, type: "update",   message: "Your subscription will renew on June 15",  time: "1 day ago",   read: false },
    { id: 3, type: "reminder", message: "Time to update your delivery preferences", time: "3 hours ago", read: true  },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Upgrade plans ───────────────────────────────────────────────────────────
  const upgradePlans = [
    { name: "6-Month Transformation",  price: "₹24,999", savings: "Save ₹3,000", features: ["Extended program", "Personal coach", "Monthly check-ins", "Priority delivery"] },
    { name: "12-Month Lifestyle Reset", price: "₹45,999", savings: "Save ₹8,000", features: ["Full year support", "Quarterly assessments", "Priority support", "Exclusive recipes"] },
  ];

  // ── Transactions (replace with real data from API) ──────────────────────────
  const transactions = orders.map((o) => ({
    id:     o.receiptNumber || "-",
    date:   o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-",
    plan:   o.subscription?.plan,
    amount: `₹${o.subscription?.amount?.toLocaleString() || 0}`,
    method: o.paymentMethod || "Online",
    status: o.subscription?.status,
  }));

  const tickets = [
    { id: "TICK001", date: "Apr 18, 2024", subject: "Meal delivery timing", status: "Resolved" },
    { id: "TICK002", date: "Apr 10, 2024", subject: "Recipe customization",  status: "In Progress" },
  ];

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    page:       { minHeight: "100vh", background: "linear-gradient(135deg,#f8fdf5 0%,#fef9f3 100%)", fontFamily: "'Outfit',sans-serif" },
    header:     { background: "linear-gradient(135deg,#2d5016 0%,#3d6b1f 100%)", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(45,80,22,.15)" },
    logoMark:   { width: 46, height: 46, background: "linear-gradient(135deg,#d4af37 0%,#f4d03f 100%)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.4rem", color: "#2d5016" },
    hBtn:       { background: "rgba(255,255,255,.1)", border: "1px solid rgba(212,175,55,.3)", borderRadius: 8, padding: ".45rem .85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem", color: "white", fontSize: ".88rem", fontFamily: "'Outfit',sans-serif" },
    layout:     { display: "flex", minHeight: "calc(100vh - 72px)" },
    sidebar:    { width: 260, background: "white", padding: "1.5rem 0", boxShadow: "4px 0 20px rgba(0,0,0,.05)", borderRight: "1px solid rgba(45,80,22,.08)", flexShrink: 0 },
    navBtn:     (active) => ({ width: "100%", padding: ".9rem 1.75rem", display: "flex", alignItems: "center", gap: ".85rem", background: active ? "linear-gradient(90deg,rgba(45,80,22,.08) 0%,transparent 100%)" : "transparent", border: "none", borderLeft: active ? "4px solid #d4af37" : "4px solid transparent", cursor: "pointer", color: active ? "#2d5016" : "#666", fontSize: ".92rem", fontWeight: active ? 600 : 500, textAlign: "left", fontFamily: "'Outfit',sans-serif", transition: "all .2s", position: "relative" }),
    main:       { flex: 1, padding: "2rem 2.5rem", overflowY: "auto" },
    card:       { background: "white", borderRadius: 14, padding: "1.75rem", border: "1px solid rgba(45,80,22,.08)", boxShadow: "0 3px 16px rgba(0,0,0,.05)", marginBottom: "1.5rem" },
    greenCard:  { background: "linear-gradient(135deg,#2d5016 0%,#3d6b1f 100%)", borderRadius: 14, padding: "1.75rem", color: "white", boxShadow: "0 8px 24px rgba(45,80,22,.22)", marginBottom: "1.5rem" },
    btnGold:    { background: "linear-gradient(135deg,#d4af37 0%,#f4d03f 100%)", color: "#2d5016", border: "none", padding: ".75rem 1.5rem", borderRadius: 9, fontSize: ".9rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" },
    btnGreen:   { background: "linear-gradient(135deg,#2d5016 0%,#3d6b1f 100%)", color: "white", border: "none", padding: ".75rem 1.5rem", borderRadius: 9, fontSize: ".9rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif" },
    btnDisabled:{ background: "#e0e0e0", color: "#999", border: "none", padding: ".75rem 1.5rem", borderRadius: 9, fontSize: ".9rem", fontWeight: 600, cursor: "not-allowed", fontFamily: "'Outfit',sans-serif" },
    overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" },
    modal:      { background: "white", borderRadius: 16, padding: "1.75rem", width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", position: "relative" },
    grid2:      { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem", marginBottom: "1.5rem" },
    progressBar:{ background: "rgba(255,255,255,.15)", borderRadius: 8, height: 10, overflow: "hidden", margin: ".5rem 0" },
    progressFill:(pct) => ({ background: "linear-gradient(90deg,#d4af37 0%,#f4d03f 100%)", height: "100%", width: `${pct}%`, borderRadius: 8, transition: "width 1s ease" }),
  };

  const currentHour = new Date().getHours();
  const canEdit      = currentHour < 17;

  const statusColor = { ACTIVE: "#2e7d32", PAUSED: "#c8860f", EXPIRED: "#c62828", UNDER_PROCESS: "#e65100" }[finalStatus] || "#666";
const pct = Math.round((daysCompleted / totalDays) * 100) || 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={S.logoMark}>R</div>
          <div>
            <h1 style={{ margin: 0, color: "white", fontSize: "1.4rem", fontWeight: 700 }}>Ryvive Roots</h1>
          
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={S.hBtn}><User size={16} color="#d4af37" />{user.firstName} {user.lastName}</div>
          <button style={{ ...S.hBtn, position: "relative" }} onClick={() => setActiveTab("notifications")}>
            <Bell size={18} color="#d4af37" />
            {unreadCount > 0 && <div style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: "#d4af37" }} />}
          </button>
          <button style={S.hBtn}><LogOut size={18} color="#d4af37" /></button>
        </div>
      </header>

      <div style={S.layout}>

        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <nav>
            {[
              { id: "info",          icon: User,           label: "My Information" },
              { id: "schedule",      icon: Calendar,       label: "My Daily Schedule" },
              { id: "subscription",  icon: Package,        label: "My Subscription" },
            
              { id: "upgrade",       icon: TrendingUp,     label: "Upgrade Plan" },
              { id: "history",       icon: Receipt,        label: "Purchase History" },
              { id: "support",       icon: MessageCircle,  label: "Support & Tickets" },
              { id: "notifications", icon: Bell,           label: "Notifications" },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={S.navBtn(activeTab === item.id)}>
                <item.icon size={19} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                {item.label}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span style={{ position: "absolute", right: "1.25rem", background: "#d4af37", color: "white", fontSize: ".65rem", fontWeight: 700, padding: ".1rem .45rem", borderRadius: 8 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ margin: "1.5rem 1rem", padding: "1.25rem", background: "linear-gradient(135deg,#f0f7ec 0%,#fef9f3 100%)", borderRadius: 10, border: "1px solid rgba(45,80,22,.1)" }}>
            <p style={{ margin: "0 0 .25rem 0", fontSize: ".75rem", color: "#666", fontWeight: 500 }}>Membership ID</p>
            <p style={{ margin: "0 0 .75rem 0", fontSize: ".95rem", fontWeight: 700, color: "#2d5016" }}>{membershipId}</p>
            <p style={{ margin: "0 0 .25rem 0", fontSize: ".75rem", color: "#666", fontWeight: 500 }}>Current Plan</p>
            <p style={{ margin: 0, fontSize: ".9rem", fontWeight: 600, color: "#3d6b1f" }}>RYVIVE {basePlan} · {durationMonths}M</p>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={S.main}>

          {/* Renewal warning banner */}
          {remainingDays <= 25 && finalStatus !== "PAUSED" && finalStatus !== "UNDER_PROCESS" && (
            <div style={{ background: "white", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(45,80,22,.12)", boxShadow: "0 3px 12px rgba(0,0,0,.06)", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                <div style={{ background: "#e8f5e9", padding: ".6rem", borderRadius: 9, fontSize: 16 }}>🔄</div>
                <div>
                  <p style={{ fontWeight: 600, color: "#333", fontSize: ".9rem", margin: 0 }}>Subscription expiring in {remainingDays} days</p>
                  <p style={{ fontSize: ".8rem", color: "#666", margin: ".2rem 0 0 0" }}>Renew now to continue your wellness journey</p>
                </div>
              </div>
              <button style={S.btnGreen} onClick={() => setShowRenewModal(true)}>Renew Now</button>
            </div>
          )}

          {/* ── My Daily Schedule ── */}
       {activeTab === "schedule" && (
  <div>
    <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>My Daily Schedule</h2>
    <p style={{ margin: "0 0 1.25rem 0", color: "#666" }}>Week {weekNumber} of your transformation journey</p>

    {/* Week Tab Buttons */}
    <div style={{ display: "flex", gap: ".65rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
     {Array.from({ length: durationMonths === 3 ? 12 : 4 }, (_, i) => i + 1).map((wk) => {
        const isActive  = selectedWeek === wk;
        const isCurrent = wk === weekNumber;
        return (
          <button
            key={wk}
            onClick={() => setSelectedWeek(wk)}
            style={{
              display: "flex", alignItems: "center", gap: ".45rem",
              padding: ".55rem 1.1rem", borderRadius: 9, cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: ".9rem", fontWeight: 600,
              border: isActive ? "2px solid #d4af37" : "1.5px solid rgba(45,80,22,.2)",
              background: isActive ? "linear-gradient(135deg,#2d5016,#3d6b1f)" : "white",
              color: isActive ? "white" : "#3d6b1f",
              boxShadow: isActive ? "0 4px 14px rgba(45,80,22,.22)" : "0 1px 4px rgba(0,0,0,.05)",
              transition: "all .2s",
            }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              background: isActive ? "rgba(255,255,255,.2)" : "linear-gradient(135deg,#d4af37,#f4d03f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: ".75rem", fontWeight: 800, color: isActive ? "white" : "#2d5016",
            }}>{wk}</span>
            Week {wk}
            {isCurrent && (
              <span style={{
                background: isActive ? "rgba(212,175,55,.8)" : "#e8f5e9",
                color: isActive ? "#2d5016" : "#2e7d32",
                fontSize: ".65rem", fontWeight: 700,
                padding: ".1rem .45rem", borderRadius: 5,
              }}>Current</span>
            )}
          </button>
        );
      })}
    </div>

    {/* Week Header */}
    <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".85rem" }}>
      <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#d4af37,#f4d03f)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", fontWeight: 700, color: "#2d5016" }}>{selectedWeek}</div>
      <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "#3d6b1f" }}>Week {selectedWeek}</span>
      {selectedWeek === weekNumber && <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: ".72rem", fontWeight: 700, padding: ".15rem .6rem", borderRadius: 6 }}>Current</span>}
    </div>

    {/* Day Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: ".85rem" }}>
     {Object.entries(WEEKLY_MENU[((selectedWeek - 1) % 4) + 1] || {}).map(([day, meal]) => {
        const isToday = selectedWeek === weekNumber && ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()] === day;
        return (
          <div key={day} style={{ background: isToday ? "linear-gradient(135deg,#2d5016,#3d6b1f)" : "white", padding: "1rem", borderRadius: 10, border: isToday ? "none" : "1px solid rgba(45,80,22,.1)", boxShadow: isToday ? "0 6px 20px rgba(45,80,22,.22)" : "0 2px 6px rgba(0,0,0,.04)", position: "relative" }}>
            {isToday && <div style={{ position: "absolute", top: 7, right: 7, background: "#d4af37", color: "#2d5016", fontSize: ".62rem", fontWeight: 700, padding: "3px 7px", borderRadius: 5 }}>TODAY</div>}
            <div style={{ fontWeight: 700, fontSize: ".85rem", color: isToday ? "#d4af37" : "#2d5016", marginBottom: ".2rem" }}>{day}</div>
<div style={{ fontSize: ".82rem", color: isToday ? "rgba(255,255,255,.75)" : "#999", marginBottom: ".55rem" }}>
  {getDayDate(subscription.activationAt, selectedWeek, day)}
</div>
            <div style={{ fontSize: ".82rem", color: isToday ? "white" : "#3d6b1f", lineHeight: 1.4, fontWeight: 500 }}>{meal}</div>
          </div>
        );
      })}
    </div>
  </div>
)}

          {/* ── My Subscription ── */}
          {activeTab === "subscription" && (
            <div>
              <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>My Subscription</h2>
              <p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>Manage your package, pauses, and delivery preferences</p>

              {/* Package overview */}
              <div style={S.greenCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: ".75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".35rem" }}>
                      <Package size={24} color="#d4af37" />
                      <h3 style={{ margin: 0, color: "white", fontSize: "1.3rem", fontWeight: 700 }}>RYVIVE {basePlan} · {durationMonths}-Month Plan</h3>
                    </div>
                    <p style={{ margin: "0 0 .4rem 0", color: "rgba(255,255,255,.8)", fontSize: ".88rem" }}>{formatDate(subscription.activationAt)} → {formatDate(subscription.endDate)}</p>
                    <span style={{ color: "#d4af37", fontWeight: 700, fontSize: ".92rem" }}>Status: {finalStatus}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 .2rem 0", color: "rgba(255,255,255,.8)", fontSize: ".8rem" }}>Progress</p>
                <p style={{ margin: 0, color: "#d4af37", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>{daysCompleted}/{totalDays}</p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,.7)", fontSize: ".8rem" }}>Days</p>
                  </div>
                </div>
                <div style={S.progressBar}><div style={S.progressFill(pct)} /></div>
                <p style={{ margin: ".3rem 0 0 0", color: "rgba(255,255,255,.9)", fontSize: ".82rem" }}>{pct}% Complete</p>
              </div>

              {pauseMessage && (
                <div style={{ background: "#fff4e5", padding: ".85rem 1rem", borderRadius: 9, border: "1px solid rgba(212,175,55,.3)", display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.25rem", fontSize: ".88rem", color: "#8b6914" }}>
                  {pauseMessage}
                </div>
              )}

              <div style={S.grid2}>
                {/* Pause card */}
                <div style={S.card}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: "1.25rem" }}>
                    <div style={{ background: "#fff8e5", padding: ".65rem", borderRadius: 10 }}><Pause size={24} color="#d4af37" /></div>
                    <div>
                      <h3 style={{ margin: 0, color: "#2d5016", fontSize: "1.1rem", fontWeight: 600 }}>Pause Subscription</h3>
                      <p style={{ margin: 0, color: "#666", fontSize: ".8rem" }}>Temporarily pause your deliveries</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: ".5rem" }}>
                    <span style={{ color: "#666", fontSize: ".88rem" }}>Pauses Used</span>
                    <span style={{ color: "#2d5016", fontSize: "1.3rem", fontWeight: 700 }}>{usedPauseCount}/{maxPauseCount}</span>
                  </div>
                  <div style={{ background: "#f0f0f0", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: ".85rem" }}>
                    <div style={{ background: "linear-gradient(90deg,#d4af37,#f4d03f)", height: "100%", width: `${maxPauseCount ? Math.round(usedPauseCount / maxPauseCount * 100) : 100}%`, borderRadius: 8 }} />
                  </div>
                  <div style={{ background: "#f0f7ec", padding: ".75rem", borderRadius: 8, border: "1px solid rgba(45,80,22,.1)", marginBottom: ".85rem" }}>
                    <p style={{ margin: 0, color: "#2d5016", fontWeight: 600, fontSize: ".9rem" }}>{remainingPauseCount} pause{remainingPauseCount !== 1 ? "s" : ""} remaining</p>
                    <p style={{ margin: ".2rem 0 0 0", color: "#666", fontSize: ".78rem" }}>Used: {usedPauseCount} / {maxPauseCount} total</p>
                  </div>
                  {canModify && (
                    <button
                      style={{ ...(isLocked || finalStatus !== "ACTIVE" ? S.btnDisabled : S.btnGold), width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" }}
                      disabled={isLocked || finalStatus !== "ACTIVE"}
                      onClick={() => {
                        if (hasUpcomingPause()) { alert("You already have a scheduled pause."); return; }
                        if (!isLocked) setShowPauseModal(true);
                      }}
                    >
                      {isLocked && <Lock size={15} />} Request Pause
                    </button>
                  )}
                </div>

                {/* Delivery slot card */}
                <div style={S.card}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: "1.25rem" }}>
                    <div style={{ background: "#e8f5e9", padding: ".65rem", borderRadius: 10 }}><Clock size={24} color="#3d6b1f" /></div>
                    <div>
                      <h3 style={{ margin: 0, color: "#2d5016", fontSize: "1.1rem", fontWeight: 600 }}>Delivery Slot</h3>
                      <p style={{ margin: 0, color: "#666", fontSize: ".8rem" }}>Change once every 14 days</p>
                    </div>
                  </div>
                  <div style={{ background: "#f0f7ec", padding: "1rem", borderRadius: 10, marginBottom: "1rem", border: "1px solid rgba(45,80,22,.1)" }}>
                    <p style={{ margin: "0 0 .25rem 0", color: "#666", fontSize: ".75rem" }}>Current Slot</p>
                    <p style={{ margin: "0 0 .5rem 0", color: "#2d5016", fontSize: "1.3rem", fontWeight: 700 }}>{order.deliverySlot || "7:00 AM - 9:00 AM"}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
                      <MapPin size={14} color="#666" />
                      <p style={{ margin: 0, color: "#666", fontSize: ".82rem" }}>
                        {order.address ? `${order.address.house}, ${order.address.street}, ${order.address.city}` : user.address || "-"}
                      </p>
                    </div>
                  </div>
                  <div style={{ background: "#fff4e5", padding: ".75rem", borderRadius: 8, border: "1px solid rgba(212,175,55,.25)", marginBottom: ".85rem", fontSize: ".82rem", color: "#8b6914", display: "flex", alignItems: "center", gap: ".4rem" }}>
                    <Clock size={14} color="#d4af37" /> Next change available after 14 days from last change
                  </div>
                  <button style={{ ...S.btnDisabled, width: "100%" }} disabled>Change Delivery Slot</button>
                </div>
              </div>

              {/* Package details */}
              <div style={S.card}>
                <h3 style={{ margin: "0 0 1.25rem 0", color: "#2d5016", fontSize: "1.1rem", fontWeight: 600 }}>Package Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "1rem" }}>
                  {[
                    ["Package",         `RYVIVE ${basePlan}`],
                    ["Duration",        `${durationMonths} Months`],
                 
                    ["Start Date",      formatDate(subscription.activationAt)],
                    ["End Date",        formatDate(subscription.endDate)],
                   ["Days Completed",  `${daysCompleted} Days`],
                   ["Days Remaining",  `${totalDays - daysCompleted} Days`],
                    ["Pause Allowance", `${maxPauseCount} total`],
                  ].map(([label, val]) => (
                    <div key={label} style={{ padding: ".85rem", background: "#f8fdf5", borderRadius: 9, border: "1px solid rgba(45,80,22,.08)" }}>
                      <p style={{ margin: "0 0 .25rem 0", color: "#666", fontSize: ".75rem", fontWeight: 500 }}>{label}</p>
                      <p style={{ margin: 0, color: "#2d5016", fontSize: "1rem", fontWeight: 700 }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pause history */}
              {subscription.pause?.history?.length > 0 && (
                <div style={S.card}>
                  <h3 style={{ margin: "0 0 1rem 0", color: "#2d5016", fontSize: "1.1rem", fontWeight: 600 }}>Pause History</h3>
                  {subscription.pause.history.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem", background: "#f8fdf5", borderRadius: 9, marginBottom: ".5rem", border: "1px solid rgba(45,80,22,.08)" }}>
                      <span style={{ color: "#2d5016", fontSize: ".88rem" }}>{formatDate(p.startDate)} → {formatDate(p.resumeDate)}</span>
                      <span style={{ background: "#fff8e1", color: "#c8860f", fontSize: ".78rem", fontWeight: 600, padding: ".2rem .65rem", borderRadius: 6 }}>{p.days} day{p.days > 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── My Information ── */}
          {activeTab === "info" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem" }}>
                <div>
                  <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>My Information</h2>
                  <p style={{ margin: 0, color: "#666" }}>View and update your profile details</p>
                </div>
                {!editMode && canEdit && (
                  <button style={S.btnGold} onClick={() => setEditMode(true)}>
                    <Edit3 size={15} style={{ marginRight: ".4rem" }} /> Edit Information
                  </button>
                )}
              </div>
              {!canEdit && (
                <div style={{ background: "#fff4e5", padding: ".85rem 1rem", borderRadius: 9, border: "1px solid rgba(212,175,55,.3)", display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.25rem", fontSize: ".88rem", color: "#8b6914" }}>
                  <Clock size={18} color="#d4af37" /> Profile editing is only allowed until 5:00 PM daily.
                </div>
              )}
              <div style={S.card}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "1.25rem" }}>
                  {[
                    { label: "Full Name",        val: `${user.firstName} ${user.lastName}`, locked: true },
                    { label: "Membership ID",    val: membershipId,                         locked: true },
                    { label: "Email Address",    val: formData.email,   key: "email",        locked: false },
                    { label: "Phone Number",     val: formData.phone,   key: "phone",        locked: false },
                    { label: "Date of Birth",    val: formatDate(user.dob),                 locked: true },
                    { label: "Delivery Address", val: order.address ? `${order.address.house}, ${order.address.street}, ${order.address.city}` : "-", locked: true },
                    { label: "Payment Method",   val: order.paymentMethod || "Online",      locked: true },
                  ].map((field) => (
                    <div key={field.label}>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".82rem", fontWeight: 600, color: "#666", marginBottom: ".4rem" }}>
                        {field.label} {field.locked && <Lock size={13} color="#bbb" />}
                      </label>
                      <input
                        type="text"
                        value={field.val}
                        disabled={!editMode || field.locked}
                        onChange={(e) => field.key && setFormData({ ...formData, [field.key]: e.target.value })}
                        style={{ width: "100%", padding: ".75rem", borderRadius: 8, border: editMode && !field.locked ? "2px solid #d4af37" : "1px solid rgba(45,80,22,.15)", fontSize: ".92rem", fontWeight: 500, color: field.locked ? "#999" : "#2d5016", background: field.locked ? "#f5f5f5" : "white", cursor: field.locked ? "not-allowed" : editMode ? "text" : "default", fontFamily: "'Outfit',sans-serif", outline: "none" }}
                      />
                    </div>
                  ))}
                </div>
                {editMode && (
                  <div style={{ marginTop: "1.5rem", display: "flex", gap: ".85rem" }}>
                    <button style={S.btnGreen} onClick={saveProfile}>Save Changes</button>
                    <button onClick={() => setEditMode(false)} style={{ background: "transparent", color: "#666", border: "1px solid #ddd", padding: ".75rem 1.5rem", borderRadius: 9, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: ".9rem" }}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Upgrade Plan ── */}
          {activeTab === "upgrade" && (
            <div>
              <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>Upgrade Your Plan</h2>
              <p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>Take your wellness journey to the next level</p>
              <div style={{ background: "#f0f7ec", padding: "1.25rem", borderRadius: 10, border: "1px solid rgba(45,80,22,.1)", marginBottom: "1.75rem" }}>
                <p style={{ margin: "0 0 .2rem 0", color: "#666", fontSize: ".82rem" }}>Current Plan</p>
                <p style={{ margin: 0, color: "#2d5016", fontSize: "1.3rem", fontWeight: 700 }}>RYVIVE {basePlan} · {durationMonths}-Month</p>
              </div>
              <div style={S.grid2}>
                {upgradePlans.map((plan) => (
                  <div key={plan.name} style={{ ...S.card, border: "1.5px solid rgba(212,175,55,.2)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, background: "linear-gradient(135deg,#d4af37,#f4d03f)", color: "#2d5016", padding: ".3rem .9rem", fontSize: ".72rem", fontWeight: 700, borderBottomLeftRadius: 10 }}>{plan.savings}</div>
                    <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".75rem" }}>{plan.name}</h3>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3d6b1f", marginBottom: "1.25rem" }}>{plan.price}</div>
                    <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".6rem", fontSize: ".9rem", color: "#555" }}>
                          <CheckCircle size={16} color="#3d6b1f" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button style={{ ...S.btnGreen, width: "100%" }}>Upgrade Now</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Purchase History ── */}
          {activeTab === "history" && (
            <div>
              <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>Purchase History</h2>
              <p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>All your transactions and receipts</p>
              <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
                {transactions.length === 0 && <p style={{ padding: "1.5rem", color: "#888" }}>No transactions found.</p>}
                {transactions.map((txn, i) => (
                  <div key={txn.id} style={{ padding: "1.25rem 1.75rem", borderBottom: i < transactions.length - 1 ? "1px solid rgba(45,80,22,.07)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".35rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, color: "#2d5016", fontSize: "1rem" }}>{txn.plan}</span>
                        <span style={{ background: txn.status === "ACTIVE" || txn.status === "Successful" ? "#e8f5e9" : "#ffebee", color: txn.status === "ACTIVE" || txn.status === "Successful" ? "#2e7d32" : "#c62828", padding: ".2rem .65rem", borderRadius: 6, fontSize: ".78rem", fontWeight: 600 }}>{txn.status}</span>
                      </div>
                      <div style={{ fontSize: ".82rem", color: "#888", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span>Invoice: {txn.id}</span><span>{txn.date}</span><span>{txn.method}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#3d6b1f" }}>{txn.amount}</span>
                      <button
  style={{ ...S.btnGold, padding: ".55rem 1rem", fontSize: ".82rem", display: "flex", alignItems: "center", gap: ".4rem" }}
  onClick={() => handleDownloadReceipt(txn.id)}
>
  <Receipt size={15} /> Download Receipt
</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Support & Tickets ── */}
          {activeTab === "support" && (
            <div>
              <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>Support & Tickets</h2>
              <p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>Get help or share feedback</p>
              <div style={{ background: "#f0f7ec", padding: "1.25rem", borderRadius: 10, border: "1px solid rgba(45,80,22,.1)", marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 .3rem 0", color: "#666", fontSize: ".82rem" }}>Need immediate help?</p>
                <p style={{ margin: "0 0 .2rem 0", color: "#2d5016", fontWeight: 600 }}>📧 customersupport@ryviveroots.com</p>
                <p style={{ margin: 0, color: "#2d5016", fontWeight: 600 }}>📞 +91 97656 00701</p>
              </div>
              <div style={{ ...S.card, marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#2d5016", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Raise a Complaint or Share Feedback</h3>
                <select style={{ width: "100%", padding: ".75rem", border: "1px solid rgba(45,80,22,.2)", borderRadius: 9, fontSize: ".9rem", fontFamily: "'Outfit',sans-serif", marginBottom: "1rem", color: "#2d5016", background: "white", outline: "none" }}>
                  <option>Select Type</option>
                  <option>Complaint</option>
                  <option>Feedback</option>
                </select>
                <textarea placeholder="Describe your concern or feedback in detail..." style={{ width: "100%", minHeight: 110, padding: ".85rem", border: "1px solid rgba(45,80,22,.2)", borderRadius: 9, fontSize: ".9rem", fontFamily: "'Outfit',sans-serif", resize: "vertical", marginBottom: "1rem", color: "#2d5016", outline: "none" }} />
                <button style={S.btnGreen}>Submit</button>
              </div>
              <h3 style={{ color: "#2d5016", fontSize: "1.1rem", fontWeight: 600, marginBottom: ".85rem" }}>Your Tickets</h3>
              <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
                {tickets.map((ticket, i) => (
                  <div key={ticket.id} style={{ padding: "1.25rem 1.75rem", borderBottom: i < tickets.length - 1 ? "1px solid rgba(45,80,22,.07)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".3rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, color: "#2d5016" }}>{ticket.subject}</span>
                        <span style={{ background: ticket.status === "Resolved" ? "#e8f5e9" : ticket.status === "In Progress" ? "#fff8e1" : "#f5f5f5", color: ticket.status === "Resolved" ? "#2e7d32" : ticket.status === "In Progress" ? "#c8860f" : "#666", padding: ".2rem .65rem", borderRadius: 6, fontSize: ".78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: ".25rem" }}>
                          {ticket.status === "Resolved" ? <CheckCircle size={13} /> : <Clock size={13} />} {ticket.status}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#888", fontSize: ".82rem" }}>ID: {ticket.id} · Raised {ticket.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>Notifications</h2>
              <p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>Stay updated with your wellness journey</p>
              <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
                {notifications.map((notif, i) => (
                  <div key={notif.id} style={{ padding: "1.1rem 1.5rem", borderBottom: i < notifications.length - 1 ? "1px solid rgba(45,80,22,.07)" : "none", background: !notif.read ? "rgba(212,175,55,.04)" : "white", display: "flex", gap: ".9rem", alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: notif.type === "delivery" ? "#e8f5e9" : notif.type === "update" ? "#fff8e5" : "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                      {notif.type === "delivery" ? "📦" : notif.type === "update" ? "🔔" : "⚠️"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 .3rem 0", fontSize: ".95rem", fontWeight: notif.read ? 500 : 600, color: "#2d5016" }}>{notif.message}</p>
                      <p style={{ margin: 0, fontSize: ".82rem", color: "#999" }}>{notif.time}</p>
                    </div>
                    {!notif.read && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#d4af37", marginTop: ".3rem", flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Pause Modal ── */}
      {showPauseModal && (
        <div style={S.overlay} onClick={() => setShowPauseModal(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#999" }} onClick={() => setShowPauseModal(false)}>✕</button>
            <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".25rem" }}>Pause Subscription</h3>
            <p style={{ color: "#666", fontSize: ".85rem", marginBottom: "1.25rem" }}>Choose when to pause and resume (max 15 days)</p>

            <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, color: "#666", marginBottom: ".35rem" }}>Pause From</label>
            <input type="date" min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} value={pauseFromDate} onChange={(e) => setPauseFromDate(e.target.value)}
              style={{ width: "100%", padding: ".75rem", border: "1px solid rgba(45,80,22,.2)", borderRadius: 9, fontSize: ".9rem", fontFamily: "'Outfit',sans-serif", marginBottom: "1rem", color: "#2d5016", outline: "none" }} />

            <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, color: "#666", marginBottom: ".35rem" }}>Pause To</label>
            <input type="date" min={pauseFromDate || new Date().toISOString().split("T")[0]} max={getMaxToDate()} value={pauseToDate} onChange={(e) => setPauseToDate(e.target.value)}
              style={{ width: "100%", padding: ".75rem", border: "1px solid rgba(45,80,22,.2)", borderRadius: 9, fontSize: ".9rem", fontFamily: "'Outfit',sans-serif", marginBottom: "1rem", color: "#2d5016", outline: "none" }} />

            {pauseDays > 0 && (
              <div style={{ background: "#f0f7ec", padding: ".75rem", borderRadius: 9, marginBottom: ".85rem", fontWeight: 600, color: "#2d5016" }}>
                Duration: {pauseDays} day{pauseDays > 1 ? "s" : ""}
              </div>
            )}

            {pauseFromDate && pauseToDate && pauseDays > 0 && (
              <div style={{ background: "#f0f7ec", padding: "1rem", borderRadius: 9, border: "1px solid rgba(45,80,22,.1)", fontSize: ".88rem", color: "#2d5016", marginBottom: "1rem", lineHeight: 1.6 }}>
                <strong>Pause from:</strong> {formatDate(pauseFromDate)}<br />
                <strong>Pause to:</strong> {formatDate(pauseToDate)}<br />
                <strong style={{ color: "#3d6b1f" }}>Service resumes on {getResumeNextDay()}</strong>
              </div>
            )}

            <button style={{ ...S.btnGreen, width: "100%" }} onClick={confirmPause}>Confirm Pause</button>
          </div>
        </div>
      )}

      {/* ── Renew Modal ── */}
      {showRenewModal && (
        <div style={S.overlay} onClick={() => setShowRenewModal(false)}>
          <div style={{ ...S.modal, maxWidth: 880 }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#999" }} onClick={() => setShowRenewModal(false)}>✕</button>
            <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".25rem" }}>Renew Your Subscription</h3>
            <p style={{ color: "#666", fontSize: ".85rem", marginBottom: "1.5rem" }}>Current Plan: <strong style={{ color: "#2d5016" }}>RYVIVE {basePlan} · {durationMonths}M</strong></p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.25rem" }}>
              {PLAN_ORDER.map((plan) => {
                const prices  = RENEWAL_PRICING[plan];
                const isSel   = selectedPlan === plan;
                const isFeat  = plan === "PLATINUM";
                return (
                  <div key={plan} onClick={() => setSelectedPlan(plan)} style={{ border: `${isSel ? "2" : "1"}px solid ${isSel ? "#d4af37" : isFeat ? "#d4af37" : "rgba(45,80,22,.15)"}`, borderRadius: 12, padding: "1.25rem", cursor: "pointer", background: isSel ? "#fffdf0" : "white", position: "relative", marginTop: isFeat ? "1rem" : 0 }}>
                    {isFeat && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#d4af37", color: "#2d5016", fontSize: ".7rem", fontWeight: 700, padding: ".2rem .75rem", borderRadius: 20, whiteSpace: "nowrap" }}>⭐ Most Popular</div>}
                    <h4 style={{ color: "#2d5016", marginBottom: ".75rem", fontSize: "1rem" }}>
                      Ryvive {plan} {plan === basePlan && <span style={{ fontSize: ".72rem", color: "#3d6b1f" }}>(Current)</span>}
                    </h4>
                    {["1", "3"].map((dur) => (
                      <div key={dur} onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setRenewDuration(dur); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${isSel && renewDuration === dur ? "#d4af37" : "rgba(45,80,22,.15)"}`, borderRadius: 9, padding: ".65rem .85rem", marginTop: ".5rem", cursor: "pointer", background: isSel && renewDuration === dur ? "#fffdf0" : "white" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                          <div style={{ width: 15, height: 15, borderRadius: "50%", border: `1.5px solid ${isSel && renewDuration === dur ? "#3d6b1f" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isSel && renewDuration === dur && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3d6b1f" }} />}
                          </div>
                          <span style={{ fontSize: ".85rem", fontWeight: dur === "3" ? 600 : 400 }}>{dur === "1" ? "1 Month" : "3 Months"}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: ".88rem", color: "#2d5016" }}>₹{prices[dur].final.toLocaleString()}</span>
                      </div>
                    ))}
                    <button style={{ ...S.btnGreen, width: "100%", marginTop: ".85rem", fontSize: ".85rem", padding: ".65rem" }}
                      onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setShowSummary(true); }}>
                      Select & Continue
                    </button>
                    <ul style={{ listStyle: "none", marginTop: ".85rem" }}>
                      {PLAN_FEATURES[plan].slice(0, 3).map((f) => (
                        <li key={f} style={{ fontSize: ".8rem", color: "#555", marginBottom: ".3rem" }}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Renewal Summary Modal ── */}
      {showSummary && selectedPlan && (() => {
        const p = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
        if (!p) return null;
        return (
          <div style={{ ...S.overlay, zIndex: 1000 }} onClick={() => setShowSummary(false)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#999" }} onClick={() => setShowSummary(false)}>✕</button>
              <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".25rem" }}>Renewal Summary — {selectedPlan}</h3>
              <p style={{ color: "#666", fontSize: ".85rem", marginBottom: "1rem" }}>Review before payment</p>
              <select value={renewDuration} onChange={(e) => setRenewDuration(e.target.value)}
                style={{ width: "100%", padding: ".75rem", border: "1px solid rgba(45,80,22,.2)", borderRadius: 9, fontSize: ".9rem", fontFamily: "'Outfit',sans-serif", marginBottom: "1rem", color: "#2d5016", background: "white", outline: "none" }}>
                <option value="1">1 Month</option>
                <option value="3">3 Months (Best Value)</option>
              </select>
              <div style={{ background: "#f8fdf5", padding: "1rem", borderRadius: 9, marginBottom: "1rem", border: "1px solid rgba(45,80,22,.1)" }}>
                {[["Plan", `RYVIVE ${selectedPlan}`], ["Duration", `${renewDuration} Month${renewDuration === "3" ? "s" : ""}`]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: ".9rem", marginBottom: ".5rem" }}>
                    <span style={{ color: "#666" }}>{l}</span><span style={{ fontWeight: 600, color: "#2d5016" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.05rem", borderTop: "1px solid rgba(45,80,22,.1)", paddingTop: ".65rem", marginTop: ".4rem" }}>
                  <span style={{ fontWeight: 600, color: "#2d5016" }}>Total</span>
                  <span style={{ fontWeight: 700, color: "#3d6b1f", fontSize: "1.2rem" }}>₹{p.final.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ background: "#e8f5e9", borderRadius: 9, padding: "1rem", fontSize: ".85rem", color: "#2e7d32", marginBottom: "1rem", lineHeight: 1.6 }}>
                🌿 <strong>Why renew now?</strong><br />
                Stay consistent, maintain your savings, and keep your wellness streak going.
              </div>
              <button style={{ ...S.btnGreen, width: "100%" }} onClick={handleRenewPayment}>
                Renew Now · ₹{p.final.toLocaleString()}
              </button>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        button:not(:disabled):hover { opacity: .92; }
        input:focus, textarea:focus, select:focus { border-color: #d4af37 !important; box-shadow: 0 0 0 3px rgba(212,175,55,.12); }
      `}</style>
    </div>
  );
}                                              
 