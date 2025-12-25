import React from "react";
import Hygene from "../assets/Hygen.png";
import Handmade from "../assets/Handmade.png";
import Quality from "../assets/Quality.png";
import Fresh from "../assets/Fresh.png";
import Nutrition from "../assets/Nutrition.png";

import {
  ShieldCheck,
  Hammer,
  BadgeCheck,
  Leaf,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Trust from "../assets/chose1.png";
import Ingre from "../assets/chose2.png";
import Truck from "../assets/chose5.png";
import Time from "../assets/chose4.png";
import Nutri from "../assets/chose3.png";
import Costomize from "../assets/chose6.png"
import Rotate from "../assets/rotate.png"

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
    title: "Flexible Swap + Pause Benefit",
    desc: "You choose what you eat — up to 3 swaps/week + 7 days pause/month.",
  },
   {
    icon: Rotate,
    title: "30-Day Rotating Menu",
    desc: "No Repeat Boredom. New meals every week so you stay excited about eating clean.",
  },
];

// Animation Variants
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function WhySubscribe() {
  return (
    <section className="w-full bg-[#FEF7F0] py-4 md:py-16">
      <div className="px-6 md:px-20 py-6">

        {/* Title */}
   <motion.h3
  initial={{ opacity: 0, y: 80 }}   // comes from lower bottom
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: false, amount: 0.3 }}
  className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] pb-10"
>
  Why Choose Ryvive Roots Subscription?
</motion.h3>


        {/* Animated Grid */}
        <motion.div
          className="grid grid-cols-1 cursor-pointer md:grid-cols-3 gap-10 mx-auto max-w-7xl  "
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="group bg-white/70 border border-white/60 rounded-2xl p-8 
                           shadow-md hover:shadow-[0_8px_30px_rgba(137,92,64,0.35)]
                           transition-all"
              >
               <div className="flex items-center gap-3 mb-3">
  <img src={Icon}
      alt={item.title}
    className="text-black font-source-sans w-12 h-12
               group-hover:text-[#253E36] group-hover:scale-110 
               transition-all duration-300"
  />

  <h3
    className="text-lg md:text-xl font-cinzel uppercase font-semibold 
               text-black font-raleway
               group-hover:text-[#253E36] transition-all duration-300"
  >
    {item.title}
  </h3>
</div>


               

                <p className="text-gray-700 font-source-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
