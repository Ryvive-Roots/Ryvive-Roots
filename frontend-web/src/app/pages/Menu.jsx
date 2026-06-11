import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
import { menuSections } from '../content/menuContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import menu1 from '../images/Menu-1.jpeg';
import menu2 from '../images/Menu-2.jpeg';
import menu3 from '../images/Menu-3.jpeg';
import menu4 from '../images/Menu-4.jpeg';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const spreadImages = [menu1, menu2, menu3, menu4];

const spreads = menuSections.map((section, index) => ({
    number: section.number,
    title: section.title,
    subtitle: section.subtitle,
    image: spreadImages[index % spreadImages.length],
    blurb: section.blurb,
    dishes: section.items.map((item) => ({
        name: item.name,
        desc: item.description,
        details: item.details,
        price: item.price,
        image: spreadImages[index % spreadImages.length],
    })),
}));

const ease = [0.22, 1, 0.36, 1];

export default function Menu() {
    const containerRef = useRef(null);
    const navRef = useRef(null);
    const stRef = useRef(null);
    const pageIndexRef = useRef(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [savedDishes, setSavedDishes] = useState(new Set());
    const [activeDish, setActiveDish] = useState(null);

    useEffect(() => {
        const pages = gsap.utils.toArray('.spread-page');
        if (!pages.length) return;

        gsap.set(containerRef.current, {
            perspective: 2200,
        });

        gsap.set(pages, {
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            backfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            willChange: 'transform',
            force3D: true,
        });

        pages.forEach((page, i) => {
            gsap.set(page, {
                zIndex: spreads.length - i,
                rotateY: 0,
                xPercent: 0,
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 72px',
                end: `+=${window.innerHeight * 0.45 * spreads.length}`,
                scrub: 0.2, // Instantly trace scroll wheel
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const newIndex = Math.round(self.progress * Math.max(0, spreads.length - 1));
                    if (pageIndexRef.current !== newIndex) {
                        pageIndexRef.current = newIndex;
                        setPageIndex(newIndex);
                    }
                },
            },
        });

        pages.forEach((page, i) => {
            if (i === pages.length - 1) return;
            tl.to(page, {
                rotateY: -180,
                duration: 1,
                ease: 'none',
            }, i);
        });

        stRef.current = tl.scrollTrigger;

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, []);

    const toggleSave = useCallback((name) => {
        setSavedDishes((s) => {
            const ns = new Set(s);
            if (ns.has(name)) ns.delete(name);
            else ns.add(name);
            return ns;
        });
    }, []);

    const openDish = useCallback((d) => {
        setActiveDish(d);
    }, []);

    const closeDish = useCallback(() => {
        setActiveDish(null);
    }, []);

    const goTo = useCallback((i) => {
        setPageIndex(i);
        pageIndexRef.current = i;
        if (stRef.current) {
            const st = stRef.current;
            const progress = i / Math.max(1, spreads.length - 1);
            const targetScroll = st.start + (st.end - st.start) * progress;
            gsap.to(window, { scrollTo: targetScroll, duration: 0.7, ease: 'power2.out' });
        }
    }, []);

    const scrollNav = useCallback((dir) => {
        const el = navRef.current;
        if (!el) return;
        const amount = Math.max(240, Math.floor(el.clientWidth * 0.45));
        el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }, []);

    // ensure nav starts at left and update arrow availability
    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        el.scrollLeft = 0;
        const update = () => {
            setCanScrollLeft(el.scrollLeft > 6);
            setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 6);
        };
        update();
        el.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            el.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <div style={{ background: CREAM }} className="min-h-screen">
            {/* HERO */}
            <section data-tone="light" className="px-5 sm:px-8 lg:px-14 pt-20 lg:pt-24 pb-6 lg:pb-8 text-center">
                <div className="tracking-[0.42em] uppercase mb-5" style={heroLabelStyle}>— Taste the Wellness</div>
                <h1 className="font-serif" style={heroTitleStyle}>
                    Our <em style={italicStyle}>Menu.</em>
                </h1>
                <p className="mx-auto mt-6" style={heroDescStyle}>
                    Scroll through the chapters of cold-pressed vitality, curated salads, sandwiches, wraps, soups, chaat, zoodles, and house-crafted dips.
                </p>
            </section>

            {/* CHAPTER NAV */}
            <section data-tone="light" className="px-5 sm:px-8 lg:px-14 pb-8 sticky top-[72px] z-50" style={navSectionStyle}>
                <div className="max-w-[1400px] mx-auto px-2">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <button
                                aria-label="Scroll categories left"
                                onClick={() => scrollNav('left')}
                                className="hidden md:inline-flex items-center justify-center"
                                style={{
                                    ...navArrowStyle,
                                    opacity: canScrollLeft ? 1 : 0.36,
                                    pointerEvents: canScrollLeft ? 'auto' : 'none'
                                }}
                            >
                                <ChevronLeft size={16} strokeWidth={1.2} color={'rgba(20,17,15,0.68)'} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div ref={navRef} className="flex items-center gap-4 whitespace-nowrap overflow-x-auto py-3 px-1" style={navScrollStyle}>
                                {spreads.map((s, i) => (
                                    <NavPill key={s.number} spread={s} index={i} isActive={i === pageIndex} goTo={goTo} />
                                ))}
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <button
                                aria-label="Scroll categories right"
                                onClick={() => scrollNav('right')}
                                className="hidden md:inline-flex items-center justify-center"
                                style={{
                                    ...navArrowStyle,
                                    opacity: canScrollRight ? 1 : 0.36,
                                    pointerEvents: canScrollRight ? 'auto' : 'none'
                                }}
                            >
                                <ChevronRight size={16} strokeWidth={1.2} color={'rgba(20,17,15,0.68)'} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* GSAP SCROLL-DRIVEN BOOK */}
            <div ref={containerRef} className="relative w-full h-[88vh] overflow-hidden bg-[var(--cream)]" style={bookContainerStyle}>
                <div className="absolute inset-0 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-14 py-8 flex items-center justify-center">
                    <div className="relative w-full h-full lg:h-[85vh] max-h-[900px]">
                        {spreads.map((spread, i) => (
                            <div
                                key={spread.number}
                                className="spread-page absolute inset-0 w-full h-full"
                                style={{
                                    zIndex: spreads.length - i,
                                    backfaceVisibility: 'hidden',
                                    background: CREAM,
                                    boxShadow: '0 18px 40px rgba(20,17,15,0.06)',
                                }}
                            >
                                <SpreadView
                                    spread={spread}
                                    saved={savedDishes}
                                    onSave={toggleSave}
                                    onOpen={openDish}
                                    pageIndex={i}
                                    total={spreads.length}
                                    isActive={i === pageIndex}
                                    isNearby={Math.abs(i - pageIndex) <= 1}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CLOSING */}
            <section className="py-20 lg:py-28 text-center" style={{ background: DARK_2 }}>
                <div className="max-w-[680px] mx-auto px-6">
                    <div className="tracking-[0.42em] uppercase mb-6" style={closingLabelStyle}>— A Final Note</div>
                    <p className="font-serif" style={closingTextStyle}>
                        Our menu shifts with the season — <em style={{ fontStyle: 'italic', color: SAGE }}>arrive curious.</em>
                    </p>
                </div>
            </section>

            {/* DISH MODAL */}
            <AnimatePresence>
                {activeDish && (
                    <DishModal dish={activeDish} onClose={closeDish} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Memoized Nav Pill ───────────────────────────────────────────────────────

const NavPill = memo(function NavPill({ spread, index, isActive, goTo }) {
    return (
        <button
            onClick={() => goTo(index)}
            className="flex items-center gap-3 transition-all duration-300 flex-shrink-0"
            style={{
                fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase',
                color: isActive ? CREAM : INK,
                background: isActive ? INK : 'transparent',
                border: `1px solid ${isActive ? INK : 'rgba(42,37,32,0.12)'}`,
                borderRadius: '6px',
                minWidth: 100,
                whiteSpace: 'nowrap',
                padding: '10px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <span style={navPillNumberStyle}>{spread.number}</span>
            <span className="whitespace-nowrap" style={navPillTitleStyle}>{spread.title}</span>
        </button>
    );
});

// ─── Memoized Dish Modal ─────────────────────────────────────────────────────

const DishModal = memo(function DishModal({ dish, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
            style={modalOverlayStyle}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full sm:max-w-[520px] overflow-hidden"
                style={modalContentStyle}
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 transition-transform active:scale-90" style={modalCloseStyle}>
                    <X size={18} strokeWidth={1.4} color={INK} />
                </button>
                <div style={{ aspectRatio: '4/3' }} className="overflow-hidden">
                    <ImageWithFallback src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-7 sm:p-9">
                    <div className="flex items-baseline justify-between gap-4 mb-3">
                        <h3 className="font-serif" style={modalDishNameStyle}>{dish.name}</h3>
                        <span className="font-serif flex-shrink-0" style={modalDishPriceStyle}>{dish.price}</span>
                    </div>
                    <p style={modalDishDescStyle}>{dish.desc}</p>

                    <div className="mt-6 pt-6" style={modalDividerStyle}>
                        <div className="tracking-[0.32em] uppercase mb-3" style={modalIngredientsLabelStyle}>Ingredients</div>
                        <p style={modalIngredientsTextStyle}>{dish.details}</p>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} className="mt-8 w-full flex items-center justify-center gap-3 py-4 tracking-[0.24em] uppercase" style={modalAddBtnStyle}>
                        <Plus size={14} strokeWidth={1.6} /> Add to Order
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
});

// ─── Memoized SpreadView ─────────────────────────────────────────────────────

const SpreadView = memo(function SpreadView({ spread, saved, onSave, onOpen, pageIndex, total, isActive, isNearby }) {
    // Only render full content for active and adjacent pages
    if (!isNearby) {
        return (
            <div className="w-full h-full flex flex-col lg:flex-row bg-[#F4EFE6] overflow-hidden relative">
                <div className="w-full lg:w-1/2 h-[35vh] lg:h-full relative overflow-hidden flex-shrink-0" style={leftPageStyle} />
                <div className="w-full lg:w-1/2 flex-1 relative" style={{ background: CREAM_2 }} />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col lg:flex-row bg-[#F4EFE6] overflow-hidden relative">
            {/* LEFT PAGE — image */}
            <div className="w-full lg:w-1/2 h-[35vh] lg:h-full relative overflow-hidden flex-shrink-0" style={leftPageStyle}>
                <ImageWithFallback src={spread.image} alt={spread.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0" style={imageOverlayStyle} />
                <div className="absolute top-0 right-0 bottom-0 hidden lg:block" style={pageCurlRightStyle} />
                <div className="absolute top-6 left-6 lg:top-10 lg:left-10 font-serif tracking-[0.42em]" style={chapterLabelStyle}>
                    — Chapter {spread.number}
                </div>
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
                    <h2 className="font-serif" style={spreadTitleStyle}>
                        {spread.title}<br />
                        <em style={{ fontStyle: 'italic', color: SAGE }}>{spread.subtitle}</em>
                    </h2>
                </div>
            </div>

            {/* RIGHT PAGE — dishes */}
            <div className="w-full lg:w-1/2 flex-1 relative px-5 sm:px-10 lg:px-14 py-7 lg:py-12 flex flex-col overflow-y-auto overscroll-contain" style={rightPageStyle}>
                <div className="absolute top-0 left-0 bottom-0 hidden lg:block" style={pageCurlLeftStyle} />

                <p className="font-serif italic mb-6 lg:mb-8 flex-shrink-0" style={blurbStyle}>
                    {spread.blurb}
                </p>

                <ul className="space-y-5 flex-1">
                    {spread.dishes.map((d, i) => (
                        <DishItem
                            key={d.name}
                            dish={d}
                            index={i}
                            isSaved={saved.has(d.name)}
                            onSave={onSave}
                            onOpen={onOpen}
                            shouldAnimate={isActive}
                        />
                    ))}
                </ul>

                <div className="mt-6 flex items-center justify-between flex-shrink-0">
                    <div className="font-serif tracking-[0.32em]" style={pageNumberLeftStyle}>
                        — {spread.number}
                    </div>
                    <div className="tracking-[0.22em] uppercase" style={pageNumberRightStyle}>
                        Page {pageIndex + 1} of {total}
                    </div>
                </div>
            </div>
        </div>
    );
});

// ─── Memoized DishItem ───────────────────────────────────────────────────────

const DishItem = memo(function DishItem({ dish, index, isSaved, onSave, onOpen, shouldAnimate }) {
    return (
        <motion.li
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.05 + index * 0.03, duration: 0.35, ease: 'easeOut' }}
            className="pb-4"
            style={dishItemBorderStyle}
        >
            <div className="flex items-start gap-4">
                <button onClick={() => onOpen(dish)} className="flex-1 text-left transition-transform active:scale-[0.99]">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                        <h3 className="font-serif" style={dishNameStyle}>{dish.name}</h3>
                        <span className="font-serif flex-shrink-0" style={dishPriceStyle}>{dish.price}</span>
                    </div>
                    {dish.details && (
                        <div className="tracking-[0.22em] uppercase mb-2" style={dishDetailsStyle}>
                            {dish.details}
                        </div>
                    )}
                    <p style={dishDescStyle}>{dish.desc}</p>
                </button>

                <motion.button whileTap={{ scale: 0.85 }} onClick={() => onSave(dish.name)} className="flex-shrink-0 mt-1 p-2" aria-label="Save dish">
                    <Heart size={18} strokeWidth={1.4} fill={isSaved ? SAGE_DARK : 'transparent'} color={isSaved ? SAGE_DARK : 'rgba(42,37,32,0.4)'} />
                </motion.button>
            </div>
        </motion.li>
    );
});

// ─── Static style objects (hoisted to avoid re-creation on render) ───────────

const heroLabelStyle = { fontSize: '10px', color: SAGE_DARK, fontWeight: 600 };
const heroTitleStyle = { fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1.02, color: INK, fontWeight: 300, letterSpacing: '-0.015em' };
const italicStyle = { fontStyle: 'italic' };
const heroDescStyle = { fontSize: '14px', lineHeight: 1.85, color: 'rgba(42,37,32,0.6)', maxWidth: '520px' };

const navSectionStyle = { background: 'rgba(244,239,230,0.92)', backdropFilter: 'blur(12px)' };
const navArrowStyle = {
    height: 36, width: 36, borderRadius: 6,
    border: '1px solid rgba(20,17,15,0.06)',
    background: 'transparent',
    transition: 'opacity 160ms ease, transform 120ms ease, background-color 160ms ease',
    alignItems: 'center', justifyContent: 'center',
};
const navScrollStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' };
const navPillNumberStyle = { opacity: 0.65, fontSize: 12, marginRight: 8 };
const navPillTitleStyle = { fontWeight: 400 };

const bookContainerStyle = { perspective: '2500px' };

const leftPageStyle = { background: DARK, boxShadow: '20px 0 40px -20px rgba(42,37,32,0.18)', zIndex: 2 };
const imageOverlayStyle = { background: 'linear-gradient(180deg, rgba(20,17,15,0.15) 0%, rgba(20,17,15,0.6) 100%)' };
const pageCurlRightStyle = { width: '24px', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 100%)' };
const pageCurlLeftStyle = { width: '24px', background: 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 100%)' };
const chapterLabelStyle = { fontSize: '11px', color: CREAM, fontWeight: 600 };
const spreadTitleStyle = { fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 1.05, color: CREAM, fontWeight: 300 };

const rightPageStyle = { background: CREAM_2, zIndex: 1 };
const blurbStyle = { fontSize: '15px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.7, maxWidth: '420px' };
const pageNumberLeftStyle = { fontSize: '11px', color: SAGE_DARK, fontWeight: 600 };
const pageNumberRightStyle = { fontSize: '10px', color: 'rgba(42,37,32,0.5)' };

const dishItemBorderStyle = { borderBottom: '1px solid rgba(42,37,32,0.12)' };
const dishNameStyle = { fontSize: '17px', color: INK, fontWeight: 400, lineHeight: 1.25 };
const dishPriceStyle = { fontSize: '15px', color: SAGE_DARK, letterSpacing: '0.04em' };
const dishDetailsStyle = { fontSize: '9px', color: SAGE_DARK, opacity: 0.8 };
const dishDescStyle = { fontSize: '13px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.65 };

const modalOverlayStyle = { background: 'rgba(20,17,15,0.7)', backdropFilter: 'blur(8px)' };
const modalContentStyle = { background: CREAM, borderRadius: '2px 2px 0 0' };
const modalCloseStyle = { background: 'rgba(244,239,230,0.9)', borderRadius: '50%' };
const modalDishNameStyle = { fontSize: '26px', color: INK, fontWeight: 300, lineHeight: 1.15 };
const modalDishPriceStyle = { fontSize: '20px', color: SAGE_DARK };
const modalDishDescStyle = { fontSize: '14px', color: 'rgba(42,37,32,0.7)', lineHeight: 1.75 };
const modalDividerStyle = { borderTop: '1px solid rgba(42,37,32,0.12)' };
const modalIngredientsLabelStyle = { fontSize: '10px', color: SAGE_DARK, fontWeight: 600 };
const modalIngredientsTextStyle = { fontSize: '13px', color: 'rgba(42,37,32,0.7)', lineHeight: 1.7 };
const modalAddBtnStyle = { fontSize: '11px', background: INK, color: CREAM, border: `1px solid ${INK}`, borderRadius: '1px' };

const closingLabelStyle = { fontSize: '10px', color: CREAM, fontWeight: 600 };
const closingTextStyle = { fontSize: 'clamp(22px, 2.4vw, 32px)', color: CREAM, lineHeight: 1.4, fontWeight: 300 };
