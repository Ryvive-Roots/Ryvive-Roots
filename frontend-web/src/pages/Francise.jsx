import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import FranchiseI from "../assets/Franchise.png";

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
    <div className="relative  mt-30 sm:mt-26 flex items-center justify-center bg-white overflow-hidden px-4">
      
      {/* 🎊 Confetti */}
      <Confetti
        width={size.width}
        height={size.height}
        numberOfPieces={120}
        recycle={false}
      />

      {/* 🖼️ Centered Image */}
      <img
        src={FranchiseI}
        alt="Franchise"
        className="
          max-w-full 
          max-h-[80vh] 
          object-contain
        "
      />
    </div>
  );
};

export default Franchise;
