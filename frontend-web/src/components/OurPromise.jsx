
import { motion } from "framer-motion";
import Sparkle from "../assets/Sparkle.png";
import Hand from "../assets/hand.png";
import Botencial from "../assets/botanical1.png";
import FreshF from "../assets/FreshFood.png";
import Bowl from "../assets/bowl2.png";
import Honest from "../assets/organic.png"

// Updated Promises for Ryvive Roots
const reasons = [
  {
    icon: Sparkle,
    title: "Pure Hygiene",
    subtitle: "Zero-Compromise Cleanliness",
    desc: "Daily sanitization, strict food-safety checks, and spotless kitchens, your meals are prepared in an environment built on absolute trust.",
  },
  {
    icon: Hand,
    title: "100% In-House Craft",
    subtitle: "Everything Made by Us",
    desc: "From spices to dressings to cashew cheese, every element is handcrafted in-house to maintain purity, authenticity, and real flavours.",
  },
  {
    icon: Bowl,
    title: "Finest Ingredients Only",
    subtitle: "Quality You Can Taste",
    desc: "We use premium, fresh, responsibly sourced ingredients that meet our strict standards, no fillers, no shortcuts, only real nourishment.",
  },
  {
    icon: FreshF,
    title: "Fresh From Scratch",
    subtitle: "No Reheat. No Leftovers. Ever.",
    desc: "Every batch is freshly crafted from scratch, never reheated, never reused, so you receive food in its purest, freshest form.",
  },
  {
    icon: Botencial,
    title: "Nutrition With Purpose",
    subtitle: "Designed for Real Wellness",
    desc: "Every meal is scientifically curated with balance, clarity, and intention, supporting sustained energy, gut health, and daily vitality.",
  },
  {
    icon: Honest,
    title: "Honest Food",
    subtitle: "Nothing Hidden, Nothing Artificial",
    desc: "No preservatives, no refined sugar, no adulteration, just honest, transparent food the way nature intended.",
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

export default function AboutPromise() {
  return (
    <section className="w-full bg-[#FEF7F0] py-16">
      <div className="px-6 md:px-20 py-6">

        {/* Title */}
        <h3 className="text-4xl text-center font-cinzel uppercase font-semibold text-[#895C40] pb-10">
          OUR PROMISES
        </h3>

        {/* Animated Grid */}
        <motion.div
          className="grid grid-cols-1 cursor-pointer md:grid-cols-3 gap-10 mx-auto max-w-7xl "
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
    className="text-lg md:text-base font-cinzel uppercase font-semibold 
               text-black font-raleway md:whitespace-nowrap
               group-hover:text-[#253E36] transition-all duration-300"
  >
    {item.title}
  </h3>
</div>


                <h4 className="text-[#895C40] font-merriweather font-semibold mb-2">
                  {item.subtitle}
                </h4>

                <p className="text-gray-700 font-source-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
