import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BgImage from "../assets/bg.png";
import Bg from "../assets/qa1.png"

import Silver from "../assets/silverF.png";
import Gold from "../assets/goldF.png";
import Plat from "../assets/platinumF.png";
import ScrollToTop from "./ScrollToTop";

const SubscriptionTypes = () => {
  const navigate = useNavigate();

  return (
    <>
      <ScrollToTop />
      <div className="relative w-full h-[120vh] flex flex-col md:flex-row items-end overflow-hidden">
        {/* Background */}
        <img
          src={BgImage}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        {/* Cards Layer */}
        <div className="relative w-full h-[85%]">
          {/* SILVER */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/subscription/silver")}
            className="absolute bottom-0 left-0 z-10 cursor-pointer"
          >
            <img
              src={Silver}
              alt="Silver"
              className="h-[500px] object-contain"
            />
          </motion.div>

          {/* GOLD (CENTER & TALLEST) */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            onClick={() => navigate("/subscription/gold")}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          >
            <img src={Gold} alt="Gold" className="h-[550px] object-contain " />
          </motion.div>

          {/* PLATINUM */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/subscription/platinum")}
            className="absolute bottom-0 right-0 z-10 cursor-pointer"
          >
            <img
              src={Plat}
              alt="Platinum"
              className="h-[600px] object-contain"
            />
          </motion.div>
        </div>
      </div>

      <img src={Bg} alt="background" className="  mt-20 object-cover " />
    </>
  );
};

export default SubscriptionTypes;
