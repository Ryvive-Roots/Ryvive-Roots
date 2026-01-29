import React from "react";
import { motion } from "framer-motion";



import Menu1 from "../assets/optimized/Menu1.webp";
import Menu2 from "../assets/optimized/Menu2.webp";
import Menu3 from "../assets/optimized/Menu3.webp";
import Menu4 from "../assets/optimized/Menu4.webp";
import Menu5 from "../assets/optimized/Menu5.webp";
import Menu6 from "../assets/optimized/Menu6.webp";
import Menu7 from "../assets/optimized/Menu7.webp";
import Menu8 from "../assets/optimized/Menu8.webp";
import Menu9 from "../assets/optimized/Menu9.webp";
import Menu10 from "../assets/optimized/Menu10.webp";
import Menu11 from "../assets/optimized/Menu11.webp";
import Menu12 from "../assets/optimized/Menu12.webp";
import Menu13 from "../assets/optimized/Menu13.webp";
import Menu14 from "../assets/optimized/Menu14.webp";
import useIsMobile from "../components/useIsMobile";

const Menu = () => {
  const isMobile = useIsMobile();

  const images = [
    "https://res.cloudinary.com/dinb2vv9u/image/upload/f_auto,q_auto/v1766744173/Menu1_lqkn6g.jpg",
    "https://res.cloudinary.com/dinb2vv9u/image/upload/f_auto,q_auto/v1766744330/Menu2_poaffq.jpg",
    Menu3,
    Menu4,
    Menu5,
    Menu6,
    Menu7,
    Menu8,
    Menu9,
    Menu10,
    Menu11,
    Menu12,
    Menu13,
    Menu14,
  ];

  return (
    <div className="bg-[#FEF7F0] mt-28">

      {/* ✅ Animated Heading */}
      <div className="relative">
        <motion.h1
          className="text-[#243E36] py-10 font-semibold font-cinzel uppercase 
                     text-5xl md:text-7xl text-center"
          initial={
            isMobile
              ? { opacity: 0 }
              : { opacity: 0, transform: "translate(-80px, -80px)" }
          }
          animate={{ opacity: 1, transform: "translate(0px, 0px)" }}
          transition={{ duration: isMobile ? 0.3 : 0.9, ease: "easeOut" }}
        >
          Our Menu
        </motion.h1>
      </div>

      {/* ✅ Menu Images Grid */}
      <div className="p-6">
        <div className="w-full px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">

            {images.map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt={`Menu Page ${index + 1}`}
                loading="lazy"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full rounded-lg shadow"
              />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
