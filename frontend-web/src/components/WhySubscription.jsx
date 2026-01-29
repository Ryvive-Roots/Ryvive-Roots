import React from "react";
import { motion } from "framer-motion";
import useIsMobile from "./useIsMobile";

import Trust from "../assets/chose1.png";
import Ingre from "../assets/chose2.png";
import Truck from "../assets/chose5.png";
import Time from "../assets/chose4.png";
import Nutri from "../assets/chose3.png";
import Costomize from "../assets/chose6.png";

// Updated Promises for Ryvive Roots
const reasons = [
  {
    icon: Trust,
    title: "Food You Can Trust",
    desc: "Freshly cooked for you — never stored, never compromised.",
  },
  {
    icon: Ingre,
    title: "100% Clean Ingredients",
    desc: "No preservatives, no artificial flavours, no shortcuts. Just real, wholesome food.",
  },
  {
    icon: Nutri,
    title: "Balanced, Dietitian-Designed Meals",
    desc: "Correct proteins, fibres & micronutrients for everyday health.",
  },
  {
    icon: Time,
    title: "Save Time, Save Money",
    desc: "No more daily meal planning or cooking stress — just effortless eating.",
  },
  {
    icon: Truck,
    title: "Reliable Daily Delivery",
    desc: "Your fresh meal arrives right at your doorstep, on time, every time.",
  },
  {
    icon: Costomize,
    title: "Flexible Pause Benefit",
    desc: "Ryvive Gold - 2 Pause, Ryvive Platinum - 3 Pause",
  },
];

// ✅ GPU-safe animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    transform: "translateY(40px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WhySubscribe() {
  const isMobile = useIsMobile();

  return (
    <section className="w-full bg-[#FEF7F0] py-4 md:py-16">
      <div className="px-6 md:px-36 py-6">

        {/* ✅ Title */}
        <motion.h3
          initial={
            isMobile
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(60px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: isMobile ? 0.3 : 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] pb-10"
        >
          Why Choose Ryvive Roots Subscription?
        </motion.h3>

        {/* ✅ Animated Grid */}
        <motion.div
          className="grid grid-cols-1 cursor-pointer md:grid-cols-3 gap-10 mx-auto max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={
                isMobile
                  ? {}
                  : { scale: 1.05 }
              }
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="group bg-white/70 border border-white/60 rounded-2xl p-6
                         shadow-md hover:shadow-[0_8px_30px_rgba(137,92,64,0.35)]
                         transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.icon}
                  alt={item.title}
                  loading="lazy"
                  className="w-12 h-12 group-hover:scale-110 transition-transform duration-300"
                />

                <h3
                  className="text-base md:text-base font-cinzel uppercase font-semibold 
                             text-black group-hover:text-[#253E36] transition-colors duration-300"
                >
                  {item.title}
                </h3>
              </div>

              <p className="text-gray-700 font-source-sans leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
