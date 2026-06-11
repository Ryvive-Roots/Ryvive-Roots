import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Leaf, Calendar, Clock, Sprout } from 'lucide-react';
import { useState, useEffect } from 'react';
// Images
import heroImage from "@/app/images/Avocado-Shake.png";
import heroImageMobile from "@/app/images/Avocado-Shake-vertical.jpg";
import landing1 from "@/app/images/Landing-1.jpeg";
import landing2 from "@/app/images/Landing-2.jpeg";
import story1 from "@/app/images/Story-1.JPG";
import menu4 from "@/app/images/Menu-4.jpeg";
import salad from "@/app/images/salad.JPG";
import sandwich from "@/app/images/sandwich.JPG";
import soup from "@/app/images/soup.JPG";
import wrap from "@/app/images/wrap.JPG";
import pasta from "@/app/images/pasta.JPG";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
// Testimonials Data exactly as requested
const testimonials = [
    {
        name: "Monika Korgaonkar",
        text: "One of the best dining experiences I’ve had. The ingredients were fresh, the flavors were perfect, and the presentation was excellent. Highly recommended for food lovers."
    },
    {
        name: "Dileep Kumar",
        text: "Tried this place for the first time today and honestly didn’t expect healthy food to taste this good. Everything was fresh and nicely seasoned. Definitely coming back."
    },
   
    {
        name: "Santosh Gupta",
        text: "I Tried the immunity booster and libido booster. I feel energetic and it tastes so good. Thank you Ryvive Roots for giving me such a good experience and ambience is so good."
    },
    {
        name: "Rajan Jadhav",
        text: "Loved the detox juices here. Very refreshing and natural taste."
    },
    {
        name: "Afroza Khan",
        text: "Loved the detox juices here. Very refreshing and natural taste."
    },
    {
        name: "Shashi Shetty",
        text: "Excellent ambience and soulful food."
    },
    {
        name: "Vishal Shetty",
        text: "This place is a hidden gem! If you guys are into conscious and healthy eating, look no further."
    },
    {
        name: "Sonali Ovhal",
        text: "It's outstanding awesome and healthy please try, be fit stay healthy."
    },
    {
        name: "The Alok Tamhankar Show",
        text: "A super healthy alternative to unwanted junk food... Bon appetite... Must try"
    }
];
// 4 Categories Data mapped to original card visuals
const categories = [
    { title: "Healthy Sandwich", desc: "Grilled, stacked, and built to fuel. Every sandwich is layered with clean proteins, fresh greens, and house-made spreads, no empty carbs, no compromises.", price: "Clean Protein", image: sandwich },
    { title: "Healthy Salads", desc: "A bowl that does more than look good. Tossed with seasonal greens, whole grains, and dressings made from scratch, every bite is balanced, intentional, and genuinely satisfying.", price: "House Bowls", image: salad },
    { title: "Healthy Wraps", desc: "Tight, clean, and packed with purpose. Our wraps bring together lean proteins, crisp vegetables, and bold flavour, rolled fresh and ready to keep you going.", price: "Fresh Rolls", image: wrap },
    { title: "Healthy Soup", desc: "Slow-cooked, scratch-made, and quietly powerful. Each soup is built on real stock, whole vegetables, and nothing artificial, warmth your body actually recognises.", price: "Warm Bowls", image: soup },
    { title: "Healthy Pasta", desc: "Not your average comfort food. Spiralised vegetables replace empty carbs, tossed in house-crafted sauces that are bold in flavour and clean in every ingredient.", price: "Zoodle House", image: pasta },
    { title: "Healthy Juices", desc: "Every glass starts with real fruit and ends with a reason. Blended fresh, never bottled, natural flavour, functional ingredients, and zero added sugar in every sip.", price: "Elixirs", image: heroImage }
];
// Custom premium ease-in-out scroll utility
const smoothScrollTo = (targetEl) => {
  if (!targetEl) return;
  const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 800; // 800ms duration for premium feel
  let startTime = null;

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  };

  requestAnimationFrame(animation);
};

export default function Home() {
    // Testimonial sliding state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const visibleCards = 1;
    // Autoplay Slider - Slides one by one with a 2800ms delay
    useEffect(() => {
        if (isHovered)
            return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = testimonials.length - visibleCards;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 2800);
        return () => clearInterval(interval);
    }, [isHovered]);
    const handleNextTestimonial = () => {
        setCurrentIndex((prev) => {
            const maxIndex = testimonials.length - visibleCards;
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };
    const handlePrevTestimonial = () => {
        setCurrentIndex((prev) => {
            const maxIndex = testimonials.length - visibleCards;
            return prev === 0 ? maxIndex : prev - 1;
        });
    };
    return (<>
      {/* HERO — DARK (ORIGINAL VISUAL DESIGN PRESERVED EXACTLY) */}
      <section className="relative min-h-screen flex items-start md:items-center overflow-hidden" style={{ background: DARK_2 }}>
        <div className="absolute inset-0">
          {/* Desktop Hero Image */}
          <div className="hidden md:block absolute inset-0">
            <ImageWithFallback src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
          </div>
          {/* Mobile Hero Image */}
          <div className="block md:hidden absolute inset-0">
            <ImageWithFallback src={heroImageMobile} alt="Hero" className="w-full h-full object-cover"/>
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,15,0.55) 0%, rgba(20,17,15,0.4) 50%, rgba(20,17,15,0.95) 100%)' }}/>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-14 w-full pt-[120px] md:pt-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="max-w-3xl">
            {/* Eyebrow Text */}
            <div className="tracking-[0.42em] uppercase mb-6 md:mb-10 flex items-center gap-4" style={{ fontSize: '11px', color: CREAM, fontWeight: 600 }}>
              <span style={{ width: '36px', height: '1px', background: CREAM, display: 'inline-block' }}/>
             FOOD ENGINEERED FOR YOUR BEST SELF.
            </div>
            
            {/* Main Heading */}
            <h1 className="mb-6 md:mb-10 text-left" style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontSize: 'clamp(32px, 4.5vw, 62px)', lineHeight: 1.04, letterSpacing: '-0.012em', color: CREAM, fontWeight: 700 }}>
           
              <span style={{ fontFamily: "'Bodoni Moda', Georgia, serif", fontStyle: 'normal', color: SAGE, fontWeight: 700, fontSize: 'clamp(54px, 8vw, 108px)', textTransform: 'uppercase' }}>Ryvive Roots</span>
            </h1>
            
            {/* Subheading */}
            <p className="mb-8 md:mb-14 max-w-xl text-left" style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(244,239,230,0.65)' }}>
             We built Ryvive Roots for one reason —
because clean food should never feel like a sacrifice.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-8">
              {/* Desktop CTA */}
              <Link to="/subscription" className="hidden md:inline-block tracking-[0.22em] uppercase transition-colors" style={{ fontSize: '11px', color: 'rgba(244,239,230,0.7)' }}>
                Start Subscription →
              </Link>
            </div>

          </motion.div>
        </div>

        {/* Mobile Glassmorphism CTA */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 block md:hidden">
          <Link 
            to="/subscription" 
            className="inline-flex items-center justify-center px-10 tracking-[0.22em] uppercase transition-all duration-300 hover:bg-white/20 active:scale-[0.98]" 
            style={{ 
              fontSize: '11px', 
              color: '#ffffff',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              borderRadius: '999px',
              height: '54px',
              width: 'max-content',
              whiteSpace: 'nowrap',
              fontWeight: 600
            }}
          >
            Start Subscription →
          </Link>
        </div>

        <motion.button 
          onClick={() => {
            const nextSection = document.getElementById('what-we-serve');
            smoothScrollTo(nextSection);
          }}
          animate={{ y: [0, 6, 0] }} 
          transition={{ repeat: Infinity, duration: 2.4 }} 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 tracking-[0.34em] uppercase" 
          style={{ fontSize: '10px', color: 'rgba(244,239,230,0.8)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Scroll to next section"
        >
          Scroll
        </motion.button>
      </section>

      {/* 2. WHAT WE SERVE SECTION — LIGHT (ORIGINAL VISUAL STYLE PRESERVED) */}
      <section id="what-we-serve" data-tone="light" className="pt-20 pb-16 lg:pt-28 lg:pb-20" style={{ background: CREAM }}>
        <div className="max-w-[1100px] mx-auto px-8 lg:px-14 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            {/* Section Label */}
            <div className="tracking-[0.42em] uppercase mb-8" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>WHAT WE SERVE</div>
            
            {/* Main Heading */}
            <h2 className="font-serif mx-auto mb-8" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.2, color: INK, fontWeight: 300, maxWidth: '900px' }}>
             NOURISHMENT<br />
              WITHOUT<br />
              <em style={{ fontStyle: 'italic', color: SAGE_DARK }}>COMPROMISE</em>
            </h2>

             

             <p className="mx-auto font-semibold max-w-2xl text-[18px]" style={{ lineHeight: 2.45, color: 'rgba(42,37,32,0.78)' }}>
              NO LABELS TO DECODE. JUST FOOD.
            </p>

            {/* Paragraph Text */}
            <p className="mx-auto max-w-2xl text-[14px]" style={{ lineHeight: 1.85, color: 'rgba(42,37,32,0.78)' }}>
              If you can't picture the ingredient, it doesn't belong on your plate. At Ryvive Roots, every item is exactly what it sounds like — clean, whole, and honestly prepared.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES SECTION — LIGHT (ORIGINAL CARD STYLING PRESERVED) */}
      <section data-tone="light" className="pt-12 pb-24 lg:pt-16 lg:pb-32" style={{ background: CREAM }}>
        <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
          <div className="flex items-end justify-between mb-20 flex-wrap gap-8">
            <div>
              <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>— Signature</div>
              <h2 className="font-serif text-left" style={{ fontSize: 'clamp(34px, 4.2vw, 56px)', lineHeight: 1.05, color: INK, fontWeight: 300, letterSpacing: '-0.01em' }}>
                Our signature<br />
                <em style={{ fontStyle: 'italic' }}>categories.</em>
              </h2>
            </div>
            <Link to="/menu" className="tracking-[0.22em] uppercase pb-1" style={{ fontSize: '11px', color: INK, borderBottom: `1px solid ${INK}` }}>
              View Full Menu →
            </Link>
          </div>

          {/* Infinite horizontal scroll marquee with navigation arrows */}
          <div className="relative group/carousel">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const el = document.querySelector('.marquee-track');
                if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex lg:hidden lg:group-hover/carousel:flex items-center justify-center transition-all duration-300"
              style={{
                height: 44,
                width: 44,
                borderRadius: '50%',
                background: 'rgba(244,239,230,0.92)',
                border: '1px solid rgba(42,37,32,0.1)',
                boxShadow: '0 4px 16px rgba(20,17,15,0.1)',
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} strokeWidth={1.4} color={INK} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const el = document.querySelector('.marquee-track');
                if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex lg:hidden lg:group-hover/carousel:flex items-center justify-center transition-all duration-300"
              style={{
                height: 44,
                width: 44,
                borderRadius: '50%',
                background: 'rgba(244,239,230,0.92)',
                border: '1px solid rgba(42,37,32,0.1)',
                boxShadow: '0 4px 16px rgba(20,17,15,0.1)',
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} strokeWidth={1.4} color={INK} />
            </button>

            <div className="overflow-hidden marquee-track" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex animate-marquee gap-8 group-hover/carousel:pause-marquee" style={{ width: 'max-content' }}>
                {[...categories, ...categories].map((item, i) => (
                  <div key={i} className="group cursor-pointer text-left flex-shrink-0" style={{ width: '300px' }}>
                    <div className="relative overflow-hidden mb-7" style={{ aspectRatio: '3/4' }}>
                      <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"/>
                    </div>

                    <div className="flex items-baseline justify-between mb-2 gap-4">
                      <h3 className="font-serif" style={{ fontSize: '20px', color: INK, fontWeight: 400 }}>
                        {item.title}
                      </h3>

                      <span style={{
                  fontSize: '13px',
                  color: SAGE_DARK,
                  letterSpacing: '0.05em'
              }}>
                        {item.price}
                      </span>
                    </div>

                    <p style={{
                  fontSize: '13px',
                  color: 'rgba(42,37,32,0.6)',
                  lineHeight: 1.7
              }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
            .group\\/carousel:hover .animate-marquee {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* 4. ABOUT / PHILOSOPHY SECTION — DARK (ORIGINAL VISUAL STYLE PRESERVED) */}
      <section id="story" className="py-32 lg:py-44" style={{ background: DARK }}>
        <div className="max-w-[1300px] mx-auto px-8 lg:px-14">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <ImageWithFallback src={story1} alt="Carefully plated food" className="w-full h-full object-cover"/>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}>
              <div className="tracking-[0.42em] uppercase mb-6 text-left" style={{ fontSize: '11px', color: CREAM, fontWeight: 600 }}>— Philosophy</div>
              <h2 className="font-serif mb-10 text-left" style={{ fontSize: 'clamp(32px, 3.8vw, 50px)', lineHeight: 1.1, color: CREAM, fontWeight: 300 }}>
                Real food.<br />
                <em style={{ fontStyle: 'italic' }}>Real Ingredients. <br/> Real Change.</em>
                
              </h2>

               <p className="mx-auto font-semibold max-w-2xl text-[18px]" style={{ lineHeight: 2.45, color: 'rgba(244,239,230,0.72)' }}>
              We cook like someone's watching.
            </p>
              
              {/* PDF Copy Paragraph */}
              <p className="text-left" style={{ fontSize: '15px', color: 'rgba(244,239,230,0.72)', lineHeight: 1.85, marginBottom: '48px', maxWidth: '480px' }}>
               Because they are, you. At Ryvive Roots, every ingredient is chosen as if you're standing right there in the kitchen. No shortcuts. No substitutes. Just food made the way it should be.
              </p>

              <div className="grid grid-cols-3 gap-8 mb-8 pt-10" style={{ borderTop: '1px solid rgba(244,239,230,0.15)' }}>
                {[
            { label: 'Organic', v: '100', s: '%' },
            { label: 'Preservatives', v: '00', s: '%' },
            { label: 'Daily Prep', v: '24', s: 'h' },
        ].map((stat, i) => (<div key={i} className="text-left">
                    <div className="font-serif mb-2" style={{ fontSize: '34px', color: CREAM, fontWeight: 300 }}>
                      {stat.v}<span style={{ color: SAGE, fontSize: '18px' }}>{stat.s}</span>
                    </div>
                    <div className="tracking-[0.2em] uppercase" style={{ fontSize: '10px', color: 'rgba(244,239,230,0.55)' }}>{stat.label}</div>
                  </div>))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8 pt-8 mb-12 text-left" style={{ borderTop: '1px solid rgba(244,239,230,0.12)' }}>
                {[
                  { icon: ShieldCheck, text: 'No Preservatives' },
                  { icon: Sparkles, text: 'No Added Sugar' },
                  { icon: Leaf, text: 'No Artificial Flavours' },
                  { icon: Calendar, text: 'Rotational Menu' },
                  { icon: Clock, text: 'Morning & Evening Delivery' },
                  { icon: Sprout, text: 'Fresh Daily Preparation' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon size={16} strokeWidth={1.4} color={SAGE} className="flex-shrink-0" />
                      <span style={{ fontSize: '12px', color: 'rgba(244,239,230,0.72)', letterSpacing: '0.04em' }}>{item.text}</span>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / CLIENT DIARIES — LIGHT CAROUSEL (ORIGINAL CARD STYLING PRESERVED) */}
      <section data-tone="light" className="py-32 lg:py-40 relative overflow-hidden" style={{ background: CREAM_2 }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="max-w-[1100px] mx-auto px-8 lg:px-14">
          {/* Section Header */}
          <div className="text-center mb-20 relative">
            <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>— Voices</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(30px, 3.5vw, 46px)', lineHeight: 1.1, color: INK, fontWeight: 300 }}>
              CLIENT DIARIES
            </h2>
          </div>

          {/* Testimonials Carousel Track Container with swipe controls */}
          <div className="relative w-full max-w-2xl mx-auto overflow-hidden py-4">
            <motion.div className="flex gap-12 items-stretch" animate={{ x: `calc(-${currentIndex} * (100% + 48px) / ${visibleCards})` }} transition={{ type: "spring", stiffness: 90, damping: 18 }} onPanEnd={(event, info) => {
            const threshold = 50;
            if (info.offset.x < -threshold) {
                handleNextTestimonial();
            }
            else if (info.offset.x > threshold) {
                handlePrevTestimonial();
            }
        }}>
              {testimonials.map((t, idx) => (<div key={idx} className="flex-shrink-0 flex flex-col justify-between text-left" style={{
                width: `calc((100% - ${(visibleCards - 1) * 48}px) / ${visibleCards})`,
            }}>
                  {/* Testimonial Quote Text with Original Styling */}
                  <div className="font-serif mb-8" style={{ fontSize: '22px', lineHeight: 1.6, color: INK, fontWeight: 300, fontStyle: 'italic' }}>
                    “{t.text}”
                  </div>
                  
                  {/* Testimonial Divider & Client Name */}
                  <div className="pt-6" style={{ borderTop: '1px solid rgba(42,37,32,0.15)' }}>
                    <div style={{ fontSize: '13px', color: INK, letterSpacing: '0.04em', fontWeight: 600 }}>{t.name}</div>
                    <div className="tracking-[0.22em] uppercase mt-1" style={{ fontSize: '10px', color: 'rgba(42,37,32,0.55)' }}>Verified Client</div>
                  </div>
                </div>))}
            </motion.div>
          </div>

          {/* Left/Right Navigation and Autoplay Indicators */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Left Glassmorphism Arrow Button */}
            <button onClick={handlePrevTestimonial} className="p-3 rounded-full border transition-all duration-300 group cursor-pointer" style={{
            borderColor: 'rgba(42, 37, 32, 0.15)',
            background: 'rgba(42, 37, 32, 0.01)',
            backdropFilter: 'blur(8px)'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(42, 37, 32, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(42, 37, 32, 0.3)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(42, 37, 32, 0.01)';
            e.currentTarget.style.borderColor = 'rgba(42, 37, 32, 0.15)';
        }}>
              <ChevronLeft size={16} style={{ color: INK }}/>
            </button>
            
            {/* Dynamic Slider Pagination Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: testimonials.length - visibleCards + 1 }).map((_, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className="h-1.5 rounded-full transition-all duration-500 cursor-pointer" style={{
                width: currentIndex === index ? '18px' : '6px',
                background: currentIndex === index ? SAGE_DARK : 'rgba(42, 37, 32, 0.15)'
            }}/>))}
            </div>

            {/* Right Glassmorphism Arrow Button */}
            <button onClick={handleNextTestimonial} className="p-3 rounded-full border transition-all duration-300 group cursor-pointer" style={{
            borderColor: 'rgba(42, 37, 32, 0.15)',
            background: 'rgba(42, 37, 32, 0.01)',
            backdropFilter: 'blur(8px)'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(42, 37, 32, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(42, 37, 32, 0.3)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(42, 37, 32, 0.01)';
            e.currentTarget.style.borderColor = 'rgba(42, 37, 32, 0.15)';
        }}>
              <ChevronRight size={16} style={{ color: INK }}/>
            </button>
          </div>

        </div>
      </section>

      {/* 6. FINAL CTA SECTION — DARK (ORIGINAL VISUAL STYLE PRESERVED) */}
      <section className="relative py-32 lg:py-44 overflow-hidden" style={{ background: DARK_2 }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,149,121,0.5), transparent 60%)' }}/>
        
        <div className="relative max-w-[900px] mx-auto px-8 lg:px-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <div className="tracking-[0.42em] uppercase mb-8" style={{ fontSize: '11px', color: CREAM, fontWeight: 600 }}>— Final Creed</div>
            
            {/* Main Heading */}
            <h2 className="font-serif mb-12" style={{ fontSize: 'clamp(34px, 4.4vw, 60px)', lineHeight: 1.05, color: CREAM, fontWeight: 300, letterSpacing: '-0.01em' }}>
              REAL FOOD.<br />
              <em style={{ fontStyle: 'italic', color: SAGE }}>REAL CHANGE.</em>
            </h2>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Link to="/menu" className="inline-block px-9 py-4 tracking-[0.26em] uppercase transition-all duration-300" style={{ fontSize: '11px', border: `1px solid ${SAGE}`, color: DARK_2, background: SAGE, borderRadius: '1px' }} onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.borderColor = CREAM; }} onMouseLeave={(e) => { e.currentTarget.style.background = SAGE; e.currentTarget.style.borderColor = SAGE; }}>
                Explore Menu
              </Link>
              <Link to="/subscription" className="inline-block px-9 py-4 tracking-[0.26em] uppercase transition-all duration-300" style={{ fontSize: '11px', border: `1px solid rgba(244,239,230,0.25)`, color: CREAM, background: 'transparent', borderRadius: '1px' }} onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; e.currentTarget.style.color = INK; e.currentTarget.style.borderColor = CREAM; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = CREAM; e.currentTarget.style.borderColor = 'rgba(244,239,230,0.25)'; }}>
                Join Subscription
              </Link>
            </div>

          </motion.div>
        </div>
      </section>
    </>);
}
