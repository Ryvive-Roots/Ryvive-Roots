import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BgImage from "../assets/bg.png";

import Silver from "../assets/SilverF.png";
import Gold from "../assets/GoldF.png";
import Plat from "../assets/platinumF.png";

import SilverMobile from "../assets/optimized/silverMo.png";
import GoldMobile from "../assets/optimized/goldMo.png";
import PlatMobile from "../assets/optimized/platinumMo.png";

import ScrollToTop from "./ScrollToTop";

const SubscriptionTypes = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScrollToTop />

      {/* MAIN WRAPPER */}
      <div
        className="
          relative w-full min-h-screen
          flex flex-col md:flex-row
          items-center md:items-end
          overflow-hidden
          bg-[#f0f7ec] md:bg-transparent
        "
      >
        {/* BACKGROUND IMAGE (DESKTOP ONLY) */}
        <img
          src={BgImage}
          alt="background"
          className="hidden md:block absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Cards Layer */}
        <div
          className="
            relative w-full
            flex flex-col md:block
            items-center gap-6
            py-10 md:py-0
          "
        >
          {/* ================= SILVER ================= */}
         <motion.div
  onClick={() => navigate("/subscription/silver")}
  className="w-full md:absolute md:bottom-0 md:left-0 z-10 cursor-pointer"
>
  {/* MOBILE WRAPPER */}
  <div className="w-full px-3 sm:px-4 md:px-0">
    <img
      src={SilverMobile}
      alt="Silver plan"
      className="w-full object-contain"
    />
  </div>

  {/* DESKTOP */}
  <img
    src={Silver}
    alt="Silver plan"
    className="hidden md:block h-[500px] object-contain"
  />
</motion.div>


          {/* ================= GOLD ================= */}
          <motion.div
  onClick={() => navigate("/subscription/gold")}
  className="w-full md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 z-20 cursor-pointer"
>
  <div className="w-full px-3 sm:px-4 md:px-0">
    <img
      src={GoldMobile}
      className="w-full object-contain"
    />
  </div>

  <img
    src={Gold}
    className="hidden md:block h-[550px] object-contain"
  />
</motion.div>


          {/* ================= PLATINUM ================= */}
          <motion.div
  onClick={() => navigate("/subscription/platinum")}
  className="w-full md:absolute md:bottom-0 md:right-0 z-10 cursor-pointer"
>
  <div className="w-full px-3 sm:px-4 md:px-0">
    <img
      src={PlatMobile}
      className="w-full object-contain"
    />
  </div>

  <img
    src={Plat}
    className="hidden md:block h-[600px] object-contain"
  />
</motion.div>

        </div>
      </div>
    </>
  );
};

export default SubscriptionTypes;
