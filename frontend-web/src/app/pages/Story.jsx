import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Target, Diamond, Sparkles, ChefHat, Leaf, UtensilsCrossed, HeartPulse, ShieldCheck, Recycle, } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { StoryParallaxBackground, StoryParallaxWrap, ParallaxStorySection, ParallaxDivider, } from '../components/story/CurtainParallaxShowcase';
import { CREAM, SAGE } from '../theme';
/* ============================================================
 * Story page — every section is a parallax slide.
 *
 * Section pattern:
 *   ODD (1, 3, 5, 7, 9, 11) → solid: own upper-layer background
 *   EVEN (2, 4, 6, 8, 10)   → transparent: lower-layer bg shows
 *
 * Background images live under src/app/images/story/ for easy
 * future swapping by file name.
 *
 * Sections 7–11 keep their ORIGINAL layouts (grids, columns,
 * image positions). Only the section background follows the
 * parallax curtain rule.
 * ============================================================ */
/* ---------- Parallax background images (swap-friendly names) ---------- */
import bgLowerLayer from '../images/story/lower-layer.jpg';
import bg01OurStory from '../images/story/01-our-story.jpg';
import bg03RealIngredients from '../images/story/03-real-ingredients.jpg';
import bg05MindfulHospitality from '../images/story/05-mindful-hospitality.jpg';
import bg07OurPhilosophy from '../images/story/07-our-philosophy.jpg';
import bg09WhatIsRyviveRoots from '../images/story/09-what-is-ryvive-roots.jpg';
import bg11OurPromises from '../images/story/11-our-promises.jpg';
/* ---------- Inline imagery used INSIDE existing section layouts ----------
   These are the photos that sit within the original grid columns
   (e.g. the image on the right side of "The Beginning"). They are
   independent from the parallax backgrounds. */
import ImageBreak from '../images/Landing-3.jpeg';
import StoryHero from '../images/Story-1.JPG';
import BagasseImg from '../images/sustainable.png';
const ease = [0.22, 1, 0.36, 1];
const promises = [
    { icon: Sparkles, title: 'Pure Hygiene', desc: 'Zero-Compromise Cleanliness. Daily sanitization, strict food-safety checks, and spotless kitchens, your meals are prepared in an environment built on absolute trust.' },
    { icon: ChefHat, title: '100% In-House Craft', desc: 'Everything Made by Us. From spices to dressings to cashew cheese, every element is handcrafted in-house to maintain purity, authenticity, and real flavours.' },
    { icon: Leaf, title: 'Finest Ingredients Only', desc: 'Quality You Can Taste. We use premium, fresh, responsibly sourced ingredients that meet our strict standards, no fillers, no shortcuts, only real nourishment.' },
    { icon: UtensilsCrossed, title: 'Fresh From Scratch', desc: 'No Reheat. No Leftovers. Ever. Every batch is freshly crafted from scratch, never reheated, never reused, so you receive food in its purest, freshest form.' },
    { icon: HeartPulse, title: 'Nutrition With Purpose', desc: 'Designed for Real Wellness. Every meal is scientifically curated with balance, clarity, and intention, supporting sustained energy, gut health, and daily vitality.' },
    { icon: ShieldCheck, title: 'Honest Food', desc: 'Nothing Hidden, Nothing Artificial. No preservatives, no refined sugar, no adulteration, just honest, transparent food the way nature intended.' }
];
const slideShellClass = 'min-h-screen w-full flex items-center justify-center px-5 sm:px-8 lg:px-14 py-24 lg:py-32';
export default function Story() {
    const [parallaxInView, setParallaxInView] = useState(true);
    return (<div className="min-h-screen" style={{ background: '#14110F' }}>
      {/* Fixed lower-layer image (visible behind transparent slides) */}
      <StoryParallaxBackground image={bgLowerLayer} hidden={!parallaxInView}/>

      <StoryParallaxWrap onInViewChange={setParallaxInView}>

        {/* ───── 1 — OUR STORY (solid) ───── */}
        <ParallaxStorySection variant="solid" image={bg01OurStory} id="our-story">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                Live. Relive. Believe.
              </span>
              <h1 className="font-serif" style={{ fontSize: 'clamp(48px, 8vw, 100px)', lineHeight: 1.02, fontWeight: 300, letterSpacing: '-0.02em', textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>
                Our <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Story</em>
              </h1>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                A return to honest, considered food — made fresh from scratch, with intention.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 2 — MADE BY HANDS (transparent) ───── */}
        <ParallaxStorySection variant="transparent" id="made-by-hands">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                Crafted in-house
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
                Made by <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Hands</em>
              </h2>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                Every spice, dressing, and detail is made in-house — a quiet ritual repeated every single day.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 3 — REAL INGREDIENTS (solid) ───── */}
        <ParallaxStorySection variant="solid" image={bg03RealIngredients} id="real-ingredients">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                Rooted in nature
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>
                Real <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Ingredients</em>
              </h2>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                Premium, responsibly sourced ingredients chosen for purity, flavour, and the way they make you feel.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 4 — EAT WELL (transparent) ───── */}
        <ParallaxStorySection variant="transparent" id="eat-well">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                Nutrition with intention
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
                Eat <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Well</em>
              </h2>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                Balanced meals designed to support real wellness — sustained energy, clarity, and daily vitality.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 5 — MINDFUL HOSPITALITY (solid) ───── */}
        <ParallaxStorySection variant="solid" image={bg05MindfulHospitality} id="mindful-hospitality">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                A refined ritual
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>
                Mindful <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Hospitality</em>
              </h2>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                Food that respects you and the planet — served with calm precision and warm hospitality.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 6 — PURE LIVING (transparent) ───── */}
        <ParallaxStorySection variant="transparent" id="pure-living">
          <div className={`${slideShellClass} text-center`}>
            <div className="max-w-[880px] mx-auto" style={{ color: '#F4EFE6' }}>
              <span className="inline-block uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#F4EFE6', fontWeight: 600 }}>
                Quietly sustainable
              </span>
              <h2 className="font-serif" style={{ fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 1.05, fontWeight: 300, letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
                Pure <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Living</em>
              </h2>
              <p className="mt-6 max-w-[640px] mx-auto" style={{ fontSize: 'clamp(15px, 1.7vw, 17px)', lineHeight: 1.7, color: 'rgba(244,239,230,0.92)', textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                Where wellness feels effortless — a refined way of living, supported by thoughtful nourishment.
              </p>
            </div>
          </div>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 7 — OUR PHILOSOPHY (solid, ORIGINAL LAYOUT) ───── */}
        <ParallaxStorySection variant="solid" image={bg07OurPhilosophy} id="our-philosophy">
          <section className="px-5 sm:px-8 lg:px-14 py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease }} className="text-center mb-16 lg:mb-24">
                <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 4.8vw, 56px)', color: CREAM, fontWeight: 300, marginBottom: '16px', textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>
                  Our Philosophy
                </h2>
                <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.85)', lineHeight: 1.7, maxWidth: '700px', margin: '0 auto', textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                  Guided by a commitment to wellness, purity, and intentional living.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {/* Vision Card */}
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay: 0, ease }} className="flex flex-col text-center p-7 lg:p-9 rounded-sm" style={{ background: 'rgba(20,17,15,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '4px' }}>
                  <div className="mb-6 w-16 h-16 mx-auto flex items-center justify-center rounded-full border transition-transform duration-700 hover:scale-110" style={{ borderColor: 'rgba(244,239,230,0.25)' }}>
                    <Eye size={26} strokeWidth={1.2} color="#C4CFB0"/>
                  </div>
                  <h3 className="font-serif mb-4" style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', color: CREAM, fontWeight: 300 }}>
                    Vision
                  </h3>
                  <p style={{ fontSize: 'clamp(14px, 1.7vw, 16px)', color: 'rgba(244,239,230,0.92)', lineHeight: 1.7 }}>
                    We believe health should be simple, effortless, and a natural part of daily life. Our aim is to make wholesome, balanced eating accessible so people can feel lighter, clearer, and more in tune with themselves.
                  </p>
                </motion.div>

                {/* Mission Card */}
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay: 0.1, ease }} className="flex flex-col text-center p-7 lg:p-9 rounded-sm" style={{ background: 'rgba(20,17,15,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '4px' }}>
                  <div className="mb-6 w-16 h-16 mx-auto flex items-center justify-center rounded-full border transition-transform duration-700 hover:scale-110" style={{ borderColor: 'rgba(244,239,230,0.25)' }}>
                    <Target size={26} strokeWidth={1.2} color="#C4CFB0"/>
                  </div>
                  <h3 className="font-serif mb-4" style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', color: CREAM, fontWeight: 300 }}>
                    Mission
                  </h3>
                  <p style={{ fontSize: 'clamp(14px, 1.7vw, 16px)', color: 'rgba(244,239,230,0.92)', lineHeight: 1.7 }}>
                    To make healthy eating easy, enjoyable, and accessible for all through mindful preparation, quality ingredients, and balanced nutrition.
                  </p>
                </motion.div>

                {/* Values Card */}
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay: 0.2, ease }} className="flex flex-col text-center p-7 lg:p-9 rounded-sm" style={{ background: 'rgba(20,17,15,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '4px' }}>
                  <div className="mb-6 w-16 h-16 mx-auto flex items-center justify-center rounded-full border transition-transform duration-700 hover:scale-110" style={{ borderColor: 'rgba(244,239,230,0.25)' }}>
                    <Diamond size={26} strokeWidth={1.2} color="#C4CFB0"/>
                  </div>
                  <h3 className="font-serif mb-4" style={{ fontSize: 'clamp(20px, 2.4vw, 26px)', color: CREAM, fontWeight: 300 }}>
                    Values
                  </h3>
                  <p style={{ fontSize: 'clamp(14px, 1.7vw, 16px)', color: 'rgba(244,239,230,0.92)', lineHeight: 1.7 }}>
                    We strive to redefine healthy eating across India by making nutritious, sustainable, wholesome food easy for everyone. We aim to create a future where good health is a lifestyle, not a privilege.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 8 — THE BEGINNING (transparent, ORIGINAL LAYOUT: 2-column with image) ───── */}
        <ParallaxStorySection variant="transparent" id="the-beginning">
          <section className="px-5 sm:px-8 lg:px-14 py-20 lg:py-32 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease }} className="max-w-[1200px] mx-auto w-full">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', color: CREAM, fontWeight: 300, textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>The Beginning</h2>
                  <p className="mb-4" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.88)', lineHeight: 1.7, textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                    Ryvive Roots was born from a simple question: Can food truly nourish us anymore? Everywhere we ate, we found frozen, artificial, and over-processed ingredients that lacked both freshness and purpose. We missed real food—the kind that energizes the body and clears the mind.
                  </p>
                  <p className="mb-4" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.88)', lineHeight: 1.7, textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                    So we created Ryvive Roots: a place where food is made the way it&rsquo;s meant to be. Every dish is prepared fresh from scratch, with in-house dressings and zero artificial flavours, colours, or sauces. Just honest ingredients, chosen with intention.
                  </p>
                  <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.88)', lineHeight: 1.7, textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                    We believe health is not a trend—it&rsquo;s a revival. Our menu is designed to support digestion, immunity, brain function, and overall balance, working with your body, not against it. Sustainability matters to us too. That&rsquo;s why every order is served in eco-friendly sugarcane-based packaging—because true wellness includes caring for the planet.
                  </p>
                </div>

                <motion.div className="w-full h-[40vh] md:h-[52vh] overflow-hidden rounded-sm" initial={{ scale: 1.02, opacity: 0.96 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.6 }}>
                  <ImageWithFallback src={ImageBreak} alt="Ryvive Roots Kitchen" className="w-full h-full object-cover object-center"/>
                </motion.div>
              </div>
            </motion.div>
          </section>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 9 — WHAT IS RYVIVE ROOTS (solid, ORIGINAL LAYOUT: 56/44 split with image) ───── */}
        <ParallaxStorySection variant="solid" image={bg09WhatIsRyviveRoots} id="what-is-ryvive-roots">
          <section className="px-5 sm:px-8 lg:px-14 py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1400px] mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease }} className="w-full">
                <div className="grid lg:grid-cols-[56%_44%] gap-10 items-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.1 }} className="relative rounded-sm p-8 lg:p-10" style={{ background: 'rgba(20,17,15,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '4px' }}>
                    <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: CREAM, fontWeight: 300 }}>
                      What is <em style={{ fontStyle: 'italic', color: '#C4CFB0' }}>Ryvive Roots?</em>
                    </h2>
                    <p className="mb-5" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.92)', lineHeight: 1.8 }}>
                      Ryvive Roots is an invitation to return to what is pure, grounded, and real. Born from a respect for nature and the body&rsquo;s innate wisdom, every dish is prepared from scratch using clean, carefully chosen ingredients that nourish without excess and restore without force.
                    </p>
                    <p style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'rgba(244,239,230,0.92)', lineHeight: 1.8 }}>
                      Free from artificial flavours, preservatives, and shortcuts, our food is designed to move in harmony with your natural rhythm—awakening energy, sustaining balance, and leaving you feeling light, clear, and renewed. We don&apos;t chase trends or promise quick fixes; we offer thoughtful nourishment, crafted with care, meant to support a refined way of living where wellness feels effortless and enduring.
                    </p>
                  </motion.div>
                  <motion.div className="w-full h-[40vh] md:h-[52vh] overflow-hidden rounded-sm" initial={{ scale: 1.02 }} whileHover={{ scale: 1.04 }} transition={{ duration: 1.4 }}>
                    <ImageWithFallback src={StoryHero} alt="Ryvive Roots" className="w-full h-full object-cover object-center"/>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 10 — QUIET SUSTAINABILITY (transparent, ORIGINAL LAYOUT: image-left + content-right) ───── */}
        <ParallaxStorySection variant="transparent" id="quiet-sustainability">
          <section className="px-5 sm:px-8 lg:px-14 py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1400px] mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-10 items-center">
                {/* IMAGE - LEFT */}
                <div className="w-full flex items-center justify-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.9, ease }} className="relative w-full max-w-[640px]">
                    <div className="overflow-hidden rounded-md" style={{ borderRadius: '8px', boxShadow: '0 14px 40px -24px rgba(0,0,0,0.5)' }}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}>
                        <ImageWithFallback src={BagasseImg} alt="Bagasse serving" className="w-full h-[48vh] lg:h-[62vh] object-cover object-center" style={{ filter: 'saturate(0.92) contrast(0.98)' }}/>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* CONTENT - RIGHT */}
                <div>
                  <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.05, ease }} className="max-w-[760px] ml-auto">
                    <p className="mb-4 uppercase tracking-[0.35em]" style={{ fontSize: '11px', color: '#F4EFE6', letterSpacing: '0.35em', fontWeight: 600, textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                      Quiet Sustainability
                    </p>
                    <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', color: CREAM, fontWeight: 300, lineHeight: 1.04, textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
                      Bagasse packaging, made to feel as considered as the food itself.
                    </h2>
                    <p className="mb-8" style={{ fontSize: 'clamp(15px, 1.7vw, 16px)', color: 'rgba(244,239,230,0.85)', lineHeight: 1.75, textShadow: '0 1px 16px rgba(0,0,0,0.6)' }}>
                      Our tableware is chosen with the same care as our food — crafted from sugarcane bagasse to be food-safe, compostable, and quietly elegant. This is sustainability designed to belong in a refined hospitality ritual.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
            { icon: ShieldCheck, title: 'Food Safe', desc: 'Direct-contact safe, crafted for daily dining with a trustworthy finish.' },
            { icon: Recycle, title: 'Compostable', desc: 'Returns to earth gently — part of a circular hospitality practice.' },
            { icon: Leaf, title: 'Biodegradable', desc: 'Naturally breaks down, reducing footprint without ceremony.' },
            { icon: UtensilsCrossed, title: 'Sugarcane Bagasse', desc: 'An agricultural by-product transformed into refined serving pieces.' },
        ].map((pillar, i) => (<motion.div key={pillar.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: i * 0.06, ease }} whileHover={{ y: -6 }} className="group rounded-sm border p-4 lg:p-5" style={{ background: 'rgba(20,17,15,0.40)', borderColor: 'rgba(244,239,230,0.10)', boxShadow: '0 6px 18px -12px rgba(0,0,0,0.35)', transition: 'box-shadow 0.28s ease, border-color 0.28s ease', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(244,239,230,0.06)', border: '1px solid rgba(244,239,230,0.16)' }}>
                              <pillar.icon size={16} strokeWidth={1.25} color="#C4CFB0"/>
                            </div>
                            <div>
                              <div className="font-serif" style={{ fontSize: '15px', color: CREAM, fontWeight: 300 }}>{pillar.title}</div>
                              <p style={{ fontSize: '13px', color: 'rgba(244,239,230,0.80)', lineHeight: 1.6 }}>{pillar.desc}</p>
                            </div>
                          </div>
                        </motion.div>))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </ParallaxStorySection>

        <ParallaxDivider />

        {/* ───── 11 — OUR PROMISES (solid, ORIGINAL LAYOUT: dark grid) ───── */}
        <ParallaxStorySection variant="solid" image={bg11OurPromises} id="our-promises">
          <section className="px-5 sm:px-8 lg:px-14 py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1300px] mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease }} className="text-center mb-16 lg:mb-24">
                <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: CREAM, fontWeight: 300, textShadow: '0 2px 30px rgba(0,0,0,0.55)' }}>
                  Our Promises
                </h2>
                <div className="w-12 h-px mx-auto" style={{ background: SAGE }}/>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {promises.map((promise, i) => (<motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, delay: i * 0.1, ease }} whileHover={{ y: -4 }} className="p-6 lg:p-8 rounded-sm border transition-all duration-500 group cursor-default" style={{ background: 'rgba(20,17,15,0.45)', borderColor: 'rgba(244,239,230,0.08)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                    <div className="mb-6 w-12 h-12 flex items-center justify-center rounded-full border transition-colors duration-500 group-hover:bg-[#14110F]" style={{ borderColor: 'rgba(244,239,230,0.20)' }}>
                      <promise.icon size={20} strokeWidth={1.2} color={SAGE}/>
                    </div>
                    <h3 className="font-serif text-xl mb-3" style={{ color: CREAM, fontWeight: 300, textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                      {promise.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(244,239,230,0.80)', lineHeight: 1.7, textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
                      {promise.desc}
                    </p>
                  </motion.div>))}
              </div>
            </div>
          </section>
        </ParallaxStorySection>

      </StoryParallaxWrap>
    </div>);
}
