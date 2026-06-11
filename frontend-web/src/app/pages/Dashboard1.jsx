import { useState, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { motion } from "motion/react"; 
import {
  User, Calendar, TrendingUp, Package, MessageCircle, Bell,
  LogOut, Edit3, Lock, Clock, CheckCircle, Pause, MapPin,
  Receipt, ChevronRight as DashMenuIcon, X as XIcon,
} from "lucide-react";
import { CREAM, CREAM_2, DARK, INK, SAGE, SAGE_DARK } from "../theme";

// ─── Theme Tokens ──────────────────────────────────────────────────────────────
const GOLD       = "#d4af37";
const GOLD_LIGHT = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";

// ─── Constants ─────────────────────────────────────────────────────────────────
const PLAN_PAUSES = {
  SILVER:   { 1: 0,  3: 3 },
  GOLD:     { 1: 2,  3: 6 },
  PLATINUM: { 1: 3,  3: 9 },
};

const RENEWAL_PRICING = {
  SILVER:   { "1": { original: 4999,  final: 4999  }, "3": { original: 17999, final: 14997 } },
  GOLD:     { "1": { original: 5999,  final: 5999  }, "3": { original: 20997, final: 17997 } },
  PLATINUM: { "1": { original: 6999,  final: 6999  }, "3": { original: 23997, final: 20997 } },
};

const PLAN_FEATURES = {
  SILVER:   ["Signature detox collection", "Fruit & vegetable elixirs", "Wellness blends", "Clean daily nourishment", "Light, balanced portions"],
  GOLD:     ["Curated salad collection", "Sandwiches", "Wraps", "Soups", "Chaat"],
  PLATINUM: ["Pasta zoodle collections", "House-crafted dips", "Premium combinations", "Chef-led seasonal edits", "Signature tasting balance"],
};

const PLAN_ORDER = ["PLATINUM", "GOLD", "SILVER"];

const WEEKLY_MENU = {
  PLATINUM: {
    1: { Mon: "High Protein Paneer Salad", Tue: "Dragon Delight + Beetroot Cheese Wrap", Wed: "The Pesto Zoodle Hour + Pomegranate Delight", Thu: "Mexican Avocado Salad", Fri: "Orange Pine Twist + Sweet Potato & PEA", Sat: "Green Garden Bowl" },
    2: { Mon: "Broccoli Cashew Cream", Tue: "O-Juice + Paneer Crunch Wrap", Wed: "The Zoodle Flame + Libido Booster", Thu: "Chickpea Paneer Fusion", Fri: "Dragon Pine + Corn N' Cheese", Sat: "Thai Mushroom Salad" },
    3: { Mon: "Chilli Lime Soya Salad", Tue: "Dragon Delight + Beetroot Cheese Wrap", Wed: "The Pesto Zoodle Hour + Pomegranate Delight", Thu: "Signature Twin Plus", Fri: "Orange Pine Twist + Sweet Potato & PEA", Sat: "Sweet Potato Bliss" },
    4: { Mon: "Creamy Double Chickpea", Tue: "Avocado Smoothie + Paneer Crunch Wrap", Wed: "The Zoodle Flame + Libido Booster", Thu: "Rajma Paneer Power Lean", Fri: "Bright Eyes + Corn N' Cheese", Sat: "Chilli Crunch Salad" },
  },
  GOLD: {
    1: { Mon: "Classic Veggie Bowl", Tue: "Immuni Boost Plus + High-Protein Soya Cheese Wrap", Wed: "Dragon Pine", Thu: "Roasted Zucchini Bowl", Fri: "Stamina Booster + Corn N' Cheese", Sat: "Avocado Paneer Royal Grill" },
    2: { Mon: "Creamy Double Chickpea", Tue: "Calm Cucumber + Paneer Crunch Cheese Wrap", Wed: "Libido Booster", Thu: "Rajma Paneer Power Lean", Fri: "For Skin Sake + Sweet N' Fresh Corn", Sat: "The Pesto Zoodle Hour" },
    3: { Mon: "Mexican Avocado Salad", Tue: "Red Ryvive + Chickpea Avocado Cheese Wrap", Wed: "Pomegranate Delight", Thu: "Broccoli Cashew Cream", Fri: "Happy Gut + Sweet Potato & Pea", Sat: "Garlic Mushroom & Veggie Melt" },
    4: { Mon: "High Protein Black Chana", Tue: "Orange Pine Twist + High Protein Soya Cheese Wrap", Wed: "Dragon Delight", Thu: "Green Garden Bowl", Fri: "Ryvive Carrot + Sweet N' Fresh Corn", Sat: "The Zoodle Flame" },
  },
  SILVER: {
    1: { Mon: "Healthy Heart", Tue: "Chilli Crunch Salad", Wed: "Paneer Crunch Wrap + Orange Pine Twist", Thu: "Chickpea Paneer Fusion", Fri: "Corn N' Cheese Chaat", Sat: "Veg Protein Supreme Wrap + Golden Pine" },
    2: { Mon: "Stamina Booster", Tue: "Creamy Double Chickpea", Wed: "Beetroot Cheese Wrap + Calm Cucumber", Thu: "Rajma Paneer Power Lean", Fri: "Soya Protein Wrap + Ryvive Carrot", Sat: "Immuni Boost Plus" },
    3: { Mon: "Red Ryvive", Tue: "Corn Paneer Balance Bowl", Wed: "Sprout Energy Wrap + Dr. Carrot", Thu: "Roasted Zucchini Bowl", Fri: "Sprout Supreme Chaat", Sat: "Spinach Corn Cheese Wrap + Beet Blend" },
    4: { Mon: "APB Shake", Tue: "High Protein Paneer Salad", Wed: "Spinach Corn Cheese Wrap + Beet Blend", Thu: "Chilli Lime Soya Salad", Fri: "Soya Protein Wrap + Ryvive Carrot", Sat: "Sweet Potato & Pea Chaat" },
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getCurrentWeekNumber(activationDate, durationMonths = 1) {
  if (!activationDate) return 1;
  const activation = new Date(activationDate);
  activation.setHours(0, 0, 0, 0);
  const dow = activation.getDay();
  const daysFromMon = dow === 0 ? 6 : dow - 1;
  const week1Monday = new Date(activation);
  week1Monday.setDate(activation.getDate() - daysFromMon);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - week1Monday.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const maxWeeks = durationMonths === 3 ? 12 : 4;
  return Math.min(Math.floor(days / 7) + 1, maxWeeks);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
}

function getRemainingDays(endDate) {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
}

// ─── Real Payment Initiator (Doc2) ─────────────────────────────────────────────
async function initiatePayment({ user, plan, duration, membershipId, isRenewal = false, isExistingCustomerPurchase = false, formData = {} }) {
  try {
    const baseMembershipId = membershipId?.includes("-") ? membershipId.split("-")[0] : membershipId;
    const planString = `${plan}_${duration}MONTH`;
    const res = await fetch("https://api.ryviveroots.com/api/payment/easebuzz/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: user?.firstName || "",
        email: formData?.email || user?.email || "",
        phone: formData?.phone || user?.phone || "",
        plan: planString,
        isRenewal,
        isExistingCustomerPurchase,
        membershipId: baseMembershipId,
      }),
    });
    const data = await res.json();
    if (!data.success || !data.access_key) { alert(data.message || "Payment failed"); return; }
    window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

// ─── UpgradePlanCard ───────────────────────────────────────────────────────────
function UpgradePlanCard({ plan, membershipId, user, formData }) {
  const [upgradeDur, setUpgradeDur] = useState("3");

  const handleUpgradePayment = () => {
    initiatePayment({ user, plan: plan.name, duration: upgradeDur, membershipId, isRenewal: false, isExistingCustomerPurchase: true, formData });
  };

  return (
    <div style={{
      background: CREAM,
      border: plan.highlight ? `2px solid ${GOLD}` : `1.5px solid ${CARD_BORDER}`,
      borderRadius: "2px",
      padding: "1.75rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {plan.badge && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: GOLD, color: DARK,
          padding: ".3rem .9rem", fontSize: ".72rem", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", borderBottomLeftRadius: "2px",
        }}>
          {plan.badge}
        </div>
      )}
      <h3 className="font-serif" style={{ color: INK, fontSize: "1.2rem", fontWeight: 400, marginBottom: "1rem", marginTop: plan.badge ? ".5rem" : 0 }}>
        {plan.label}
      </h3>
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
        {["1", "3"].map((dur) => (
          <button key={dur} onClick={() => setUpgradeDur(dur)} style={{
            flex: 1, padding: ".6rem",
            border: `${upgradeDur === dur ? "2" : "1"}px solid ${upgradeDur === dur ? GOLD : CARD_BORDER}`,
            background: upgradeDur === dur ? GOLD_LIGHT : CREAM,
            color: INK, fontWeight: upgradeDur === dur ? 700 : 400,
            fontSize: ".85rem", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {dur === "1" ? "1 Month" : "3 Months"}
          </button>
        ))}
      </div>
      <div className="font-serif" style={{ fontSize: "2rem", fontWeight: 300, color: INK, marginBottom: "1.25rem" }}>
        ₹{plan.prices[upgradeDur].toLocaleString()}
        <span style={{ fontSize: ".85rem", fontWeight: 400, color: "rgba(42,37,32,0.5)", marginLeft: ".4rem" }}>
          / {upgradeDur === "1" ? "month" : "3 months"}
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: "0 0 1.5rem 0", padding: 0 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", marginBottom: ".55rem", fontSize: ".88rem", color: "rgba(42,37,32,0.7)" }}>
            <CheckCircle size={15} color={SAGE_DARK} style={{ marginTop: "2px", flexShrink: 0 }} /> {f}
          </li>
        ))}
      </ul>
      <div style={{
        background: CREAM_2, borderRadius: "2px", padding: ".85rem",
        border: `1px solid ${CARD_BORDER}`, marginBottom: "1rem", fontSize: ".85rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".35rem" }}>
          <span style={{ color: "rgba(42,37,32,0.6)" }}>Plan</span>
          <span style={{ fontWeight: 600, color: INK }}>RYVIVE {plan.name} · {upgradeDur}M</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${CARD_BORDER}`, paddingTop: ".35rem", marginTop: ".35rem" }}>
          <span style={{ fontWeight: 600, color: INK }}>Total</span>
          <span style={{ fontWeight: 700, color: SAGE_DARK }}>₹{plan.prices[upgradeDur].toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={handleUpgradePayment}
        className="tracking-widest uppercase"
        style={{ width: "100%", padding: ".75rem 1.5rem", background: DARK, color: CREAM, border: "none", fontSize: ".82rem", fontWeight: 400, cursor: "pointer", letterSpacing: "0.2em" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        Continue
      </button>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard1() {
  const [activeTab, setActiveTab]       = useState("schedule");
  const [order, setOrder]               = useState(null);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "", phone: "", deliverySlot: "",
    house: "", street: "", landmark: "", pincode: "", city: "",
  });

  // Policy modal
  const [showPolicyModal, setShowPolicyModal]       = useState(false);
  const [activePolicySection, setActivePolicySection] = useState(null);

  // Support state
  const [supportMode, setSupportMode]       = useState("ticket");
  const [feedbackType, setFeedbackType]     = useState("Query");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText]     = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Pause modal
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseFromDate, setPauseFromDate]   = useState("");
  const [pauseToDate, setPauseToDate]       = useState("");

  // Renew modals
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showSummary, setShowSummary]       = useState(false);
  const [renewDuration, setRenewDuration]   = useState("3");
  const [selectedPlan, setSelectedPlan]     = useState(null);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(1);

  // ── GSAP mount animations ──────────────────────────────────────────────────
  useEffect(() => {
    const cards = document.querySelectorAll(".dash-card");
    if (cards && cards.length) {
      gsap.from(cards, { y: 14, opacity: 0, stagger: 0.05, duration: 0.75, ease: "power2.out" });
    }
  }, [activeTab]);

  // ── Fetch dashboard data from real API ────────────────────────────────────
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

    const fetchNotifications = async () => {
      try {
        const membershipId = localStorage.getItem("membershipId");
        const res  = await fetch(`https://api.ryviveroots.com/api/user/notifications?membershipId=${membershipId}`);
        const data = await res.json();
        if (data.success) setNotifications(data.notifications || []);
      } catch (err) {
        console.log("Notification fetch error:", err);
      }
    };

    fetchDashboard();
    fetchNotifications();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Sync formData when order loads ────────────────────────────────────────
  useEffect(() => {
    if (!order) return;
    setFormData({
      email:        order.user?.email         || "",
      phone:        order.user?.phone         || "",
      deliverySlot: order.deliverySlot        || "",
      house:        order.address?.house      || "",
      street:       order.address?.street     || "",
      landmark:     order.address?.landmark   || "",
      pincode:      order.address?.pincode    || "",
      city:         order.address?.city       || "",
    });
    const plan = order.subscription?.plan?.split("_")[0]?.toUpperCase();
    if (["SILVER", "GOLD", "PLATINUM"].includes(plan)) setSelectedPlan(plan);
    const dur = order.subscription?.durationMonths || 1;
    const wk  = getCurrentWeekNumber(order.subscription?.activationAt, dur);
    setSelectedWeek(wk);
  }, [order]);

  // ── Lock body scroll when modals or mobile nav open ───────────────────────
  useEffect(() => {
    document.body.style.overflow =
      showPauseModal || showRenewModal || showSummary || mobileNavOpen || showPolicyModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showPauseModal, showRenewModal, showSummary, mobileNavOpen, showPolicyModal]);

  // ── Scroll top + close mobile nav on tab change ───────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileNavOpen(false);
  }, [activeTab]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: CREAM_2 }}>
        <div className="text-center">
          <div className="tracking-[0.42em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE }}>— Revyve Roots</div>
          <div className="font-serif" style={{ fontSize: "22px", color: INK, fontWeight: 300 }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const { user, subscription, membershipId } = order;
  const basePlan       = subscription.plan.split("_")[0].toUpperCase();
  const durationMonths = subscription.durationMonths || 1;

  // ── Meal day calculations ──────────────────────────────────────────────────
  const getTotalMealDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate), end = new Date(endDate);
    let count = 0; const cursor = new Date(start);
    while (cursor <= end) { if (cursor.getDay() !== 0) count++; cursor.setDate(cursor.getDate() + 1); }
    return count;
  };
  const getCompletedMealDays = (startDate, endDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate), end = new Date(endDate), now = new Date();
    const limit = now < end ? now : end;
    let count = 0; const cursor = new Date(start);
    while (cursor <= limit) { if (cursor.getDay() !== 0) count++; cursor.setDate(cursor.getDate() + 1); }
    return count;
  };
  const totalDays     = getTotalMealDays(subscription.activationAt, subscription.endDate);
  const daysCompleted = getCompletedMealDays(subscription.activationAt, subscription.endDate);
  const remainingDays = getRemainingDays(subscription.endDate);
  const pct           = Math.round((daysCompleted / totalDays) * 100) || 0;

  // ── Pause logic ───────────────────────────────────────────────────────────
  const canModify          = basePlan === "GOLD" || basePlan === "PLATINUM" || (basePlan === "SILVER" && durationMonths === 3);
  const maxPauseCount      = basePlan === "SILVER" && durationMonths === 1 ? 0 : (PLAN_PAUSES[basePlan]?.[durationMonths] || 0);
  const usedPauseCount     = subscription.pause?.history?.length || 0;
  const remainingPauseCount = Math.max(maxPauseCount - usedPauseCount, 0);
  const perMonth           = { SILVER: 1, GOLD: 2, PLATINUM: 3 }[basePlan] || 0;

  const calculatePauseDays = () => {
    if (!pauseFromDate || !pauseToDate) return 0;
    const diff = new Date(pauseToDate).getTime() - new Date(pauseFromDate).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 0;
  };
  const pauseDays = calculatePauseDays();

  const getMaxToDate = () => {
    if (!pauseFromDate) return "";
    const d = new Date(pauseFromDate); d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  };
  const getResumeNextDay = () => {
    if (!pauseToDate) return "";
    const d = new Date(pauseToDate); d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("en-IN");
  };
  const hasOverlap = () =>
    subscription.pause?.history?.some((p) => {
      const eStart = new Date(p.startDate), eEnd = new Date(p.resumeDate);
      const nStart = new Date(pauseFromDate), nEnd = new Date(pauseToDate);
      return nStart <= eEnd && nEnd >= eStart;
    });
  const hasUpcomingPause = () =>
    subscription.pause?.history?.some((p) => new Date(p.startDate) > new Date());

  // ── Real API pause confirm ────────────────────────────────────────────────
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
      if (data.success) { alert("Subscription paused successfully"); setShowPauseModal(false); window.location.reload(); }
      else alert(data.message);
    } catch (err) { console.error(err); alert("Something went wrong."); }
  };

  // ── Status logic ──────────────────────────────────────────────────────────
  const getSubscriptionStatus = () => {
    const pause = subscription.pause;
    if (!pause || pause.history.length === 0) return "ACTIVE";
    const latest = pause.history[pause.history.length - 1];
    const now = new Date(), start = new Date(latest.startDate), resume = new Date(latest.resumeDate);
    if (now >= start && now <= resume) return "PAUSED";
    return "ACTIVE";
  };
  const backendStatus = subscription.status;
  const pauseStatus   = getSubscriptionStatus();
  const isExpired     = new Date() > new Date(subscription.endDate);
  const finalStatus   =
    backendStatus === "UNDER_PROCESS" ? "UNDER_PROCESS"
    : isExpired                       ? "EXPIRED"
    : pauseStatus === "PAUSED"        ? "PAUSED"
    : "ACTIVE";
  const isLocked = remainingPauseCount === 0 || finalStatus === "UNDER_PROCESS" || finalStatus === "EXPIRED";

  const latestPause  = subscription.pause?.history?.length > 0 ? subscription.pause.history[subscription.pause.history.length - 1] : null;
  const pauseMessage = latestPause
    ? latestPause.days === 1
      ? `Pause scheduled for ${formatDate(latestPause.startDate)}. Service will resume the next day.`
      : `Pause scheduled from ${formatDate(latestPause.startDate)} to ${formatDate(latestPause.resumeDate)}`
    : null;

  // ── Real API renew payment ─────────────────────────────────────────────────
  const handleRenewPayment = async () => {
    if (!selectedPlan) { alert("Please select a plan"); return; }
    const planPrices = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
    if (!planPrices) return;
    try {
      const res = await fetch("https://api.ryviveroots.com/api/payment/easebuzz/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: user.firstName, email: user.email, phone: user.phone,
          plan: `${selectedPlan}_${renewDuration}MONTH`,
          isRenewal: true, membershipId: order.membershipId,
        }),
      });
      const data = await res.json();
      if (!data.success || !data.access_key) { alert("Payment initiation failed"); return; }
      window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
    } catch (error) { console.error("Renew payment error:", error); alert("Something went wrong"); }
  };

  // ── Real API save profile ─────────────────────────────────────────────────
  const saveProfile = async () => {
    const mid = localStorage.getItem("membershipId");
    try {
      const res = await fetch("https://api.ryviveroots.com/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: mid, email: formData.email, phone: formData.phone,
          address: { house: formData.house, street: formData.street, landmark: formData.landmark, pincode: formData.pincode, city: formData.city },
        }),
      });
      const data = await res.json();
      if (data.success) { setEditMode(false); alert("Profile updated successfully!"); window.location.reload(); }
      else alert(data.message || "Update failed.");
    } catch (err) { console.error(err); alert("Something went wrong."); }
  };

  // ── Real API receipt download ─────────────────────────────────────────────
  const handleDownloadReceipt = async (receiptNumber) => {
    const mid = localStorage.getItem("membershipId");
    try {
      const response = await fetch(`https://api.ryviveroots.com/api/user/receipt?membershipId=${mid}&receiptNumber=${receiptNumber}`);
      if (!response.ok) { alert("Receipt not available."); return; }
      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `invoice-${receiptNumber}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); alert("Something went wrong."); }
  };

  // ── Real API support submit ───────────────────────────────────────────────
  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) { alert("Please describe your message."); return; }
    const mid = localStorage.getItem("membershipId");
    try {
      const res = await fetch("https://api.ryviveroots.com/api/user/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: mid, type: feedbackType, message: feedbackText, rating: feedbackRating }),
      });
      const data = await res.json();
      if (data.success) { setFeedbackSubmitted(true); setFeedbackText(""); setFeedbackRating(0); }
      else alert(data.message || "Submission failed.");
    } catch (err) { console.error(err); alert("Something went wrong."); }
  };

  const unreadCount  = notifications.filter((n) => !n.read).length;
  const currentHour  = new Date().getHours();
  const canEdit      = currentHour < 17;

  // ── Per-field change limits (Doc2) ────────────────────────────────────────
  const emailChanges         = user?.emailChanges        || 0;
  const phoneChanges         = user?.phoneChanges        || 0;
  const lastEmailChange      = user?.lastEmailChange ? new Date(user.lastEmailChange) : null;
  const lastPhoneChange      = user?.lastPhoneChange ? new Date(user.lastPhoneChange) : null;
  const daysSinceEmailChange = lastEmailChange ? Math.floor((Date.now() - lastEmailChange.getTime()) / 86400000) : 999;
  const daysSincePhoneChange = lastPhoneChange ? Math.floor((Date.now() - lastPhoneChange.getTime()) / 86400000) : 999;
  const emailLocked          = emailChanges >= 2;
  const emailCooldown        = emailChanges === 1 && daysSinceEmailChange < 6;
  const phoneLocked          = phoneChanges >= 2;
  const phoneCooldown        = phoneChanges === 1 && daysSincePhoneChange < 6;
  const canEditEmail         = !emailLocked && !emailCooldown && editMode;
  const canEditPhone         = !phoneLocked && !phoneCooldown && editMode;
  const addressChanges       = order.address?.addressChanges || 0;
  const maxAddressChanges    = durationMonths === 3 ? 3 : 1;
  const addressLocked        = addressChanges >= maxAddressChanges;

  // ── Address window (Fri 11AM – Sat 5PM IST) ──────────────────────────────
  const nowUTC              = new Date();
  const nowIST              = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
  const istDay              = nowIST.getUTCDay();
  const istTime             = nowIST.getUTCHours() * 60 + nowIST.getUTCMinutes();
  const isAddressWindowOpen = (istDay === 5 && istTime >= 11 * 60) || (istDay === 6 && istTime < 17 * 60);
  const isAddressDisabled   = addressLocked || !isAddressWindowOpen;

  const statusColors = { ACTIVE: "#2e7d32", PAUSED: "#c8860f", EXPIRED: "#c62828", UNDER_PROCESS: "#e65100" };
  const statusColor  = statusColors[finalStatus] || "#666";

  const transactions = orders.map((o) => ({
    id: o.receiptNumber || "-", date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-",
    plan: o.subscription?.plan, amount: `₹${o.subscription?.amount?.toLocaleString() || 0}`,
    method: o.paymentMethod || "Online", status: o.subscription?.status,
  }));

  const tickets = [
    { id: "TICK001", date: "Apr 18, 2024", subject: "Meal delivery timing",  status: "Resolved"    },
    { id: "TICK002", date: "Apr 10, 2024", subject: "Recipe customization",   status: "In Progress" },
  ];

  // ── Policy sections ────────────────────────────────────────────────────────
  const policyItems = [
    { icon: "👤", title: "Name Changes",      tag: "Support Only",                   rules: ["Cannot be edited directly by you", "Customer Support can update up to 2 times", "Further changes require Management approval"] },
    { icon: "📧", title: "Email Address",      tag: `${emailChanges}/2 used`,         rules: ["Allowed 2 changes total", "Second change requires 6-day gap from first", "After 2 changes, email is locked permanently"] },
    { icon: "📍", title: "Delivery Address",   tag: "Window: Fri–Sat",               rules: ["Changes allowed Fri 11AM – Sat 5PM only", "New address takes effect from following Monday", "1-Month plan: 1 change | 3-Month plan: 3 changes"] },
    { icon: "📱", title: "Mobile Number",      tag: `${phoneChanges}/2 used`,         rules: ["Allowed 2 changes total", "Second change requires 6-day gap from first", "Third change requires contacting Support"] },
  ];

  // ─── Shared style helpers ─────────────────────────────────────────────────
  const card = { background: CREAM, borderRadius: "4px", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 1px 8px rgba(42,37,32,0.03)", marginBottom: "1.5rem" };
  const btnGold    = { background: GOLD, color: DARK, border: "none", padding: ".65rem 1.4rem", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" };
  const btnDark    = { background: DARK, color: CREAM, border: "none", padding: ".65rem 1.4rem", fontSize: ".82rem", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase" };
  const btnOutline = { background: "transparent", color: INK, border: `1px solid ${INK}`, padding: ".65rem 1.4rem", fontSize: ".82rem", cursor: "pointer", letterSpacing: "0.12em", textTransform: "uppercase" };
  const btnDisabled = { background: CREAM_2, color: "rgba(42,37,32,0.35)", border: `1px solid ${CARD_BORDER}`, padding: ".65rem 1.4rem", fontSize: ".82rem", cursor: "not-allowed", letterSpacing: "0.12em", textTransform: "uppercase" };
  const overlay    = { position: "fixed", inset: 0, background: "rgba(26,22,19,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" };
  const modal      = { background: CREAM, borderRadius: "2px", padding: "2rem", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", position: "relative", border: `1px solid ${CARD_BORDER}` };
  const progressBarOuter = { background: "rgba(255,255,255,0.15)", borderRadius: "2px", height: 8, overflow: "hidden", margin: ".5rem 0" };
  const labelStyle = { fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: SAGE_DARK, fontWeight: 600 };

  // ─── Nav items ────────────────────────────────────────────────────────────
  const navItems = [
    { id: "info",          icon: User,          label: "My Information" },
    { id: "subscription",  icon: Package,        label: "My Subscription" },
    { id: "schedule",      icon: Calendar,       label: "My Daily Schedule" },
    { id: "history",       icon: Receipt,        label: "Purchase History" },
    { id: "upgrade",       icon: TrendingUp,     label: "Explore More Plans" },
    { id: "support",       icon: MessageCircle,  label: "Support & Tickets" },
    { id: "notifications", icon: Bell,           label: "Notifications" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen dash-root" style={{ background: CREAM_2 }} data-tone="light">
      <style>{`
        .dash-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight:300; letter-spacing: 0.01em; color: ${INK}; }
        .dash-root .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight:300; letter-spacing: 0.005em; }
        .dash-root h1, .dash-root h2, .dash-root h3 { margin: 0 0 0.55rem 0; }
        .sidebar-btn { transition: transform .28s ease, color .22s ease, opacity .22s ease; }
        .sidebar-btn:hover { transform: translateX(3px); }
        .dash-card { position: relative; transition: transform .28s ease, box-shadow .3s ease; }
        .dash-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(26,22,19,0.05); }
        .dash-root button { transition: transform .18s ease, opacity .18s ease; }
        .dash-root button:hover:not(:disabled) { transform: translateY(-1px); }
        .dash-root button:active { transform: translateY(0); }
        .dash-progress { background: rgba(255,255,255,0.08); border-radius: 999px; height: 8px; overflow: hidden; }
        .dash-progress-fill { height: 100%; background: ${SAGE_DARK}; transition: width .9s ease; }
        input[type="date"]:focus, textarea:focus, select:focus { border-color: ${GOLD} !important; outline: none; }
        button:not(:disabled):active { opacity: 0.8; }
      `}</style>

      <div className="flex pt-[72px] min-h-screen items-start relative">

        {/* ── MOBILE NAV TRIGGER ──────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden fixed top-[80px] left-0 z-40 flex items-center justify-center w-7 h-14 rounded-r-full"
          style={{ background: DARK, color: CREAM, border: `1px solid rgba(244,239,230,0.18)`, borderLeft: "none", boxShadow: "0 4px 12px -4px rgba(20,17,15,0.35)" }}
          aria-label="Open dashboard menu"
        >
          <DashMenuIcon size={16} strokeWidth={1.8} />
        </button>

        {/* ── MOBILE BACKDROP ─────────────────────────────────────────────── */}
        {mobileNavOpen && (
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close dashboard menu"
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "rgba(20,17,15,0.55)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
          />
        )}

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <aside
          className={`flex flex-col w-[280px] flex-shrink-0 transition-transform duration-300 ease-out overflow-hidden
            lg:sticky lg:top-[72px] lg:translate-x-0 lg:h-[calc(100vh-72px)] lg:max-h-[calc(100vh-72px)] lg:w-[260px]
            fixed top-0 left-0 z-50 h-screen
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          style={{ background: DARK }}
          aria-label="Dashboard navigation"
        >
          {/* Member info */}
          <div className="px-7 py-8 pt-24 lg:pt-8 relative flex-shrink-0" style={{ borderBottom: `1px solid rgba(244,239,230,0.08)` }}>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full"
              style={{ background: "rgba(244,239,230,0.05)", color: CREAM, border: `1px solid rgba(244,239,230,0.12)` }}
              aria-label="Close dashboard menu"
            >
              <XIcon size={16} strokeWidth={1.6} />
            </button>
            <div className="tracking-[0.42em] uppercase mb-3" style={{ fontSize: "10px", color: CREAM, fontWeight: 600 }}>— Member</div>
            <div className="font-serif mb-1" style={{ fontSize: "18px", color: CREAM, fontWeight: 300 }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: "11px", color: "rgba(244,239,230,0.5)" }}>{user.email}</div>
          </div>

          {/* Nav */}
         <nav
  className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto min-h-0"
  style={{
    scrollbarWidth: "thin",
    maxHeight: "100%"
  }}
>
            {navItems.map((item) => {
              const Icon     = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all duration-200 relative sidebar-btn"
                  style={{
                    background: isActive ? "rgba(244,239,230,0.07)" : "transparent",
                    borderLeft: `2px solid ${isActive ? GOLD : "transparent"}`,
                    color: isActive ? CREAM : "rgba(244,239,230,0.52)",
                    fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = CREAM; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "rgba(244,239,230,0.52)"; }}
                >
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.4} />
                  <span className="flex-1">{item.label}</span>
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span style={{ background: GOLD, color: DARK, fontSize: "10px", fontWeight: 700, padding: ".1rem .4rem", letterSpacing: "0.06em" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Membership info box */}
          <div className="mx-4 my-4 px-5 py-4 flex-shrink-0" style={{ background: "rgba(244,239,230,0.05)", border: `1px solid rgba(244,239,230,0.08)` }}>
            <div style={{ ...labelStyle, color: "rgba(244,239,230,0.4)", marginBottom: ".4rem" }}>Membership ID</div>
            <div style={{ fontSize: "13px", color: CREAM, fontWeight: 500, marginBottom: ".75rem", letterSpacing: "0.06em" }}>{membershipId}</div>
            <div style={{ ...labelStyle, color: "rgba(244,239,230,0.4)", marginBottom: ".4rem" }}>Current Plan</div>
            <div style={{ fontSize: "12px", color: SAGE, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase" }}>RYVIVE {basePlan} · {durationMonths}M</div>
          </div>

          {/* Sign out */}
          <div className="flex-shrink-0" style={{ borderTop: `1px solid rgba(244,239,230,0.08)` }}>
            <Link
              to="/login"
              className="flex items-center gap-3 px-7 py-5 transition-all duration-200"
              style={{ fontSize: "10px", color: "rgba(244,239,230,0.38)", letterSpacing: "0.22em", textTransform: "uppercase" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = CREAM; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,239,230,0.38)"; }}
            >
              <LogOut size={13} strokeWidth={1.4} /> Sign Out
            </Link>
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
     <main
  className="flex-1 px-5 sm:px-8 lg:px-12 py-10 lg:py-14 min-w-0 overflow-y-auto"
  style={{
    height: "calc(100vh - 72px)",
  }}
>
          <div className="max-w-[960px] mx-auto w-full">

            {/* Expiry Banner */}
            {remainingDays <= 82 && finalStatus !== "PAUSED" && finalStatus !== "UNDER_PROCESS" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="flex items-center justify-between gap-4 flex-wrap mb-8 px-6 py-4"
                style={{ background: CREAM, border: `1px solid ${CARD_BORDER}` }}
              >
                <div className="flex items-center gap-4">
                  <div className="px-3 py-2" style={{ background: CREAM_2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: SAGE_DARK, margin: "8px auto" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: INK, fontSize: ".9rem", margin: 0, letterSpacing: "0.04em" }}>
                      Subscription expiring in {remainingDays} day{remainingDays !== 1 ? "s" : ""}
                    </p>
                    <p style={{ fontSize: ".8rem", color: "rgba(42,37,32,0.6)", margin: ".2rem 0 0 0" }}>
                      Renew now to continue your wellness journey
                    </p>
                  </div>
                </div>
                <button style={btnDark} onClick={() => setShowRenewModal(true)}>Renew Now</button>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── MY INFORMATION ────────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "info" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <div style={labelStyle} className="mb-2">— Profile</div>
                    <h2 className="font-serif" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>My Information</h2>
                    <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginTop: ".25rem" }}>View and update your profile details</p>
                  </div>
                  <div style={{ display: "flex", gap: ".75rem", alignItems: "center" }}>
                    {/* Policy button — Doc2 feature */}
                    <button
                      onClick={() => setShowPolicyModal(true)}
                      style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}`, padding: ".5rem 1rem", cursor: "pointer", fontSize: ".82rem", fontWeight: 600, color: INK, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: ".4rem" }}
                    >
                      📋 Update Policy
                    </button>
                    {!editMode && canEdit && (
                      <button style={btnGold} onClick={() => setEditMode(true)}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}><Edit3 size={14} /> Edit Information</span>
                      </button>
                    )}
                  </div>
                </div>

                {!canEdit && (
                  <div className="flex items-center gap-3 px-5 py-4 mb-6" style={{ background: "#fff8e5", border: `1px solid rgba(212,175,55,0.3)`, fontSize: ".88rem", color: "#8b6914" }}>
                    <Clock size={16} color={GOLD} /> Profile editing is only allowed until 5:00 PM daily.
                  </div>
                )}

                {/* Policy summary strip — Doc2 feature */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: ".75rem", marginBottom: "1.5rem" }}>
                  {policyItems.map((p) => (
                    <div
                      key={p.title}
                      onClick={() => { setActivePolicySection(p); setShowPolicyModal(true); }}
                      style={{ background: CREAM, border: `1px solid ${CARD_BORDER}`, padding: ".85rem 1rem", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".35rem" }}>
                        <span style={{ fontSize: ".88rem", fontWeight: 600, color: INK }}>{p.icon} {p.title}</span>
                        <span style={{ background: CREAM_2, color: SAGE_DARK, fontSize: ".7rem", fontWeight: 700, padding: ".15rem .5rem" }}>{p.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: ".75rem", color: "rgba(42,37,32,0.55)" }}>{p.rules[0]}</p>
                    </div>
                  ))}
                </div>

                <div className="dash-card" style={{ ...card, padding: "2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: "1.5rem" }}>

                    {/* Full Name */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Full Name <Lock size={12} color={SAGE} />
                        <span style={{ marginLeft: "auto", fontSize: ".7rem", color: "rgba(42,37,32,0.5)", background: CREAM_2, padding: ".1rem .45rem" }}>Support Only</span>
                      </label>
                      <input type="text" value={`${user.firstName} ${user.lastName}`} disabled
                        style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: "rgba(42,37,32,0.5)", fontSize: ".9rem", cursor: "not-allowed", outline: "none", fontFamily: "inherit" }} />
                    </div>

                    {/* Membership ID */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Membership ID <Lock size={12} color={SAGE} />
                      </label>
                      <input type="text" value={membershipId} disabled
                        style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: "rgba(42,37,32,0.5)", fontSize: ".9rem", cursor: "not-allowed", outline: "none", fontFamily: "inherit" }} />
                    </div>

                    {/* Email — with change limit (Doc2) */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Email Address
                        {emailLocked && <Lock size={12} color="#e53935" />}
                        <span style={{ marginLeft: "auto", fontSize: ".7rem", fontWeight: 700, color: emailLocked ? "#c62828" : emailChanges === 1 ? "#c8860f" : SAGE_DARK, background: emailLocked ? "#ffebee" : emailChanges === 1 ? "#fff8e1" : CREAM_2, padding: ".1rem .45rem" }}>
                          {emailLocked ? "Locked" : `${emailChanges}/2 changes`}
                        </span>
                      </label>
                      <input type="email" value={formData.email} disabled={!canEditEmail}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: "100%", padding: ".7rem .9rem", border: canEditEmail ? `1.5px solid ${GOLD}` : `1px solid ${CARD_BORDER}`, background: emailLocked ? CREAM_2 : CREAM, color: emailLocked ? "rgba(42,37,32,0.5)" : INK, fontSize: ".9rem", cursor: emailLocked ? "not-allowed" : canEditEmail ? "text" : "default", outline: "none", fontFamily: "inherit" }} />
                      {emailCooldown && <p style={{ margin: ".3rem 0 0 0", fontSize: ".75rem", color: "#c8860f" }}>⏳ Next change in {6 - daysSinceEmailChange} day(s)</p>}
                      {emailLocked  && <p style={{ margin: ".3rem 0 0 0", fontSize: ".75rem", color: "#c62828" }}>🔒 Email permanently locked after 2 changes</p>}
                    </div>

                    {/* Phone — with change limit (Doc2) */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Phone Number
                        {phoneLocked && <Lock size={12} color="#e53935" />}
                        <span style={{ marginLeft: "auto", fontSize: ".7rem", fontWeight: 700, color: phoneLocked ? "#c62828" : phoneChanges === 1 ? "#c8860f" : SAGE_DARK, background: phoneLocked ? "#ffebee" : phoneChanges === 1 ? "#fff8e1" : CREAM_2, padding: ".1rem .45rem" }}>
                          {phoneLocked ? "Contact Support" : `${phoneChanges}/2 changes`}
                        </span>
                      </label>
                      <input type="text" value={formData.phone} disabled={!canEditPhone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: "100%", padding: ".7rem .9rem", border: canEditPhone ? `1.5px solid ${GOLD}` : `1px solid ${CARD_BORDER}`, background: phoneLocked ? CREAM_2 : CREAM, color: phoneLocked ? "rgba(42,37,32,0.5)" : INK, fontSize: ".9rem", cursor: phoneLocked ? "not-allowed" : canEditPhone ? "text" : "default", outline: "none", fontFamily: "inherit" }} />
                      {phoneCooldown && <p style={{ margin: ".3rem 0 0 0", fontSize: ".75rem", color: "#c8860f" }}>⏳ Next change in {6 - daysSincePhoneChange} day(s)</p>}
                      {phoneLocked  && <p style={{ margin: ".3rem 0 0 0", fontSize: ".75rem", color: "#c62828" }}>📞 Contact Support for further changes</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Date of Birth <Lock size={12} color={SAGE} />
                      </label>
                      <input type="text" value={formatDate(user.dob)} disabled
                        style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: "rgba(42,37,32,0.5)", fontSize: ".9rem", cursor: "not-allowed", outline: "none", fontFamily: "inherit" }} />
                    </div>

                    {/* Delivery Address — window-gated multi-field (Doc2) */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Delivery Address
                        {!editMode && <Lock size={12} color={SAGE} />}
                        <span style={{ marginLeft: "auto", fontSize: ".7rem", fontWeight: 600, padding: ".1rem .45rem", color: isAddressWindowOpen ? "#2e7d32" : "#c8860f", background: isAddressWindowOpen ? "rgba(46,125,50,0.1)" : "#fff8e1" }}>
                          {isAddressWindowOpen ? "✅ Window Open" : "Fri 11AM – Sat 5PM"} · {addressChanges}/{maxAddressChanges} used
                        </span>
                      </label>

                      {!editMode ? (
                        <>
                          <input type="text"
                            value={order.address ? [order.address.house, order.address.street, order.address.city].filter(Boolean).join(", ") : "-"}
                            disabled style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: "rgba(42,37,32,0.5)", fontSize: ".9rem", cursor: "not-allowed", outline: "none", fontFamily: "inherit" }} />
                          <p style={{ margin: ".3rem 0 0 0", fontSize: ".75rem", color: "rgba(42,37,32,0.5)" }}>
                            Changes allowed only Fri 11:00 AM – Sat 5:00 PM · {maxAddressChanges - addressChanges} change{maxAddressChanges - addressChanges !== 1 ? "s" : ""} remaining
                          </p>
                        </>
                      ) : (
                        <>
                          {addressLocked ? (
                            <div style={{ background: "#ffebee", padding: ".75rem 1rem", border: "1px solid #ffcdd2", marginBottom: ".85rem", fontSize: ".82rem", color: "#c62828" }}>
                              🔒 Address change limit reached ({maxAddressChanges} max for your plan).
                            </div>
                          ) : isAddressWindowOpen ? (
                            <div style={{ background: "rgba(46,125,50,0.08)", padding: ".75rem 1rem", border: "1px solid rgba(46,125,50,0.2)", marginBottom: ".85rem", fontSize: ".82rem", color: "#2e7d32", display: "flex", alignItems: "center", gap: ".4rem" }}>
                              ✅ Address change window is <strong>open now</strong>. Changes take effect from next Monday.
                            </div>
                          ) : (
                            <div style={{ background: "#fff8e5", padding: ".75rem 1rem", border: `1px solid rgba(212,175,55,0.3)`, marginBottom: ".85rem", fontSize: ".82rem", color: "#8b6914", display: "flex", alignItems: "center", gap: ".4rem" }}>
                              <Clock size={14} color={GOLD} /> Address changes only allowed Fri 11:00 AM – Sat 5:00 PM.
                            </div>
                          )}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                            {[
                              { key: "house",    label: "House / Flat",  placeholder: "House / Flat No." },
                              { key: "street",   label: "Street / Area", placeholder: "Street / Area" },
                              { key: "landmark", label: "Landmark",      placeholder: "Landmark" },
                              { key: "pincode",  label: "Pincode",       placeholder: "Pincode" },
                              { key: "city",     label: "City",          placeholder: "City" },
                            ].map(({ key, label, placeholder }) => (
                              <div key={key}>
                                <label style={{ fontSize: ".75rem", fontWeight: 600, color: "rgba(42,37,32,0.55)", display: "block", marginBottom: ".25rem" }}>{label}</label>
                                <input type="text" placeholder={placeholder} value={formData[key] || ""} disabled={isAddressDisabled}
                                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                  style={{ width: "100%", padding: ".7rem .9rem", border: isAddressDisabled ? `1px solid ${CARD_BORDER}` : `1.5px solid ${GOLD}`, background: isAddressDisabled ? CREAM_2 : CREAM, color: isAddressDisabled ? "rgba(42,37,32,0.5)" : INK, fontSize: ".88rem", cursor: isAddressDisabled ? "not-allowed" : "text", outline: "none", fontFamily: "inherit" }} />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: ".4rem", ...labelStyle, marginBottom: ".5rem" }}>
                        Payment Method <Lock size={12} color={SAGE} />
                      </label>
                      <input type="text" value={order.paymentMethod || "Online"} disabled
                        style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: "rgba(42,37,32,0.5)", fontSize: ".9rem", cursor: "not-allowed", outline: "none", fontFamily: "inherit" }} />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-3 mt-8">
                      <button style={btnDark} onClick={saveProfile}>Save Changes</button>
                      <button style={btnOutline} onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── MY SUBSCRIPTION ───────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "subscription" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">— Active Plan</div>
                <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>My Subscription</h2>
                <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>Manage your package, pauses, and delivery preferences</p>

                {/* Hero card */}
                <div className="mb-6 px-8 py-7" style={{ background: DARK }}>
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package size={20} color={GOLD} strokeWidth={1.5} />
                        <h3 className="font-serif" style={{ margin: 0, color: CREAM, fontSize: "1.2rem", fontWeight: 300 }}>
                          RYVIVE {basePlan} · {durationMonths}-Month Plan
                        </h3>
                      </div>
                      <p style={{ margin: "0 0 .4rem 0", color: "rgba(244,239,230,0.65)", fontSize: ".85rem" }}>
                        {formatDate(subscription.activationAt)} → {formatDate(subscription.endDate)}
                      </p>
                      <span style={{ color: GOLD, fontWeight: 600, fontSize: ".88rem", letterSpacing: "0.08em" }}>
                        Status: <span style={{ color: statusColor, filter: "brightness(1.5)" }}>{finalStatus}</span>
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 .2rem 0", color: "rgba(244,239,230,0.55)", fontSize: ".75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Progress</p>
                      <p className="font-serif" style={{ margin: 0, color: GOLD, fontSize: "2.2rem", fontWeight: 300, lineHeight: 1 }}>{daysCompleted}/{totalDays}</p>
                      <p style={{ margin: 0, color: "rgba(244,239,230,0.5)", fontSize: ".75rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Days</p>
                    </div>
                  </div>
                  <div className="dash-progress" style={progressBarOuter}>
                    <div className="dash-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p style={{ margin: ".3rem 0 0 0", color: "rgba(244,239,230,0.7)", fontSize: ".8rem", letterSpacing: "0.08em" }}>{pct}% Complete</p>
                </div>

                {pauseMessage && (
                  <div className="flex items-center gap-3 px-5 py-4 mb-5" style={{ background: "#fff8e5", border: `1px solid rgba(212,175,55,0.25)`, fontSize: ".88rem", color: "#8b6914" }}>
                    <Pause size={15} color={GOLD} /> {pauseMessage}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
                  {/* Pause card */}
                  <div className="dash-card" style={{ ...card, padding: "1.75rem", marginBottom: 0 }}>
                    <div className="flex items-center gap-4 mb-5">
                      <div style={{ background: CREAM_2, padding: ".65rem" }}><Pause size={22} color={GOLD} strokeWidth={1.5} /></div>
                      <div>
                        <h3 style={{ margin: 0, color: INK, fontSize: "1rem", fontWeight: 500, letterSpacing: "0.04em" }}>Pause Subscription</h3>
                        <p style={{ margin: 0, color: "rgba(42,37,32,0.55)", fontSize: ".78rem" }}>Temporarily pause your deliveries</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span style={{ color: "rgba(42,37,32,0.6)", fontSize: ".85rem" }}>Pauses Used</span>
                      <span className="font-serif" style={{ color: INK, fontSize: "1.3rem", fontWeight: 300 }}>{usedPauseCount}/{maxPauseCount}</span>
                    </div>
                    <div style={{ background: CREAM_2, height: 6, overflow: "hidden", marginBottom: ".85rem" }}>
                      <div style={{ background: SAGE_DARK, height: "100%", width: `${maxPauseCount ? Math.round(usedPauseCount / maxPauseCount * 100) : 100}%`, transition: "width 1s ease" }} />
                    </div>
                    <div className="px-4 py-3 mb-4" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}` }}>
                      <p style={{ margin: 0, color: INK, fontWeight: 500, fontSize: ".88rem" }}>{remainingPauseCount} pause{remainingPauseCount !== 1 ? "s" : ""} remaining</p>
                      <p style={{ margin: ".15rem 0 0 0", color: "rgba(42,37,32,0.55)", fontSize: ".78rem" }}>Used: {usedPauseCount} / {maxPauseCount} total</p>
                    </div>
                    {canModify && (
                      <button
                        style={isLocked || finalStatus !== "ACTIVE" ? { ...btnDisabled, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" } : { ...btnGold, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" }}
                        disabled={isLocked || finalStatus !== "ACTIVE"}
                        onClick={() => {
                          if (hasUpcomingPause()) { alert("You already have a scheduled pause."); return; }
                          if (!isLocked) setShowPauseModal(true);
                        }}
                      >
                        {isLocked && <Lock size={14} />} Request Pause
                      </button>
                    )}
                  </div>

                  {/* Delivery slot card */}
                  <div className="dash-card" style={{ ...card, padding: "1.75rem", marginBottom: 0 }}>
                    <div className="flex items-center gap-4 mb-5">
                      <div style={{ background: CREAM_2, padding: ".65rem" }}><Clock size={22} color={SAGE_DARK} strokeWidth={1.5} /></div>
                      <div>
                        <h3 style={{ margin: 0, color: INK, fontSize: "1rem", fontWeight: 500, letterSpacing: "0.04em" }}>Delivery Slot</h3>
                        <p style={{ margin: 0, color: "rgba(42,37,32,0.55)", fontSize: ".78rem" }}>Change once every 14 days</p>
                      </div>
                    </div>
                    <div className="px-4 py-4 mb-4" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}` }}>
                      <p style={{ margin: "0 0 .25rem 0", color: "rgba(42,37,32,0.55)", fontSize: ".72rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Current Slot</p>
                      <p className="font-serif" style={{ margin: "0 0 .4rem 0", color: INK, fontSize: "1.2rem", fontWeight: 300 }}>{order.deliverySlot || "7:00 AM - 9:00 AM"}</p>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} color={SAGE_DARK} />
                        <p style={{ margin: 0, color: "rgba(42,37,32,0.6)", fontSize: ".8rem" }}>
                          {order.address ? `${order.address.house}, ${order.address.street}, ${order.address.city}` : user.address || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 mb-4" style={{ background: "#fff8e5", border: `1px solid rgba(212,175,55,0.2)`, fontSize: ".8rem", color: "#8b6914" }}>
                      <Clock size={13} color={GOLD} /> Next change available after 14 days from last change
                    </div>
                    <button style={{ ...btnDisabled, width: "100%" }} disabled>Change Delivery Slot</button>
                  </div>
                </div>

                {/* Package details */}
                <div className="dash-card" style={{ ...card, padding: "1.75rem" }}>
                  <div style={labelStyle} className="mb-5">— Package Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
                    {[
                      ["Package",          `RYVIVE ${basePlan}`],
                      ["Duration",         `${durationMonths} Month${durationMonths > 1 ? "s" : ""}`],
                      ["Start Date",       formatDate(subscription.activationAt)],
                      ["End Date",         formatDate(subscription.endDate)],
                      ["Meals Completed",  `${daysCompleted} / ${totalDays}`],
                      ["Meals Remaining",  `${totalDays - daysCompleted} meals left`],
                      ["Pause Allowance",  `${maxPauseCount} total`],
                    ].map(([label, val]) => (
                      <div key={label} className="px-4 py-4" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}` }}>
                        <p style={{ margin: "0 0 .3rem 0", ...labelStyle, color: "rgba(42,37,32,0.5)" }}>{label}</p>
                        <p className="font-serif" style={{ margin: 0, color: INK, fontSize: "1rem", fontWeight: 300 }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pause history */}
                {subscription.pause?.history?.length > 0 && (
                  <div className="dash-card" style={{ ...card, padding: "1.75rem" }}>
                    <div style={labelStyle} className="mb-5">— Pause History</div>
                    {subscription.pause.history.map((p, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-3 mb-2" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}` }}>
                        <span style={{ color: INK, fontSize: ".88rem" }}>{formatDate(p.startDate)} → {formatDate(p.resumeDate)}</span>
                        <span style={{ background: "#fff8e1", color: "#c8860f", fontSize: ".75rem", fontWeight: 700, padding: ".2rem .65rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {p.days} day{p.days > 1 ? "s" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── MY DAILY SCHEDULE ─────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "schedule" && (() => {
              const activationDate = new Date(subscription.activationAt);
              const endDate        = new Date(subscription.endDate);
              activationDate.setHours(0, 0, 0, 0);
              endDate.setHours(0, 0, 0, 0);

              const currentMonth    = calendarDate.getMonth();
              const currentYear     = calendarDate.getFullYear();
              const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
              const startDay        = firstDayOfMonth.getDay();
              const thisMonthStart  = new Date(currentYear, currentMonth, 1);
              const subStartMonth   = new Date(activationDate.getFullYear(), activationDate.getMonth(), 1);
              const subEndMonth     = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
              const canGoPrev = thisMonthStart > subStartMonth;
              const canGoNext = thisMonthStart < subEndMonth;

              const handlePrevMonth = () => { if (!canGoPrev) return; const prev = new Date(calendarDate); prev.setMonth(prev.getMonth() - 1); setCalendarDate(prev); };
              const handleNextMonth = () => { if (!canGoNext) return; const next = new Date(calendarDate); next.setMonth(next.getMonth() + 1); setCalendarDate(next); };
              const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

              return (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div style={labelStyle} className="mb-2">— Calendar</div>
                  <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>My Daily Schedule</h2>
                  <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>Meal calendar overview</p>

                  <div style={{ background: CREAM, border: `1px solid ${CARD_BORDER}`, overflow: "hidden" }}>
                    {/* Calendar header */}
                    <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                      <button onClick={handlePrevMonth} disabled={!canGoPrev} style={{ width: 34, height: 34, border: `1px solid ${CARD_BORDER}`, background: CREAM_2, cursor: canGoPrev ? "pointer" : "default", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", color: INK, opacity: canGoPrev ? 1 : 0.28 }}>‹</button>
                      <span className="font-serif" style={{ fontSize: "1rem", fontWeight: 300, color: INK, letterSpacing: "0.06em" }}>
                        {calendarDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                      </span>
                      <button onClick={handleNextMonth} disabled={!canGoNext} style={{ width: 34, height: 34, border: `1px solid ${CARD_BORDER}`, background: CREAM_2, cursor: canGoNext ? "pointer" : "default", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", color: INK, opacity: canGoNext ? 1 : 0.28 }}>›</button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: `1px solid ${CARD_BORDER}` }}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div key={d} style={{ textAlign: "center", fontWeight: 500, color: SAGE_DARK, padding: "10px 0", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>{d}</div>
                      ))}
                    </div>

                    {/* Calendar grid — with correct activation-month start (Doc2 fix) */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                      {Array.from({ length: 42 }).map((_, index) => {
                        let gridStartDate;
                        if (currentMonth === activationDate.getMonth() && currentYear === activationDate.getFullYear()) {
                          gridStartDate = new Date(activationDate);
                          gridStartDate.setDate(activationDate.getDate() - activationDate.getDay());
                        } else {
                          gridStartDate = new Date(currentYear, currentMonth, 1 - startDay);
                        }

                        const currentDate = new Date(gridStartDate);
                        currentDate.setDate(gridStartDate.getDate() + index);
                        currentDate.setHours(0, 0, 0, 0);

                        const today    = new Date(); today.setHours(0, 0, 0, 0);
                        const isToday  = currentDate.getTime() === today.getTime();
                        const isPast   = currentDate < today;
                        const isFuture = currentDate > today;
                        const isSunday = currentDate.getDay() === 0;
                        const isCurrentMonth = currentDate.getMonth() === currentMonth;
                        const beforeStart    = currentDate < activationDate;
                        const afterEnd       = currentDate > endDate;

                        if (afterEnd && !isCurrentMonth) {
                          return <div key={index} style={{ minHeight: 100, borderRight: `1px solid ${CARD_BORDER}`, borderBottom: `1px solid ${CARD_BORDER}`, background: CREAM_2 }} />;
                        }

                        const diffDays   = Math.floor((currentDate.getTime() - activationDate.getTime()) / 86400000);
                        const wkNum      = Math.floor(diffDays / 7) + 1;
                        const menu       = WEEKLY_MENU[basePlan]?.[(((wkNum - 1) % 4) + 1)] || {};
                        const dayName    = DAY_NAMES[currentDate.getDay()];
                        const meal       = !beforeStart && !afterEnd && !isSunday ? menu[dayName] : null;

                        return (
                          <div key={index} style={{
                            minHeight: 108, padding: "10px 8px 8px",
                            borderRight: `1px solid ${CARD_BORDER}`, borderBottom: `1px solid ${CARD_BORDER}`,
                            display: "flex", flexDirection: "column", gap: 6,
                            background: isToday ? "rgba(139,149,121,0.08)" : afterEnd ? CREAM_2 : "transparent",
                            opacity: beforeStart ? 0.18 : !isCurrentMonth ? 0.38 : afterEnd ? 0.45 : 1,
                            pointerEvents: beforeStart ? "none" : "auto",
                          }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: isToday ? DARK : "transparent", color: isToday ? CREAM : isCurrentMonth ? INK : "rgba(42,37,32,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: isToday ? 500 : 400, flexShrink: 0 }}>
                              {currentDate.getDate()}
                            </div>
                            {!beforeStart && !afterEnd && isSunday ? (
                              <div style={{ fontSize: "0.62rem", color: "rgba(42,37,32,0.38)", fontStyle: "italic", textAlign: "center", marginTop: 3 }}>Rest day</div>
                            ) : (
                              <>
                                {meal && (
                                  <div style={{ fontSize: "0.63rem", color: isToday ? INK : isCurrentMonth ? "rgba(42,37,32,0.65)" : "rgba(42,37,32,0.32)", lineHeight: 1.45, flex: 1 }}>
                                    {meal}
                                  </div>
                                )}
                                {!beforeStart && !afterEnd && (
                                  <div>
                                    {isPast   && <span style={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(139,149,121,0.15)", color: SAGE_DARK, padding: "2px 7px", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.06em" }}>Done</span>}
                                    {isToday  && <span style={{ display: "inline-flex", alignItems: "center", background: `rgba(212,175,55,0.18)`, color: "#854F0B", padding: "2px 7px", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.06em" }}>Today</span>}
                                    {isFuture && <span style={{ display: "inline-flex", alignItems: "center", background: CREAM_2, color: "rgba(42,37,32,0.45)", padding: "2px 7px", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.06em", border: `1px solid ${CARD_BORDER}` }}>Upcoming</span>}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-5 flex-wrap px-6 py-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                      {[{ color: DARK, label: "Today" }, { color: SAGE_DARK, label: "Done" }, { color: "#854F0B", label: "Current" }, { color: CARD_BORDER, label: "Upcoming" }].map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-2" style={{ fontSize: "11px", color: "rgba(42,37,32,0.55)", letterSpacing: "0.1em" }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} /> {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── PURCHASE HISTORY ──────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "history" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">— Transactions</div>
                <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>Purchase History</h2>
                <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>All your transactions and receipts</p>
                <div className="dash-card" style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {transactions.length === 0 && <p style={{ padding: "2rem", color: "rgba(42,37,32,0.5)", textAlign: "center" }}>No transactions found.</p>}
                  {transactions.map((txn, i) => (
                    <div key={txn.id} className="flex justify-between items-center flex-wrap gap-4 px-7 py-5" style={{ borderBottom: i < transactions.length - 1 ? `1px solid ${CARD_BORDER}` : "none" }}>
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-serif" style={{ fontWeight: 300, color: INK, fontSize: "1rem" }}>{txn.plan}</span>
                          <span style={{
                            background: txn.status === "ACTIVE" || txn.status === "Successful" ? "rgba(46,125,50,0.1)" : "rgba(198,40,40,0.1)",
                            color: txn.status === "ACTIVE" || txn.status === "Successful" ? "#2e7d32" : "#c62828",
                            padding: ".15rem .65rem", fontSize: ".72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                          }}>
                            {txn.status}
                          </span>
                        </div>
                        <div className="flex gap-5 flex-wrap" style={{ fontSize: ".8rem", color: "rgba(42,37,32,0.55)", letterSpacing: "0.04em" }}>
                          <span>Invoice: {txn.id}</span><span>{txn.date}</span><span>{txn.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif" style={{ fontSize: "1.2rem", fontWeight: 300, color: INK }}>{txn.amount}</span>
                        {/* Real API receipt download (Doc2) */}
                        <button
                          style={{ ...btnGold, padding: ".5rem .9rem", fontSize: ".78rem", display: "inline-flex", alignItems: "center", gap: ".4rem" }}
                          onClick={() => handleDownloadReceipt(txn.id)}
                        >
                          <Receipt size={13} /> Download Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── EXPLORE MORE PLANS ────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "upgrade" && (() => {
              const PLAN_RANK   = { SILVER: 1, GOLD: 2, PLATINUM: 3 };
              const currentRank = PLAN_RANK[basePlan];
              const allPlans = [
                { name: "PLATINUM", label: "Ryvive Platinum", prices: { "1": 6999, "3": 23997 }, features: ["Pasta zoodle collections", "3 pauses / month", "House-crafted dips", "Chef-led seasonal edits", "Signature tasting balance"] },
                { name: "GOLD",     label: "Ryvive Gold",     prices: { "1": 5999, "3": 20997 }, features: ["Curated salad collection", "2 pauses / month", "Sandwiches", "Wraps", "Soups"] },
                { name: "SILVER",   label: "Ryvive Silver",   prices: { "1": 4999, "3": 17999 }, features: ["Signature detox collection", "1 pause / month", "Fruit & vegetable elixirs", "Wellness blends", "Light daily nourishment"] },
              ];
              return (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div style={labelStyle} className="mb-2">— Plans</div>
                  <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>Explore More Plans</h2>
                  <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>Upgrade, downgrade or renew — choose what works best for you</p>
                  <div className="px-5 py-4 mb-7" style={{ background: CREAM, border: `1px solid ${CARD_BORDER}` }}>
                    <p style={{ margin: "0 0 .2rem 0", ...labelStyle }}>Current Plan</p>
                    <p className="font-serif" style={{ margin: 0, color: INK, fontSize: "1.2rem", fontWeight: 300 }}>RYVIVE {basePlan} · {durationMonths}-Month</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
                    {allPlans.sort((a) => (a.name === basePlan ? -1 : 1)).map((plan) => {
                      const rank        = PLAN_RANK[plan.name];
                      const isCurrent   = plan.name === basePlan;
                      const isUpgrade   = rank > currentRank;
                      const badge       = isCurrent ? "Current Plan" : isUpgrade ? "↑ Upgrade" : "↓ Downgrade";
                      return (
                        <div key={plan.name} style={{ position: "relative" }}>
                          {/* Real payment API via UpgradePlanCard (Doc2) */}
                          <UpgradePlanCard
                            plan={{ ...plan, highlight: isUpgrade, badge }}
                            membershipId={membershipId}
                            user={user}
                            formData={formData}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })()}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── SUPPORT & TICKETS ─────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "support" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">— Help</div>
                <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>Support & Tickets</h2>
                <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>Get help or share feedback</p>

                {/* Contact info */}
                <div className="px-6 py-5 mb-6" style={{ background: CREAM, border: `1px solid ${CARD_BORDER}` }}>
                  <p style={{ margin: "0 0 .5rem 0", ...labelStyle }}>— Need immediate help?</p>
                  <p style={{ margin: "0 0 .3rem 0", color: INK, fontSize: ".9rem" }}>customersupport@ryviveroots.com</p>
                  <p style={{ margin: 0, color: INK, fontSize: ".9rem" }}>+91 97656 00701</p>
                </div>

                {/* Ticket/Feedback form with toggle (Doc2) */}
                <div style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
                  {/* Mode toggle */}
                  <div style={{ display: "flex", background: CREAM_2, padding: "4px", marginBottom: "1.4rem", width: "fit-content" }}>
                    {[{ id: "ticket", label: "Raise a Ticket" }, { id: "feedback", label: "Share Feedback" }].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => { setSupportMode(tab.id); setFeedbackText(""); setFeedbackRating(0); setFeedbackSubmitted(false); setFeedbackType("Query"); }}
                        style={{ padding: ".45rem 1.1rem", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: ".88rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: supportMode === tab.id ? 600 : 400, background: supportMode === tab.id ? CREAM : "transparent", color: supportMode === tab.id ? INK : "rgba(42,37,32,0.5)", boxShadow: supportMode === tab.id ? "0 1px 4px rgba(0,0,0,.08)" : "none", transition: "all .15s" }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {feedbackSubmitted ? (
                    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>{supportMode === "feedback" ? "🌿" : "✅"}</div>
                      <p style={{ fontWeight: 600, color: INK, fontSize: "1.1rem", margin: "0 0 .35rem 0" }}>
                        {supportMode === "feedback" ? "Feedback Received" : "Ticket Submitted"}
                      </p>
                      <p style={{ color: "rgba(42,37,32,0.6)", fontSize: ".88rem", margin: "0 0 1.25rem 0" }}>
                        {supportMode === "feedback" ? "Thank you — your feedback helps us improve." : "We'll get back to you within 24 hours."}
                      </p>
                      <button style={btnDark} onClick={() => setFeedbackSubmitted(false)}>Submit Another</button>
                    </div>
                  ) : supportMode === "ticket" ? (
                    <>
                      <div style={labelStyle} className="mb-5">— Raise a Complaint or Share Feedback</div>
                      {/* Type selector cards (Doc2) */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: ".65rem", marginBottom: "1.25rem" }}>
                        {[
                          { id: "Query",     icon: "❓", label: "Query",     desc: "Ask a question or request information" },
                          { id: "Complaint", icon: "⚠️", label: "Complaint", desc: "Report an issue with your order or delivery" },
                        ].map((t) => (
                          <div
                            key={t.id}
                            onClick={() => setFeedbackType(t.id)}
                            style={{ border: `${feedbackType === t.id ? "2" : "1"}px solid ${feedbackType === t.id ? GOLD : CARD_BORDER}`, padding: ".85rem .75rem", cursor: "pointer", background: feedbackType === t.id ? GOLD_LIGHT : CREAM, transition: "all .15s" }}
                          >
                            <div style={{ fontSize: "1.3rem", marginBottom: ".3rem" }}>{t.icon}</div>
                            <p style={{ margin: "0 0 .15rem 0", fontWeight: 600, fontSize: ".88rem", color: feedbackType === t.id ? INK : "rgba(42,37,32,0.6)" }}>{t.label}</p>
                            <p style={{ margin: 0, fontSize: ".72rem", color: "rgba(42,37,32,0.5)", lineHeight: 1.3 }}>{t.desc}</p>
                          </div>
                        ))}
                      </div>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder={feedbackType === "Complaint" ? "What went wrong? Include date and order details if possible..." : "What would you like to know?"}
                        style={{ width: "100%", minHeight: 110, padding: ".85rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM, fontSize: ".9rem", fontFamily: "inherit", resize: "vertical", marginBottom: "1rem", color: INK, outline: "none" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: 0, fontSize: ".78rem", color: "rgba(42,37,32,0.4)" }}>{feedbackText.length} characters</p>
                        <button style={btnDark} onClick={handleFeedbackSubmit}>Submit Ticket →</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={labelStyle} className="mb-5">— Share Your Experience</div>
                      {/* Star rating (Doc2) */}
                      <div style={{ marginBottom: "1.1rem" }}>
                        <label style={{ ...labelStyle, display: "block", marginBottom: ".5rem" }}>Rate your experience</label>
                        <div style={{ display: "flex", gap: ".4rem" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} onClick={() => setFeedbackRating(star)} style={{ fontSize: "2rem", cursor: "pointer", color: star <= feedbackRating ? GOLD : "rgba(42,37,32,0.2)", transition: "color .15s" }}>★</span>
                          ))}
                        </div>
                      </div>
                      <label style={{ ...labelStyle, display: "block", marginBottom: ".4rem" }}>Your feedback</label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Share what you loved, what surprised you, or what we could do better..."
                        style={{ width: "100%", minHeight: 110, padding: ".85rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM, fontSize: ".9rem", fontFamily: "inherit", resize: "vertical", marginBottom: "1rem", color: INK, outline: "none" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: 0, fontSize: ".78rem", color: "rgba(42,37,32,0.4)" }}>{feedbackText.length} characters</p>
                        <button style={btnGold} onClick={handleFeedbackSubmit}>Submit Feedback →</button>
                      </div>
                    </>
                  )}
                </div>

                {/* Tickets list */}
                <div style={labelStyle} className="mb-4">— Your Tickets</div>
                <div className="dash-card" style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {tickets.map((ticket, i) => (
                    <div key={ticket.id} className="flex justify-between items-center px-7 py-5" style={{ borderBottom: i < tickets.length - 1 ? `1px solid ${CARD_BORDER}` : "none" }}>
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span style={{ fontWeight: 500, color: INK, fontSize: ".92rem" }}>{ticket.subject}</span>
                          <span style={{
                            background: ticket.status === "Resolved" ? "rgba(46,125,50,0.1)" : ticket.status === "In Progress" ? "rgba(212,175,55,0.15)" : CREAM_2,
                            color: ticket.status === "Resolved" ? "#2e7d32" : ticket.status === "In Progress" ? "#c8860f" : "rgba(42,37,32,0.5)",
                            padding: ".15rem .65rem", fontSize: ".72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: ".3rem",
                          }}>
                            {ticket.status === "Resolved" ? <CheckCircle size={11} /> : <Clock size={11} />} {ticket.status}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: "rgba(42,37,32,0.5)", fontSize: ".8rem" }}>ID: {ticket.id} · Raised {ticket.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {activeTab === "notifications" && (() => {
              const endDateObj     = new Date(subscription.endDate);
              const today2         = new Date(); today2.setHours(0, 0, 0, 0);
              const daysLeft       = Math.max(Math.ceil((endDateObj.getTime() - today2.getTime()) / (1000 * 60 * 60 * 24)), 0);
              const isExpiringSoon = daysLeft <= 10;
              const isExpiredLocal = daysLeft === 0;

              const renewalMessage = isExpiredLocal
                ? `Your RYVIVE ${basePlan} subscription has expired. Renew now to continue.`
                : isExpiringSoon
                ? `Your subscription expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} on ${endDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. Renew soon!`
                : `Your RYVIVE ${basePlan} plan renews on ${endDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.`;

              const renewalIconBg = isExpiredLocal ? "rgba(198,40,40,0.1)" : isExpiringSoon ? "rgba(212,175,55,0.15)" : "rgba(139,149,121,0.12)";
              const renewBtnStyle = isExpiredLocal
                ? { ...btnOutline, color: "#c62828", borderColor: "#c62828", padding: ".3rem .85rem", fontSize: ".78rem" }
                : isExpiringSoon
                ? { ...btnGold, padding: ".3rem .85rem", fontSize: ".78rem" }
                : { ...btnDark, padding: ".3rem .85rem", fontSize: ".78rem" };

              return (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div style={labelStyle} className="mb-2">— Updates</div>
                  <h2 className="font-serif mb-1" style={{ fontSize: "clamp(24px,3vw,34px)", color: INK, fontWeight: 300 }}>Notifications</h2>
                  <p style={{ fontSize: "13px", color: "rgba(42,37,32,0.6)", marginBottom: "2rem" }}>Stay updated with your wellness journey</p>

                  {/* Renewal notification */}
                  <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
                    <div className="flex gap-4 items-start px-6 py-5" style={{ background: CREAM }}>
                      <div style={{ width: 36, height: 36, background: renewalIconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Bell size={16} color={isExpiredLocal ? "#c62828" : isExpiringSoon ? "#c8860f" : SAGE_DARK} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 .3rem 0", fontSize: ".9rem", fontWeight: 500, color: INK, lineHeight: 1.45 }}>{renewalMessage}</p>
                        <div className="flex items-center gap-4 flex-wrap mt-2">
                          <p style={{ margin: 0, fontSize: ".78rem", color: "rgba(42,37,32,0.5)" }}>Just now</p>
                          <button style={renewBtnStyle} onClick={() => setShowRenewModal(true)}>Renew Now</button>
                        </div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, marginTop: ".3rem", flexShrink: 0 }} />
                    </div>
                  </div>

                  {/* Admin notifications from real API (Doc2) */}
                  {notifications.length === 0 ? (
                    <div style={{ ...card, padding: "2rem", textAlign: "center" }}>
                      <p style={{ margin: 0, color: "rgba(42,37,32,0.5)" }}>No admin notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} style={{ ...card, padding: 0, overflow: "hidden", marginBottom: "1rem" }}>
                        <div className="flex gap-4 items-start px-6 py-5">
                          <div style={{ width: 36, height: 36, background: CREAM_2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Bell size={15} color={SAGE_DARK} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 .3rem 0", fontSize: ".9rem", fontWeight: 600, color: INK }}>{n.title}</p>
                            <p style={{ margin: "0 0 .4rem 0", fontSize: ".85rem", color: "rgba(42,37,32,0.65)", lineHeight: 1.55 }}>{n.message}</p>
                            <p style={{ margin: 0, fontSize: ".75rem", color: "rgba(42,37,32,0.4)" }}>{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                          </div>
                          {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, marginTop: ".3rem", flexShrink: 0 }} />}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              );
            })()}

          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── PAUSE MODAL ─────────────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showPauseModal && (
        <div style={overlay} onClick={() => setShowPauseModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={modal} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "rgba(42,37,32,0.45)" }} onClick={() => setShowPauseModal(false)}>Close</button>
            <div style={labelStyle} className="mb-2">— Pause Request</div>
            <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>Pause Subscription</h3>
            <p style={{ color: "rgba(42,37,32,0.6)", fontSize: ".85rem", marginBottom: "1.5rem" }}>Choose when to pause and resume (max 15 days)</p>

            <label style={{ ...labelStyle, display: "block", marginBottom: ".4rem" }}>Pause From</label>
            <input type="date" min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} value={pauseFromDate} onChange={(e) => setPauseFromDate(e.target.value)}
              style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: INK, fontSize: ".9rem", fontFamily: "inherit", marginBottom: "1rem", outline: "none" }} />

            <label style={{ ...labelStyle, display: "block", marginBottom: ".4rem" }}>Pause To</label>
            <input type="date" min={pauseFromDate || new Date().toISOString().split("T")[0]} max={getMaxToDate()} value={pauseToDate} onChange={(e) => setPauseToDate(e.target.value)}
              style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, color: INK, fontSize: ".9rem", fontFamily: "inherit", marginBottom: "1rem", outline: "none" }} />

            {pauseDays > 0 && (
              <div className="px-4 py-3 mb-3" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}`, fontWeight: 500, color: INK, fontSize: ".88rem" }}>
                Duration: {pauseDays} day{pauseDays > 1 ? "s" : ""}
              </div>
            )}
            {pauseFromDate && pauseToDate && pauseDays > 0 && (
              <div className="px-4 py-4 mb-4" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}`, fontSize: ".85rem", color: INK, lineHeight: 1.7 }}>
                <strong>Pause from:</strong> {formatDate(pauseFromDate)}<br />
                <strong>Pause to:</strong> {formatDate(pauseToDate)}<br />
                <span style={{ color: SAGE_DARK, fontWeight: 600 }}>Service resumes on {getResumeNextDay()}</span>
              </div>
            )}
            {/* Real API call on confirm (Doc2) */}
            <button style={{ ...btnDark, width: "100%" }} onClick={confirmPause}>Confirm Pause</button>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── RENEW MODAL — plan-filtered (Doc2) ──────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showRenewModal && (
        <div style={overlay} onClick={() => setShowRenewModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }}
            style={{ ...modal, maxWidth: basePlan === "PLATINUM" ? 480 : basePlan === "GOLD" ? 680 : 920 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "rgba(42,37,32,0.45)" }} onClick={() => setShowRenewModal(false)}>Close</button>
            <div style={labelStyle} className="mb-2">— Renew</div>
            <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>Renew Your Subscription</h3>
            <p style={{ color: "rgba(42,37,32,0.6)", fontSize: ".85rem", marginBottom: "1.5rem" }}>
              Current Plan: <strong style={{ color: INK }}>RYVIVE {basePlan} · {durationMonths}M</strong>
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${PLAN_ORDER.filter((p) => {
                if (basePlan === "PLATINUM") return p === "PLATINUM";
                if (basePlan === "GOLD")     return p === "GOLD" || p === "PLATINUM";
                return true;
              }).length}, minmax(200px,1fr))`,
              gap: "1rem",
            }}>
              {PLAN_ORDER.filter((plan) => {
                if (basePlan === "PLATINUM") return plan === "PLATINUM";
                if (basePlan === "GOLD")     return plan === "GOLD" || plan === "PLATINUM";
                return true;
              }).map((plan) => {
                const prices = RENEWAL_PRICING[plan];
                const isSel  = selectedPlan === plan;
                const isFeat = plan === "PLATINUM";
                return (
                  <div key={plan} onClick={() => setSelectedPlan(plan)} style={{ border: `${isSel ? "2" : "1"}px solid ${isSel ? GOLD : isFeat ? GOLD : CARD_BORDER}`, padding: "1.25rem", cursor: "pointer", background: isSel ? GOLD_LIGHT : CREAM, position: "relative", marginTop: isFeat ? "1rem" : 0 }}>
                    {isFeat && plan !== basePlan && (
                      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: GOLD, color: DARK, fontSize: ".68rem", fontWeight: 700, padding: ".2rem .75rem", whiteSpace: "nowrap", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Most Popular
                      </div>
                    )}
                    <h4 className="font-serif" style={{ color: INK, marginBottom: ".75rem", fontSize: "1rem", fontWeight: 300 }}>
                      Ryvive {plan} {plan === basePlan && <span style={{ fontSize: ".72rem", color: SAGE_DARK }}>(Current)</span>}
                    </h4>
                    {["1", "3"].map((dur) => (
                      <div key={dur} onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setRenewDuration(dur); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${isSel && renewDuration === dur ? GOLD : CARD_BORDER}`, padding: ".6rem .8rem", marginTop: ".5rem", cursor: "pointer", background: isSel && renewDuration === dur ? GOLD_LIGHT : CREAM }}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${isSel && renewDuration === dur ? SAGE_DARK : CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isSel && renewDuration === dur && <div style={{ width: 6, height: 6, borderRadius: "50%", background: SAGE_DARK }} />}
                          </div>
                          <span style={{ fontSize: ".83rem", fontWeight: dur === "3" ? 600 : 400, color: INK }}>{dur === "1" ? "1 Month" : "3 Months"}</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: ".85rem", color: INK }}>₹{prices[dur].final.toLocaleString()}</span>
                      </div>
                    ))}
                    <button style={{ ...btnDark, width: "100%", marginTop: ".85rem", fontSize: ".82rem", padding: ".6rem" }}
                      onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); setShowSummary(true); }}>
                      Continue
                    </button>
                    <ul style={{ listStyle: "none", marginTop: ".85rem", padding: 0 }}>
                      {PLAN_FEATURES[plan].slice(0, 3).map((f) => (
                        <li key={f} style={{ fontSize: ".78rem", color: "rgba(42,37,32,0.6)", marginBottom: ".3rem", letterSpacing: "0.02em" }}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── RENEWAL SUMMARY MODAL — real payment (Doc2) ───────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showSummary && selectedPlan && (() => {
        const p = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
        if (!p) return null;
        return (
          <div style={{ ...overlay, zIndex: 1000 }} onClick={() => setShowSummary(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={modal} onClick={(e) => e.stopPropagation()}>
              <button style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "rgba(42,37,32,0.45)" }} onClick={() => setShowSummary(false)}>Close</button>
              <div style={labelStyle} className="mb-2">— Summary</div>
              <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>Renewal Summary — {selectedPlan}</h3>
              <p style={{ color: "rgba(42,37,32,0.6)", fontSize: ".85rem", marginBottom: "1rem" }}>Review before payment</p>
              <select value={renewDuration} onChange={(e) => setRenewDuration(e.target.value)}
                style={{ width: "100%", padding: ".7rem .9rem", border: `1px solid ${CARD_BORDER}`, background: CREAM_2, fontSize: ".9rem", fontFamily: "inherit", marginBottom: "1rem", color: INK, outline: "none", appearance: "auto" }}>
                <option value="1">1 Month</option>
                <option value="3">3 Months (Best Value)</option>
              </select>
              <div className="px-5 py-4 mb-4" style={{ background: CREAM_2, border: `1px solid ${CARD_BORDER}` }}>
                {[["Plan", `RYVIVE ${selectedPlan}`], ["Duration", `${renewDuration} Month${renewDuration === "3" ? "s" : ""}`]].map(([l, v]) => (
                  <div key={l} className="flex justify-between mb-2" style={{ fontSize: ".9rem" }}>
                    <span style={{ color: "rgba(42,37,32,0.6)" }}>{l}</span>
                    <span style={{ fontWeight: 500, color: INK }}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 mt-2" style={{ borderTop: `1px solid ${CARD_BORDER}`, fontSize: "1.05rem" }}>
                  <span style={{ fontWeight: 500, color: INK }}>Total</span>
                  <span className="font-serif" style={{ fontWeight: 300, color: INK, fontSize: "1.25rem" }}>₹{p.final.toLocaleString()}</span>
                </div>
              </div>
              <div className="px-5 py-4 mb-5" style={{ background: "rgba(139,149,121,0.1)", border: `1px solid rgba(139,149,121,0.15)`, fontSize: ".85rem", color: SAGE_DARK, lineHeight: 1.65 }}>
                <strong>Why renew now?</strong><br />
                Maintain consistency, preserve savings, and continue your wellness ritual.
              </div>
              {/* Real payment API call (Doc2) */}
              <button style={{ ...btnDark, width: "100%" }} onClick={handleRenewPayment}>
                Renew Now · ₹{p.final.toLocaleString()}
              </button>
            </motion.div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── POLICY MODAL (Doc2) ──────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showPolicyModal && (
        <div style={overlay} onClick={() => { setShowPolicyModal(false); setActivePolicySection(null); }}>
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={{ ...modal, maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", fontSize: "1rem", cursor: "pointer", color: "rgba(42,37,32,0.45)" }} onClick={() => { setShowPolicyModal(false); setActivePolicySection(null); }}>Close</button>
            <div style={labelStyle} className="mb-2">— Policy</div>
            <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>Customer Information Update Policy</h3>
            <p style={{ color: "rgba(42,37,32,0.6)", fontSize: ".83rem", marginBottom: "1.5rem" }}>We value transparency and security. Please review these rules before making changes.</p>

            {[
              { icon: "👤", title: "Name Changes",     rules: ["Cannot be edited directly by customers.", "Customer Support can update your name up to 2 times.", "Further changes require Management approval."] },
              { icon: "📧", title: "Email Address",     rules: ["You may update your email up to 2 times total.", "Second change requires a minimum 6-day gap from the first.", "After 2 changes, your email is permanently locked."] },
              { icon: "📍", title: "Delivery Address",  rules: ["Changes allowed only: Friday 11:00 AM – Saturday 5:00 PM.", "New address takes effect from the following Monday.", "1-Month Plan: 1 change only. 3-Month Plan: 3 changes (one per month)."] },
              { icon: "📱", title: "Mobile Number",     rules: ["You may update your mobile number up to 2 times.", "Second change requires a minimum 6-day gap from the first.", "A third change requires contacting Customer Support."] },
            ].map((section, idx) => {
              const isActive = activePolicySection?.title === section.title;
              return (
                <div key={section.title} style={{ marginBottom: ".85rem", border: isActive ? `1.5px solid ${GOLD}` : `1px solid ${CARD_BORDER}`, overflow: "hidden" }}>
                  <div style={{ padding: ".85rem 1rem", background: isActive ? GOLD_LIGHT : CREAM_2, display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{section.icon}</span>
                    <span style={{ fontWeight: 600, color: INK, fontSize: ".95rem", letterSpacing: "0.04em" }}>{idx + 1}. {section.title}</span>
                  </div>
                  <ul style={{ margin: 0, padding: "0 1rem 0 2rem" }}>
                    {section.rules.map((r, i) => (
                      <li key={i} style={{ padding: ".4rem 0", fontSize: ".85rem", color: "rgba(42,37,32,0.65)", borderBottom: i < section.rules.length - 1 ? `1px solid ${CARD_BORDER}` : "none" }}>{r}</li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div style={{ background: CREAM_2, padding: ".85rem 1rem", marginTop: ".5rem", fontSize: ".8rem", color: "rgba(42,37,32,0.6)", lineHeight: 1.6, border: `1px solid ${CARD_BORDER}` }}>
              All updates are subject to verification. The company reserves the right to reject requests that do not comply with these rules.
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
