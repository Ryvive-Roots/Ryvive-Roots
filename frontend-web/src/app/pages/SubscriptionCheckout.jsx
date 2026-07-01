import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import Confetti from "react-confetti";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ChefHat,
  Truck,
   UtensilsCrossed, 
  CheckCircle,
} from "lucide-react";
import landing1 from '../images/Landing-1.jpeg';
import landing2 from '../images/Landing-2.jpeg';
import landing3 from '../images/Landing-3.jpeg';
import landing4 from '../images/Landing-4.jpeg';
import { useLocation } from "react-router-dom";
const SubscriptionHeader = new URL('../images/Landing-3.jpeg', import.meta.url).href;

// ─── Theme ───────────────────────────────────────────────────────────────────
const CREAM    = "#F4EFE6";
const CREAM_2  = "#EDE8DE";
const DARK     = "#14110F";
const INK      = "#2A2520";
const SAGE     = "#8B9579";
const SAGE_DARK = "#6B7560";

// ─── Data ─────────────────────────────────────────────────────────────────────
const allowedPincodes = [
  { code: "421201", area: "Dombivli East" },
  { code: "421202", area: "Dombivli West" },
  { code: "421203", area: "Manpada" },
  { code: "421204", area: "Thakurli" },
];

const plans = [
  {
    key: "silver",
    name: "RYVIVE SILVER",
    tagline: "A gentle introduction.",
 
    prices: { 1: 4999, 3: 17999 },
    apiKey: "SILVER",
  },
  {
    key: "gold",
    name: "RYVIVE GOLD",
    tagline: "Our most chosen plan.",
   
    prices: { 1: 5999, 3: 20997 },
  
    apiKey: "GOLD",
  },
  {
    key: "platinum",
    name: "RYVIVE PLATINUM",
    tagline: "A devoted ritual.",
       popular: true,
    prices: { 1: 6999, 3: 23997 },
    apiKey: "PLATINUM",
  },
];

const features = {
  PLATINUM: {
    1: ["Chef's signature menu", "3 Pauses Available", "Glow juices", "Elite combinations"],
    3: ["Premium nutrition combinations", "3 pauses / month", "Custom meal adjustments", "Priority delivery", "Exclusive chef curated dishes", "Surprise upgrades"],
  },
  GOLD: {
    1: ["4 High-protein meals / week", "2 Pauses Available", "Gut-friendly meals", "Energy juices"],
    3: ["More nutritional variety", "2 pauses / month", "Gut & Skin-Friendly Meals", "Advanced energy juices", "Boost Energy Levels", "Naturally Detoxifying Ingredients"],
  },
  SILVER: {
    1: ["Clean Meals", "No pause available", "Easy Digestion", "Weekly Variety"],
    3: ["Clean Meals", "1 pause available / month", "Easy Digestion", "Weekly Variety", "Functional Juices", "No calorie stress"],
  },
};

const steps = [
  { n: 1, label: "Plan Selection" },
  { n: 2, label: "Personal Details" },
  { n: 3, label: "Health Information" },
  { n: 4, label: "Delivery Details" },
  { n: 5, label: "Review & Pay" },
];

const ease = [0.22, 1, 0.36, 1];

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(42,37,32,0.25)",
  padding: "14px 2px",
  fontSize: "15px",
  color: INK,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.3s ease",
};

const labelStyle = {
  fontSize: "10px",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: SAGE_DARK,
  marginBottom: "4px",
  display: "block",
};

// ─── CustomSelect ─────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full" style={{ opacity: disabled ? 0.4 : 1 }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between"
        style={{
          ...inputStyle,
          borderBottomColor: open ? SAGE_DARK : "rgba(42,37,32,0.25)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <span style={{ color: value ? INK : "rgba(42,37,32,0.5)" }}>
          {value
            ? options.find((o) => o.value === value)?.label
            : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && !disabled && (
            <div
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={14} color="rgba(42,37,32,0.5)" />
            </div>
          )}
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <ChevronDown size={16} color="rgba(42,37,32,0.5)" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease }}
              className="absolute left-0 right-0 z-50 mt-1 py-1 rounded-sm overflow-hidden"
              style={{
                background: CREAM_2,
                border: "1px solid rgba(42,37,32,0.08)",
                boxShadow: "0 10px 30px -10px rgba(42,37,32,0.15)",
              }}
            >
              {options.map((opt) => {
                const isSel = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#f2efe9] transition-colors"
                    style={{ background: isSel ? "rgba(42,37,32,0.04)" : "transparent" }}
                  >
                    <span style={{ fontSize: "14px", color: isSel ? INK : "rgba(42,37,32,0.85)", fontWeight: isSel ? 400 : 300 }}>
                      {opt.label}
                    </span>
                    {isSel && <Check size={14} color={SAGE_DARK} />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const subscriptionTestimonials = [
  {
    rating: "★★★★★",
    text: "Meals arrive fresh every day and have completely changed my routine. The packaging is clean and temperature-controlled.",
    name: "Aarav Mehta",
    label: "Verified Subscriber"
  },
  {
    rating: "★★★★★",
    text: "Finally found a meal subscription that actually tastes homemade. Every dish is seasoned perfectly without feeling heavy.",
    name: "Riya Sen",
    label: "Verified Subscriber"
  },
  {
    rating: "★★★★★",
    text: "The delivery schedule is reliable and the food quality is exceptional. Customer service is also incredibly accommodating.",
    name: "Kabir Malhotra",
    label: "Verified Subscriber"
  }
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SubscriptionCheckout() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [membershipId, setMembershipId] = useState("");
   const [currentIndex, setCurrentIndex] = useState(0);
     const [isHovered, setIsHovered] = useState(false);
  const [showSuccessPopper, setShowSuccessPopper] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });
 const visibleCards = 1;
  // Plan state
  const [selectedPlan, setSelectedPlan] = useState("gold");
  const [durations, setDurations] = useState({ silver: 1, gold: 1, platinum: 1 });

  // Personal info
  const [info, setInfo] = useState(() =>
    JSON.parse(localStorage.getItem("ryvive_info") || "null") || {
      firstName: "", lastName: "", phone: "", email: "", dob: "",
    }
  );

  // Health info
  const [health, setHealth] = useState(() =>
    JSON.parse(localStorage.getItem("ryvive_health") || "null") || {
      allergies: "", medical: "",
    }
  );

  // Delivery
  const [delivery, setDelivery] = useState(() =>
    JSON.parse(localStorage.getItem("ryvive_delivery") || "null") || {
      pincode: "", house: "", street: "", landmark: "",
      morningSlot: "", eveningSlot: "",
    }
  );

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("ryvive_info", JSON.stringify(info)); }, [info]);
  useEffect(() => { localStorage.setItem("ryvive_health", JSON.stringify(health)); }, [health]);
  useEffect(() => { localStorage.setItem("ryvive_delivery", JSON.stringify(delivery)); }, [delivery]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    useEffect(() => {
      if (isHovered)
        return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = subscriptionTestimonials.length - visibleCards;
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 2800);
      return () => clearInterval(interval);
    }, [isHovered]);
    const handleNextTestimonial = () => {
      setCurrentIndex((prev) => {
        const maxIndex = subscriptionTestimonials.length - visibleCards;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    };
    const handlePrevTestimonial = () => {
      setCurrentIndex((prev) => {
        const maxIndex = subscriptionTestimonials.length - visibleCards;
        return prev === 0 ? maxIndex : prev - 1;
      });
    };

  // Check for payment return (membershipId in URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mid = params.get("membershipId");
    if (mid) {
      setMembershipId(mid);
      setShowSuccessPopper(true);
      localStorage.removeItem("ryvive_info");
      localStorage.removeItem("ryvive_health");
      localStorage.removeItem("ryvive_delivery");
    }
  }, [location.search]);

  const current = plans.find((p) => p.key === selectedPlan);
  const currentDuration = durations[selectedPlan] ?? 1;
  const currentPrice = current.prices[currentDuration];

  // Validation per step
  const isStepValid = () => {
    if (step === 1) return true; // plan always selected
    if (step === 2)
      return info.firstName && info.lastName && info.phone && info.email && info.dob;
    if (step === 3) return true; // health is optional
    if (step === 4)
      return (
        delivery.pincode &&
        delivery.house &&
        delivery.street &&
        (delivery.morningSlot || delivery.eveningSlot)
      );
    if (step === 5) return termsAgreed;
    return true;
  };

  // Payment handler
  const handlePayment = async () => {
    if (loadingOrder) return;
    try {
      setLoadingOrder(true);
      const chosenSlot = delivery.morningSlot
        ? `Morning - ${delivery.morningSlot}`
        : `Evening - ${delivery.eveningSlot}`;

      const res = await fetch(
        "https://api.ryviveroots.com/api/payment/easebuzz/initiate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: info.firstName,
            lastname: info.lastName,
            email: info.email,
            phone: info.phone,
            plan: `${current.apiKey}_${currentDuration}MONTH`,
            formData: {
              ...info,
              ...health,
              slot: chosenSlot,
              pincode: delivery.pincode,
              house: delivery.house,
              street: delivery.street,
              landmark: delivery.landmark,
            },
          }),
        }
      );
      const data = await res.json();
      if (!data.success || !data.access_key) {
        alert("Payment initiation failed. Please try again.");
        return;
      }
      window.location.href = `https://pay.easebuzz.in/pay/${data.access_key}`;
    } catch (err) {
      console.error("Easebuzz error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingOrder(false);
    }
  };

 const scrollToTop = () => {
  // Only for mobile devices
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      const el = document.getElementById("checkout-top");
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 80);
  }
};

  const goNext = () => {
    if (step < 5) { setStep(step + 1); scrollToTop(); }
  };

  const goBack = () => {
    if (step > 1) { setStep(step - 1); scrollToTop(); }
  };

  // ─── Success screen ───────────────────────────────────────────────────────
  if (showSuccessPopper) {
    return (
      <>
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          gravity={0.25}
          recycle={false}
        />
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(20,17,15,0.6)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-[90%] max-w-md p-8 text-center"
            style={{
              background: CREAM,
              borderRadius: "4px",
              boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(139,149,121,0.2)",
            }}
          >
            <CheckCircle size={72} className="mx-auto mb-5" style={{ color: SAGE }} />
            <h2 className="font-serif" style={{ fontSize: "26px", color: INK, fontWeight: 300, marginBottom: "8px" }}>
              Payment Successful
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(42,37,32,0.65)", lineHeight: 1.7, marginBottom: "24px" }}>
              Your membership has been activated. Welcome to Ryvive.
            </p>
            <div
              className="py-5 px-6 mb-6"
              style={{
                background: "rgba(139,149,121,0.1)",
                border: "1px solid rgba(139,149,121,0.25)",
                borderRadius: "2px",
              }}
            >
              <p className="tracking-[0.28em] uppercase mb-2" style={{ fontSize: "10px", color: SAGE_DARK }}>
                Membership ID
              </p>
              <p className="font-serif" style={{ fontSize: "22px", color: INK, fontWeight: 400 }}>
                {membershipId}
              </p>
            </div>
            <button
              onClick={() => { setShowSuccessPopper(false); window.location.replace("/login"); }}
              className="w-full py-4 tracking-[0.28em] uppercase transition-all"
              style={{
                fontSize: "11px",
                background: INK,
                color: CREAM,
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── Main layout ──────────────────────────────────────────────────────────
  return (
    <div
      id="checkout-top"
      className="min-h-screen"
      style={{ background: CREAM, scrollMarginTop: "80px" }}
    >
      {/* Hero */}
      {/* HERO — DARK with overlay image */}
         <section className="relative min-h-[68vh] flex items-center overflow-hidden" style={{ background: DARK }}>
           <div className="absolute inset-0">
             <ImageWithFallback src={SubscriptionHeader} alt="Subscription Header" style={{
               width: '100%',
               height: '100%',
               objectFit: 'cover',
               objectPosition: 'center',
             }} />
             <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,15,0.55) 0%, rgba(20,17,15,0.55) 50%, rgba(20,17,15,0.96) 100%)' }} />
           </div>
           <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-14 w-full pt-32 lg:pt-40 pb-16 lg:pb-24 text-center">
             <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
               <div className="inline-block px-4 py-1.5 rounded-full border mb-8 backdrop-blur-[6px] tracking-[0.42em] uppercase" style={{
                 fontSize: '10px',
                 color: CREAM,
                 borderColor: 'rgba(139,149,121,0.4)',
                 background: 'rgba(139,149,121,0.1)',
                 fontWeight: 500
               }}>
                 — Membership
               </div>
               <h1 className="font-serif mx-auto" style={{ fontSize: 'clamp(40px, 6.4vw, 86px)', lineHeight: 1.02, color: CREAM, fontWeight: 300, letterSpacing: '-0.015em', maxWidth: '900px' }}>
                 A daily ritual,<br />
                 <em style={{ fontStyle: 'italic', color: SAGE }}>delivered.</em>
               </h1>
               <p className="mx-auto mt-8" style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(244,239,230,0.7)', maxWidth: '520px' }}>
                 Choose the nourishment plan that fits your lifestyle.
               </p>
             </motion.div>
           </div>
         </section>

      {/* Main split */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-14 py-10 lg:py-16">
        <div className="grid lg:grid-cols-[minmax(240px,28%)_minmax(0,72%)] gap-5 xl:gap-8">

          {/* ── Left sidebar ───────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-[100px] self-start">
            <div
              className="p-6 lg:p-8"
              style={{
                background: "rgba(237,232,222,0.94)",
                backdropFilter: "blur(12px)",
                borderRadius: "2px",
                border: "1px solid rgba(42,37,32,0.07)",
              }}
            >
              <div
                className="tracking-[0.42em] uppercase mb-7"
                style={{ fontSize: "10px", color: SAGE_DARK, fontWeight: 600 }}
              >
                — Your Journey
              </div>

              <ol className="space-y-6">
                {steps.map((s) => {
                  const isDone = step > s.n;
                  const isActive = step === s.n;
                  return (
                    <li key={s.n} className="flex items-center gap-4">
                      <motion.div
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex-shrink-0 flex items-center justify-center font-serif"
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: `1px solid ${isDone || isActive ? INK : "rgba(42,37,32,0.18)"}`,
                          background: isDone || isActive ? INK : "transparent",
                          color: isDone || isActive ? CREAM : "rgba(42,37,32,0.55)",
                          fontSize: "13px",
                        }}
                      >
                        {isDone ? <Check size={14} strokeWidth={1.5} /> : s.n}
                      </motion.div>
                      <div>
                        <div
                          className="tracking-[0.22em] uppercase"
                          style={{ fontSize: "9px", color: isActive ? INK : "rgba(42,37,32,0.4)" }}
                        >
                          Step {s.n}
                        </div>
                        <div style={{ fontSize: "13px", color: isActive ? INK : "rgba(42,37,32,0.5)", marginTop: "2px" }}>
                          {s.label}
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="step-indicator"
                            style={{ width: "20px", height: "1px", background: SAGE_DARK, marginTop: "6px" }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Plan summary in sidebar */}
              <div
                className="mt-8 pt-6"
                style={{ borderTop: "1px solid rgba(42,37,32,0.1)" }}
              >
                <div className="font-serif" style={{ fontSize: "20px", color: INK, fontWeight: 300 }}>
                  {current.name}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(42,37,32,0.55)", marginTop: "4px" }}>
                  ₹{currentPrice.toLocaleString("en-IN")} /{" "}
                  {currentDuration === 1 ? "month" : "3 months"}
                </div>
                <div style={{ fontSize: "12px", color: SAGE_DARK, marginTop: "2px" }}>
                  {current.meals}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main panel ─────────────────────────────────────────────────── */}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
                className="p-6 sm:p-8 lg:p-10"
                style={{
                  background: "rgba(237,232,222,0.7)",
                  borderRadius: "2px",
                  border: "1px solid rgba(42,37,32,0.07)",
                  minHeight: "460px",
                }}
              >
                {step === 1 && (
                  <PlanStep
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    durations={durations}
                    setDurations={setDurations}
                    onContinue={goNext}
                  />
                )}
                {step === 2 && <PersonalStep info={info} setInfo={setInfo} />}
                {step === 3 && <HealthStep health={health} setHealth={setHealth} />}
                {step === 4 && (
                  <DeliveryStep delivery={delivery} setDelivery={setDelivery} />
                )}
                {step === 5 && (
                  <ReviewStep
                    plan={current}
                    durationMonths={currentDuration}
                    price={currentPrice}
                    info={info}
                    health={health}
                    delivery={delivery}
                    termsAgreed={termsAgreed}
                    setTermsAgreed={setTermsAgreed}
                    loadingOrder={loadingOrder}
                    onPay={handlePayment}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 5 && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={goBack}
                  disabled={step === 1}
                  className="flex items-center gap-3 px-5 py-3.5 tracking-[0.22em] uppercase transition-all"
                  style={{
                    fontSize: "11px",
                    color: step === 1 ? "rgba(42,37,32,0.3)" : INK,
                    border: `1px solid ${step === 1 ? "rgba(42,37,32,0.15)" : "rgba(42,37,32,0.35)"}`,
                    background: "transparent",
                    borderRadius: "1px",
                    cursor: step === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ArrowLeft size={14} strokeWidth={1.4} /> Back
                </motion.button>

                <motion.button
                  whileTap={{ scale: isStepValid() ? 0.97 : 1 }}
                  whileHover={{ scale: isStepValid() ? 1.02 : 1 }}
                  onClick={isStepValid() ? goNext : undefined}
                  disabled={!isStepValid()}
                  className="flex items-center gap-3 px-7 sm:px-9 py-3.5 tracking-[0.22em] uppercase transition-all"
                  style={{
                    fontSize: "11px",
                    background: isStepValid() ? INK : "rgba(42,37,32,0.3)",
                    color: CREAM,
                    border: "1px solid transparent",
                    borderRadius: "1px",
                    cursor: isStepValid() ? "pointer" : "not-allowed",
                  }}
                >
                  Continue <ArrowRight size={14} strokeWidth={1.4} />
                </motion.button>
              </div>
            )}

            {!isStepValid() && step < 5 && (
              <p style={{ fontSize: "12px", color: "#c46955", marginTop: "10px" }}>
                Please fill all required fields to continue.
              </p>
            )}
          </main>
        </div>
      </div>

        <section className="px-8 lg:px-14 py-14 lg:py-16 relative overflow-hidden" style={{
            background: CREAM_2,
          }} data-tone="light">
            {/* Subtle Luxury Visual Overlays and Gradients */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,24,20,0.04) 0%, rgba(28,24,20,0.01) 30%, rgba(28,24,20,0.05) 100%)' }} />
              <div style={{ position: 'absolute', left: '-10%', top: '-6%', width: '34%', height: '64%', background: 'radial-gradient(closest-side, rgba(139,149,121,0.14), transparent 60%)', filter: 'blur(56px)', opacity: 0.95 }} />
              <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '34%', height: '64%', background: 'radial-gradient(closest-side, rgba(28,24,20,0.08), transparent 62%)', filter: 'blur(56px)', opacity: 0.8 }} />
      
              {/* Low-opacity Blurred Food Accents */}
              <div className="absolute inset-0 opacity-[0.025] select-none" style={{ mixBlendMode: 'multiply' }}>
                <img src={landing2} alt="" className="absolute -left-[10%] -bottom-[6%] w-[38%] aspect-square object-cover rounded-full filter blur-[40px] saturate-[0.8]" />
                <img src={landing3} alt="" className="absolute -right-[10%] -top-[6%] w-[38%] aspect-square object-cover rounded-full filter blur-[40px] saturate-[0.8]" />
              </div>
            </div>
      
            <div className="max-w-[1400px] mx-auto relative z-10">
              <div className="text-center mb-10 lg:mb-12">
                <p className="uppercase tracking-[0.28em] mb-4" style={{
                  color: SAGE_DARK,
                  fontSize: '11px',
                }}>
                  How It Works
                </p>
      
                <h2 className="font-serif mx-auto" style={{
                  color: INK,
                  fontSize: 'clamp(34px, 4.8vw, 58px)',
                  lineHeight: '0.96',
                  fontWeight: 300,
                  maxWidth: '900px',
                }}>
                  Simple steps to eat
                  <br />
                  better every day
                </h2>
              </div>
      
              <div className="relative">
                {/* Soft Premium Connecting Line Glow */}
                <div className="hidden lg:block absolute left-[10%] right-[10%] top-10 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(107,117,96,0.15) 15%, rgba(139,149,121,0.4) 50%, rgba(107,117,96,0.15) 85%, transparent 100%)' }} />
                <div className="hidden lg:flex absolute left-[13%] right-[13%] top-[34px] items-center justify-between pointer-events-none">
                  <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: SAGE, opacity: 0.55, boxShadow: '0 0 8px rgba(139,149,121,0.4)' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: SAGE_DARK, opacity: 0.55, boxShadow: '0 0 8px rgba(107,117,96,0.4)' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: SAGE, opacity: 0.55, boxShadow: '0 0 8px rgba(139,149,121,0.4)' }} />
                </div>
      
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-4">
                  {[
                    {
                      number: '01',
                      title: 'Choose Your Plan',
                      desc: 'Select from Silver, Gold, or Platinum nourishment rituals curated for your lifestyle.',
                      icon: ChefHat,
                    },
                    {
                      number: '02',
                      title: 'Schedule Delivery',
                      desc: 'Choose your preferred delivery cadence for effortless morning or evening nourishment.',
                      icon: Truck,
                    },
                    {
                      number: '03',
                      title: 'Receive Daily',
                      desc: 'Freshly prepared wellness meals arrive daily with seamless concierge-style delivery.',
                      icon: UtensilsCrossed,
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (<motion.div key={index} whileHover={{
                      y: -6,
                      scale: 1.015,
                      boxShadow: '0 20px 40px -16px rgba(14,41,27,0.14), 0 0 0 1px rgba(255,255,255,0.95) inset',
                      borderColor: 'rgba(107,117,96,0.35)'
                    }} whileTap={{ y: -3, scale: 1.01 }} transition={{ duration: 0.45, ease }} className="relative overflow-hidden" style={{
                      minHeight: '235px',
                      padding: '20px 20px 18px',
                      borderRadius: '12px',
                      background: 'rgba(248,244,237,0.95)',
                      border: '1px solid rgba(107,117,96,0.16)',
                      boxShadow: '0 15px 35px -20px rgba(14,41,27,0.1), 0 0 0 1px rgba(255,255,255,0.7) inset',
                      backdropFilter: 'blur(8px)',
                      transitionProperty: 'transform, box-shadow, border-color',
                    }}>
                      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 28%, rgba(28,24,20,0.02) 100%)' }} />
                        <div style={{ position: 'absolute', right: '-12%', top: '-18%', width: '58%', height: '72%', background: 'radial-gradient(closest-side, rgba(139,149,121,0.15), transparent 68%)', filter: 'blur(26px)', opacity: 0.75 }} />
                      </div>
      
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="font-serif" style={{
                              fontSize: 'clamp(28px, 3.8vw, 48px)',
                              lineHeight: 0.9,
                              color: SAGE_DARK,
                              opacity: 0.75,
                              letterSpacing: '-0.04em',
                              fontWeight: 600,
                            }}>
                              {item.number}
                            </div>
                            <div className="mt-2" style={{
                              width: '36px',
                              height: '1px',
                              background: `linear-gradient(90deg, ${SAGE} 0%, ${SAGE_DARK} 100%)`,
                              opacity: 0.8,
                            }} />
                          </div>
      
                          {/* Refined Icon Visibility with SAGE colors */}
                          <div className="flex items-center justify-center transition-colors duration-300" style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '999px',
                            background: 'rgba(107,117,96,0.06)',
                            border: '1px solid rgba(107,117,96,0.15)',
                          }}>
                            <Icon size={24} strokeWidth={1.35} color={SAGE_DARK} />
                          </div>
                        </div>
      
                        <h3 className="font-serif" style={{
                          color: INK,
                          fontSize: 'clamp(18px, 2.2vw, 24px)',
                          lineHeight: 1.1,
                          marginBottom: '8px',
                          fontWeight: 600,
                        }}>
                          {item.title}
                        </h3>
      
                        <p style={{
                          color: 'rgba(28,24,20,0.76)',
                          fontSize: '14px',
                          lineHeight: 1.65,
                          marginBottom: '12px',
                          maxWidth: '24ch',
                        }}>
                          {item.desc}
                        </p>
      
                        <div className="mt-auto flex items-center justify-between gap-4 pt-3.5" style={{ borderTop: '1px solid rgba(28,24,20,0.08)' }}>
                          <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(28,24,20,0.52)' }}>
      
                          </div>
                          <div style={{ width: '24px', height: '1px', background: 'rgba(28,24,20,0.22)' }} />
                        </div>
                      </div>
                    </motion.div>);
                  })}
                </div>
              </div>
            </div>
          </section>
      
          {/* SUBSCRIBER TESTIMONIALS SECTION — DARK LUXURY (MATCHES HOMEPAGE DESIGN SYSTEM EXACTLY IN STRUCTURE, BUT WITH SUBTLE ELEVATED DARK PANELS) */}
          <section 
            data-tone="dark" 
            className="py-10 lg:py-12 relative overflow-hidden" 
            style={{ background: '#0D0A09' }}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="max-w-[1100px] mx-auto px-8 lg:px-14 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-6 lg:mb-8 relative">
                <div className="tracking-[0.42em] uppercase mb-5" style={{ fontSize: '11px', color: SAGE, fontWeight: 600 }}>— Voices</div>
                <h2 className="font-serif" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', lineHeight: 1.1, color: CREAM, fontWeight: 300 }}>
                  SUBSCRIBER DIARIES
                </h2>
              </div>
      
              {/* Testimonials Carousel Track Container with swipe controls */}
              <div className="relative w-full max-w-2xl mx-auto overflow-hidden py-2">
                <motion.div 
                  className="flex gap-12 items-stretch" 
                  animate={{ x: `calc(-${currentIndex} * (100% + 48px) / ${visibleCards})` }} 
                  transition={{ type: "spring", stiffness: 90, damping: 18 }} 
                  onPanEnd={(event, info) => {
                    const threshold = 50;
                    if (info.offset.x < -threshold) {
                      handleNextTestimonial();
                    }
                    else if (info.offset.x > threshold) {
                      handlePrevTestimonial();
                    }
                  }}
                >
                  {subscriptionTestimonials.map((t, idx) => (
                    <div 
                      key={idx} 
                      className="flex-shrink-0 flex flex-col justify-between text-left" 
                      style={{
                        width: `calc((100% - ${(visibleCards - 1) * 48}px) / ${visibleCards})`,
                        background: '#13100E',
                        border: '1px solid rgba(244, 239, 230, 0.04)',
                        borderRadius: '3px',
                        padding: '36px 36px 32px',
                        boxShadow: '0 16px 40px -10px rgba(0,0,0,0.35)',
                      }}
                    >
                      {/* Testimonial Quote Text in Warm Ivory (matching homepage styling) */}
                      <div className="font-serif mb-6" style={{ fontSize: '22px', lineHeight: 1.6, color: CREAM, fontWeight: 300, fontStyle: 'italic' }}>
                        “{t.text}”
                      </div>
                      
                      {/* Testimonial Divider & Client Name */}
                      <div className="pt-4" style={{ borderTop: '1px solid rgba(244,239,230,0.08)' }}>
                        <div style={{ fontSize: '13px', color: '#FFFFFF', letterSpacing: '0.04em', fontWeight: 600 }}>{t.name}</div>
                        <div className="tracking-[0.22em] uppercase mt-1" style={{ fontSize: '10px', color: SAGE, fontWeight: 500 }}>{t.label}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
      
              {/* Left/Right Navigation and Autoplay Indicators */}
              <div className="flex items-center justify-center gap-6 mt-6">
                {/* Left Arrow Button */}
                <button 
                  onClick={handlePrevTestimonial} 
                  className="p-3 rounded-full border transition-all duration-300 group cursor-pointer" 
                  style={{
                    borderColor: 'rgba(244, 239, 230, 0.15)',
                    background: 'rgba(244, 239, 230, 0.01)',
                    backdropFilter: 'blur(8px)',
                    borderWidth: '1px'
                  }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 239, 230, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(244, 239, 230, 0.3)';
                  }} 
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 239, 230, 0.01)';
                    e.currentTarget.style.borderColor = 'rgba(244, 239, 230, 0.15)';
                  }}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={16} style={{ color: CREAM }}/>
                </button>
                
                {/* Dynamic Slider Pagination Dots */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: subscriptionTestimonials.length - visibleCards + 1 }).map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentIndex(index)} 
                      className="h-1.5 rounded-full transition-all duration-500 cursor-pointer" 
                      style={{
                        width: currentIndex === index ? '18px' : '6px',
                        background: currentIndex === index ? SAGE : 'rgba(244, 239, 230, 0.15)'
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
      
                {/* Right Arrow Button */}
                <button 
                  onClick={handleNextTestimonial} 
                  className="p-3 rounded-full border transition-all duration-300 group cursor-pointer" 
                  style={{
                    borderColor: 'rgba(244, 239, 230, 0.15)',
                    background: 'rgba(244, 239, 230, 0.01)',
                    backdropFilter: 'blur(8px)',
                    borderWidth: '1px'
                  }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 239, 230, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(244, 239, 230, 0.3)';
                  }} 
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 239, 230, 0.01)';
                    e.currentTarget.style.borderColor = 'rgba(244, 239, 230, 0.15)';
                  }}
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={16} style={{ color: CREAM }}/>
                </button>
              </div>
            </div>
          </section>
    </div>
  );
}

// ─── Step 1: Plan Selection ────────────────────────────────────────────────────
function PlanStep({ selectedPlan, setSelectedPlan, durations, setDurations, onContinue }) {
  const durationOptions = [1, 3];

  const updateDuration = (planKey, duration) => {
    setSelectedPlan(planKey);
    setDurations((prev) => ({ ...prev, [planKey]: duration }));
  };

  return (
    <div>
      <h2 className="font-serif mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)", color: INK, fontWeight: 300, lineHeight: 1.1 }}>
        Select your <em style={{ fontStyle: "italic" }}>plan.</em>
      </h2>
      <p className="mb-8" style={{ fontSize: "14px", color: "rgba(42,37,32,0.6)", lineHeight: 1.8 }}>
        Choose the nourishment plan that fits your lifestyle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, i) => {
          const isSel = selectedPlan === p.key;
          const duration = durations[p.key] ?? 1;
          const price = p.prices[duration];

          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: isSel ? -6 : 0, scale: isSel ? 1.02 : 1 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease }}
              whileHover={!isSel ? { y: -4, scale: 1.01 } : undefined}
              className="relative p-6 flex flex-col"
              style={{
                background: isSel ? INK : "rgba(244,239,230,0.7)",
                color: isSel ? CREAM : INK,
                border: `1.5px solid ${isSel ? SAGE : p.popular ? SAGE_DARK : "rgba(42,37,32,0.1)"}`,
                borderRadius: "3px",
                boxShadow: isSel
                  ? "0 30px 60px -15px rgba(14,41,27,0.35)"
                  : "0 6px 24px -12px rgba(42,37,32,0.08)",
                cursor: "pointer",
              }}
              onClick={() => setSelectedPlan(p.key)}
            >
              {p.popular && (
                <div
                  className="absolute -top-3 left-6 px-3 py-1 tracking-[0.28em] uppercase"
                  style={{ fontSize: "9px", background: SAGE, color: DARK, borderRadius: "2px", fontWeight: 500 }}
                >
                  Most Popular
                </div>
              )}

              <div className="tracking-[0.35em] uppercase mb-3" style={{ fontSize: "10px", color: isSel ? SAGE : SAGE_DARK }}>
                Plan
              </div>
              <div className="font-serif mb-1" style={{ fontSize: "22px", fontWeight: 300, lineHeight: 1.1 }}>
                {p.name}
              </div>
              <div style={{ fontSize: "13px", color: isSel ? "rgba(244,239,230,0.65)" : "rgba(42,37,32,0.55)", fontStyle: "italic", marginBottom: "16px" }}>
                {p.tagline}
              </div>

              {/* Duration toggle */}
              <div
                className="mb-4 inline-flex rounded-full p-1 border relative overflow-hidden self-start"
                style={{
                  borderColor: isSel ? "rgba(244,239,230,0.2)" : "rgba(42,37,32,0.12)",
                  background: isSel ? "rgba(244,239,230,0.06)" : "rgba(255,255,255,0.4)",
                }}
              >
                {durationOptions.map((months) => {
                  const active = duration === months;
                  return (
                    <button
                      key={months}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); updateDuration(p.key, months); }}
                      className="relative z-10 tracking-[0.18em] uppercase transition-all px-3 py-1.5"
                      style={{
                        fontSize: "10px",
                        borderRadius: "999px",
                        background: active ? (isSel ? CREAM : INK) : "transparent",
                        color: active ? (isSel ? INK : CREAM) : isSel ? "rgba(244,239,230,0.6)" : "rgba(42,37,32,0.55)",
                        fontWeight: active ? 500 : 300,
                        transition: "all 0.25s ease",
                      }}
                    >
                      {months === 1 ? "1 Month" : "3 Months"}
                    </button>
                  );
                })}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1">
                <span style={{ fontSize: "13px", opacity: 0.55 }}>₹</span>
                <span className="font-serif" style={{ fontSize: "34px", fontWeight: 300, lineHeight: 1 }}>
                  {price.toLocaleString("en-IN")}
                </span>
                 <div
                className="tracking-[0.22em] uppercase mb-5"
                style={{ fontSize: "10px", opacity: 0.6 }}
              >
                / {duration === 1 ? "month" : "3 months"} · {p.meals}
              </div>
              </div>
             

              {/* Features */}
              <ul className="flex flex-col gap-y-2 mb-6 flex-1" style={{ borderTop: `1px solid ${isSel ? "rgba(244,239,230,0.12)" : "rgba(42,37,32,0.08)"}`, paddingTop: "16px" }}>
                {features[p.key.toUpperCase()][duration].map((f) => (
                  <li key={f} className="flex items-start gap-2.5" style={{ fontSize: "13px", lineHeight: 1.5 }}>
                    <Check size={14} strokeWidth={1.5} style={{ color: isSel ? SAGE : SAGE_DARK, marginTop: "2px", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => { if (isSel) { onContinue(); } else { setSelectedPlan(p.key); } }}
                className="w-full py-3.5 tracking-[0.28em] uppercase text-center transition-all"
                style={{
                  fontSize: "11px",
                  background: isSel ? SAGE : "transparent",
                  color: isSel ? DARK : INK,
                  border: `1px solid ${isSel ? SAGE : "rgba(42,37,32,0.35)"}`,
                  borderRadius: "2px",
                  cursor: "pointer",
                }}
              >
                {isSel ? "Continue →" : "Select Plan"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Personal Details ─────────────────────────────────────────────────
function PersonalStep({ info, setInfo }) {
  const onFocus = (e) => { e.currentTarget.style.borderBottomColor = SAGE_DARK; };
  const onBlur = (e) => { e.currentTarget.style.borderBottomColor = "rgba(42,37,32,0.25)"; };

  return (
    <div>
      <h2 className="font-serif mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)", color: INK, fontWeight: 300 }}>
        Personal <em style={{ fontStyle: "italic" }}>details.</em>
      </h2>
      <p className="mb-8" style={{ fontSize: "14px", color: "rgba(42,37,32,0.6)", lineHeight: 1.8 }}>
        So we know who to take care of.
      </p>
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {[
          { label: "First Name", key: "firstName", type: "text" },
          { label: "Last Name", key: "lastName", type: "text" },
          { label: "Phone Number", key: "phone", type: "tel" },
          { label: "Email ID", key: "email", type: "email" },
          { label: "Date of Birth", key: "dob", type: "date" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type}
              value={info[key]}
              onChange={(e) => {
                let val = e.target.value;
                if (key === "phone") val = val.replace(/\D/g, "").slice(0, 10);
                setInfo({ ...info, [key]: val });
              }}
              style={{ ...inputStyle, color: info[key] ? INK : "rgba(42,37,32,0.5)" }}
              onFocus={onFocus}
              onBlur={onBlur}
              maxLength={key === "phone" ? 10 : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Health Information ───────────────────────────────────────────────
function HealthStep({ health, setHealth }) {
  const onFocus = (e) => { e.currentTarget.style.borderBottomColor = SAGE_DARK; };
  const onBlur = (e) => { e.currentTarget.style.borderBottomColor = "rgba(42,37,32,0.25)"; };

  return (
    <div>
      <h2 className="font-serif mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)", color: INK, fontWeight: 300 }}>
        Health <em style={{ fontStyle: "italic" }}>information.</em>
      </h2>
      <p className="mb-8" style={{ fontSize: "14px", color: "rgba(42,37,32,0.6)", lineHeight: 1.8 }}>
        Optional — but knowing helps us take better care of you.
      </p>
      <div className="flex flex-col gap-8">
        <div>
          <label style={labelStyle}>Allergies (if any)</label>
          <input
            value={health.allergies}
            onChange={(e) => setHealth({ ...health, allergies: e.target.value })}
            placeholder="e.g. Peanuts, Dairy"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>Medical Conditions (optional)</label>
          <textarea
            value={health.medical}
            rows={3}
            onChange={(e) => setHealth({ ...health, medical: e.target.value })}
            placeholder="Please mention any conditions we should be aware of…"
            style={{ ...inputStyle, resize: "none", paddingTop: "10px" }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <p style={{ fontSize: "12px", color: "rgba(42,37,32,0.45)", marginTop: "-12px" }}>
          Your health information is kept strictly private.
        </p>
      </div>
    </div>
  );
}

// ─── Step 4: Delivery Details ─────────────────────────────────────────────────
function DeliveryStep({ delivery, setDelivery }) {
  const onFocus = (e) => { e.currentTarget.style.borderBottomColor = SAGE_DARK; };
  const onBlur = (e) => { e.currentTarget.style.borderBottomColor = "rgba(42,37,32,0.25)"; };

  return (
    <div>
      <h2 className="font-serif mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)", color: INK, fontWeight: 300 }}>
        Delivery <em style={{ fontStyle: "italic" }}>details.</em>
      </h2>
      <p className="mb-8" style={{ fontSize: "14px", color: "rgba(42,37,32,0.6)", lineHeight: 1.8 }}>
        Where and when shall we send your daily ritual?
      </p>
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {/* Pincode dropdown */}
        <div>
          <label style={labelStyle}>Pincode</label>
          <CustomSelect
            value={delivery.pincode}
            onChange={(val) => setDelivery({ ...delivery, pincode: val })}
            options={allowedPincodes.map((p) => ({
              value: p.code,
              label: `${p.code} — ${p.area}`,
            }))}
            placeholder="Select your pincode"
          />
        </div>

        <div>
          <label style={labelStyle}>House / Flat No.</label>
          <input
            value={delivery.house}
            onChange={(e) => setDelivery({ ...delivery, house: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>Street / Area</label>
          <input
            value={delivery.street}
            onChange={(e) => setDelivery({ ...delivery, street: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <div>
          <label style={labelStyle}>Landmark (Optional)</label>
          <input
            value={delivery.landmark}
            onChange={(e) => setDelivery({ ...delivery, landmark: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {/* Read-only city/state */}
        <div>
          <label style={labelStyle}>City</label>
          <input value="Dombivli" readOnly style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input value="Maharashtra, India" readOnly style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
        </div>

        {/* Morning slot */}
        <div>
          <label style={labelStyle}>Morning Delivery Slot</label>
          <CustomSelect
            value={delivery.morningSlot}
            onChange={(val) => setDelivery({ ...delivery, morningSlot: val })}
            options={[
              { value: "08:00 – 09:00 AM", label: "08:00 AM – 09:00 AM" },
              { value: "09:00 – 10:00 AM", label: "09:00 AM – 10:00 AM" },
              { value: "10:00 – 11:00 AM", label: "10:00 AM – 11:00 AM" },
            ]}
            placeholder="Select morning slot"
            disabled={!!delivery.eveningSlot}
          />
        </div>

        {/* Evening slot */}
        <div>
          <label style={labelStyle}>Evening Delivery Slot</label>
          <CustomSelect
            value={delivery.eveningSlot}
            onChange={(val) => setDelivery({ ...delivery, eveningSlot: val })}
            options={[
              { value: "05:00 – 06:00 PM", label: "05:00 PM – 06:00 PM" },
              { value: "06:00 – 07:00 PM", label: "06:00 PM – 07:00 PM" },
              { value: "07:00 – 08:00 PM", label: "07:00 PM – 08:00 PM" },
              { value: "08:00 – 09:00 PM", label: "08:00 PM – 09:00 PM" },
            ]}
            placeholder="Select evening slot"
            disabled={!!delivery.morningSlot}
          />
        </div>

        {!delivery.morningSlot && !delivery.eveningSlot && (
          <div className="sm:col-span-2">
            <span style={{ fontSize: "13px", color: "#c46955" }}>
              * Please select either a morning or evening delivery slot to proceed.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Review & Pay ─────────────────────────────────────────────────────
function ReviewStep({ plan, durationMonths, price, info, health, delivery, termsAgreed, setTermsAgreed, loadingOrder, onPay }) {
  const address = [delivery.house, delivery.street, delivery.landmark, delivery.pincode]
    .filter(Boolean)
    .join(", ");
  const slot = delivery.morningSlot
    ? `Morning — ${delivery.morningSlot}`
    : `Evening — ${delivery.eveningSlot}`;

  const Row = ({ label, value }) =>
    value ? (
      <div
        className="flex items-baseline justify-between py-3.5 gap-4"
        style={{ borderBottom: "1px solid rgba(42,37,32,0.08)" }}
      >
        <div className="tracking-[0.22em] uppercase flex-shrink-0" style={{ fontSize: "10px", color: SAGE_DARK }}>
          {label}
        </div>
        <div className="text-right" style={{ fontSize: "13px", color: INK }}>
          {value}
        </div>
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-serif mb-2" style={{ fontSize: "clamp(26px, 3vw, 38px)", color: INK, fontWeight: 300 }}>
          Review <em style={{ fontStyle: "italic" }}>&amp; pay.</em>
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(42,37,32,0.6)", lineHeight: 1.8 }}>
          A final glance before we begin your journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Order Summary */}
        <div
          className="p-6 lg:p-8"
          style={{ background: CREAM_2, borderRadius: "2px", border: "1px solid rgba(42,37,32,0.08)" }}
        >
          <div className="tracking-[0.32em] uppercase mb-5" style={{ fontSize: "10px", color: SAGE_DARK }}>
            Subscription Summary
          </div>
          <div className="font-serif mb-1" style={{ fontSize: "26px", fontWeight: 300, color: INK }}>
            {plan.name}
          </div>
          <div style={{ fontSize: "13px", color: SAGE_DARK, fontStyle: "italic", marginBottom: "20px" }}>
            {plan.tagline}
          </div>

          <ul className="space-y-2 mb-6">
            {features[plan.key.toUpperCase()][durationMonths].map((f) => (
              <li key={f} className="flex items-start gap-2.5" style={{ fontSize: "13px", color: "rgba(42,37,32,0.8)" }}>
                <Check size={13} strokeWidth={1.5} style={{ color: SAGE_DARK, marginTop: "2px", flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>

          <div
            className="pt-5 mt-5 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(42,37,32,0.1)" }}
          >
            <div>
              <div className="tracking-[0.24em] uppercase mb-1" style={{ fontSize: "10px", color: SAGE_DARK }}>
                Total Payable
              </div>
              <div className="flex items-baseline gap-1">
                <span style={{ fontSize: "13px", opacity: 0.55 }}>₹</span>
                <span className="font-serif" style={{ fontSize: "32px", fontWeight: 300, color: INK }}>
                  {price.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="tracking-[0.22em] uppercase mt-1" style={{ fontSize: "10px", opacity: 0.55 }}>
                / {durationMonths === 1 ? "month" : "3 months"} · {plan.meals}
              </div>
            </div>
            <div
              className="px-4 py-2 tracking-[0.22em] uppercase"
              style={{
                fontSize: "10px",
                background: "rgba(139,149,121,0.12)",
                color: SAGE_DARK,
                borderRadius: "2px",
                border: "1px solid rgba(139,149,121,0.2)",
              }}
            >
              FREE Delivery
            </div>
          </div>
        </div>

        {/* Your Details */}
        <div
          className="p-6 lg:p-8"
          style={{ background: CREAM_2, borderRadius: "2px", border: "1px solid rgba(42,37,32,0.08)" }}
        >
          <div className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE_DARK }}>
            Your Details
          </div>
          <Row label="Name" value={`${info.firstName} ${info.lastName}`.trim() || "—"} />
          <Row label="Phone" value={info.phone || "—"} />
          <Row label="Email" value={info.email || "—"} />
          <Row label="DOB" value={info.dob || "—"} />
          {health.allergies && <Row label="Allergies" value={health.allergies} />}
          {health.medical && <Row label="Conditions" value={health.medical} />}

          <div className="mt-5">
            <div className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE_DARK }}>
              Delivery
            </div>
            <Row label="Address" value={address || "—"} />
            <Row label="Slot" value={slot} />
          </div>
        </div>
      </div>

      {/* Terms */}
      <div
        className="p-6 lg:p-8"
        style={{ background: CREAM_2, borderRadius: "2px", border: "1px solid rgba(42,37,32,0.08)" }}
      >
        <div className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE_DARK }}>
          Terms &amp; Conditions
        </div>
        <div
          className="overflow-y-auto pr-2 mb-5"
          style={{
            maxHeight: "160px",
            fontSize: "13px",
            color: "rgba(42,37,32,0.65)",
            lineHeight: 1.75,
            borderBottom: "1px solid rgba(42,37,32,0.08)",
            paddingBottom: "16px",
          }}
        >
          <p className="font-semibold mb-3">1. Subscription Terms</p>
          <p className="mb-3">Subscriptions are billed in advance and are non-transferable. Once activated, subscriptions are non-cancellable except when service is unavailable from Ryvive Roots. Missed deliveries due to customer unavailability or incorrect details are not eligible for compensation or refunds.</p>
          <p className="font-semibold mb-3">2. Privacy</p>
          <p className="mb-3">We collect personal information solely for service fulfilment. Payments are securely processed through Easebuzz and Ryvive Roots does not store any banking or card details.</p>
          <p className="font-semibold mb-3">3. Pause Policy</p>
          <p className="mb-3">Gold subscribers may pause up to 2 times per month; Platinum up to 3 times per month. Requests must be submitted by 5:00 PM the previous day. Paused days are adjusted at end of subscription period — no refunds provided.</p>
          <p className="font-semibold mb-3">4. Food Safety</p>
          <p className="mb-0">Allergen-free meals cannot be guaranteed. Ryvive Roots shall not be liable for adverse reactions from undisclosed allergies. Meals are not intended to diagnose or treat any medical condition.</p>
        </div>
        <label className="flex items-start gap-4 cursor-pointer">
          <div className="relative flex items-center justify-center mt-0.5" style={{ width: "18px", height: "18px", flexShrink: 0 }}>
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="absolute opacity-0 w-full h-full cursor-pointer z-10"
            />
            <div
              style={{
                width: "100%",
                height: "100%",
                border: `1px solid ${termsAgreed ? SAGE_DARK : "rgba(42,37,32,0.3)"}`,
                background: termsAgreed ? SAGE_DARK : "transparent",
                borderRadius: "2px",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {termsAgreed && <Check size={11} strokeWidth={3} color={CREAM} />}
            </div>
          </div>
          <span style={{ fontSize: "13px", color: "rgba(42,37,32,0.8)", lineHeight: 1.6, userSelect: "none" }}>
            I have read and agree to the Terms &amp; Conditions and Privacy Policy.
          </span>
        </label>
      </div>

      {/* Pay button */}
      <motion.button
        type="button"
        disabled={!termsAgreed || loadingOrder}
        onClick={termsAgreed && !loadingOrder ? onPay : undefined}
        whileTap={{ scale: termsAgreed ? 0.98 : 1 }}
        className="w-full py-5 tracking-[0.3em] uppercase transition-all"
        style={{
          fontSize: "12px",
          background: termsAgreed && !loadingOrder ? INK : "rgba(42,37,32,0.3)",
          color: CREAM,
          border: "none",
          borderRadius: "2px",
          cursor: termsAgreed && !loadingOrder ? "pointer" : "not-allowed",
          letterSpacing: "0.3em",
        }}
      >
        {loadingOrder
          ? "Redirecting to payment…"
          : `Pay ₹${price.toLocaleString("en-IN")} & Place Order`}
      </motion.button>

      <p className="text-center" style={{ fontSize: "12px", color: "rgba(42,37,32,0.45)" }}>
        🔒 Secure checkout via Easebuzz · No hidden charges
      </p>
    </div>
  );
}
