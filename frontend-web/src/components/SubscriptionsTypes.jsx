import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import BgImage from "../assets/optimized/bg.webp";

import Silver from "../assets/optimized/silverD.webp";
import Gold from "../assets/optimized/goldD.webp";
import Plat from "../assets/optimized/platinumD.webp";

import SilverMobile from "../assets/optimized/silverP.webp";
import GoldMobile from "../assets/optimized/goldP.webp";
import PlatMobile from "../assets/optimized/platinumP.webp";

import ScrollToTop from "./ScrollToTop";

const SubscriptionTypes = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScrollToTop />

      {/* MAIN WRAPPER */}
      <div className="relative w-full min-h-screen overflow-hidden bg-[#f0f7ec] md:bg-transparent">

        {/* BACKGROUND */}
        <img
          src={BgImage}
          alt="background"
          className="hidden md:block absolute inset-0 w-full h-full object-top object-cover -z-10"
        />

        {/* ================= DESKTOP CARDS ================= */}
        <div className="hidden md:block absolute inset-0">

          {/* SILVER — LEFT */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/subscription/silver")}
            className="absolute bottom-0 mb-3 2xl:mb-0 left-[-3%] z-10 cursor-pointer"
          >
            <img
              src={Silver}
              alt="Silver plan"
              className="h-[480px] lg:h-[520px] 2xl:h-[640px] object-contain"
            />
          </motion.div>

          {/* GOLD — CENTER */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => navigate("/subscription/gold")}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          >
            <img
              src={Gold}
              alt="Gold plan"
              className="h-[520px] lg:h-[550px] 2xl:h-[730px] object-contain"
            />
          </motion.div>

          {/* PLATINUM — RIGHT */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/subscription/platinum")}
            className="absolute bottom-0 right-[-3%] z-10 cursor-pointer"
          >
            <img
              src={Plat}
              alt="Platinum plan"
              className="h-[560px] lg:h-[580px] 2xl:h-[770px] object-contain"
            />
          </motion.div>

        </div>

        {/* ================= MOBILE CARDS ================= */}
      {/* ================= MOBILE CARDS ================= */}
<div className="md:hidden flex flex-col items-center gap-6 py-10">

  <motion.img
  whileTap={{ scale: 0.97 }}
    src={SilverMobile}
    alt="Silver"
    className="w-full px-4 cursor-pointer"
    onClick={() => navigate("/subscription/silver")}
  />

  <motion.img
  whileTap={{ scale: 0.97 }}
    src={GoldMobile}
    alt="Gold"
    className="w-full px-4 cursor-pointer"
    onClick={() => navigate("/subscription/gold")}
  />

  <motion.img
  whileTap={{ scale: 0.97 }}
    src={PlatMobile}
    alt="Platinum"
    className="w-full px-4 cursor-pointer"
    onClick={() => navigate("/subscription/platinum")}
  />

</div>


      </div>
    </>
  );
};

export default SubscriptionTypes;
