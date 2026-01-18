import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BgImage from "../assets/bg.png";

import Silver from "../assets/SilverF.png";
import Gold from "../assets/GoldF.png";
import Plat from "../assets/platinumF.png";
import ScrollToTop from "./ScrollToTop";

const SubscriptionTypes = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScrollToTop />
      <div
        className="relative w-full min-h-screen 
  flex flex-col md:flex-row 
  items-center md:items-end 
  overflow-hidden"
      >
        {/* Background */}
        <img
          src={BgImage}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Cards Layer */}
        <div
          className="relative w-full 
  flex flex-col md:block 
  items-center gap-6 
  py-10 md:py-0"
        >
          {/* SILVER */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/subscription/silver")}
            className="md:absolute md:bottom-0 md:left-0  self-start
  z-10 cursor-pointer"
          >
            <img
              src={Silver}
              alt="Silver"
              className="h-[260px] sm:h-[320px] md:h-[500px] object-contain"
            />
          </motion.div>

          {/* GOLD (CENTER & TALLEST) */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            onClick={() => navigate("/subscription/gold")}
            className="md:absolute md:bottom-0 md:left-1/2 
  md:-translate-x-1/2 
  z-20 cursor-pointer"
          >
            <img
              src={Gold}
              alt="Gold"
              className="h-[300px] sm:h-[360px] md:h-[550px] object-contain"
            />
          </motion.div>

          {/* PLATINUM */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/subscription/platinum")}
            className="md:absolute md:bottom-0 self-end md:right-0 
  z-10 cursor-pointer"
          >
            <img
              src={Plat}
              alt="Platinum"
              className="h-[320px] sm:h-[380px]  md:h-[600px] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionTypes;
