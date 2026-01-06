import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const Franchise = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen mt-16 sm:mt-20 flex items-center justify-center bg-white overflow-hidden px-4">
      
      {/* 🎊 Confetti */}
      <Confetti
        width={size.width}
        height={size.height}
        numberOfPieces={120}
        recycle={true}
      />

      {/* ✨ Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl 
                   p-6 sm:p-10 md:p-12 text-center"
      >
        {/* Top Text */}
        <h2 className="text-xs sm:text-sm tracking-widest uppercase text-green-700 font-semibold mb-3">
          Big Announcement
        </h2>

        <h1 className="text-2xl font-fredoka font sm:text-4xl md:text-5xl font-extrabold text-[#243E36]  mb-6">
          Franchise Opportunity
        </h1>

        <div className="inline-block italic font-manrope px-5 sm:px-6 py-2 rounded-full 
                         font-bold text-base sm:text-lg 
                        mb-6 shadow-lg animate-pulse">
          Coming Soon
        </div>

        <p className="text-gray-700 font-semibold text-base sm:text-lg mb-6 leading-relaxed">
          We’re celebrating something exciting!  
          <br className="hidden sm:block" />
          Soon, you can partner with us and bring healthy living to your city.
        </p>

        <p className="mt-6 font-manrope font-semibold text-xs sm:text-sm text-gray-600">
          🎊 Stay tuned — applications opening very soon!
        </p>
      </motion.div>
    </div>
  );
};

export default Franchise;
 