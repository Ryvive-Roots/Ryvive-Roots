import React, { useState, useEffect } from 'react';
import { User, Calendar, TrendingUp, Receipt, MessageCircle, Bell, LogOut, Edit3, Lock, Clock, CheckCircle, AlertCircle, Package, Pause, MapPin, RefreshCw } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const PLAN_PAUSES = {
  SILVER: { 1: 0, 3: 3 },
  GOLD:   { 1: 2, 3: 6 },
  PLATINUM: { 1: 3, 3: 9 },
};

const RENEWAL_PRICING = {
  SILVER:   { "1": { original: 4999,  final: 4999  }, "3": { original: 17999, final: 14997 } },
  GOLD:     { "1": { original: 5999,  final: 5999  }, "3": { original: 20997, final: 17997 } },
  PLATINUM: { "1": { original: 6999,  final: 6999  }, "3": { original: 23997, final: 20997 } },
};

const PLAN_FEATURES = {
  SILVER:   ["Clean meals", "Easy digestion", "Weekly variety", "Functional juices", "No calorie stress"],
  GOLD:     ["6 high-protein meals/week", "Gut & skin-friendly meals", "Advanced energy juices", "Boost energy levels", "Naturally detoxifying"],
  PLATINUM: ["Chef's signature menu", "Glow & recovery juices", "Guilt-free wraps & zoodle options", "Elite combinations", "Surprise upgrades"],
};

const PLAN_ORDER = ["PLATINUM", "GOLD", "SILVER"];
const WEEKLY_MENU = {
  PLATINUM: {
    1: {
      Mon: "High Protein Paneer Salad",
      Tue: "Dragon Delight + Beetroot Cheese Wrap",
      Wed: "The Pesto Zoodle Hour + Pomegranate Delight",
      Thu: "Mexican Avocado Salad",
      Fri: "Orange Pine Twist + Sweet Potato & PEA",
      Sat: "Green Garden Bowl",
    },

    2: {
      Mon: "Broccoli Cashew Cream",
      Tue: "O-Juice + Paneer Crunch Wrap",
      Wed: "The Zoodle Flame + Libido Booster",
      Thu: "Chickpea Paneer Fusion",
      Fri: "Dragon Pine + Corn N’ Cheese",
      Sat: "Thai Mushroom Salad",
    },

    3: {
      Mon: "Chilli Lime Soya Salad",
      Tue: "Dragon Delight + Beetroot Cheese Wrap",
      Wed: "The Pesto Zoodle Hour + Pomegranate Delight",
      Thu: "Signature Twin Plus",
      Fri: "Orange Pine Twist + Sweet Potato & PEA",
      Sat: "Sweet Potato Bliss",
    },

    4: {
      Mon: "Creamy Double Chickpea",
      Tue: "Avocado Smoothie + Paneer Crunch Wrap",
      Wed: "The Zoodle Flame + Libido Booster",
      Thu: "Rajma Paneer Power Lean",
      Fri: "Bright Eyes + Corn N’ Cheese",
      Sat: "Chilli Crunch Salad",
    },
  },

  GOLD: {
    1: {
      Mon: "Classic Veggie Bowl",
      Tue: "Immuni Boost Plus + High-Protein Soya Cheese Wrap",
      Wed: "Dragon Pine",
      Thu: "Roasted Zucchini Bowl",
      Fri: "Stamina Boost + Corn N’ Cheese Chaat",
      Sat: "Avocado Paneer Royal Grill",
    },

    2: {
      Mon: "Creamy Double Chickpea",
      Tue: "Calm Cucumber + Paneer Crunch Cheese Wrap",
      Wed: "Libido Booster",
      Thu: "Rajma Paneer Power Lean",
      Fri: "For Skin Sake + Sweet N’ Fresh Corn",
      Sat: "The Pesto Zoodle Hour",
    },

    3: {
      Mon: "Mexican Avocado Salad",
      Tue: "Red Ryvive + Chickpea Avocado Cheese Wrap",
      Wed: "Pomegranate Delight",
      Thu: "Broccoli Cashew Cream",
      Fri: "Happy Gut + Sweet Potato & Pea",
      Sat: "Garlic Mushroom & Veggie Melt",
    },

    4: {
      Mon: "High Protein Black Chana",
      Tue: "Orange Pine Twist + High Protein Soya Cheese Wrap",
      Wed: "Dragon Delight",
      Thu: "Green Garden Bowl",
      Fri: "Ryvive Carrot + Sweet N’ Fresh Corn",
      Sat: "The Zoodle Flame",
    },
  },

  SILVER: {
    1: {
      Mon: "Healthy Heart",
      Tue: "Chilli Crunch Salad",
      Wed: "Paneer Crunch Wrap + Orange Pine Twist",
      Thu: "Chickpea Paneer Fusion",
      Fri: "Corn N Cheese Chaat",
      Sat: "Veg Protein Supreme Wrap + Golden Pine",
    },

    2: {
      Mon: "Stamina Booster",
      Tue: "Creamy Double Chickpea",
      Wed: "Beetroot Cheese Wrap + Calm Cucumber",
      Thu: "Rajma Paneer Power Lean",
      Fri: "Soya Protein Wrap + Ryvive Carrot",
      Sat: "Immuni Boost Plus",
    },

    3: {
      Mon: "Red Ryvive",
      Tue: "Corn Paneer Balance Bowl",
      Wed: "Sprout Energy Wrap + Dr. Carrot",
      Thu: "Roasted Zucchini Bowl",
      Fri: "Sprout Supreme Chaat",
      Sat: "Spinach Corn Cheese Wrap + Beet Blend",
    },

    4: {
      Mon: "APB Shake",
      Tue: "High Protein Paneer Salad",
      Wed: "Spinach Corn Cheese Wrap + Beet Blend",
      Thu: "Chilli Lime Soya Salad",
      Fri: "Soya Protein Wrap + Ryvive Carrot",
      Sat: "Sweet Potato & Pea Chaat",
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentWeekNumber(activationDate, durationMonths = 1) {
  if (!activationDate) return 1;

  const activation = new Date(activationDate);
  activation.setHours(0, 0, 0, 0);

  // Find Monday of the week containing activation date
  const dow = activation.getDay(); // 0=Sun,1=Mon...6=Sat
  const daysFromMon = dow === 0 ? 6 : dow - 1;
  const week1Monday = new Date(activation);
  week1Monday.setDate(activation.getDate() - daysFromMon);

  // Today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // How many days from week1Monday to today
  const diff = today.getTime() - week1Monday.getTime();
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
  const DAY_OFFSETS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5 };
  if (!(dayName in DAY_OFFSETS)) return "";
  const activation = new Date(activationDate);
  activation.setHours(0, 0, 0, 0);
  // Find the Monday of week 1 (the Monday on or before activation date)
  const activationDow = activation.getDay(); // 0=Sun,1=Mon...6=Sat
  const daysFromMonday = activationDow === 0 ? 6 : activationDow - 1;
  const week1Monday = new Date(activation);
  week1Monday.setDate(activation.getDate() - daysFromMonday);
  // Monday of selected week
  const weekMonday = new Date(week1Monday);
  weekMonday.setDate(week1Monday.getDate() + (weekNumber - 1) * 7);
  const date = new Date(weekMonday);
  date.setDate(weekMonday.getDate() + DAY_OFFSETS[dayName]);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function isToday(activationDate, weekNumber, dayName, currentWeekNumber) {
  if (weekNumber !== currentWeekNumber) return false;
  if (!activationDate) return false;
  const DAY_OFFSETS = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5 };
  if (!(dayName in DAY_OFFSETS)) return false;
  const activation = new Date(activationDate);
  activation.setHours(0, 0, 0, 0);
  const weekMonday = new Date(activation);
  weekMonday.setDate(activation.getDate() + (weekNumber - 1) * 7);
  const cardDate = new Date(weekMonday);
  cardDate.setDate(weekMonday.getDate() + DAY_OFFSETS[dayName]);
  cardDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return cardDate.getTime() === today.getTime();
}

function getRemainingDays(endDate) {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0); 
}  

function getDynamicPauseFeature(plan, duration) {
  const perMonth = { SILVER: 1, GOLD: 2, PLATINUM: 3 }[plan] || 0;
  if (plan === "SILVER" && String(duration) === "1") return "No pause available";
  return `${perMonth} pause${perMonth > 1 ? "s" : ""} / month`;
}
function UpgradePlanCard({ plan, S, user, membershipId, formData }) {
  const [upgradeDur, setUpgradeDur] = React.useState("3");

const initiatePayment = async ({
  user,
  plan,
  duration,
  membershipId,
  isRenewal = false,
  isExistingCustomerPurchase = false,
}) => {
  try {
   const baseMembershipId = membershipId?.includes("-")
      ? membershipId.split("-")[0]
      : membershipId;

    const planString = `${plan}_${duration}MONTH`;

    const res = await fetch(
      "https://api.ryviveroots.com/api/payment/easebuzz/initiate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  firstname: user?.firstName || "",
  email: formData?.email || user?.email || "",
  phone: formData?.phone || user?.phone || "",
  plan: planString,
  isRenewal,

  isExistingCustomerPurchase,
  membershipId: baseMembershipId,
}),
      }
    );

    const data = await res.json();

    if (!data.success || !data.access_key) {
      alert(data.message || "Payment failed");
      return;
    }

    window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

const handleUpgradePayment = () => {
 initiatePayment({
  user,
  plan: plan.name,
  duration: upgradeDur,
  membershipId,
  isRenewal: false,

  isExistingCustomerPurchase: true,
});
};

  return (
    <div style={{
      ...S.card,
      border: plan.highlight ? "2px solid #d4af37" : "1.5px solid rgba(45,80,22,.15)",
      position: "relative",
      overflow: "hidden"
    }}>
      {plan.badge && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: "linear-gradient(135deg,#d4af37,#f4d03f)",
          color: "#2d5016", padding: ".3rem .9rem",
          fontSize: ".72rem", fontWeight: 700, borderBottomLeftRadius: 10
        }}>
          {plan.badge}
        </div>
      )}

      <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", marginTop: plan.badge ? ".5rem" : 0 }}>
        {plan.label}
      </h3>

      {/* Duration Selector */}
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
        {["1", "3"].map((dur) => (
          <button
            key={dur}
            onClick={() => setUpgradeDur(dur)}
            style={{
              flex: 1, padding: ".6rem", borderRadius: 8, cursor: "pointer",
              border: `${upgradeDur === dur ? "2" : "1"}px solid ${upgradeDur === dur ? "#d4af37" : "rgba(45,80,22,.2)"}`,
              background: upgradeDur === dur ? "#fffdf0" : "white",
              color: "#2d5016",
              fontWeight: upgradeDur === dur ? 700 : 500,
              fontSize: ".85rem",
              fontFamily: "'Outfit',sans-serif"
            }}
          >
            {dur === "1" ? "1 Month" : "3 Months"}
          </button>
        ))}
      </div>

      {/* Price */}
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#3d6b1f", marginBottom: "1.25rem" }}>
        ₹{plan.prices[upgradeDur].toLocaleString()}
        <span style={{ fontSize: ".85rem", fontWeight: 500, color: "#888", marginLeft: ".4rem" }}>
          / {upgradeDur === "1" ? "month" : "3 months"}
        </span>
      </div>

      {/* Features */}
      <ul style={{ listStyle: "none", margin: "0 0 1.5rem 0", padding: 0 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: ".5rem", marginBottom: ".55rem", fontSize: ".88rem", color: "#555" }}>
            <CheckCircle size={15} color="#3d6b1f" style={{ marginTop: "2px", flexShrink: 0 }} /> {f}
          </li>
        ))}
      </ul>

      {/* Summary before pay */}
      <div style={{ background: "#f0f7ec", borderRadius: 9, padding: ".85rem", border: "1px solid rgba(45,80,22,.1)", marginBottom: "1rem", fontSize: ".85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".35rem" }}>
          <span style={{ color: "#666" }}>Plan</span>
          <span style={{ fontWeight: 600, color: "#2d5016" }}>RYVIVE {plan.name} · {upgradeDur}M</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(45,80,22,.1)", paddingTop: ".35rem", marginTop: ".35rem" }}>
          <span style={{ fontWeight: 600, color: "#2d5016" }}>Total</span>
          <span style={{ fontWeight: 700, color: "#3d6b1f" }}>₹{plan.prices[upgradeDur].toLocaleString()}</span>
        </div>
      </div>

      <button
        style={{ ...S.btnGreen, width: "100%" }}
        onClick={handleUpgradePayment}
      >
      Continue
      </button>
    </div>
  );
}
// ─── Main Component ───────────────────────────────────────────────────────────

export default function RyviveDashboard() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [order, setOrder]         = useState(null);
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  /* ── Notifications State ── */
const [notifications, setNotifications] = useState([]);


/* ── Fetch Notifications ── */
const fetchNotifications = async () => {
  try {
    const membershipId = localStorage.getItem("membershipId");

    const res = await fetch(
      `https://api.ryviveroots.com/api/user/notifications?membershipId=${membershipId}`
    );

    const data = await res.json();

    if (data.success) {
      setNotifications(data.notifications || []);
    }

  } catch (err) {
    console.log("Notification fetch error:", err);
  }
};
  

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
const [calendarDate, setCalendarDate] = useState(new Date());



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
    fetchNotifications();
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

    // ✅ Auto-jump to current week on load
    const dur = order.subscription?.durationMonths || 1;
    const wk  = getCurrentWeekNumber(order.subscription?.activationAt, dur);
    setSelectedWeek(wk);
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

// ── Calculate total meal days (Mon–Sat) between start and end date ────────────
const getTotalMealDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const cursor = new Date(start);

  while (cursor <= end) {
    const day = cursor.getDay(); // 0=Sun
    if (day !== 0) count++;     // skip Sunday
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

// ── Calculate completed meal days (Mon–Sat) from start to today ───────────────
const getCompletedMealDays = (startDate, endDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const limit = now < end ? now : end; // don't exceed end date
  let count = 0;
  const cursor = new Date(start);

  while (cursor <= limit) {
    const day = cursor.getDay();
    if (day !== 0) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
};

const totalDays     = getTotalMealDays(subscription.activationAt, subscription.endDate);
const daysCompleted = getCompletedMealDays(subscription.activationAt, subscription.endDate);

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
  try {
   const membershipId = order.membershipId;

    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }

    const planPrices =
      RENEWAL_PRICING[selectedPlan]?.[renewDuration];

    if (!planPrices) return;

   

    const res = await fetch(
      "https://api.ryviveroots.com/api/payment/easebuzz/initiate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
  firstname: user.firstName,
  
  email: user.email,
  phone: user.phone,
  plan: `${selectedPlan}_${renewDuration}MONTH`,   // just GOLD / SILVER / PLATINUM
  isRenewal: true,
  membershipId: order.membershipId,  
}),

      }
    );

    const data = await res.json();

    if (!data.success || !data.access_key) {
      alert("Payment initiation failed");
      return;
    }

    // ✅ Correct redirect
    window.location.href =
      `https://pay.easebuzz.in/pay/${data.access_key}`;

  } catch (error) {
    console.error("Renew payment error:", error);
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
                 { id: "subscription",  icon: Package,        label: "My Subscription" },
            
              { id: "schedule",      icon: Calendar,       label: "My Daily Schedule" },
             { id: "history",       icon: Receipt,        label: "Purchase History" },
              { id: "upgrade",       icon: TrendingUp,     label: "Explore More Plans" },
            
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

         
         {remainingDays <= 82 && finalStatus !== "PAUSED" && finalStatus !== "UNDER_PROCESS" && (
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



{/* ───────────────── SCHEDULE TAB ───────────────── */}

{activeTab === "schedule" && (() => {

  const activationDate = new Date(subscription.activationAt);
  const endDate = new Date(subscription.endDate);

  activationDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // CURRENT MONTH VIEW
  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getFullYear();

  // MONTH START
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // WEEK START
  const startDay = firstDayOfMonth.getDay();

  // NAV LIMITS
  const thisMonthStart = new Date(currentYear, currentMonth, 1);
  const subStartMonth = new Date(activationDate.getFullYear(), activationDate.getMonth(), 1);
  const subEndMonth   = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  const canGoPrev = thisMonthStart > subStartMonth;
  const canGoNext = thisMonthStart < subEndMonth;

  // PREVIOUS MONTH
  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    const prev = new Date(calendarDate);
    prev.setMonth(prev.getMonth() - 1);
    setCalendarDate(prev);
  };

  // NEXT MONTH
  const handleNextMonth = () => {
    if (!canGoNext) return;
    const next = new Date(calendarDate);
    next.setMonth(next.getMonth() + 1);
    setCalendarDate(next);
  };

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>

      {/* HEADER */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            margin: "0 0 4px 0",
            fontSize: "1.4rem",
            fontWeight: 600,
            color: "#111",
          }}
        >
          My Daily Schedule
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          Meal calendar overview
        </p>
      </div>

      {/* CALENDAR CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e5e5",
          overflow: "hidden",
        }}
      >

        {/* MONTH NAV */}
        <div
          style={{
            padding: "1.1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {/* PREV */}
          <button
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            style={{
              border: "1px solid #e0e0e0",
              background: "#f7f7f7",
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: canGoPrev ? "pointer" : "default",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              opacity: canGoPrev ? 1 : 0.3,
              transition: "opacity .15s",
            }}
          >
            ‹
          </button>

          {/* MONTH LABEL */}
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#111",
            }}
          >
            {calendarDate.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </span>

          {/* NEXT */}
          <button
            onClick={handleNextMonth}
            disabled={!canGoNext}
            style={{
              border: "1px solid #e0e0e0",
              background: "#f7f7f7",
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: canGoNext ? "pointer" : "default",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              opacity: canGoNext ? 1 : 0.3,
              transition: "opacity .15s",
            }}
          >
            ›
          </button>
        </div>

        {/* WEEK DAY LABELS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontWeight: 600,
                color: "#999",
                padding: "10px 0",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
          }}
        >
          {Array.from({ length: 42 }).map((_, index) => {

            // GRID START DATE
            let gridStartDate;

            if (
              currentMonth === activationDate.getMonth() &&
              currentYear === activationDate.getFullYear()
            ) {
              gridStartDate = new Date(activationDate);
              gridStartDate.setDate(
                activationDate.getDate() - activationDate.getDay()
              );
            } else {
              gridStartDate = new Date(currentYear, currentMonth, 1 - startDay);
            }

            // CURRENT CELL DATE
            const currentDate = new Date(gridStartDate);
            currentDate.setDate(gridStartDate.getDate() + index);
            currentDate.setHours(0, 0, 0, 0);

            // TODAY
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isToday    = currentDate.getTime() === today.getTime();
            const isPast     = currentDate < today;
            const isFuture   = currentDate > today;
            const isSunday   = currentDate.getDay() === 0;
            const isCurrentMonth = currentDate.getMonth() === currentMonth;
            const beforeStart = currentDate < activationDate;
            const afterEnd    = currentDate > endDate;

            // HIDE EXTRA DAYS AFTER SUBSCRIPTION END
            if (afterEnd && !isCurrentMonth) {
              return (
                <div
                  key={index}
                  style={{
                    minHeight: 110,
                    borderRight: "1px solid #f0f0f0",
                    borderBottom: "1px solid #f0f0f0",
                    background: "#fafafa",
                  }}
                />
              );
            }

            // MEAL DATA
            const diffDays   = Math.floor((currentDate - activationDate) / 86400000);
            const weekNumber = Math.floor(diffDays / 7) + 1;
            const menu       = WEEKLY_MENU[basePlan]?.[(((weekNumber - 1) % 4) + 1)] || {};
            const dayName    = DAYS[currentDate.getDay()];
            const meal       = !beforeStart && !afterEnd && !isSunday ? menu[dayName] : null;

            return (
              <div
                key={index}
                style={{
                  minHeight: 110,
                  padding: "10px 8px 8px",
                  borderRight: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  background: isToday ? "#EBF3FC" : afterEnd ? "#fafafa" : "transparent",
                  opacity: beforeStart ? 0.18 : !isCurrentMonth ? 0.38 : afterEnd ? 0.4 : 1,
                  pointerEvents: beforeStart ? "none" : "auto",
                }}
              >

                {/* DATE NUMBER */}
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: isToday ? "#185FA5" : "transparent",
                    color: isToday
                      ? "#fff"
                      : isCurrentMonth
                      ? "#444"
                      : "#bbb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {currentDate.getDate()}
                </div>

                {/* REST DAY */}
                {!beforeStart && !afterEnd && isSunday ? (
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "#bbb",
                      fontStyle: "italic",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Rest day
                  </div>
                ) : (
                  <>
                    {/* MEAL NAME */}
                    {meal && (
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: isToday ? "#0C447C" : isCurrentMonth ? "#777" : "#bbb",
                          lineHeight: 1.45,
                          flex: 1,
                        }}
                      >
                        {meal}
                      </div>
                    )}

                    {/* STATUS PILL */}
                    {!beforeStart && !afterEnd && (
                      <div>
                        {isPast && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              background: "#EAF3DE",
                              color: "#3B6D11",
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.62rem",
                              fontWeight: 600,
                            }}
                          >
                            ✓ Done
                          </span>
                        )}

                        {isToday && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "#FAEEDA",
                              color: "#854F0B",
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.62rem",
                              fontWeight: 600,
                            }}
                          >
                            Today
                          </span>
                        )}

                        {isFuture && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              background: "#f3f3f3",
                              color: "#999",
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.62rem",
                              fontWeight: 600,
                              border: "1px solid #e5e5e5",
                            }}
                          >
                            Upcoming
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* LEGEND */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            padding: "12px 1.5rem",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          {[
            { color: "#185FA5", label: "Today" },
            { color: "#3B6D11", label: "Done" },
            { color: "#854F0B", label: "Current" },
            { color: "#ccc",    label: "Upcoming" },
          ].map(({ color, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#888",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                }}
              />
              {label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );

})()}


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
                 ["Meals Completed",  `${daysCompleted} / ${totalDays}`],
["Meals Remaining",  `${totalDays - daysCompleted} meals left`],
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
      {activeTab === "upgrade" && (() => {
const PLAN_RANK = { SILVER: 1, GOLD: 2, PLATINUM: 3 };
const currentRank = PLAN_RANK[basePlan];

const allPlans = [
  { name: "PLATINUM", label: "Ryvive Platinum", prices: { "1": 6999, "3": 23997 },
    features: ["Chef's signature menu", "3 pauses / month", "Glow & recovery juices", "Elite combinations", "Surprise upgrades"] },
  { name: "GOLD", label: "Ryvive Gold", prices: { "1": 5999, "3": 20997 },
    features: ["6 High-protein meals / week", "2 pauses / month", "Gut & Skin-Friendly Meals", "Advanced energy juices", "Boost Energy Levels"] },
  { name: "SILVER", label: "Ryvive Silver", prices: { "1": 4999, "3": 17999 },
    features: ["Clean Meals", "1 pause / month", "Easy Digestion", "Weekly Variety", "Functional Juices"] },
];

  return (
    <div>
    <h2 style={{ margin: "0 0 .25rem 0", fontSize: "1.8rem", fontWeight: 700, color: "#2d5016" }}>
  Explore More Plans
</h2>
<p style={{ margin: "0 0 1.75rem 0", color: "#666" }}>
  Upgrade, downgrade or renew — choose what works best for you
</p>

      <div style={{ background: "#f0f7ec", padding: "1.25rem", borderRadius: 10, border: "1px solid rgba(45,80,22,.1)", marginBottom: "1.75rem" }}>
        <p style={{ margin: "0 0 .2rem 0", color: "#666", fontSize: ".82rem" }}>Current Plan</p>
        <p style={{ margin: 0, color: "#2d5016", fontSize: "1.3rem", fontWeight: 700 }}>RYVIVE {basePlan} · {durationMonths}-Month</p>
      </div>

    <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "1.25rem"
}}>
  {allPlans
    // 🔥 Move current plan to FIRST position
    .sort((a) => (a.name === basePlan ? -1 : 1))
    .map((plan) => {

      const rank = PLAN_RANK[plan.name];
      const isCurrent  = plan.name === basePlan;
      const isUpgrade  = rank > currentRank;
      const isDowngrade = rank < currentRank;

      return (
      <div
  key={plan.name}
  style={{
    border: isCurrent
      ? "2px solid #3d6b1f"
      : isUpgrade
      ? "2px solid #d4af37"
      : "1.5px solid rgba(45,80,22,.15)",
    borderRadius: 14,
    position: "relative",
    overflow: "hidden",   // ✅ IMPORTANT (merges layers)
    background: "#fff"    // single surface
  }}
>
          {/* ✅ Current Plan Badge */}
       {isCurrent && (
  <div style={{
    position: "absolute",
    top: 0,
    right: 0,
    background: "#3d6b1f",   // green
    color: "#fff",
    padding: ".25rem .85rem",
    fontSize: ".7rem",
    fontWeight: 700,
    borderBottomLeftRadius: 9,
    zIndex: 10
  }}>
    ✓ Current Plan
  </div>
)}

          {/* Upgrade / Downgrade badges */}
          {!isCurrent && isUpgrade && (
          <div style={{
  position: "absolute",
  top: 0,
  right: 0,
  background: "#fff8e5",
  color: "#c8860f",
  padding: ".25rem .85rem",
  fontSize: ".7rem",
  fontWeight: 700,
  borderBottomLeftRadius: 9,
  zIndex: 10   // ✅ ADD THIS
}}>
  ↑ Upgrade
</div>
          )}

          {!isCurrent && isDowngrade && (
            <div style={{
  position: "absolute",
  top: 0,
  right: 0,
  background: "#f0f0f0",
  color: "#888",
  padding: ".25rem .85rem",
  fontSize: ".7rem",
  fontWeight: 700,
  borderBottomLeftRadius: 9,
  zIndex: 10   // ✅ ADD THIS
}}>
  ↓ Downgrade
</div>
          )}

          {/* Card Content */}
          <UpgradePlanCard
            plan={{ ...plan, highlight: isUpgrade }}
            S={S}
            user={user}
            membershipId={membershipId}
            formData={formData} 
            onUpgrade={() => {}}
            buttonLabel={
              isCurrent
                ? `Renew ${plan.label}`
                : isUpgrade
                ? `Upgrade to ${plan.label}`
                : `Switch to ${plan.label}`
            }
          />
        </div>
      );
    })}
</div>
    </div>
  );
})()}

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
                  <option>Query</option>
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
     {activeTab === "notifications" && (() => {

  const endDateObj = new Date(subscription.endDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeft = Math.max(
    Math.ceil(
      (endDateObj.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    ),
    0
  );

  const isExpiringSoon = daysLeft <= 10;
  const isExpired = daysLeft === 0;

  const renewalMessage = isExpired
    ? `Your RYVIVE ${basePlan} subscription has expired. Renew now to continue.`
    : isExpiringSoon
    ? `Your subscription expires in ${daysLeft} day${
        daysLeft !== 1 ? "s" : ""
      } on ${endDateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}. Renew soon!`
    : `Your RYVIVE ${basePlan} plan renews on ${endDateObj.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )}.`;

  const renewalIcon = isExpired
    ? "⚠️"
    : isExpiringSoon
    ? "🔴"
    : "🔄";

  const renewalIconBg = isExpired
    ? "#ffebee"
    : isExpiringSoon
    ? "#fff4e5"
    : "#e8f5e9";

  const btnBg = isExpired
    ? "linear-gradient(135deg,#c62828,#e53935)"
    : isExpiringSoon
    ? "linear-gradient(135deg,#c8860f,#f4a020)"
    : "linear-gradient(135deg,#2d5016,#3d6b1f)";

  return (
    <div>

      {/* HEADER */}
      <h2
        style={{
          margin: "0 0 .25rem 0",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#2d5016",
        }}
      >
        Notifications
      </h2>

      <p
        style={{
          margin: "0 0 1.75rem 0",
          color: "#666",
        }}
      >
        Stay updated with your wellness journey
      </p>

      {/* RENEWAL NOTIFICATION */}
      <div
        style={{
          ...S.card,
          padding: 0,
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            padding: "1.1rem 1.5rem",
            background: "rgba(212,175,55,.04)",
            display: "flex",
            gap: ".9rem",
            alignItems: "flex-start",
          }}
        >

          {/* ICON */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: renewalIconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 16,
            }}
          >
            {renewalIcon}
          </div>

          {/* MESSAGE */}
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: "0 0 .3rem 0",
                fontSize: ".95rem",
                fontWeight: 600,
                color: "#2d5016",
                lineHeight: 1.4,
              }}
            >
              {renewalMessage}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".75rem",
                flexWrap: "wrap",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: ".82rem",
                  color: "#999",
                }}
              >
                Just now
              </p>

              <button
                onClick={() => setShowRenewModal(true)}
                style={{
                  background: btnBg,
                  color: "#fff",
                  border: "none",
                  padding: ".3rem .85rem",
                  borderRadius: 7,
                  fontSize: ".78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif",
                }}
              >
                Renew Now
              </button>
            </div>
          </div>

          {/* UNREAD DOT */}
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#d4af37",
              marginTop: ".3rem",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      {/* ADMIN NOTIFICATIONS */}

      {notifications.length === 0 ? (

        <div style={S.card}>
          <p
            style={{
              margin: 0,
              textAlign: "center",
              color: "#777",
            }}
          >
            No admin notifications yet
          </p>
        </div>

      ) : (

        notifications.map((n) => (

          <div
            key={n._id}
            style={{
              ...S.card,
              padding: 0,
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                padding: "1.1rem 1.5rem",
                display: "flex",
                gap: ".9rem",
                alignItems: "flex-start",
                background: "#f8fdf5",
              }}
            >

              {/* ICON */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 16,
                }}
              >
                📢
              </div>

              {/* CONTENT */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: "0 0 .3rem 0",
                    fontSize: ".95rem",
                    fontWeight: 700,
                    color: "#2d5016",
                  }}
                >
                  {n.title}
                </p>

                <p
                  style={{
                    margin: "0 0 .5rem 0",
                    fontSize: ".88rem",
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  {n.message}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: ".78rem",
                    color: "#999",
                  }}
                >
                  {new Date(n.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              {/* UNREAD DOT */}
              {!n.read && (
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#d4af37",
                    marginTop: ".3rem",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          </div>

        ))
      )}
    </div>
  );
})()}
 


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
          <div style={{ 
  ...S.modal, 
  maxWidth: basePlan === "PLATINUM" ? 460 : basePlan === "GOLD" ? 620 : 880 
}} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#999" }} onClick={() => setShowRenewModal(false)}>✕</button>
            <h3 style={{ color: "#2d5016", fontSize: "1.2rem", fontWeight: 700, marginBottom: ".25rem" }}>Renew Your Subscription</h3>
            <p style={{ color: "#666", fontSize: ".85rem", marginBottom: "1.5rem" }}>Current Plan: <strong style={{ color: "#2d5016" }}>RYVIVE {basePlan} · {durationMonths}M</strong></p>
            <div style={{ 
  display: "grid", 
  gridTemplateColumns: `repeat(${PLAN_ORDER.filter((plan) => {
    if (basePlan === "PLATINUM") return plan === "PLATINUM";
    if (basePlan === "GOLD") return plan === "GOLD" || plan === "PLATINUM";
    return true;
  }).length}, minmax(220px, 1fr))`, 
  gap: "1.25rem",
  maxWidth: basePlan === "PLATINUM" ? "380px" : "100%",
  margin: basePlan === "PLATINUM" ? "0 auto" : "0"
}}>
            {PLAN_ORDER
  .filter((plan) => {
    if (basePlan === "PLATINUM") return plan === "PLATINUM";
    if (basePlan === "GOLD") return plan === "GOLD" || plan === "PLATINUM";
    if (basePlan === "SILVER") return true; // show all 3
  })
  .map((plan) => {
                const prices  = RENEWAL_PRICING[plan];
                const isSel   = selectedPlan === plan;
                const isFeat  = plan === "PLATINUM";
                return (
                  <div key={plan} onClick={() => setSelectedPlan(plan)} style={{ border: `${isSel ? "2" : "1"}px solid ${isSel ? "#d4af37" : isFeat ? "#d4af37" : "rgba(45,80,22,.15)"}`, borderRadius: 12, padding: "1.25rem", cursor: "pointer", background: isSel ? "#fffdf0" : "white", position: "relative", marginTop: isFeat ? "1rem" : 0 }}>
                    {isFeat && plan !== basePlan && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#d4af37", color: "#2d5016", fontSize: ".7rem", fontWeight: 700, padding: ".2rem .75rem", borderRadius: 20, whiteSpace: "nowrap" }}>⭐ Most Popular</div>}
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
                      Continue
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
 