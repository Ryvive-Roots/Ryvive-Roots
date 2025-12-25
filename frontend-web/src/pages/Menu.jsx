import React from "react";
import { motion } from "framer-motion";
import Banner from "../assets/MenuBanner.jpg";
import Menu1 from "../assets/Menu1.jpg";
import Menu2 from "../assets/Menu2.jpg";
import Menu3 from "../assets/Menu3.jpg";
import Menu4 from "../assets/Menu4.jpg";
import Menu5 from "../assets/Menu5.jpg";
import Menu6 from "../assets/Menu6.jpg";
import Menu7 from "../assets/Menu7.jpg";
import Menu8 from "../assets/Menu8.jpg";
import Menu9 from "../assets/Menu9.jpg";
import Menu10 from "../assets/Menu10.jpg";
import Menu11 from "../assets/Menu11.jpg";
import Menu12 from "../assets/Menu12.jpg";
import Menu13 from "../assets/Menu13.jpg";
import Menu14 from "../assets/Menu14.jpg";

const Menu = () => {
  const images = [
  Menu1, 
  Menu2,
  Menu3,
   Menu4,
    Menu5, Menu6,  Menu6,  Menu7,  Menu8,  Menu9,  Menu10,  Menu11,  Menu12,  Menu13,  Menu14

  // ... add all 14 image paths
];
  return (
    <div>
      <div>
        {" "}
         <div className="relative bg-[#FEF7F0] mt-28">
        
        
        
          {/* Animated Text */}
          <motion.h1
            className=" text-[#243E36] py-10 font-semibold font-cinzel uppercase 
                       text-5xl md:text-7xl text-center "
            initial={{ x: -150, y: -150, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Our Menu
          </motion.h1>
        </div>
      </div>
      <div className="bg-[#FEF7F0]">
      <div className="p-6">
      
      <div className="w-full px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Menu Page ${index + 1}`}
            className="w-full rounded-lg shadow"
          />
        ))}
      </div>
    </div>
    
    </div>
    </div>
    </div>
  );
};

export default Menu;
