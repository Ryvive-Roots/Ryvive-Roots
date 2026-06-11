import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, ChefHat, Truck, UtensilsCrossed, CreditCard, Smartphone, Landmark, Wallet, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
import landing1 from '../images/Landing-1.jpeg';
import landing2 from '../images/Landing-2.jpeg';
import landing3 from '../images/Landing-3.jpeg';
import landing4 from '../images/Landing-4.jpeg';
const SubscriptionHeader = new URL('../images/Landing-3.jpeg', import.meta.url).href;
const features = {
  PLATINUM: {
    "1": [
      "Chef’s signature menu",
      "3 Pauses Available",
      "Glow juices",
      "Elite combinations"
    ],
    "3": [
      "Premium nutrition combinations",
      "3 pauses / month",
      "Custom meal adjustments",
      "Priority delivery",
      "Exclusive chef curated dishes",
      "Surprise upgrades"
    ]
  },

  GOLD: {
    "1": [
      "4 High-protein meals / week",
      "2 Pauses Available",
      "Gut-friendly meals",
      "Energy juices"
    ],
    "3": [
      "More nutritional variety",
      "2 pauses / month",
      "Gut & Skin-Friendly Meals",
      "Advanced energy juices",
      "Boost Energy Levels",
      "Naturally Detoxifying Ingredients"
    ]
  },

  SILVER: {
    "1": [
      "Clean Meals",
      "No pause available",
      "Easy Digestion",
      "Weekly Variety"
    ],
    "3": [
      "Clean Meals",
      "1 pause available / month",
      "Easy Digestion",
      "Weekly Variety",
      "Functional Juices",
      "No calorie stress"
    ]
  }
};

const plans = [
  {
    key: 'silver',
    name: 'RYVIVE SILVER',
    tagline: 'A gentle introduction.',
    meals: '14 meals weekly',
    prices: { 1: 4999, 3: 17999 },
  },
  {
    key: 'gold',
    name: 'RYVIVE GOLD',
    tagline: 'Our most chosen plan.',
    meals: '21 meals weekly',
    prices: { 1: 5999, 3: 20997 },
    popular: true,
  },
  {
    key: 'platinum',
    name: 'RYVIVE PLATINUM',
    tagline: 'A devoted ritual.',
    meals: '28 meals weekly',
    prices: { 1: 6999, 3: 23997 },
  },
];
const steps = [
  { n: 1, label: 'Plan Selection' },
  { n: 2, label: 'Your Information' },
  { n: 3, label: 'Delivery Details' },
  { n: 4, label: 'Review' },
  { n: 5, label: 'Payment' },
];
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
const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: `1px solid rgba(42,37,32,0.25)`,
  padding: '14px 2px',
  fontSize: '15px',
  color: INK,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.3s ease',
};
const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
};
const labelStyle = {
  fontSize: '10px',
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  color: SAGE_DARK,
  marginBottom: '4px',
  display: 'block',
};
const ease = [0.22, 1, 0.36, 1];
export default function Subscription() {
  const [step, setStep] = useState(1);
  // Testimonials sliding state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const visibleCards = 1;
  // Autoplay Slider - Slides one by one with a 2800ms delay
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
  const [selectedPlan, setSelectedPlan] = useState('gold');
  const [durations, setDurations] = useState({
    silver: 1,
    gold: 1,
    platinum: 1,
  });
  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    allergies: '',
    conditions: ''
  });
  const [delivery, setDelivery] = useState({
    pincode: '',
    house: '',
    street: '',
    landmark: '',
    morningSlot: '',
    eveningSlot: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const current = plans.find((p) => p.key === selectedPlan);
  const currentDuration = durations[selectedPlan] ?? 1;
  const currentPrice = current.prices[currentDuration];
  const nextStepAndScroll = () => {
    setStep((s) => Math.min(5, s + 1));
    setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const targetId = isMobile ? 'subscription-journey-section' : 'subscription-main-panel';
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  const backStepAndScroll = () => {
    setStep((s) => Math.max(1, s - 1));
    setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      const targetId = isMobile ? 'subscription-journey-section' : 'subscription-main-panel';
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  const isContinueDisabled = (step === 4 && !termsAgreed) || (step === 5 && !agreed) || (step === 3 && !delivery.morningSlot && !delivery.eveningSlot);
  return (<div style={{ background: CREAM }} className="min-h-screen">
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

    {/* MAIN SPLIT */}
    <section data-tone="light" className="px-5 sm:px-8 lg:px-14 pt-10 lg:pt-16 pb-20 lg:pb-32">
      <div className="max-w-[1520px] mx-auto grid lg:grid-cols-[minmax(240px,29%)_minmax(0,71%)] gap-4 lg:gap-5 xl:gap-6">
        {/* LEFT — vertical step rail (mobile + desktop) */}
        <aside id="subscription-journey-section" className="relative w-full mb-8 lg:sticky lg:top-[100px] self-start" style={{ scrollMarginTop: '100px' }}>
          <div className="px-3 py-2 lg:p-8" style={{
            background: 'rgba(244,239,230,0.94)',
            backdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(42,37,32,0.08)',
            borderRadius: window.innerWidth >= 1024 ? '2px' : '18px',
          }}>
            <div className="tracking-[0.42em] uppercase mb-8" style={{ fontSize: '10px', color: SAGE_DARK, fontWeight: 600 }}>— Your Journey</div>
            <ol className="flex items-center justify-between lg:block lg:space-y-7">
              {steps.map((s) => {
                const isDone = step > s.n;
                const isActive = step === s.n;
                return (<li key={s.n} className="flex flex-col items-center text-center lg:flex-row lg:text-left gap-1 lg:gap-5 flex-1">
                  <motion.div animate={{ scale: isActive ? 1.05 : 1 }} transition={{ duration: 0.4 }} className="flex-shrink-0 flex items-center justify-center font-serif" style={{
                    width: window.innerWidth >= 1024 ? '40px' : '28px',
                    height: window.innerWidth >= 1024 ? '40px' : '28px',
                    borderRadius: '50%',
                    border: `1px solid ${isDone || isActive ? INK : 'rgba(42,37,32,0.18)'}`,
                    background: isDone || isActive ? INK : 'transparent',
                    color: isDone || isActive ? CREAM : 'rgba(42,37,32,0.55)',
                    fontSize: window.innerWidth >= 1024 ? '14px' : '10px',
                  }}>
                    {isDone ? <Check size={16} strokeWidth={1.5} /> : s.n}
                  </motion.div>
                  <div>
                    <div>
                      <div className="hidden lg:block tracking-[0.22em] uppercase" style={{
                        fontSize: '10px',
                        color: isActive ? INK : 'rgba(42,37,32,0.45)',
                      }}>
                        Step {s.n}
                      </div>

                      <div className="hidden lg:block" style={{
                        fontSize: '14px',
                        color: isActive ? INK : 'rgba(42,37,32,0.55)',
                        marginTop: '4px',
                      }}>
                        {s.label}
                      </div>

                      {isActive && (<motion.div layoutId="step-pulse" className="mt-1.5 hidden lg:block" style={{
                        width: '24px',
                        height: '1px',
                        background: SAGE_DARK,
                      }} />)}
                    </div>
                  </div>
                </li>);
              })}
            </ol>

            <div className="font-serif mt-10" style={{ fontSize: '24px', color: INK, fontWeight: 300 }}>{current.name}</div>
            <div style={{ fontSize: '12px', color: 'rgba(42,37,32,0.6)', marginTop: '4px' }}>
              ₹{currentPrice.toLocaleString('en-IN')} / {currentDuration === 1 ? 'month' : '3 months'}
            </div>
          </div>
        </aside>

        {/* RIGHT — main panel */}
        <main id="subscription-main-panel" className="min-h-[460px]" style={{ scrollMarginTop: '100px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease }}>
              {step === 1 && <PlanStep selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} durations={durations} setDurations={setDurations} onContinue={nextStepAndScroll} />}
              {step === 2 && <InfoStep info={info} setInfo={setInfo} />}
              {step === 3 && <DeliveryStep delivery={delivery} setDelivery={setDelivery} />}
              {step === 4 && <ReviewStep plan={current} durationMonths={currentDuration} info={info} delivery={delivery} termsAgreed={termsAgreed} setTermsAgreed={setTermsAgreed} />}
              {step === 5 && <PaymentStep plan={current} durationMonths={currentDuration} agreed={agreed} setAgreed={setAgreed} />}
            </motion.div>
          </AnimatePresence>

          {/* NAV */}
          <div className="mt-12 lg:mt-16 flex items-center justify-between gap-4">
            <motion.button whileTap={{ scale: 0.97 }} onClick={backStepAndScroll} disabled={step === 1} className="flex items-center gap-3 px-5 py-3.5 tracking-[0.22em] uppercase transition-all duration-300" style={{
              fontSize: '11px',
              color: step === 1 ? 'rgba(42,37,32,0.3)' : INK,
              border: `1px solid ${step === 1 ? 'rgba(42,37,32,0.15)' : 'rgba(42,37,32,0.4)'}`,
              background: 'transparent',
              borderRadius: '1px',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}>
              <ArrowLeft size={14} strokeWidth={1.4} /> Back
            </motion.button>

            <motion.button whileTap={{ scale: isContinueDisabled ? 1 : 0.97 }} whileHover={{ scale: isContinueDisabled ? 1 : 1.02 }} onClick={step === 5 ? () => alert('Subscription confirmed') : nextStepAndScroll} disabled={isContinueDisabled} className="flex items-center gap-3 px-7 sm:px-9 py-3.5 tracking-[0.22em] uppercase transition-all duration-300" style={{
              fontSize: '11px',
              background: isContinueDisabled ? 'rgba(42,37,32,0.5)' : INK,
              color: CREAM,
              border: `1px solid ${isContinueDisabled ? 'rgba(42,37,32,0)' : INK}`,
              borderRadius: '1px',
              cursor: isContinueDisabled ? 'not-allowed' : 'pointer'
            }}>
              {step === 5 ? 'Confirm Subscription' : 'Continue'} <ArrowRight size={14} strokeWidth={1.4} />
            </motion.button>
          </div>
        </main>
      </div>
    </section>

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
  </div>);
}
/* — Step 1 — */
function PlanStep({ selectedPlan, setSelectedPlan, durations, setDurations, onContinue, }) {
  const durationOptions = [1, 3];
  const updateDuration = (planKey, duration) => {
    setSelectedPlan(planKey);
    setDurations({
      ...durations,
      [planKey]: duration,
    });
  };
  return (<div className="relative">
    {/* Soft Blurred Organic / Wellness Background Overlays */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.035] select-none" style={{ mixBlendMode: 'multiply' }}>
      <img src={landing1} alt="" className="absolute -left-[12%] -top-[8%] w-[42%] aspect-square object-cover rounded-full filter blur-[32px] saturate-[0.8]" />
      <img src={landing4} alt="" className="absolute -right-[12%] -bottom-[8%] w-[42%] aspect-square object-cover rounded-full filter blur-[32px] saturate-[0.8]" />
    </div>

    <div className="relative z-10">
      <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: INK, fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
        Select your <em style={{ fontStyle: 'italic' }}>plan.</em>
      </h2>
      <p className="mb-10" style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
        Choose the nourishment plan that fits your lifestyle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-4 xl:gap-5 pt-4 lg:pt-5">
        {plans.map((p, i) => {
          const isSel = selectedPlan === p.key;
          const duration = durations[p.key] ?? 1;
          const price = p.prices[duration];
          return (<motion.div key={p.key} initial={{ opacity: 0, y: 20 }} animate={{
            opacity: 1,
            y: isSel ? -8 : 0,
            scale: isSel ? 1.03 : 1,
          }} transition={{ delay: i * 0.08, duration: 0.55, ease }} whileHover={!isSel ? {
            y: -5,
            scale: 1.015,
            boxShadow: '0 20px 40px -16px rgba(42,37,32,0.12), 0 0 0 1px rgba(255,255,255,0.7) inset',
            borderColor: 'rgba(107,117,96,0.3)'
          } : undefined} className="relative p-[22px] lg:p-[26px] text-left flex flex-col min-h-[418px] backdrop-blur-[6px]" style={{
            background: isSel ? INK : 'rgba(244, 239, 230, 0.65)',
            color: isSel ? CREAM : INK,
            border: `1.5px solid ${isSel ? SAGE : (p.popular ? SAGE_DARK : 'rgba(42,37,32,0.08)')}`,
            borderRadius: '3px',
            boxShadow: isSel
              ? '0 35px 70px -15px rgba(14,41,27,0.38), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 0 4px rgba(139,149,121,0.15)'
              : '0 8px 30px -16px rgba(42,37,32,0.08), 0 0 0 1px rgba(255,255,255,0.65) inset',
            transformOrigin: 'center bottom',
          }}>
            {p.popular && (<div className="absolute -top-3.5 left-8 px-4 py-1.5 tracking-[0.3em] uppercase z-10" style={{ fontSize: '9px', background: SAGE, color: DARK_2, borderRadius: '2px', fontWeight: 500 }}>
              Most Popular
            </div>)}
            <div className="tracking-[0.35em] uppercase mb-5" style={{ fontSize: '10px', color: isSel ? SAGE : SAGE_DARK }}>
              Plan
            </div>
            <div className="font-serif mb-2" style={{ fontSize: '32px', fontWeight: 300, lineHeight: 1.1 }}>{p.name}</div>
            <div style={{ fontSize: '14px', color: isSel ? 'rgba(244,239,230,0.7)' : 'rgba(42,37,32,0.6)', fontStyle: 'italic', marginBottom: '20px' }}>
              {p.tagline}
            </div>

            <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${isSel ? 'rgba(244,239,230,0.15)' : 'rgba(42,37,32,0.12)'}` }}>
              <div className="mb-3.5 inline-flex rounded-full p-1 border relative overflow-hidden" style={{
                borderColor: isSel ? 'rgba(244,239,230,0.14)' : 'rgba(42,37,32,0.12)',
                background: isSel ? 'rgba(244,239,230,0.05)' : 'rgba(255,255,255,0.38)',
                boxShadow: isSel ? 'inset 0 0 0 1px rgba(139,149,121,0.12)' : 'none',
              }}>
                <motion.div layoutId={`duration-pill-${p.key}`} transition={{ duration: 0.35, ease }} className="absolute top-1 bottom-1 rounded-full" style={{
                  left: duration === 1 ? '4px' : 'calc(50% + 4px)',
                  width: 'calc(50% - 8px)',
                  background: isSel ? CREAM : 'rgba(42,37,32,0.06)',
                  boxShadow: '0 8px 20px -18px rgba(42,37,32,0.22)',
                }} />
                {durationOptions.map((months) => {
                  const active = duration === months;
                  return (<button key={months} type="button" onClick={(e) => {
                    e.stopPropagation();
                    updateDuration(p.key, months);
                  }} className="relative z-10 tracking-[0.22em] uppercase transition-all duration-300 flex-1 text-center" style={{
                    fontSize: 'clamp(9px, 1.6vw, 11px)',
                    padding: '8px 10px',
                    borderRadius: '999px',
                    color: active ? (isSel ? DARK_2 : INK) : (isSel ? 'rgba(244,239,230,0.72)' : 'rgba(42,37,32,0.56)'),
                    background: 'transparent',
                    boxShadow: 'none',
                  }}>
                    {months === 1 ? '1 Month' : '3 Months'}
                  </button>);
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`${p.key}-${duration}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease }}>
                  <div className="flex items-baseline gap-2">
                    <span style={{ fontSize: '14px', opacity: 0.55 }}>₹</span>
                    <span className="font-serif" style={{ fontSize: '42px', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="tracking-[0.24em] uppercase mt-3" style={{ fontSize: '11px', opacity: 0.65 }}>
                    / {duration === 1 ? 'month' : '3 months'} · {p.meals}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <ul className="flex flex-col gap-y-2.5 mb-6 flex-1">
              {features[p.key.toUpperCase()][duration].map((f) => (<li key={f} className="flex items-start gap-3" style={{ fontSize: '14px', lineHeight: 1.5, opacity: 0.9 }}>
                <Check size={16} strokeWidth={1.5} style={{ color: isSel ? SAGE : SAGE_DARK, marginTop: '2px', flexShrink: 0 }} />
                {f}
              </li>))}
            </ul>

            <motion.button type="button" onClick={() => {
              if (isSel) {
                onContinue();
              }
              else {
                setSelectedPlan(p.key);
              }
            }} whileTap={{ scale: 0.96 }} className="tracking-[0.28em] uppercase text-center py-4 transition-all w-full" style={{
              fontSize: '11px',
              background: isSel ? SAGE : 'transparent',
              color: isSel ? DARK_2 : INK,
              border: `1px solid ${isSel ? SAGE : 'rgba(42,37,32,0.4)'}`,
              borderRadius: '2px',
            }}>
              {isSel ? 'Continue →' : 'Select Plan'}
            </motion.button>
          </motion.div>);
        })}
      </div>
    </div>
  </div>);
}
/* — Step 2 — */
function InfoStep({ info, setInfo }) {
  const onFocus = (e) => { e.currentTarget.style.borderBottomColor = SAGE_DARK; };
  const onBlur = (e) => { e.currentTarget.style.borderBottomColor = 'rgba(42,37,32,0.25)'; };
  return (<div>
    <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: INK, fontWeight: 300, lineHeight: 1.1 }}>
      Your <em style={{ fontStyle: 'italic' }}>information.</em>
    </h2>
    <p className="mb-10" style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
      So we know who to take care of.
    </p>
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
      <div>
        <label style={labelStyle}>First Name</label>
        <input value={info.firstName} onChange={(e) => setInfo({ ...info, firstName: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Last Name</label>
        <input value={info.lastName} onChange={(e) => setInfo({ ...info, lastName: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Phone Number</label>
        <input type="tel" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Email ID</label>
        <input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Date of Birth</label>
        <input type="date" value={info.dob} onChange={(e) => setInfo({ ...info, dob: e.target.value })} style={{ ...inputStyle, color: info.dob ? INK : 'rgba(42,37,32,0.5)' }} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Allergies (If any)</label>
        <input value={info.allergies} onChange={(e) => setInfo({ ...info, allergies: e.target.value })} placeholder="e.g. Peanuts, Dairy" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div className="sm:col-span-2">
        <label style={labelStyle}>Medical Conditions</label>
        <textarea rows={3} value={info.conditions} onChange={(e) => setInfo({ ...info, conditions: e.target.value })} placeholder="Please mention any medical conditions we should be aware of..." style={{ ...inputStyle, resize: 'none', paddingTop: '10px' }} onFocus={onFocus} onBlur={onBlur} />
      </div>
    </div>
  </div>);
}
function CustomSelect({ value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  return (<div className="relative w-full" style={{ opacity: disabled ? 0.4 : 1 }}>
    <button type="button" disabled={disabled} onClick={() => setOpen(!open)} className="w-full text-left flex items-center justify-between transition-colors" style={{
      ...inputStyle,
      borderBottomColor: open ? SAGE_DARK : 'rgba(42,37,32,0.25)',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      <span style={{ color: value ? INK : 'rgba(42,37,32,0.5)' }}>
        {value ? options.find(o => o.value === value)?.label : placeholder}
      </span>

      <div className="flex items-center gap-2">
        {value && !disabled && (<div onClick={(e) => { e.stopPropagation(); onChange(''); }} className="p-1 rounded-full hover:bg-black/5 transition-colors">
          <X size={14} color="rgba(42,37,32,0.5)" />
        </div>)}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease }}>
          <ChevronDown size={16} color="rgba(42,37,32,0.5)" />
        </motion.div>
      </div>
    </button>

    <AnimatePresence>
      {open && !disabled && (<>
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3, ease }} className="absolute left-0 right-0 z-50 mt-1 py-1 rounded-[2px] overflow-hidden" style={{
          background: CREAM_2,
          border: '1px solid rgba(42,37,32,0.08)',
          boxShadow: '0 10px 30px -10px rgba(42,37,32,0.15)',
        }}>
          {options.map((opt) => {
            const isSel = value === opt.value;
            return (<button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className="w-full text-left px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-[#f2efe9]" style={{ background: isSel ? 'rgba(42,37,32,0.04)' : 'transparent' }}>
              <span style={{ fontSize: '14px', color: isSel ? INK : 'rgba(42,37,32,0.85)', fontWeight: isSel ? 400 : 300 }}>
                {opt.label}
              </span>
              {isSel && <Check size={14} color={SAGE_DARK} />}
            </button>);
          })}
        </motion.div>
      </>)}
    </AnimatePresence>
  </div>);
}
/* — Step 3 — */
function DeliveryStep({ delivery, setDelivery }) {
  const onFocus = (e) => { e.currentTarget.style.borderBottomColor = SAGE_DARK; };
  const onBlur = (e) => { e.currentTarget.style.borderBottomColor = 'rgba(42,37,32,0.25)'; };
  return (<div>
    <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: INK, fontWeight: 300, lineHeight: 1.1 }}>
      Delivery <em style={{ fontStyle: 'italic' }}>details.</em>
    </h2>
    <p className="mb-10" style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
      Where and when shall we send your daily ritual?
    </p>
    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
      <div>
        <label style={labelStyle}>Pincode</label>
        <input value={delivery.pincode} onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>House / Flat No.</label>
        <input value={delivery.house} onChange={(e) => setDelivery({ ...delivery, house: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Street / Area</label>
        <input value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Landmark (Optional)</label>
        <input value={delivery.landmark} onChange={(e) => setDelivery({ ...delivery, landmark: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <label style={labelStyle}>Morning Delivery Slot</label>
        <CustomSelect value={delivery.morningSlot} onChange={(val) => setDelivery({ ...delivery, morningSlot: val })} options={[
          { value: '08-09 AM', label: '08:00 AM - 09:00 AM' },
          { value: '09-10 AM', label: '09:00 AM - 10:00 AM' },
          { value: '10-11 AM', label: '10:00 AM - 11:00 AM' }
        ]} placeholder="Select morning slot" disabled={!!delivery.eveningSlot} />
      </div>
      <div>
        <label style={labelStyle}>Evening Delivery Slot</label>
        <CustomSelect value={delivery.eveningSlot} onChange={(val) => setDelivery({ ...delivery, eveningSlot: val })} options={[
          { value: '05-06 PM', label: '05:00 PM - 06:00 PM' },
          { value: '06-07 PM', label: '06:00 PM - 07:00 PM' },
          { value: '07-08 PM', label: '07:00 PM - 08:00 PM' },
          { value: '08-09 PM', label: '08:00 PM - 09:00 PM' }
        ]} placeholder="Select evening slot" disabled={!!delivery.morningSlot} />
      </div>

      {(!delivery.morningSlot && !delivery.eveningSlot) && (<div className="sm:col-span-2 pt-2">
        <span style={{ fontSize: '13px', color: '#c46955', opacity: 0.9 }}>* Please select either a morning or evening delivery slot to proceed.</span>
      </div>)}
    </div>
  </div>);
}
const reviewPlanDetails = {
  silver: {
    name: 'RYVIVE SILVER',
    tagline: 'Gentle beginnings to a nourished life.',
    desc: 'Ryvive Essentials is thoughtfully designed for those taking their first intentional steps toward better eating. With balanced, wholesome meals made from fresh ingredients, this plan offers a simple yet effective foundation for healthier habits.',
    included: [
      'Two balanced meals daily with seasonal ingredients',
      'Carefully curated weekly menu',
      'Basic concierge support',
      'Focus on gut health and sustained energy',
      'Nourishing staples made with care'
    ],
    categories: [
      'Signature Detox Collection',
      'Fruit & Vegetable Elixirs',
      'Wellness Blends'
    ]
  },
  gold: {
    name: 'RYVIVE GOLD',
    tagline: 'Harmony in every meal.',
    desc: 'Ryvive Balance is our most chosen plan — crafted for those who seek consistency, vitality, and balance in their daily nourishment. It delivers the perfect equilibrium of flavor, nutrition, and convenience for a purposeful lifestyle.',
    included: [
      'Three complete meals daily',
      'Priority chef access and customizations',
      'Cold-pressed elixirs and functional juices',
      'Personal nutritionist guidance',
      'Weekly menu refinements based on your feedback'
    ],
    categories: [
      'Curated Salad Collection',
      'Sandwiches',
      'Wraps',
      'Soups',
      'Chaat'
    ]
  },
  platinum: {
    name: 'RYVIVE PLATINUM',
    tagline: 'Excellence without compromise.',
    desc: 'Ryvive Complete is created for those who desire the highest level of nourishment and personalization. Every element is meticulously curated — from ingredient sourcing to flavor pairing — delivering a truly transformative wellness experience.',
    included: [
      'Four meals daily with premium ingredients',
      'Bespoke menu design tailored to your goals',
      'Private tastings and seasonal exclusives',
      'Wellness consultations and progress tracking',
      'Full access to all signature offerings and functional beverages'
    ],
    categories: [
      'Soups & Chaat',
      'Pasta Zoodle Collections',
      'House Crafted Dips',
      'Signature Detox Collection',
      'Curated Salad Collection'
    ]
  }
};
/* — Step 4 — */
function ReviewStep({ plan, durationMonths, info, delivery, termsAgreed, setTermsAgreed }) {
  const Row = ({ label, value }) => (value ? <div className="flex items-baseline justify-between py-4 gap-4" style={{ borderBottom: '1px solid rgba(42,37,32,0.1)' }}>
    <div className="tracking-[0.22em] uppercase flex-shrink-0" style={{ fontSize: '10px', color: SAGE_DARK }}>{label}</div>
    <div className="text-right" style={{ fontSize: '13px', color: INK }}>{value}</div>
  </div> : null);
  const fullName = `${info.firstName} ${info.lastName}`.trim();
  const address = [delivery.house, delivery.street, delivery.landmark, delivery.pincode].filter(Boolean).join(', ');
  const details = reviewPlanDetails[plan.key];
  const price = plan.prices[durationMonths];
  return (<div className="flex flex-col gap-8">
    <div>
      <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: INK, fontWeight: 300, lineHeight: 1.1 }}>
        Order <em style={{ fontStyle: 'italic' }}>Summary.</em>
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
        A final glance before we begin your journey.
      </p>
    </div>

    {/* DETAILED PLAN SUMMARY & USER DETAILS SIDE-BY-SIDE */}
    <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-stretch">
      {/* LEFT COLUMN: DETAILED PLAN SUMMARY */}
      <div className="p-7 lg:p-10 flex flex-col justify-between h-full text-left" style={{ background: CREAM_2, borderRadius: '2px', border: '1px solid rgba(42,37,32,0.08)' }}>
        <div className="flex flex-col gap-6">
          <div>
            <div className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>Your Selected Plan</div>
            <div className="font-serif mb-2" style={{ fontSize: 'clamp(32px, 3.8vw, 44px)', fontWeight: 300, color: INK, letterSpacing: '0.01em', lineHeight: 1.15 }}>
              {details.name}
            </div>
            <div className="mb-4" style={{ fontSize: '15px', color: SAGE_DARK, fontStyle: 'italic' }}>
              {details.tagline}
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(42,37,32,0.7)', lineHeight: 1.8 }}>
              {details.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid rgba(42,37,32,0.08)' }}>
            <div>
              <div className="tracking-[0.28em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>
                What’s Included
              </div>
              <ul className="space-y-2.5">
                {features[plan.key.toUpperCase()][durationMonths].map((f, i) => (<li key={i} className="flex items-start gap-3.5" style={{ fontSize: '13px', color: 'rgba(42,37,32,0.85)', lineHeight: 1.55 }}>
                  <span style={{ color: SAGE_DARK, flexShrink: 0, marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
                  {f}
                </li>))}
              </ul>
            </div>
            <div>
              <div className="tracking-[0.28em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>
                Categories Covered
              </div>
              <ul className="space-y-2.5">
                {details.categories.map((c, i) => (<li key={i} className="flex items-start gap-3.5" style={{ fontSize: '13px', color: 'rgba(42,37,32,0.85)', lineHeight: 1.55 }}>
                  <span style={{ color: SAGE_DARK, flexShrink: 0, marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor' }} />
                  {c}
                </li>))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-8 pt-6" style={{ borderTop: '1px solid rgba(42,37,32,0.08)' }}>
          <span style={{ fontSize: '14px', opacity: 0.55 }}>₹</span>
          <span className="font-serif" style={{ fontSize: '32px', fontWeight: 300, color: INK, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {price.toLocaleString('en-IN')}
          </span>
          <span className="tracking-[0.24em] uppercase ml-2" style={{ fontSize: '11px', color: 'rgba(42,37,32,0.5)' }}>
            / {durationMonths === 1 ? 'month' : '3 months'} · {plan.meals}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: USER DETAILS & TOTAL */}
      <div className="p-7 lg:p-10 flex flex-col justify-between h-full text-left" style={{ background: CREAM_2, borderRadius: '2px', border: '1px solid rgba(42,37,32,0.08)' }}>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>Personal Information</h3>
            <Row label="Name" value={fullName || '—'} />
            <Row label="Contact Number" value={info.phone || '—'} />
            <Row label="Email ID" value={info.email || '—'} />
            <Row label="DOB" value={info.dob || '—'} />
            {(info.allergies || info.conditions) && (
              <Row label="Health Info" value={[info.allergies ? `Allergies: ${info.allergies}` : null, info.conditions ? `Conditions: ${info.conditions}` : null].filter(Boolean).join(' | ')} />
            )}
          </div>

          <div>
            <h3 className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>Delivery Information</h3>
            <Row label="Address" value={address || '—'} />
            <Row label="Morning Delivery Slot" value={delivery.morningSlot || '—'} />
            <Row label="Evening Delivery Slot" value={delivery.eveningSlot || '—'} />
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-6 mt-8" style={{ borderTop: '1px solid rgba(42,37,32,0.08)' }}>
          <div className="tracking-[0.32em] uppercase" style={{ fontSize: '11px', color: INK }}>Total Amount</div>
          <div className="font-serif" style={{ fontSize: '34px', color: INK, fontWeight: 300 }}>
            ₹{price.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>

    {/* FULL-WIDTH TERMS & CONDITIONS */}
    <div className="p-7 lg:p-10 text-left" style={{ background: CREAM_2, borderRadius: '2px', border: '1px solid rgba(42,37,32,0.08)' }}>
      <h3 className="tracking-[0.32em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>Terms & Conditions</h3>
      <div className="overflow-y-auto pr-2 mb-6 text-left" style={{ maxHeight: '180px', fontSize: '13px', color: 'rgba(42,37,32,0.7)', lineHeight: 1.7, borderBottom: '1px solid rgba(42,37,32,0.08)', paddingBottom: '16px' }}>
        <p className="mb-4 font-semibold">1. Privacy Policy</p>
        <p className="mb-4">
          RYVIVE ROOTS is committed to protecting customer privacy. We collect personal information including name, contact details, delivery address, date of birth, disclosed allergies or medical conditions, subscription preferences, and order history solely for service fulfilment and communication purposes. Payments are securely processed through Easebuzz, and RYVIVE ROOTS does not store any banking or card details. Customer data is shared only with essential service partners or when required by applicable law.
        </p>

        <p className="mb-4 font-semibold">2. Services Offered</p>
        <p className="mb-4">
          RYVIVE ROOTS provides healthy food and beverage options, including soups, salads, sandwiches, wraps, chaat, pasta, and fresh juices, through one-time orders and subscription-based services.
        </p>

        <p className="mb-4 font-semibold">3. Subscription Plans</p>
        <p className="mb-4">
          Subscriptions are billed monthly in advance and are non-transferable. Once activated, subscriptions are non-cancellable except in cases where service is unavailable from RYVIVE ROOTS. Subscriptions are valid only for the registered customer and the registered delivery address. Missed deliveries due to customer unavailability or incorrect details are not eligible for compensation, refunds, or replacements.
        </p>

        <p className="mb-4 font-semibold">4. Pricing & Payments</p>
        <p className="mb-4">
          All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely via Easebuzz. Failed, delayed, or unsuccessful payments may result in temporary suspension or cancellation of services.
        </p>

        <p className="mb-4 font-semibold">5. Offers & Benefits</p>
        <p className="mb-4">
          Offers and benefits may vary by city, location, and participating partners and are subject to specific terms, validity periods, and availability.
        </p>
        <p className="mb-2">Offers are:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Available only on RYVIVE ROOTS platforms</li>
          <li>Non-transferable and non-cashable</li>
          <li>Not combinable with other promotions</li>
          <li>Subject to modification or withdrawal without prior notice</li>
          <li>Valid only for eligible subscribed users and selected locations</li>
        </ul>

        <p className="mb-4 font-semibold">6. User Responsibilities</p>
        <p className="mb-4">
          Customers agree to provide accurate and complete information, ensure availability at the delivery location, disclose any allergies or medical conditions in advance, follow food storage and consumption guidelines, and use the services lawfully and respectfully.
        </p>

        <p className="mb-4 font-semibold">7. Prohibited Uses</p>
        <p className="mb-2">Users shall not use RYVIVE ROOTS services for:</p>
        <ul className="list-disc pl-5 mb-2 space-y-1">
          <li>Any unlawful or fraudulent purpose</li>
          <li>Reselling or redistributing meals or subscriptions</li>
          <li>Providing false information or impersonation</li>
          <li>Interfering with service operations</li>
          <li>Violating applicable laws or regulations</li>
        </ul>
        <p className="mb-4">
          Violation of these terms may result in immediate suspension or termination of services without refund.
        </p>

        <p className="mb-4 font-semibold">8. Pause / Hold Policy</p>
        <p className="mb-4">
          Subscriptions may be paused up to two (2) times per month for the Gold plan and up to three (3) times per month for the Platinum plan. Each pause may be taken for a minimum of one (1) day and a maximum of fifteen (15) days. Pause requests must be submitted at least one (1) day in advance, no later than 5:00 PM on the previous day. Same-day pause requests are not permitted. All paused days will be adjusted at the end of the subscription period, and no refunds will be provided for paused days.
        </p>

        <p className="mb-4 font-semibold">9. Food Safety & Health Disclaimer</p>
        <p className="mb-4">
          Food is prepared following standard hygiene and safety practices; however, allergen-free meals cannot be guaranteed. RYVIVE ROOTS shall not be liable for adverse reactions resulting from undisclosed allergies or medical conditions. Meals are not intended to diagnose, treat, cure, or prevent any medical condition.
        </p>

        <p className="mb-4 font-semibold">10. Natural Food Variation Disclaimer</p>
        <p className="mb-4">
          Due to the use of fresh and natural ingredients, variations in taste, texture, portion size, and appearance may occur and shall not qualify for refunds or replacements.
        </p>

        <p className="mb-4 font-semibold">11. Complaint & Feedback Policy</p>
        <p className="mb-4">
          Complaints related to food quality, packaging, or delivery must be reported within twenty-four (24) hours of delivery. Complaints raised after this period may not be considered. RYVIVE ROOTS reserves the right to verify all complaints.
        </p>

        <p className="mb-4 font-semibold">12. Operational & Communication Policy</p>
        <p className="mb-4">
          RYVIVE ROOTS may assign delivery personnel, coordinators, or service partners as required. All subscription-related communication must be conducted through official RYVIVE ROOTS communication channels only.
        </p>

        <p className="mb-4 font-semibold">13. Service Modifications</p>
        <p className="mb-4">
          RYVIVE ROOTS reserves the right to modify menus, pricing, delivery schedules, or services due to operational requirements without prior notice.
        </p>

        <p className="mb-4 font-semibold">14. Service Suspension / Termination</p>
        <p className="mb-4">
          Services may be suspended or terminated without refund in cases of abusive behaviour, repeated misuse of policies, provision of false information, or violation of these Terms & Conditions.
        </p>

        <p className="mb-4 font-semibold">15. Intellectual Property</p>
        <p className="mb-4">
          All content, branding, logos, images, packaging, and materials are the intellectual property of RYVIVE ROOTS and may not be copied, reproduced, or used without prior written authorization.
        </p>

        <p className="mb-4 font-semibold">16. Force Majeure</p>
        <p className="mb-4">
          RYVIVE ROOTS shall not be liable for service delays or failures caused by events beyond reasonable control, including but not limited to natural disasters, government actions, strikes, pandemics, or transportation disruptions.
        </p>

        <p className="mb-4 font-semibold">17. Limitation of Liability</p>
        <p className="mb-4">
          To the maximum extent permitted by law, RYVIVE ROOTS shall not be liable for any indirect, incidental, or consequential damages. Liability, if any, shall be limited to the subscription amount paid by the customer.
        </p>

        <p className="mb-4 font-semibold">18. Severability</p>
        <p className="mb-4">
          If any provision of these Terms & Conditions is held to be invalid or unenforceable, the remaining provisions shall continue to remain in full force and effect.
        </p>

        <p className="mb-4 font-semibold">19. Acceptance of Terms</p>
        <p className="mb-0">
          By subscribing to or using RYVIVE ROOTS services, customers confirm that they have read, understood, and agreed to these Terms & Conditions.
        </p>
      </div>

      <label className="flex items-start gap-4 cursor-pointer" style={{ padding: '4px 0' }}>
        <div className="relative flex items-center justify-center mt-0.5" style={{ width: '18px', height: '18px' }}>
          <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="absolute opacity-0 w-full h-full cursor-pointer z-10" />
          <div style={{
            width: '100%',
            height: '100%',
            border: `1px solid ${termsAgreed ? SAGE_DARK : 'rgba(42,37,32,0.3)'}`,
            background: termsAgreed ? SAGE_DARK : 'transparent',
            borderRadius: '2px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {termsAgreed && <Check size={12} strokeWidth={3} color={CREAM} />}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(42,37,32,0.8)', lineHeight: 1.6, userSelect: 'none' }}>
          I have read and agree to the Terms & Conditions.
        </div>
      </label>
    </div>
  </div>);
}
/* — Step 5 — */
function PaymentStep({ plan, durationMonths, agreed, setAgreed }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const amount = plan.prices[durationMonths];
  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', icon: Landmark },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];
  return (<div>
    <h2 className="font-serif mb-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', color: INK, fontWeight: 300, lineHeight: 1.1 }}>
      Payment <em style={{ fontStyle: 'italic' }}>method.</em>
    </h2>
    <p className="mb-10" style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
      Choose how you'd like to pay for your subscription.
    </p>

    {/* PAYMENT METHODS */}
    <div className="p-7 lg:p-9 mb-8" style={{ background: CREAM_2, borderRadius: '2px', border: '1px solid rgba(42,37,32,0.08)' }}>
      <h3 className="tracking-[0.32em] uppercase mb-6" style={{ fontSize: '10px', color: SAGE_DARK }}>Payment Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentOptions.map((opt) => {
          const isSel = paymentMethod === opt.id;
          return (<motion.button key={opt.id} onClick={() => setPaymentMethod(opt.id)} whileTap={{ scale: 0.98 }} whileHover={{ y: -2 }} className="flex items-center gap-4 p-4 lg:p-5 text-left transition-all duration-300" style={{
            background: isSel ? INK : 'rgba(255,255,255,0.4)',
            border: `1px solid ${isSel ? INK : 'rgba(42,37,32,0.1)'}`,
            color: isSel ? CREAM : INK,
            borderRadius: '2px',
            boxShadow: isSel ? '0 10px 20px -10px rgba(42,37,32,0.2)' : 'none',
          }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors" style={{ background: isSel ? 'rgba(244,239,230,0.1)' : CREAM }}>
              <opt.icon size={18} strokeWidth={1.5} color={isSel ? SAGE : SAGE_DARK} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: isSel ? 400 : 300, flex: 1 }}>{opt.label}</div>
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0" style={{ borderColor: isSel ? SAGE : 'rgba(42,37,32,0.2)' }}>
              {isSel && <div className="w-2 h-2 rounded-full" style={{ background: SAGE }} />}
            </div>
          </motion.button>);
        })}
      </div>

      {/* Prominent Price Display */}
      <div className="mt-8 pt-8 flex items-end justify-between" style={{ borderTop: '1px solid rgba(42,37,32,0.08)' }}>
        <div>
          <div className="tracking-[0.24em] uppercase mb-2" style={{ fontSize: '10px', color: SAGE_DARK }}>Amount Due</div>
          <div className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 42px)', color: INK, fontWeight: 300, lineHeight: 1 }}>
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="tracking-[0.24em] uppercase" style={{ fontSize: '11px', color: 'rgba(42,37,32,0.5)', paddingBottom: '6px' }}>
          / {durationMonths === 1 ? 'month' : '3 months'}
        </div>
      </div>
    </div>

    <label className="flex items-start gap-4 cursor-pointer" style={{ padding: '4px 0' }}>
      <div className="relative flex items-center justify-center mt-0.5" style={{ width: '18px', height: '18px' }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="absolute opacity-0 w-full h-full cursor-pointer z-10" />
        <div style={{
          width: '100%',
          height: '100%',
          border: `1px solid ${agreed ? SAGE_DARK : 'rgba(42,37,32,0.3)'}`,
          background: agreed ? SAGE_DARK : 'transparent',
          borderRadius: '2px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {agreed && <Check size={12} strokeWidth={3} color={CREAM} />}
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(42,37,32,0.8)', lineHeight: 1.6, userSelect: 'none' }}>
        I agree to the Terms & Conditions and Privacy Policy
      </div>
    </label>
  </div>);
}
