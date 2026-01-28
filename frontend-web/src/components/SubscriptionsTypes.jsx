import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import BgImage from "../assets/bg.png";

import Silver from "../assets/optimized/silverD.png";
import Gold from "../assets/optimized/goldD.png";
import Plat from "../assets/optimized/platinumD.png";

import SilverMobile from "../assets/optimized/silverP.png";
import GoldMobile from "../assets/optimized/goldP.png";
import PlatMobile from "../assets/optimized/platinumP.png";

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
          className="hidden md:block absolute inset-0 w-full h-full object-top object-cover -z-10"
        />

        {/* CARD CONTAINER */}
        <div
          className="
            relative w-full
            max-w-[1600px] mx-auto
            flex flex-col md:block
            items-center
            py-10 md:py-0
          "
        >
          {/* ================= SILVER ================= */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/subscription/silver")}
            className="md:absolute md:bottom-0 md:left-[-3%] z-10 cursor-pointer"
          >
            {/* Desktop */}
            <img
              src={Silver}
              alt="Silver healthy meal plan"
              className="hidden md:block mb-3 h-[480px] lg:h-[520px] 2xl:h-[620px] object-contain"
            />

            {/* Mobile */}
            <img
              src={SilverMobile}
              alt="Silver plan"
              className="block md:hidden w-full px-3 sm:px-4 object-contain"
            />
          </motion.div>

          {/* ================= GOLD ================= */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            onClick={() => navigate("/subscription/gold")}
            className="
              md:absolute md:bottom-0 md:left-1/2
              md:-translate-x-1/2
              z-20 cursor-pointer
              2xl:scale-105
            "
          >
            {/* Desktop */}
            <img
              src={Gold}
              alt="Gold healthy meal subscription plan"
              className="hidden md:block h-[520px] lg:h-[580px] 2xl:h-[700px] object-contain"
            />

            {/* Mobile */}
            <img
              src={GoldMobile}
              alt="Gold plan"
              className="block md:hidden w-full px-3 sm:px-4 object-contain"
            />
          </motion.div>

          {/* ================= PLATINUM ================= */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            onClick={() => navigate("/subscription/platinum")}
            className="md:absolute md:bottom-0 md:right-[-3%] z-10 cursor-pointer"
          >
            {/* Desktop */}
            <img
              src={Plat}
              alt="Platinum healthy meal subscription plan"
              className="hidden md:block h-[560px] lg:h-[620px] 2xl:h-[760px] object-contain"
            />

            {/* Mobile */}
            <img
              src={PlatMobile}
              alt="Platinum plan"
              className="block md:hidden w-full px-3 sm:px-4 object-contain"
            />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionTypes;
