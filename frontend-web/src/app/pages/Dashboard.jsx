import { useState, useEffect } from "react";
import gsap from 'gsap';
import { Link } from "react-router";
import { motion } from "motion/react";
import { User, Calendar, TrendingUp, Package, MessageCircle, Bell, LogOut, Edit3, Lock, Clock, CheckCircle, Pause, MapPin, Receipt, ChevronRight as DashMenuIcon, X as XIcon, } from "lucide-react";
import { CREAM, CREAM_2, DARK, INK, SAGE, SAGE_DARK } from "../theme";
// ─── Theme Tokens ─────────────────────────────────────────────────────────────
const GOLD = "#d4af37";
const GOLD_LIGHT = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";
// ─── Constants ────────────────────────────────────────────────────────────────
const PLAN_PAUSES = {
    SILVER: { 1: 0, 3: 3 },
    GOLD: { 1: 2, 3: 6 },
    PLATINUM: { 1: 3, 3: 9 },
};
const RENEWAL_PRICING = {
    SILVER: {
        "1": { original: 4999, final: 4999 },
        "3": { original: 17999, final: 14997 },
    },
    GOLD: {
        "1": { original: 5999, final: 5999 },
        "3": { original: 20997, final: 17997 },
    },
    PLATINUM: {
        "1": { original: 6999, final: 6999 },
        "3": { original: 23997, final: 20997 },
    },
};
const PLAN_FEATURES = {
    SILVER: [
        "Signature detox collection",
        "Fruit & vegetable elixirs",
        "Wellness blends",
        "Clean daily nourishment",
        "Light, balanced portions",
    ],
    GOLD: [
        "Curated salad collection",
        "Sandwiches",
        "Wraps",
        "Soups",
        "Chaat",
    ],
    PLATINUM: [
        "Pasta zoodle collections",
        "House-crafted dips",
        "Premium combinations",
        "Chef-led seasonal edits",
        "Signature tasting balance",
    ],
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
            Fri: "Dragon Pine + Corn N' Cheese",
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
            Fri: "Bright Eyes + Corn N' Cheese",
            Sat: "Chilli Crunch Salad",
        },
    },
    GOLD: {
        1: {
            Mon: "Classic Veggie Bowl",
            Tue: "Immuni Boost Plus + High-Protein Soya Cheese Wrap",
            Wed: "Dragon Pine",
            Thu: "Roasted Zucchini Bowl",
            Fri: "Stamina Booster + Corn N, Cheese",
            Sat: "Avocado Paneer Royal Grill",
        },
        2: {
            Mon: "Creamy Double Chickpea",
            Tue: "Calm Cucumber + Paneer Crunch Cheese Wrap",
            Wed: "Libido Booster",
            Thu: "Rajma Paneer Power Lean",
            Fri: "For Skin Sake + Sweet N' Fresh Corn",
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
            Fri: "Ryvive Carrot + Sweet N' Fresh Corn",
            Sat: "The Zoodle Flame",
        },
    },
    SILVER: {
        1: {
            Mon: "Healthy Heart",
            Tue: "Chilli Crunch Salad",
            Wed: "Paneer Crunch Wrap + Orange Pine Twist",
            Thu: "Chickpea Paneer Fusion",
            Fri: "CORN N, CHEESE",
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
            Fri: "SPROIT SIPREME",
            Sat: "Spinach Corn Cheese Wrap + Beet Blend",
        },
        4: {
            Mon: "APB Shake",
            Tue: "High Protein Paneer Salad",
            Wed: "Spinach Corn Cheese Wrap + Beet Blend",
            Thu: "Chilli Lime Soya Salad",
            Fri: "Soya Protein Wrap + Ryvive Carrot",
            Sat: "SWEET POTATO & PEA",
        },
    },
};
// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_ORDER = {
    membershipId: "RVR-2024-001",
    receiptNumber: "RVR-REC-001",
    createdAt: "2025-03-01T10:00:00.000Z",
    paymentMethod: "Online",
    deliverySlot: "7:00 AM - 9:00 AM",
    address: {
        house: "Flat 4B, Sunshine Apartments",
        street: "MG Road",
        city: "Mumbai",
    },
    user: {
        firstName: "Aarav",
        lastName: "Sharma",
        email: "aarav.sharma@example.com",
        phone: "9876543210",
        dob: "1994-07-15T00:00:00.000Z",
        address: "Flat 4B, Sunshine Apartments, MG Road, Mumbai",
    },
    subscription: {
        plan: "GOLD_1MONTH",
        durationMonths: 1,
        amount: 5999,
        status: "ACTIVE",
        activationAt: "2025-05-01T00:00:00.000Z",
        endDate: "2025-05-31T00:00:00.000Z",
        pause: {
            history: [
                {
                    startDate: "2025-05-10T00:00:00.000Z",
                    resumeDate: "2025-05-13T00:00:00.000Z",
                    days: 3,
                },
            ],
        },
    },
};
const MOCK_ORDERS = [
    MOCK_ORDER,
    {
        membershipId: "RVR-2024-001",
        receiptNumber: "RVR-REC-000",
        createdAt: "2025-02-01T10:00:00.000Z",
        paymentMethod: "Online",
        deliverySlot: "7:00 AM - 9:00 AM",
        address: {
            house: "Flat 4B, Sunshine Apartments",
            street: "MG Road",
            city: "Mumbai",
        },
        user: {
            firstName: "Aarav",
            lastName: "Sharma",
            email: "aarav.sharma@example.com",
            phone: "9876543210",
            dob: "1994-07-15T00:00:00.000Z",
        },
        subscription: {
            plan: "SILVER_1MONTH",
            durationMonths: 1,
            amount: 4999,
            status: "EXPIRED",
            activationAt: "2025-02-01T00:00:00.000Z",
            endDate: "2025-02-28T00:00:00.000Z",
            pause: { history: [] },
        },
    },
];
const MOCK_NOTIFICATIONS = [
    {
        _id: "notif_001",
        title: "New Menu This Week",
        message: "We've added 3 new dishes to your GOLD plan this week. Check your schedule to see what's fresh!",
        createdAt: "2025-05-13T09:00:00.000Z",
        read: false,
    },
    {
        _id: "notif_002",
        title: "Delivery Update",
        message: "Your delivery for tomorrow (May 14) is confirmed. Our rider will arrive between 7:00 AM – 9:00 AM.",
        createdAt: "2025-05-12T18:30:00.000Z",
        read: true,
    },
];
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCurrentWeekNumber(activationDate, durationMonths = 1) {
    if (!activationDate)
        return 1;
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
    if (!date)
        return "-";
    return new Date(date).toLocaleDateString("en-IN");
}
function getRemainingDays(endDate) {
    if (!endDate)
        return 0;
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
}
function UpgradePlanCard({ plan, membershipId }) {
    const [upgradeDur, setUpgradeDur] = useState("3");
    const handleUpgradePayment = () => {
        alert(`[MOCK] Initiating payment for ${plan.name} · ${upgradeDur}M\n` +
            `Amount: ₹${plan.prices[upgradeDur].toLocaleString()}\n` +
            `Member: ${membershipId}\n\n` +
            `(No real API call — replace with your payment gateway integration)`);
    };
    return (<div style={{
            background: CREAM,
            border: plan.highlight
                ? `2px solid ${GOLD}`
                : `1.5px solid ${CARD_BORDER}`,
            borderRadius: "2px",
            padding: "1.75rem",
            position: "relative",
            overflow: "hidden",
        }}>
      {plan.badge && (<div style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: GOLD,
                color: DARK,
                padding: ".3rem .9rem",
                fontSize: ".72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderBottomLeftRadius: "2px",
            }}>
          {plan.badge}
        </div>)}
      <h3 className="font-serif" style={{
            color: INK,
            fontSize: "1.2rem",
            fontWeight: 400,
            marginBottom: "1rem",
            marginTop: plan.badge ? ".5rem" : 0,
        }}>
        {plan.label}
      </h3>
      {/* Duration toggle */}
      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
        {["1", "3"].map((dur) => (<button key={dur} onClick={() => setUpgradeDur(dur)} style={{
                flex: 1,
                padding: ".6rem",
                border: `${upgradeDur === dur ? "2" : "1"}px solid ${upgradeDur === dur ? GOLD : CARD_BORDER}`,
                background: upgradeDur === dur ? GOLD_LIGHT : CREAM,
                color: INK,
                fontWeight: upgradeDur === dur ? 700 : 400,
                fontSize: ".85rem",
                cursor: "pointer",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
            }}>
            {dur === "1" ? "1 Month" : "3 Months"}
          </button>))}
      </div>
      <div className="font-serif" style={{
            fontSize: "2rem",
            fontWeight: 300,
            color: INK,
            marginBottom: "1.25rem",
        }}>
        ₹{plan.prices[upgradeDur].toLocaleString()}
        <span style={{
            fontSize: ".85rem",
            fontWeight: 400,
            color: "rgba(42,37,32,0.5)",
            marginLeft: ".4rem",
        }}>
          / {upgradeDur === "1" ? "month" : "3 months"}
        </span>
      </div>
      <ul style={{ listStyle: "none", margin: "0 0 1.5rem 0", padding: 0 }}>
        {plan.features.map((f) => (<li key={f} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: ".5rem",
                marginBottom: ".55rem",
                fontSize: ".88rem",
                color: "rgba(42,37,32,0.7)",
            }}>
            <CheckCircle size={15} color={SAGE_DARK} style={{ marginTop: "2px", flexShrink: 0 }}/>{" "}
            {f}
          </li>))}
      </ul>
      {/* Summary box */}
      <div style={{
            background: CREAM_2,
            borderRadius: "2px",
            padding: ".85rem",
            border: `1px solid ${CARD_BORDER}`,
            marginBottom: "1rem",
            fontSize: ".85rem",
        }}>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: ".35rem",
        }}>
          <span style={{ color: "rgba(42,37,32,0.6)" }}>Plan</span>
          <span style={{ fontWeight: 600, color: INK }}>
            RYVIVE {plan.name} · {upgradeDur}M
          </span>
        </div>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${CARD_BORDER}`,
            paddingTop: ".35rem",
            marginTop: ".35rem",
        }}>
          <span style={{ fontWeight: 600, color: INK }}>Total</span>
          <span style={{ fontWeight: 700, color: SAGE_DARK }}>
            ₹{plan.prices[upgradeDur].toLocaleString()}
          </span>
        </div>
      </div>
      <button onClick={handleUpgradePayment} className="tracking-widest uppercase" style={{
            width: "100%",
            padding: ".75rem 1.5rem",
            background: DARK,
            color: CREAM,
            border: "none",
            fontSize: ".82rem",
            fontWeight: 400,
            cursor: "pointer",
            letterSpacing: "0.2em",
        }} onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
        }} onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
        }}>
        Continue
      </button>
    </div>);
}
// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("schedule");
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [order, setOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    // Edit state
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        deliverySlot: "",
    });
    // Pause modal
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [pauseFromDate, setPauseFromDate] = useState("");
    const [pauseToDate, setPauseToDate] = useState("");
    // Renew modals
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [renewDuration, setRenewDuration] = useState("3");
    const [selectedPlan, setSelectedPlan] = useState(null);
    // ── Subtle mount animations for cards and sidebar
    useEffect(() => {
        const cards = document.querySelectorAll('.dash-card');
        if (cards && cards.length) {
            gsap.from(cards, { y: 14, opacity: 0, stagger: 0.05, duration: 0.75, ease: 'power2.out' });
        }
        const activeBtn = document.querySelector('.sidebar-btn[style*="borderLeft: 2px solid"]');
        if (activeBtn) {
            gsap.from(activeBtn, { opacity: 0.72, x: -4, duration: 0.45, ease: 'power2.out' });
        }
    }, []);
    const [calendarDate, setCalendarDate] = useState(new Date());
    // Load mock data on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setOrder(MOCK_ORDER);
            setOrders(MOCK_ORDERS);
            setNotifications(MOCK_NOTIFICATIONS);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);
    // Sync formData when order loads
    useEffect(() => {
        if (!order)
            return;
        setFormData({
            email: order.user?.email || "",
            phone: order.user?.phone || "",
            deliverySlot: order.deliverySlot || "",
        });
        const plan = order.subscription?.plan?.split("_")[0]?.toUpperCase();
        if (["SILVER", "GOLD", "PLATINUM"].includes(plan))
            setSelectedPlan(plan);
        const dur = order.subscription?.durationMonths || 1;
        const wk = getCurrentWeekNumber(order.subscription?.activationAt, dur);
        setSelectedWeek(wk);
    }, [order]);
    // Lock body scroll when modals open
    useEffect(() => {
        document.body.style.overflow =
            showPauseModal || showRenewModal || showSummary || mobileNavOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showPauseModal, showRenewModal, showSummary, mobileNavOpen]);
    // Scroll to top on tab change + close mobile nav
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setMobileNavOpen(false);
    }, [activeTab]);
    // Loading state
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center" style={{ background: CREAM_2 }}>
        <div className="text-center">
          <div className="tracking-[0.42em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE }}>
            — Revyve Roots
          </div>
          <div className="font-serif" style={{ fontSize: "22px", color: INK, fontWeight: 300 }}>
            Loading dashboard...
          </div>
        </div>
      </div>);
    }
    if (!order)
        return null;
    const { user, subscription, membershipId } = order;
    const basePlan = subscription.plan.split("_")[0].toUpperCase();
    const durationMonths = subscription.durationMonths || 1;
    // Meal day calculations
    const getTotalMealDays = (startDate, endDate) => {
        if (!startDate || !endDate)
            return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        let count = 0;
        const cursor = new Date(start);
        while (cursor <= end) {
            if (cursor.getDay() !== 0)
                count++;
            cursor.setDate(cursor.getDate() + 1);
        }
        return count;
    };
    const getCompletedMealDays = (startDate, endDate) => {
        if (!startDate)
            return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        const limit = now < end ? now : end;
        let count = 0;
        const cursor = new Date(start);
        while (cursor <= limit) {
            if (cursor.getDay() !== 0)
                count++;
            cursor.setDate(cursor.getDate() + 1);
        }
        return count;
    };
    const totalDays = getTotalMealDays(subscription.activationAt, subscription.endDate);
    const daysCompleted = getCompletedMealDays(subscription.activationAt, subscription.endDate);
    const remainingDays = getRemainingDays(subscription.endDate);
    const pct = Math.round((daysCompleted / totalDays) * 100) || 0;
    // Pause logic
    const canModify = basePlan === "GOLD" ||
        basePlan === "PLATINUM" ||
        (basePlan === "SILVER" && durationMonths === 3);
    const maxPauseCount = basePlan === "SILVER" && durationMonths === 1
        ? 0
        : PLAN_PAUSES[basePlan]?.[durationMonths] || 0;
    const usedPauseCount = subscription.pause?.history?.length || 0;
    const remainingPauseCount = Math.max(maxPauseCount - usedPauseCount, 0);
    const perMonth = { SILVER: 1, GOLD: 2, PLATINUM: 3 }[basePlan] ||
        0;
    const calculatePauseDays = () => {
        if (!pauseFromDate || !pauseToDate)
            return 0;
        const diff = new Date(pauseToDate).getTime() - new Date(pauseFromDate).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        return days > 0 ? days : 0;
    };
    const pauseDays = calculatePauseDays();
    const getMaxToDate = () => {
        if (!pauseFromDate)
            return "";
        const d = new Date(pauseFromDate);
        d.setDate(d.getDate() + 14);
        return d.toISOString().split("T")[0];
    };
    const getResumeNextDay = () => {
        if (!pauseToDate)
            return "";
        const d = new Date(pauseToDate);
        d.setDate(d.getDate() + 1);
        return d.toLocaleDateString("en-IN");
    };
    const hasOverlap = () => subscription.pause?.history?.some((p) => {
        const eStart = new Date(p.startDate);
        const eEnd = new Date(p.resumeDate);
        const nStart = new Date(pauseFromDate);
        const nEnd = new Date(pauseToDate);
        return nStart <= eEnd && nEnd >= eStart;
    });
    const hasUpcomingPause = () => subscription.pause?.history?.some((p) => new Date(p.startDate) > new Date());
    const confirmPause = () => {
        if (!pauseFromDate || !pauseToDate) {
            alert("Please select pause dates.");
            return;
        }
        if (pauseDays <= 0) {
            alert("Invalid date selection.");
            return;
        }
        if (pauseDays > 15) {
            alert("Pause duration cannot exceed 15 days.");
            return;
        }
        if (remainingPauseCount === 0) {
            alert("No pauses remaining.");
            return;
        }
        if (hasOverlap()) {
            alert("Pause dates overlap with an existing pause.");
            return;
        }
        alert(`[MOCK] Pause request submitted!\nFrom: ${formatDate(pauseFromDate)}\nTo: ${formatDate(pauseToDate)}\nDuration: ${pauseDays} day(s)\n\n(No real API call — connect to POST /api/subscription/pause)`);
        setShowPauseModal(false);
    };
    // Status logic
    const getSubscriptionStatus = () => {
        const pause = subscription.pause;
        if (!pause || pause.history.length === 0)
            return "ACTIVE";
        const latest = pause.history[pause.history.length - 1];
        const now = new Date();
        const start = new Date(latest.startDate);
        const resume = new Date(latest.resumeDate);
        if (now >= start && now <= resume)
            return "PAUSED";
        return "ACTIVE";
    };
    const backendStatus = subscription.status;
    const pauseStatus = getSubscriptionStatus();
    const isExpired = new Date() > new Date(subscription.endDate);
    const finalStatus = backendStatus === "UNDER_PROCESS"
        ? "UNDER_PROCESS"
        : isExpired
            ? "EXPIRED"
            : pauseStatus === "PAUSED"
                ? "PAUSED"
                : "ACTIVE";
    const isLocked = remainingPauseCount === 0 ||
        finalStatus === "UNDER_PROCESS" ||
        finalStatus === "EXPIRED";
    const remainingLabel = basePlan === "SILVER" && durationMonths === 1
        ? "No pause available"
        : isLocked
            ? "No pauses remaining"
            : durationMonths === 1
                ? `${remainingPauseCount} pause${remainingPauseCount > 1 ? "s" : ""} remaining`
                : `${perMonth} pause${perMonth > 1 ? "s" : ""} / month`;
    const latestPause = subscription.pause?.history?.length > 0
        ? subscription.pause.history[subscription.pause.history.length - 1]
        : null;
    const pauseMessage = latestPause
        ? latestPause.days === 1
            ? `Pause scheduled for ${formatDate(latestPause.startDate)}. Service will resume the next day.`
            : `Pause scheduled from ${formatDate(latestPause.startDate)} to ${formatDate(latestPause.resumeDate)}`
        : null;
    // Renew payment (mock)
    const handleRenewPayment = () => {
        if (!selectedPlan) {
            alert("Please select a plan");
            return;
        }
        const planPrices = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
        if (!planPrices)
            return;
        alert(`[MOCK] Renewal payment initiated!\nPlan: RYVIVE ${selectedPlan} · ${renewDuration}M\nAmount: ₹${planPrices.final.toLocaleString()}\nMember: ${order.membershipId}\n\n(No real API call)`);
        setShowSummary(false);
        setShowRenewModal(false);
    };
    // Save profile (mock)
    const saveProfile = () => {
        alert(`[MOCK] Profile updated!\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n(No real API call)`);
        setEditMode(false);
    };
    // Download receipt (mock)
    const handleDownloadReceipt = (receiptNumber) => {
        alert(`[MOCK] Downloading receipt: ${receiptNumber}\n\n(No real API call)`);
    };
    const unreadCount = notifications.filter((n) => !n.read).length;
    const currentHour = new Date().getHours();
    const canEdit = currentHour < 17;
    const statusColors = {
        ACTIVE: "#2e7d32",
        PAUSED: "#c8860f",
        EXPIRED: "#c62828",
        UNDER_PROCESS: "#e65100",
    };
    const statusColor = statusColors[finalStatus] || "#666";
    const transactions = orders.map((o) => ({
        id: o.receiptNumber || "-",
        date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "-",
        plan: o.subscription?.plan,
        amount: `₹${o.subscription?.amount?.toLocaleString() || 0}`,
        method: o.paymentMethod || "Online",
        status: o.subscription?.status,
    }));
    const tickets = [
        {
            id: "TICK001",
            date: "Apr 18, 2024",
            subject: "Meal delivery timing",
            status: "Resolved",
        },
        {
            id: "TICK002",
            date: "Apr 10, 2024",
            subject: "Recipe customization",
            status: "In Progress",
        },
    ];
    // ─── Shared style helpers ────────────────────────────────────────────────────
    const card = {
        background: CREAM,
        borderRadius: "4px",
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: "0 1px 8px rgba(42,37,32,0.03)",
        marginBottom: "1.5rem",
    };
    const btnGold = {
        background: GOLD,
        color: DARK,
        border: "none",
        padding: ".65rem 1.4rem",
        fontSize: ".82rem",
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
    };
    const btnDark = {
        background: DARK,
        color: CREAM,
        border: "none",
        padding: ".65rem 1.4rem",
        fontSize: ".82rem",
        cursor: "pointer",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
    };
    const btnOutline = {
        background: "transparent",
        color: INK,
        border: `1px solid ${INK}`,
        padding: ".65rem 1.4rem",
        fontSize: ".82rem",
        cursor: "pointer",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
    };
    const btnDisabled = {
        background: CREAM_2,
        color: "rgba(42,37,32,0.35)",
        border: `1px solid ${CARD_BORDER}`,
        padding: ".65rem 1.4rem",
        fontSize: ".82rem",
        cursor: "not-allowed",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
    };
    const overlay = {
        position: "fixed",
        inset: 0,
        background: "rgba(26,22,19,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "1rem",
    };
    const modal = {
        background: CREAM,
        borderRadius: "2px",
        padding: "2rem",
        width: "100%",
        maxWidth: 480,
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative",
        border: `1px solid ${CARD_BORDER}`,
    };
    const progressBarOuter = {
        background: "rgba(255,255,255,0.15)",
        borderRadius: "2px",
        height: 8,
        overflow: "hidden",
        margin: ".5rem 0",
    };
    const progressFill = (p) => ({
        background: SAGE_DARK,
        height: "100%",
        width: `${p}%`,
        borderRadius: "2px",
        transition: "width .9s ease",
    });
    const labelStyle = {
        fontSize: "10px",
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: SAGE_DARK,
        fontWeight: 600,
    };
    // ─── Nav items ──────────────────────────────────────────────────────────────
    const navItems = [
        { id: "info", icon: User, label: "My Information" },
        { id: "subscription", icon: Package, label: "My Subscription" },
        { id: "schedule", icon: Calendar, label: "My Daily Schedule" },
        { id: "history", icon: Receipt, label: "Purchase History" },
        { id: "upgrade", icon: TrendingUp, label: "Explore More Plans" },
        { id: "support", icon: MessageCircle, label: "Support & Tickets" },
        { id: "notifications", icon: Bell, label: "Notifications" },
    ];
    // ─── Render ─────────────────────────────────────────────────────────────────
    return (<div className="min-h-screen dash-root" style={{ background: CREAM_2 }} data-tone="light">
      <style>{`
        /* Typography — match site-wide system */
        .dash-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight:300; letter-spacing: 0.01em; color: ${INK}; }
        .dash-root .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight:300; letter-spacing: 0.005em; }
        .dash-root h1, .dash-root h2, .dash-root h3 { margin: 0 0 0.55rem 0; }

        /* Sidebar */
        .sidebar-btn { transition: transform .28s ease, color .22s ease, opacity .22s ease; }
        .sidebar-btn:hover { transform: translateX(3px); color: ${CREAM} !important; opacity: 1; }
        .sidebar-btn[style*="borderLeft: 2px solid"] { background: rgba(244,239,230,0.09) !important; }

        /* Cards */
        .dash-card { position: relative; transition: transform .28s ease, box-shadow .3s ease, border-color .3s ease; }
        .dash-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(26,22,19,0.05); }

        /* Buttons */
        .dash-root button { transition: transform .18s ease, opacity .18s ease, background-color .24s ease; }
        .dash-root button:hover:not(:disabled) { transform: translateY(-1px); }
        .dash-root button:active { transform: translateY(0); }

        /* Progress */
        .dash-progress { background: rgba(255,255,255,0.08); border-radius: 999px; height: 8px; overflow: hidden; }
        .dash-progress-fill { height: 100%; background: ${SAGE_DARK}; transition: width .9s ease; }

        /* Calendar */
        .calendar-day { transition: background .22s ease, opacity .22s ease, transform .22s ease; }
        .calendar-day:hover { background: rgba(244,239,230,0.03); transform: translateY(-2px); }
        .calendar-day[style*="background: rgba(139,149,121,0.08)"] > div:first-child { background: ${DARK}; color: ${CREAM} !important; }

      `}</style>
      <div className="flex pt-[72px] min-h-screen items-start relative">
        {/* ── MOBILE NAV TRIGGER ─────────────────────────────────────────── */}
        <button type="button" onClick={() => setMobileNavOpen(true)} className="lg:hidden fixed top-[80px] left-0 z-40 flex items-center justify-center w-7 h-14 rounded-r-full" style={{
            background: DARK,
            color: CREAM,
            border: `1px solid rgba(244,239,230,0.18)`,
            borderLeft: 'none',
            boxShadow: '0 4px 12px -4px rgba(20,17,15,0.35)',
        }} aria-label="Open dashboard menu" aria-expanded={mobileNavOpen}>
          <DashMenuIcon size={16} strokeWidth={1.8}/>
        </button>

        {/* ── MOBILE BACKDROP ────────────────────────────────────────────── */}
        {mobileNavOpen && (<button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close dashboard menu" className="lg:hidden fixed inset-0 z-40" style={{
                background: 'rgba(20, 17, 15, 0.55)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
            }}/>)}

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className={`flex flex-col w-[280px] flex-shrink-0 transition-transform duration-300 ease-out overflow-hidden
            lg:sticky lg:top-[72px] lg:translate-x-0 lg:h-[calc(100vh-72px)] lg:max-h-[calc(100vh-72px)] lg:w-[260px]
            fixed top-0 left-0 z-50 h-screen
            ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ background: DARK }} aria-label="Dashboard navigation" aria-hidden={!mobileNavOpen ? undefined : false}>
          {/* Member info */}
          <div className="px-7 py-8 pt-24 lg:pt-8 relative flex-shrink-0" style={{ borderBottom: `1px solid rgba(244,239,230,0.08)` }}>
            {/* Mobile-only close button */}
            <button type="button" onClick={() => setMobileNavOpen(false)} className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full" style={{
            background: 'rgba(244,239,230,0.05)',
            color: CREAM,
            border: `1px solid rgba(244,239,230,0.12)`,
        }} aria-label="Close dashboard menu">
              <XIcon size={16} strokeWidth={1.6}/>
            </button>
            <div className="tracking-[0.42em] uppercase mb-3" style={{ fontSize: "10px", color: CREAM, fontWeight: 600 }}>
              — Member
            </div>
            <div className="font-serif mb-1" style={{ fontSize: "18px", color: CREAM, fontWeight: 300 }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(244,239,230,0.5)" }}>
              {user.email}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'none' }}>
            {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => setActiveTab(item.id)} className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all duration-200 relative sidebar-btn" style={{
                    background: isActive
                        ? "rgba(244,239,230,0.07)"
                        : "transparent",
                    borderLeft: `2px solid ${isActive ? GOLD : "transparent"}`,
                    color: isActive ? CREAM : "rgba(244,239,230,0.52)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                }} onMouseEnter={(e) => {
                    if (!isActive)
                        e.currentTarget.style.color =
                            CREAM;
                }} onMouseLeave={(e) => {
                    if (!isActive)
                        e.currentTarget.style.color =
                            "rgba(244,239,230,0.52)";
                }}>
                  <Icon size={15} strokeWidth={isActive ? 2 : 1.4}/>
                  <span className="flex-1">{item.label}</span>
                  {item.id === "notifications" && unreadCount > 0 && (<span style={{
                        background: GOLD,
                        color: DARK,
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: ".1rem .4rem",
                        letterSpacing: "0.06em",
                     }}>
                      {unreadCount}
                    </span>)}
                </button>);
        })}
          </nav>

          {/* Membership info box */}
          <div className="mx-4 my-4 px-5 py-4 flex-shrink-0" style={{
            background: "rgba(244,239,230,0.05)",
            border: `1px solid rgba(244,239,230,0.08)`,
        }}>
            <div style={{
            ...labelStyle,
            color: "rgba(244,239,230,0.4)",
            marginBottom: ".4rem",
        }}>
              Membership ID
            </div>
            <div style={{
            fontSize: "13px",
            color: CREAM,
            fontWeight: 500,
            marginBottom: ".75rem",
            letterSpacing: "0.06em",
        }}>
              {membershipId}
            </div>
            <div style={{
            ...labelStyle,
            color: "rgba(244,239,230,0.4)",
            marginBottom: ".4rem",
        }}>
              Current Plan
            </div>
            <div style={{
            fontSize: "12px",
            color: SAGE,
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
        }}>
              RYVIVE {basePlan} · {durationMonths}M
            </div>
          </div>

          {/* Sign out */}
          <div className="flex-shrink-0" style={{ borderTop: `1px solid rgba(244,239,230,0.08)` }}>
            <Link to="/login" className="flex items-center gap-3 px-7 py-5 transition-all duration-200" style={{
            fontSize: "10px",
            color: "rgba(244,239,230,0.38)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
        }} onMouseEnter={(e) => {
            e.currentTarget.style.color = CREAM;
        }} onMouseLeave={(e) => {
            e.currentTarget.style.color =
                "rgba(244,239,230,0.38)";
        }}>
              <LogOut size={13} strokeWidth={1.4}/> Sign Out
            </Link>
          </div>
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main className="flex-1 px-5 sm:px-8 lg:px-12 py-10 lg:py-14 min-w-0">
          <div className="max-w-[960px] mx-auto w-full">
            {/* Expiry Banner */}
            {remainingDays <= 82 &&
            finalStatus !== "PAUSED" &&
            finalStatus !== "UNDER_PROCESS" && (<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between gap-4 flex-wrap mb-8 px-6 py-4" style={{
                background: CREAM,
                border: `1px solid ${CARD_BORDER}`,
            }}>
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-2" style={{ background: CREAM_2, width: 28, height: 28 }}>
                      <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: SAGE_DARK,
                margin: "8px auto",
            }}/>
                    </div>
                    <div>
                      <p style={{
                fontWeight: 600,
                color: INK,
                fontSize: ".9rem",
                margin: 0,
                letterSpacing: "0.04em",
            }}>
                        Subscription expiring in {remainingDays} day
                        {remainingDays !== 1 ? "s" : ""}
                      </p>
                      <p style={{
                fontSize: ".8rem",
                color: "rgba(42,37,32,0.6)",
                margin: ".2rem 0 0 0",
            }}>
                        Renew now to continue your wellness journey
                      </p>
                    </div>
                  </div>
                  <button style={btnDark} onClick={() => setShowRenewModal(true)}>
                    Renew Now
                  </button>
                </motion.div>)}

            {/* ── MY INFORMATION ────────────────────────────────────────── */}
            {activeTab === "info" && (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <div style={labelStyle} className="mb-2">
                      — Profile
                    </div>
                    <h2 className="font-serif" style={{
                fontSize: "clamp(24px,3vw,34px)",
                color: INK,
                fontWeight: 300,
            }}>
                      My Information
                    </h2>
                    <p style={{
                fontSize: "13px",
                color: "rgba(42,37,32,0.6)",
                marginTop: ".25rem",
            }}>
                      View and update your profile details
                    </p>
                  </div>
                  {!editMode && canEdit && (<button style={btnGold} onClick={() => setEditMode(true)}>
                      <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".4rem",
                }}>
                        <Edit3 size={14}/> Edit Information
                      </span>
                    </button>)}
                </div>
                {!canEdit && (<div className="flex items-center gap-3 px-5 py-4 mb-6" style={{
                    background: "#fff8e5",
                    border: `1px solid rgba(212,175,55,0.3)`,
                    fontSize: ".88rem",
                    color: "#8b6914",
                }}>
                    <Clock size={16} color={GOLD}/>
                    Profile editing is only allowed until 5:00 PM daily.
                  </div>)}
                <div className="dash-card" style={{ ...card, padding: "2rem" }}>
                  <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
                gap: "1.5rem",
            }}>
                    {[
                {
                    label: "Full Name",
                    val: `${user.firstName} ${user.lastName}`,
                    locked: true,
                },
                {
                    label: "Membership ID",
                    val: membershipId,
                    locked: true,
                },
                {
                    label: "Email Address",
                    val: formData.email,
                    fieldKey: "email",
                    locked: false,
                },
                {
                    label: "Phone Number",
                    val: formData.phone,
                    fieldKey: "phone",
                    locked: false,
                },
                {
                    label: "Date of Birth",
                    val: formatDate(user.dob),
                    locked: true,
                },
                {
                    label: "Delivery Address",
                    val: order.address
                        ? `${order.address.house}, ${order.address.street}, ${order.address.city}`
                        : "-",
                    locked: true,
                },
                {
                    label: "Payment Method",
                    val: order.paymentMethod || "Online",
                    locked: true,
                },
            ].map((field) => (<div key={field.label}>
                        <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                    ...labelStyle,
                    marginBottom: ".5rem",
                }}>
                          {field.label}{" "}
                          {field.locked && <Lock size={12} color={SAGE}/>}
                        </label>
                        <input type="text" value={field.val} disabled={!editMode || field.locked} onChange={(e) => field.fieldKey &&
                    setFormData({
                        ...formData,
                        [field.fieldKey]: e.target.value,
                    })} style={{
                    width: "100%",
                    padding: ".7rem .9rem",
                    border: editMode && !field.locked
                        ? `1.5px solid ${GOLD}`
                        : `1px solid ${CARD_BORDER}`,
                    background: field.locked ? CREAM_2 : CREAM,
                    color: field.locked ? "rgba(42,37,32,0.5)" : INK,
                    fontSize: ".9rem",
                    cursor: field.locked
                        ? "not-allowed"
                        : editMode
                            ? "text"
                            : "default",
                    outline: "none",
                    fontFamily: "inherit",
                }}/>
                      </div>))}
                  </div>
                  {editMode && (<div className="flex gap-3 mt-8">
                      <button style={btnDark} onClick={saveProfile}>
                        Save Changes
                      </button>
                      <button style={btnOutline} onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </div>)}
                </div>
              </motion.div>)}

            {/* ── MY SUBSCRIPTION ───────────────────────────────────────── */}
            {activeTab === "subscription" && (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">
                  — Active Plan
                </div>
                <h2 className="font-serif mb-1" style={{
                fontSize: "clamp(24px,3vw,34px)",
                color: INK,
                fontWeight: 300,
            }}>
                  My Subscription
                </h2>
                <p style={{
                fontSize: "13px",
                color: "rgba(42,37,32,0.6)",
                marginBottom: "2rem",
            }}>
                  Manage your package, pauses, and delivery preferences
                </p>

                {/* Green card → use DARK */}
                <div className="mb-6 px-8 py-7" style={{ background: DARK }}>
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package size={20} color={GOLD} strokeWidth={1.5}/>
                        <h3 className="font-serif" style={{
                margin: 0,
                color: CREAM,
                fontSize: "1.2rem",
                fontWeight: 300,
            }}>
                          RYVIVE {basePlan} · {durationMonths}-Month Plan
                        </h3>
                      </div>
                      <p style={{
                margin: "0 0 .4rem 0",
                color: "rgba(244,239,230,0.65)",
                fontSize: ".85rem",
            }}>
                        {formatDate(subscription.activationAt)} →{" "}
                        {formatDate(subscription.endDate)}
                      </p>
                      <span style={{
                color: GOLD,
                fontWeight: 600,
                fontSize: ".88rem",
                letterSpacing: "0.08em",
            }}>
                        Status:{" "}
                        <span style={{
                color: statusColor,
                filter: "brightness(1.5)",
            }}>
                          {finalStatus}
                        </span>
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{
                margin: "0 0 .2rem 0",
                color: "rgba(244,239,230,0.55)",
                fontSize: ".75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
            }}>
                        Progress
                      </p>
                      <p className="font-serif" style={{
                margin: 0,
                color: GOLD,
                fontSize: "2.2rem",
                fontWeight: 300,
                lineHeight: 1,
            }}>
                        {daysCompleted}/{totalDays}
                      </p>
                      <p style={{
                margin: 0,
                color: "rgba(244,239,230,0.5)",
                fontSize: ".75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
            }}>
                        Days
                      </p>
                    </div>
                  </div>
                  <div className="dash-progress" style={progressBarOuter}>
                    <div className="dash-progress-fill" style={{ width: `${pct}%` }}/>
                  </div>
                  <p style={{
                margin: ".3rem 0 0 0",
                color: "rgba(244,239,230,0.7)",
                fontSize: ".8rem",
                letterSpacing: "0.08em",
            }}>
                    {pct}% Complete
                  </p>
                </div>

                {/* Pause message */}
                {pauseMessage && (<div className="flex items-center gap-3 px-5 py-4 mb-5" style={{
                    background: "#fff8e5",
                    border: `1px solid rgba(212,175,55,0.25)`,
                    fontSize: ".88rem",
                    color: "#8b6914",
                }}>
                    <Pause size={15} color={GOLD}/> {pauseMessage}
                  </div>)}

                {/* Pause + Delivery grid */}
                <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: "1.25rem",
                marginBottom: "1.25rem",
            }}>
                  {/* Pause card */}
                  <div className="dash-card" style={{ ...card, padding: "1.75rem", marginBottom: 0 }}>
                    <div className="flex items-center gap-4 mb-5">
                      <div style={{ background: CREAM_2, padding: ".65rem" }}>
                        <Pause size={22} color={GOLD} strokeWidth={1.5}/>
                      </div>
                      <div>
                        <h3 style={{
                margin: 0,
                color: INK,
                fontSize: "1rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
            }}>
                          Pause Subscription
                        </h3>
                        <p style={{
                margin: 0,
                color: "rgba(42,37,32,0.55)",
                fontSize: ".78rem",
            }}>
                          Temporarily pause your deliveries
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span style={{
                color: "rgba(42,37,32,0.6)",
                fontSize: ".85rem",
            }}>
                        Pauses Used
                      </span>
                      <span className="font-serif" style={{
                color: INK,
                fontSize: "1.3rem",
                fontWeight: 300,
            }}>
                        {usedPauseCount}/{maxPauseCount}
                      </span>
                    </div>
                    <div style={{
                background: CREAM_2,
                height: 6,
                overflow: "hidden",
                marginBottom: ".85rem",
            }}>
                      <div style={{
                background: SAGE_DARK,
                height: "100%",
                width: `${maxPauseCount ? Math.round((usedPauseCount / maxPauseCount) * 100) : 100}%`,
                transition: "width 1s ease",
            }}/>
                    </div>
                    <div className="px-4 py-3 mb-4" style={{
                background: CREAM_2,
                border: `1px solid ${CARD_BORDER}`,
            }}>
                      <p style={{
                margin: 0,
                color: INK,
                fontWeight: 500,
                fontSize: ".88rem",
            }}>
                        {remainingPauseCount} pause
                        {remainingPauseCount !== 1 ? "s" : ""} remaining
                      </p>
                      <p style={{
                margin: ".15rem 0 0 0",
                color: "rgba(42,37,32,0.55)",
                fontSize: ".78rem",
            }}>
                        Used: {usedPauseCount} / {maxPauseCount} total
                      </p>
                    </div>
                    {canModify && (<button style={isLocked || finalStatus !== "ACTIVE"
                    ? {
                        ...btnDisabled,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: ".4rem",
                    }
                    : {
                        ...btnGold,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: ".4rem",
                    }} disabled={isLocked || finalStatus !== "ACTIVE"} onClick={() => {
                    if (hasUpcomingPause()) {
                        alert("You already have a scheduled pause.");
                        return;
                    }
                    if (!isLocked)
                        setShowPauseModal(true);
                }}>
                        {isLocked && <Lock size={14}/>} Request Pause
                      </button>)}
                  </div>

                  {/* Delivery slot card */}
                  <div className="dash-card" style={{ ...card, padding: "1.75rem", marginBottom: 0 }}>
                    <div className="flex items-center gap-4 mb-5">
                      <div style={{ background: CREAM_2, padding: ".65rem" }}>
                        <Clock size={22} color={SAGE_DARK} strokeWidth={1.5}/>
                      </div>
                      <div>
                        <h3 style={{
                margin: 0,
                color: INK,
                fontSize: "1rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
            }}>
                          Delivery Slot
                        </h3>
                        <p style={{
                margin: 0,
                color: "rgba(42,37,32,0.55)",
                fontSize: ".78rem",
            }}>
                          Change once every 14 days
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-4 mb-4" style={{
                background: CREAM_2,
                border: `1px solid ${CARD_BORDER}`,
            }}>
                      <p style={{
                margin: "0 0 .25rem 0",
                color: "rgba(42,37,32,0.55)",
                fontSize: ".72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
            }}>
                        Current Slot
                      </p>
                      <p className="font-serif" style={{
                margin: "0 0 .4rem 0",
                color: INK,
                fontSize: "1.2rem",
                fontWeight: 300,
            }}>
                        {order.deliverySlot || "7:00 AM - 9:00 AM"}
                      </p>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} color={SAGE_DARK}/>
                        <p style={{
                margin: 0,
                color: "rgba(42,37,32,0.6)",
                fontSize: ".8rem",
            }}>
                          {order.address
                ? `${order.address.house}, ${order.address.street}, ${order.address.city}`
                : user.address || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 mb-4" style={{
                background: "#fff8e5",
                border: `1px solid rgba(212,175,55,0.2)`,
                fontSize: ".8rem",
                color: "#8b6914",
            }}>
                      <Clock size={13} color={GOLD}/> Next change available
                      after 14 days from last change
                    </div>
                    <button style={{ ...btnDisabled, width: "100%" }} disabled>
                      Change Delivery Slot
                    </button>
                  </div>
                </div>

                {/* Package details */}
                <div className="dash-card" style={{ ...card, padding: "1.75rem" }}>
                  <div style={labelStyle} className="mb-5">
                    — Package Details
                  </div>
                  <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                gap: "1rem",
            }}>
                    {[
                ["Package", `RYVIVE ${basePlan}`],
                [
                    "Duration",
                    `${durationMonths} Month${durationMonths > 1 ? "s" : ""}`,
                ],
                ["Start Date", formatDate(subscription.activationAt)],
                ["End Date", formatDate(subscription.endDate)],
                ["Meals Completed", `${daysCompleted} / ${totalDays}`],
                [
                    "Meals Remaining",
                    `${totalDays - daysCompleted} meals left`,
                ],
                ["Pause Allowance", `${maxPauseCount} total`],
            ].map(([label, val]) => (<div key={label} className="px-4 py-4" style={{
                    background: CREAM_2,
                    border: `1px solid ${CARD_BORDER}`,
                }}>
                        <p style={{
                    margin: "0 0 .3rem 0",
                    ...labelStyle,
                    color: "rgba(42,37,32,0.5)",
                }}>
                          {label}
                        </p>
                        <p className="font-serif" style={{
                    margin: 0,
                    color: INK,
                    fontSize: "1rem",
                    fontWeight: 300,
                }}>
                          {val}
                        </p>
                      </div>))}
                  </div>
                </div>

                {/* Pause history */}
                {subscription.pause?.history?.length > 0 && (<div className="dash-card" style={{ ...card, padding: "1.75rem" }}>
                    <div style={labelStyle} className="mb-5">
                      — Pause History
                    </div>
                    {subscription.pause.history.map((p, i) => (<div key={i} className="flex justify-between items-center px-4 py-3 mb-2" style={{
                        background: CREAM_2,
                        border: `1px solid ${CARD_BORDER}`,
                    }}>
                        <span style={{ color: INK, fontSize: ".88rem" }}>
                          {formatDate(p.startDate)} → {formatDate(p.resumeDate)}
                        </span>
                        <span style={{
                        background: "#fff8e1",
                        color: "#c8860f",
                        fontSize: ".75rem",
                        fontWeight: 700,
                        padding: ".2rem .65rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}>
                          {p.days} day{p.days > 1 ? "s" : ""}
                        </span>
                      </div>))}
                  </div>)}
              </motion.div>)}

            {/* ── MY DAILY SCHEDULE ─────────────────────────────────────── */}
            {activeTab === "schedule" &&
            (() => {
                const activationDate = new Date(subscription.activationAt);
                const endDate = new Date(subscription.endDate);
                activationDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                const currentMonth = calendarDate.getMonth();
                const currentYear = calendarDate.getFullYear();
                const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                const startDay = firstDayOfMonth.getDay();
                const thisMonthStart = new Date(currentYear, currentMonth, 1);
                const subStartMonth = new Date(activationDate.getFullYear(), activationDate.getMonth(), 1);
                const subEndMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                const canGoPrev = thisMonthStart > subStartMonth;
                const canGoNext = thisMonthStart < subEndMonth;
                const handlePrevMonth = () => {
                    if (!canGoPrev)
                        return;
                    const prev = new Date(calendarDate);
                    prev.setMonth(prev.getMonth() - 1);
                    setCalendarDate(prev);
                };
                const handleNextMonth = () => {
                    if (!canGoNext)
                        return;
                    const next = new Date(calendarDate);
                    next.setMonth(next.getMonth() + 1);
                    setCalendarDate(next);
                };
                const DAY_NAMES = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                ];
                return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div style={labelStyle} className="mb-2">
                      — Calendar
                    </div>
                    <h2 className="font-serif mb-1" style={{
                        fontSize: "clamp(24px,3vw,34px)",
                        color: INK,
                        fontWeight: 300,
                    }}>
                      My Daily Schedule
                    </h2>
                    <p style={{
                        fontSize: "13px",
                        color: "rgba(42,37,32,0.6)",
                        marginBottom: "2rem",
                    }}>
                      Meal calendar overview
                    </p>

                    <div style={{
                        background: CREAM,
                        border: `1px solid ${CARD_BORDER}`,
                        overflow: "hidden",
                    }}>
                      {/* Calendar header */}
                      <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
                        <button onClick={handlePrevMonth} disabled={!canGoPrev} style={{
                        width: 34,
                        height: 34,
                        border: `1px solid ${CARD_BORDER}`,
                        background: CREAM_2,
                        cursor: canGoPrev ? "pointer" : "default",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: INK,
                        opacity: canGoPrev ? 1 : 0.28,
                    }}>
                          ‹
                        </button>
                        <span className="font-serif" style={{
                        fontSize: "1rem",
                        fontWeight: 300,
                        color: INK,
                        letterSpacing: "0.06em",
                    }}>
                          {calendarDate.toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                    })}
                        </span>
                        <button onClick={handleNextMonth} disabled={!canGoNext} style={{
                        width: 34,
                        height: 34,
                        border: `1px solid ${CARD_BORDER}`,
                        background: CREAM_2,
                        cursor: canGoNext ? "pointer" : "default",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: INK,
                        opacity: canGoNext ? 1 : 0.28,
                    }}>
                          ›
                        </button>
                      </div>

                      {/* Day headers */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7,1fr)",
                        borderBottom: `1px solid ${CARD_BORDER}`,
                    }}>
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (<div key={d} style={{
                            textAlign: "center",
                            fontWeight: 500,
                            color: SAGE_DARK,
                            padding: "10px 0",
                            fontSize: "0.72rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                        }}>
                            {d}
                          </div>))}
                      </div>

                      {/* Calendar grid */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(7,1fr)",
                    }}>
                        {Array.from({ length: 42 }).map((_, index) => {
                        let gridStartDate;
                        if (currentMonth === activationDate.getMonth() &&
                            currentYear === activationDate.getFullYear()) {
                            gridStartDate = new Date(activationDate);
                            gridStartDate.setDate(activationDate.getDate() -
                                activationDate.getDay());
                        }
                        else {
                            gridStartDate = new Date(currentYear, currentMonth, 1 - startDay);
                        }
                        const currentDate = new Date(gridStartDate);
                        currentDate.setDate(gridStartDate.getDate() + index);
                        currentDate.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const isToday = currentDate.getTime() === today.getTime();
                        const isPast = currentDate < today;
                        const isFuture = currentDate > today;
                        const isSunday = currentDate.getDay() === 0;
                        const isCurrentMonth = currentDate.getMonth() === currentMonth;
                        const beforeStart = currentDate < activationDate;
                        const afterEnd = currentDate > endDate;
                        if (afterEnd && !isCurrentMonth) {
                            return (<div key={index} style={{
                                    minHeight: 100,
                                    borderRight: `1px solid ${CARD_BORDER}`,
                                    borderBottom: `1px solid ${CARD_BORDER}`,
                                    background: CREAM_2,
                                }}/>);
                        }
                        const diffDays = Math.floor((currentDate.getTime() - activationDate.getTime()) /
                            86400000);
                        const wkNum = Math.floor(diffDays / 7) + 1;
                        const menu = WEEKLY_MENU[basePlan]?.[(((wkNum - 1) % 4) + 1)] || {};
                        const dayName = DAY_NAMES[currentDate.getDay()];
                        const meal = !beforeStart && !afterEnd && !isSunday
                            ? menu[dayName]
                            : null;
                        return (<div key={index} className="calendar-day" style={{
                                minHeight: 108,
                                padding: "10px 8px 8px",
                                borderRight: `1px solid ${CARD_BORDER}`,
                                borderBottom: `1px solid ${CARD_BORDER}`,
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                                background: isToday
                                    ? "rgba(139,149,121,0.08)"
                                    : afterEnd
                                        ? CREAM_2
                                        : "transparent",
                                opacity: beforeStart
                                    ? 0.18
                                    : !isCurrentMonth
                                        ? 0.38
                                        : afterEnd
                                            ? 0.45
                                            : 1,
                                pointerEvents: beforeStart ? "none" : "auto",
                            }}>
                              <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: isToday ? DARK : "transparent",
                                color: isToday
                                    ? CREAM
                                    : isCurrentMonth
                                        ? INK
                                        : "rgba(42,37,32,0.35)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.78rem",
                                fontWeight: isToday ? 500 : 400,
                                flexShrink: 0,
                            }}>
                                {currentDate.getDate()}
                              </div>
                              {!beforeStart && !afterEnd && isSunday ? (<div style={{
                                    fontSize: "0.62rem",
                                    color: "rgba(42,37,32,0.38)",
                                    fontStyle: "italic",
                                    textAlign: "center",
                                    marginTop: 3,
                                }}>
                                  Rest day
                                </div>) : (<>
                                  {meal && (<div style={{
                                        fontSize: "0.63rem",
                                        color: isToday
                                            ? INK
                                            : isCurrentMonth
                                                ? "rgba(42,37,32,0.65)"
                                                : "rgba(42,37,32,0.32)",
                                        lineHeight: 1.45,
                                        flex: 1,
                                    }}>
                                      {meal}
                                    </div>)}
                                  {!beforeStart && !afterEnd && (<div>
                                      {isPast && (<span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 2,
                                            background: "rgba(139,149,121,0.15)",
                                            color: SAGE_DARK,
                                            padding: "2px 7px",
                                            fontSize: "0.6rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                        }}>
                                          Done
                                        </span>)}
                                      {isToday && (<span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            background: `rgba(212,175,55,0.18)`,
                                            color: "#854F0B",
                                            padding: "2px 7px",
                                            fontSize: "0.6rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                        }}>
                                          Today
                                        </span>)}
                                      {isFuture && (<span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            background: CREAM_2,
                                            color: "rgba(42,37,32,0.45)",
                                            padding: "2px 7px",
                                            fontSize: "0.6rem",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                            border: `1px solid ${CARD_BORDER}`,
                                        }}>
                                          Upcoming
                                        </span>)}
                                    </div>)}
                                </>)}
                            </div>);
                    })}
                      </div>

                      {/* Legend */}
                      <div className="flex gap-5 flex-wrap px-6 py-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                        {[
                        { color: DARK, label: "Today" },
                        { color: SAGE_DARK, label: "Done" },
                        { color: "#854F0B", label: "Current" },
                        { color: CARD_BORDER, label: "Upcoming" },
                    ].map(({ color, label }) => (<div key={label} className="flex items-center gap-2" style={{
                            fontSize: "11px",
                            color: "rgba(42,37,32,0.55)",
                            letterSpacing: "0.1em",
                        }}>
                            <div style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: color,
                        }}/>
                            {label}
                          </div>))}
                      </div>
                    </div>
                  </motion.div>);
            })()}

            {/* ── PURCHASE HISTORY ──────────────────────────────────────── */}
            {activeTab === "history" && (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">
                  — Transactions
                </div>
                <h2 className="font-serif mb-1" style={{
                fontSize: "clamp(24px,3vw,34px)",
                color: INK,
                fontWeight: 300,
            }}>
                  Purchase History
                </h2>
                <p style={{
                fontSize: "13px",
                color: "rgba(42,37,32,0.6)",
                marginBottom: "2rem",
            }}>
                  All your transactions and receipts
                </p>
                <div className="dash-card" style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {transactions.length === 0 && (<p style={{
                    padding: "2rem",
                    color: "rgba(42,37,32,0.5)",
                    textAlign: "center",
                }}>
                      No transactions found.
                    </p>)}
                  {transactions.map((txn, i) => (<div key={txn.id} className="flex justify-between items-center flex-wrap gap-4 px-7 py-5" style={{
                    borderBottom: i < transactions.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : "none",
                }}>
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-serif" style={{
                    fontWeight: 300,
                    color: INK,
                    fontSize: "1rem",
                }}>
                            {txn.plan}
                          </span>
                          <span style={{
                    background: txn.status === "ACTIVE" ||
                        txn.status === "Successful"
                        ? "rgba(46,125,50,0.1)"
                        : "rgba(198,40,40,0.1)",
                    color: txn.status === "ACTIVE" ||
                        txn.status === "Successful"
                        ? "#2e7d32"
                        : "#c62828",
                    padding: ".15rem .65rem",
                    fontSize: ".72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}>
                            {txn.status}
                          </span>
                        </div>
                        <div className="flex gap-5 flex-wrap" style={{
                    fontSize: ".8rem",
                    color: "rgba(42,37,32,0.55)",
                    letterSpacing: "0.04em",
                }}>
                          <span>Invoice: {txn.id}</span>
                          <span>{txn.date}</span>
                          <span>{txn.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif" style={{
                    fontSize: "1.2rem",
                    fontWeight: 300,
                    color: INK,
                }}>
                          {txn.amount}
                        </span>
                        <button style={{
                    ...btnGold,
                    padding: ".5rem .9rem",
                    fontSize: ".78rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".4rem",
                }} onClick={() => handleDownloadReceipt(txn.id)}>
                          <Receipt size={13}/> Download Receipt
                        </button>
                      </div>
                    </div>))}
                </div>
              </motion.div>)}

            {/* ── EXPLORE MORE PLANS ────────────────────────────────────── */}
            {activeTab === "upgrade" &&
            (() => {
                const PLAN_RANK = {
                    SILVER: 1,
                    GOLD: 2,
                    PLATINUM: 3,
                };
                const currentRank = PLAN_RANK[basePlan];
                const allPlans = [
                    {
                        name: "PLATINUM",
                        label: "Ryvive Platinum",
                        prices: { "1": 6999, "3": 23997 },
                        features: [
                            "Pasta zoodle collections",
                            "3 pauses / month",
                            "House-crafted dips",
                            "Chef-led seasonal edits",
                            "Signature tasting balance",
                        ],
                    },
                    {
                        name: "GOLD",
                        label: "Ryvive Gold",
                        prices: { "1": 5999, "3": 20997 },
                        features: [
                            "Curated salad collection",
                            "2 pauses / month",
                            "Sandwiches",
                            "Wraps",
                            "Soups",
                        ],
                    },
                    {
                        name: "SILVER",
                        label: "Ryvive Silver",
                        prices: { "1": 4999, "3": 17999 },
                        features: [
                            "Signature detox collection",
                            "1 pause / month",
                            "Fruit & vegetable elixirs",
                            "Wellness blends",
                            "Light daily nourishment",
                        ],
                    },
                ];
                return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div style={labelStyle} className="mb-2">
                      — Plans
                    </div>
                    <h2 className="font-serif mb-1" style={{
                        fontSize: "clamp(24px,3vw,34px)",
                        color: INK,
                        fontWeight: 300,
                    }}>
                      Explore More Plans
                    </h2>
                    <p style={{
                        fontSize: "13px",
                        color: "rgba(42,37,32,0.6)",
                        marginBottom: "2rem",
                    }}>
                      Upgrade, downgrade or renew — choose what works best for
                      you
                    </p>

                    {/* Current plan info */}
                    <div className="px-5 py-4 mb-7" style={{
                        background: CREAM,
                        border: `1px solid ${CARD_BORDER}`,
                    }}>
                      <p style={{ margin: "0 0 .2rem 0", ...labelStyle }}>
                        Current Plan
                      </p>
                      <p className="font-serif" style={{
                        margin: 0,
                        color: INK,
                        fontSize: "1.2rem",
                        fontWeight: 300,
                    }}>
                        RYVIVE {basePlan} · {durationMonths}-Month
                      </p>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1.25rem",
                    }}>
                      {allPlans
                        .sort((a) => (a.name === basePlan ? -1 : 1))
                        .map((plan) => {
                        const rank = PLAN_RANK[plan.name];
                        const isCurrent = plan.name === basePlan;
                        const isUpgrade = rank > currentRank;
                        const isDowngrade = rank < currentRank;
                        const badge = isCurrent
                            ? "Current Plan"
                            : isUpgrade
                                ? "↑ Upgrade"
                                : "↓ Downgrade";
                        return (<div key={plan.name} style={{ position: "relative" }}>
                              <UpgradePlanCard plan={{ ...plan, highlight: isUpgrade, badge }} membershipId={membershipId}/>
                            </div>);
                    })}
                    </div>
                  </motion.div>);
            })()}

            {/* ── SUPPORT & TICKETS ─────────────────────────────────────── */}
            {activeTab === "support" && (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={labelStyle} className="mb-2">
                  — Help
                </div>
                <h2 className="font-serif mb-1" style={{
                fontSize: "clamp(24px,3vw,34px)",
                color: INK,
                fontWeight: 300,
            }}>
                  Support & Tickets
                </h2>
                <p style={{
                fontSize: "13px",
                color: "rgba(42,37,32,0.6)",
                marginBottom: "2rem",
            }}>
                  Get help or share feedback
                </p>

                {/* Contact info */}
                <div className="px-6 py-5 mb-6" style={{
                background: CREAM,
                border: `1px solid ${CARD_BORDER}`,
            }}>
                  <p style={{ margin: "0 0 .5rem 0", ...labelStyle }}>
                    — Need immediate help?
                  </p>
                  <p style={{
                margin: "0 0 .3rem 0",
                color: INK,
                fontSize: ".9rem",
            }}>
                    customersupport@ryviveroots.com
                  </p>
                  <p style={{ margin: 0, color: INK, fontSize: ".9rem" }}>
                    +91 97656 00701
                  </p>
                </div>

                {/* Raise complaint */}
                <div style={{
                ...card,
                padding: "1.75rem",
                marginBottom: "1.5rem",
            }}>
                  <div style={labelStyle} className="mb-5">
                    — Raise a Complaint or Share Feedback
                  </div>
                  <select style={{
                width: "100%",
                padding: ".7rem .9rem",
                border: `1px solid ${CARD_BORDER}`,
                background: CREAM,
                fontSize: ".9rem",
                marginBottom: "1rem",
                color: INK,
                outline: "none",
                fontFamily: "inherit",
                appearance: "auto",
            }}>
                    <option>Select Type</option>
                    <option>Query</option>
                    <option>Feedback</option>
                  </select>
                  <textarea placeholder="Describe your concern or feedback in detail..." style={{
                width: "100%",
                minHeight: 110,
                padding: ".85rem .9rem",
                border: `1px solid ${CARD_BORDER}`,
                background: CREAM,
                fontSize: ".9rem",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: "1rem",
                color: INK,
                outline: "none",
            }}/>
                  <button style={btnDark} onClick={() => alert("[MOCK] Ticket submitted!\n\n(Connect to your support API)")}>
                    Submit
                  </button>
                </div>

                {/* Tickets list */}
                <div style={labelStyle} className="mb-4">
                  — Your Tickets
                </div>
                <div className="dash-card" style={{ ...card, padding: 0, overflow: "hidden" }}>
                  {tickets.map((ticket, i) => (<div key={ticket.id} className="flex justify-between items-center px-7 py-5" style={{
                    borderBottom: i < tickets.length - 1
                        ? `1px solid ${CARD_BORDER}`
                        : "none",
                }}>
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span style={{
                    fontWeight: 500,
                    color: INK,
                    fontSize: ".92rem",
                }}>
                            {ticket.subject}
                          </span>
                          <span style={{
                    background: ticket.status === "Resolved"
                        ? "rgba(46,125,50,0.1)"
                        : ticket.status === "In Progress"
                            ? "rgba(212,175,55,0.15)"
                            : CREAM_2,
                    color: ticket.status === "Resolved"
                        ? "#2e7d32"
                        : ticket.status === "In Progress"
                            ? "#c8860f"
                            : "rgba(42,37,32,0.5)",
                    padding: ".15rem .65rem",
                    fontSize: ".72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".3rem",
                }}>
                            {ticket.status === "Resolved" ? (<CheckCircle size={11}/>) : (<Clock size={11}/>)}{" "}
                            {ticket.status}
                          </span>
                        </div>
                        <p style={{
                    margin: 0,
                    color: "rgba(42,37,32,0.5)",
                    fontSize: ".8rem",
                }}>
                          ID: {ticket.id} · Raised {ticket.date}
                        </p>
                      </div>
                    </div>))}
                </div>
              </motion.div>)}

            {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
            {activeTab === "notifications" &&
            (() => {
                const endDateObj = new Date(subscription.endDate);
                const today2 = new Date();
                today2.setHours(0, 0, 0, 0);
                const daysLeft = Math.max(Math.ceil((endDateObj.getTime() - today2.getTime()) /
                    (1000 * 60 * 60 * 24)), 0);
                const isExpiringSoon = daysLeft <= 10;
                const isExpiredLocal = daysLeft === 0;
                const renewalMessage = isExpiredLocal
                    ? `Your RYVIVE ${basePlan} subscription has expired. Renew now to continue.`
                    : isExpiringSoon
                        ? `Your subscription expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} on ${endDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. Renew soon!`
                        : `Your RYVIVE ${basePlan} plan renews on ${endDateObj.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.`;
                const renewalIconBg = isExpiredLocal
                    ? "rgba(198,40,40,0.1)"
                    : isExpiringSoon
                        ? "rgba(212,175,55,0.15)"
                        : "rgba(139,149,121,0.12)";
                const renewBtnStyle = isExpiredLocal
                    ? {
                        ...btnOutline,
                        color: "#c62828",
                        borderColor: "#c62828",
                        padding: ".3rem .85rem",
                        fontSize: ".78rem",
                        letterSpacing: "0.1em",
                    }
                    : isExpiringSoon
                        ? {
                            ...btnGold,
                            padding: ".3rem .85rem",
                            fontSize: ".78rem",
                        }
                        : {
                            ...btnDark,
                            padding: ".3rem .85rem",
                            fontSize: ".78rem",
                        };
                return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div style={labelStyle} className="mb-2">
                      — Updates
                    </div>
                    <h2 className="font-serif mb-1" style={{
                        fontSize: "clamp(24px,3vw,34px)",
                        color: INK,
                        fontWeight: 300,
                    }}>
                      Notifications
                    </h2>
                    <p style={{
                        fontSize: "13px",
                        color: "rgba(42,37,32,0.6)",
                        marginBottom: "2rem",
                    }}>
                      Stay updated with your wellness journey
                    </p>

                    {/* Renewal notification */}
                    <div style={{
                        ...card,
                        padding: 0,
                        overflow: "hidden",
                        marginBottom: "1rem",
                    }}>
                      <div className="flex gap-4 items-start px-6 py-5" style={{ background: CREAM }}>
                        <div style={{
                        width: 36,
                        height: 36,
                        background: renewalIconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}>
                          <Bell size={16} color={isExpiredLocal
                        ? "#c62828"
                        : isExpiringSoon
                            ? "#c8860f"
                            : SAGE_DARK}/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                        margin: "0 0 .3rem 0",
                        fontSize: ".9rem",
                        fontWeight: 500,
                        color: INK,
                        lineHeight: 1.45,
                    }}>
                            {renewalMessage}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap mt-2">
                            <p style={{
                        margin: 0,
                        fontSize: ".78rem",
                        color: "rgba(42,37,32,0.5)",
                    }}>
                              Just now
                            </p>
                            <button style={renewBtnStyle} onClick={() => setShowRenewModal(true)}>
                              Renew Now
                            </button>
                          </div>
                        </div>
                        <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: GOLD,
                        marginTop: ".3rem",
                        flexShrink: 0,
                    }}/>
                      </div>
                    </div>

                    {/* Admin notifications */}
                    {notifications.length === 0 ? (<div style={{
                            ...card,
                            padding: "2rem",
                            textAlign: "center",
                        }}>
                        <p style={{ margin: 0, color: "rgba(42,37,32,0.5)" }}>
                          No admin notifications yet
                        </p>
                      </div>) : (notifications.map((n) => (<div key={n._id} style={{
                            ...card,
                            padding: 0,
                            overflow: "hidden",
                            marginBottom: "1rem",
                        }}>
                          <div className="flex gap-4 items-start px-6 py-5">
                            <div style={{
                            width: 36,
                            height: 36,
                            background: CREAM_2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}>
                              <Bell size={15} color={SAGE_DARK}/>
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{
                            margin: "0 0 .3rem 0",
                            fontSize: ".9rem",
                            fontWeight: 600,
                            color: INK,
                        }}>
                                {n.title}
                              </p>
                              <p style={{
                            margin: "0 0 .4rem 0",
                            fontSize: ".85rem",
                            color: "rgba(42,37,32,0.65)",
                            lineHeight: 1.55,
                        }}>
                                {n.message}
                              </p>
                              <p style={{
                            margin: 0,
                            fontSize: ".75rem",
                            color: "rgba(42,37,32,0.4)",
                        }}>
                                {new Date(n.createdAt).toLocaleString("en-IN")}
                              </p>
                            </div>
                            {!n.read && (<div style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: GOLD,
                                marginTop: ".3rem",
                                flexShrink: 0,
                            }}/>)}
                          </div>
                        </div>)))}
                  </motion.div>);
            })()}
          </div>
        </main>
      </div>

      {/* ── PAUSE MODAL ────────────────────────────────────────────────────── */}
      {showPauseModal && (<div style={overlay} onClick={() => setShowPauseModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={modal} onClick={(e) => e.stopPropagation()}>
            <button style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "rgba(42,37,32,0.45)",
            }} onClick={() => setShowPauseModal(false)}>
              Close
            </button>
            <div style={labelStyle} className="mb-2">
              — Pause Request
            </div>
            <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>
              Pause Subscription
            </h3>
            <p style={{
                color: "rgba(42,37,32,0.6)",
                fontSize: ".85rem",
                marginBottom: "1.5rem",
            }}>
              Choose when to pause and resume (max 15 days)
            </p>
            <label style={{ ...labelStyle, display: "block", marginBottom: ".4rem" }}>
              Pause From
            </label>
            <input type="date" min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} value={pauseFromDate} onChange={(e) => setPauseFromDate(e.target.value)} style={{
                width: "100%",
                padding: ".7rem .9rem",
                border: `1px solid ${CARD_BORDER}`,
                background: CREAM_2,
                color: INK,
                fontSize: ".9rem",
                fontFamily: "inherit",
                marginBottom: "1rem",
                outline: "none",
            }}/>
            <label style={{ ...labelStyle, display: "block", marginBottom: ".4rem" }}>
              Pause To
            </label>
            <input type="date" min={pauseFromDate || new Date().toISOString().split("T")[0]} max={getMaxToDate()} value={pauseToDate} onChange={(e) => setPauseToDate(e.target.value)} style={{
                width: "100%",
                padding: ".7rem .9rem",
                border: `1px solid ${CARD_BORDER}`,
                background: CREAM_2,
                color: INK,
                fontSize: ".9rem",
                fontFamily: "inherit",
                marginBottom: "1rem",
                outline: "none",
            }}/>
            {pauseDays > 0 && (<div className="px-4 py-3 mb-3" style={{
                    background: CREAM_2,
                    border: `1px solid ${CARD_BORDER}`,
                    fontWeight: 500,
                    color: INK,
                    fontSize: ".88rem",
                }}>
                Duration: {pauseDays} day{pauseDays > 1 ? "s" : ""}
              </div>)}
            {pauseFromDate && pauseToDate && pauseDays > 0 && (<div className="px-4 py-4 mb-4" style={{
                    background: CREAM_2,
                    border: `1px solid ${CARD_BORDER}`,
                    fontSize: ".85rem",
                    color: INK,
                    lineHeight: 1.7,
                }}>
                <strong>Pause from:</strong> {formatDate(pauseFromDate)}
                <br />
                <strong>Pause to:</strong> {formatDate(pauseToDate)}
                <br />
                <span style={{ color: SAGE_DARK, fontWeight: 600 }}>
                  Service resumes on {getResumeNextDay()}
                </span>
              </div>)}
            <button style={{ ...btnDark, width: "100%" }} onClick={confirmPause}>
              Confirm Pause
            </button>
          </motion.div>
        </div>)}

      {/* ── RENEW MODAL ─────────────────────────────────────────────────────── */}
      {showRenewModal && (<div style={overlay} onClick={() => setShowRenewModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={{
                ...modal,
                maxWidth: basePlan === "PLATINUM" ? 480 : basePlan === "GOLD" ? 680 : 920,
            }} onClick={(e) => e.stopPropagation()}>
            <button style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                fontSize: "1rem",
                cursor: "pointer",
                color: "rgba(42,37,32,0.45)",
            }} onClick={() => setShowRenewModal(false)}>
              Close
            </button>
            <div style={labelStyle} className="mb-2">
              — Renew
            </div>
            <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>
              Renew Your Subscription
            </h3>
            <p style={{
                color: "rgba(42,37,32,0.6)",
                fontSize: ".85rem",
                marginBottom: "1.5rem",
            }}>
              Current Plan:{" "}
              <strong style={{ color: INK }}>
                RYVIVE {basePlan} · {durationMonths}M
              </strong>
            </p>
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PLAN_ORDER.filter((plan) => {
                    if (basePlan === "PLATINUM")
                        return plan === "PLATINUM";
                    if (basePlan === "GOLD")
                        return plan === "GOLD" || plan === "PLATINUM";
                    return true;
                }).length},minmax(200px,1fr))`,
                gap: "1rem",
            }}>
              {PLAN_ORDER.filter((plan) => {
                if (basePlan === "PLATINUM")
                    return plan === "PLATINUM";
                if (basePlan === "GOLD")
                    return plan === "GOLD" || plan === "PLATINUM";
                return true;
            }).map((plan) => {
                const prices = RENEWAL_PRICING[plan];
                const isSel = selectedPlan === plan;
                const isFeat = plan === "PLATINUM";
                return (<div key={plan} onClick={() => setSelectedPlan(plan)} style={{
                        border: `${isSel ? "2" : "1"}px solid ${isSel ? GOLD : isFeat ? GOLD : CARD_BORDER}`,
                        padding: "1.25rem",
                        cursor: "pointer",
                        background: isSel ? GOLD_LIGHT : CREAM,
                        position: "relative",
                        marginTop: isFeat ? "1rem" : 0,
                    }}>
                    {isFeat && plan !== basePlan && (<div style={{
                            position: "absolute",
                            top: -12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: GOLD,
                            color: DARK,
                            fontSize: ".68rem",
                            fontWeight: 700,
                            padding: ".2rem .75rem",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                        }}>
                        Most Popular
                      </div>)}
                    <h4 className="font-serif" style={{
                        color: INK,
                        marginBottom: ".75rem",
                        fontSize: "1rem",
                        fontWeight: 300,
                    }}>
                      Ryvive {plan}{" "}
                      {plan === basePlan && (<span style={{ fontSize: ".72rem", color: SAGE_DARK }}>
                          (Current)
                        </span>)}
                    </h4>
                    {["1", "3"].map((dur) => (<div key={dur} onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(plan);
                            setRenewDuration(dur);
                        }} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: `1px solid ${isSel && renewDuration === dur ? GOLD : CARD_BORDER}`,
                            padding: ".6rem .8rem",
                            marginTop: ".5rem",
                            cursor: "pointer",
                            background: isSel && renewDuration === dur ? GOLD_LIGHT : CREAM,
                        }}>
                        <div className="flex items-center gap-2">
                          <div style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            border: `1.5px solid ${isSel && renewDuration === dur ? SAGE_DARK : CARD_BORDER}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            {isSel && renewDuration === dur && (<div style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: SAGE_DARK,
                            }}/>)}
                          </div>
                          <span style={{
                            fontSize: ".83rem",
                            fontWeight: dur === "3" ? 600 : 400,
                            color: INK,
                        }}>
                            {dur === "1" ? "1 Month" : "3 Months"}
                          </span>
                        </div>
                        <span style={{
                            fontWeight: 700,
                            fontSize: ".85rem",
                            color: INK,
                        }}>
                          ₹{prices[dur].final.toLocaleString()}
                        </span>
                      </div>))}
                    <button style={{
                        ...btnDark,
                        width: "100%",
                        marginTop: ".85rem",
                        fontSize: ".82rem",
                        padding: ".6rem",
                    }} onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan);
                        setShowSummary(true);
                    }}>
                      Continue
                    </button>
                    <ul style={{
                        listStyle: "none",
                        marginTop: ".85rem",
                        padding: 0,
                    }}>
                      {PLAN_FEATURES[plan].slice(0, 3).map((f) => (<li key={f} style={{
                            fontSize: ".78rem",
                            color: "rgba(42,37,32,0.6)",
                            marginBottom: ".3rem",
                            letterSpacing: "0.02em",
                        }}>
                          • {f}
                        </li>))}
                    </ul>
                  </div>);
            })}
            </div>
          </motion.div>
        </div>)}

      {/* ── RENEWAL SUMMARY MODAL ──────────────────────────────────────────── */}
      {showSummary &&
            selectedPlan &&
            (() => {
                const p = RENEWAL_PRICING[selectedPlan]?.[renewDuration];
                if (!p)
                    return null;
                return (<div style={{ ...overlay, zIndex: 1000 }} onClick={() => setShowSummary(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.97, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} style={modal} onClick={(e) => e.stopPropagation()}>
                <button style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "1.25rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        cursor: "pointer",
                        color: "rgba(42,37,32,0.45)",
                    }} onClick={() => setShowSummary(false)}>
                  Close
                </button>
                <div style={labelStyle} className="mb-2">
                  — Summary
                </div>
                <h3 className="font-serif mb-1" style={{ color: INK, fontSize: "1.4rem", fontWeight: 300 }}>
                  Renewal Summary — {selectedPlan}
                </h3>
                <p style={{
                        color: "rgba(42,37,32,0.6)",
                        fontSize: ".85rem",
                        marginBottom: "1rem",
                    }}>
                  Review before payment
                </p>
                <select value={renewDuration} onChange={(e) => setRenewDuration(e.target.value)} style={{
                        width: "100%",
                        padding: ".7rem .9rem",
                        border: `1px solid ${CARD_BORDER}`,
                        background: CREAM_2,
                        fontSize: ".9rem",
                        fontFamily: "inherit",
                        marginBottom: "1rem",
                        color: INK,
                        outline: "none",
                        appearance: "auto",
                    }}>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months (Best Value)</option>
                </select>
                <div className="px-5 py-4 mb-4" style={{
                        background: CREAM_2,
                        border: `1px solid ${CARD_BORDER}`,
                    }}>
                  {[
                        ["Plan", `RYVIVE ${selectedPlan}`],
                        [
                            "Duration",
                            `${renewDuration} Month${renewDuration === "3" ? "s" : ""}`,
                        ],
                    ].map(([l, v]) => (<div key={l} className="flex justify-between mb-2" style={{ fontSize: ".9rem" }}>
                      <span style={{ color: "rgba(42,37,32,0.6)" }}>{l}</span>
                      <span style={{ fontWeight: 500, color: INK }}>{v}</span>
                    </div>))}
                  <div className="flex justify-between pt-3 mt-2" style={{
                        borderTop: `1px solid ${CARD_BORDER}`,
                        fontSize: "1.05rem",
                    }}>
                    <span style={{ fontWeight: 500, color: INK }}>Total</span>
                    <span className="font-serif" style={{
                        fontWeight: 300,
                        color: INK,
                        fontSize: "1.25rem",
                    }}>
                      ₹{p.final.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 mb-5" style={{
                        background: "rgba(139,149,121,0.1)",
                        border: `1px solid rgba(139,149,121,0.15)`,
                        fontSize: ".85rem",
                        color: SAGE_DARK,
                        lineHeight: 1.65,
                    }}>
                  <strong>Why renew now?</strong>
                  <br />
                  Maintain consistency, preserve savings, and continue your
                  wellness ritual.
                </div>
                <button style={{ ...btnDark, width: "100%" }} onClick={handleRenewPayment}>
                  Renew Now · ₹{p.final.toLocaleString()}
                </button>
              </motion.div>
            </div>);
            })()}

      <style>{`
        /* Minimal fallback styles while refining visuals */
        input[type="date"]:focus, textarea:focus, select:focus { border-color: #d4af37 !important; outline: none; }
        button:not(:disabled):active { opacity: 0.8; }
      `}</style>
    </div>);
}
