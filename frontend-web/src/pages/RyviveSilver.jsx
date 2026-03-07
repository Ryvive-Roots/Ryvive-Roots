import React from "react";
import { motion } from "framer-motion";
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import BgImage from "../assets/BgImage.png";


const RyviveSilver = () => {
const categories = [
{ name: "Salads", icon: saladIcon },
{ name: "Wraps + Juice Combos", icon: wrapIcon },
{ name: "Juices", icon: juiceIcon },
{ name: "Chaat", icon: chaatIcon },
];

return ( <div className="relative min-h-screen mt-20 flex items-center justify-center overflow-hidden">


  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-top bg-no-repeat"
    style={{
      backgroundImage: `url(${BgImage})`,
    }}
  />

  {/* Blur Layer */}
  <div className="absolute inset-0 backdrop-blur-xs"></div>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>

  {/* Main Content */}
 {/* Main Content */}
<div className="relative min-h-screen py-20 px-6 md:px-20 flex justify-center">
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* LEFT — PLAN DETAILS */}
      <div className="md:col-span-2  rounded-xl  text-sm">
        <h1 className="text-3xl text-center font-cinzel uppercase font-bold text-white mb-4">
          Ryvive Silver
        </h1>

        <p className="text-white text-base text-center mb-2 font-roboto">
          Ryvive Silver is the ideal starting point for healthier eating, without drastic lifestyle changes.
          Designed to be simple and stress-free, it offers light, nourishing meals that support
          energy and digestion.
        </p>

        <p className="text-white text-base text-center mb-7 font-roboto">
          With fresh salads, protein-balanced wraps, functional juices, and clean chaat options,
          this plan helps you gradually replace unhealthy choices with better ones. Perfect for
          beginners, busy professionals, and anyone starting their wellness journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* What's Included */}
          <div className="bg-gray-100  rounded-xl p-6">
            <h2 className="font-semibold font-merriweather text-gray-800 mb-2">
              What’s Included
            </h2>

            <ul className="list-disc list-inside font-roboto text-gray-600 space-y-1">
              <li>Elegantly crafted, vegetable-forward salads and nourishing bowls</li>
              <li>Protein-balanced wraps designed for sustained energy</li>
              <li>Immunity- and stamina-enhancing juice blends</li>
              <li>Light, clean chaat prepared with mindful techniques</li>
              <li>Rotating weekly menu for variety</li>
            </ul>
          </div>

       

        </div>
      </div>

   
 {/* RIGHT SIDE */}
<div className="space-y-4">

  {/* CART TOTAL */}
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
      CART TOTAL
    </h2>

    <div className="space-y-2 text-sm font-manrope">

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹4,999</span>
      </div>

      <div className="flex justify-between">
        <span>Food Delivery Fee</span>
        <span>Free</span>
      </div>

      <div className="flex justify-between font-bold border-t pt-2">
        <span>Total</span>
        <span>₹4,999</span>
      </div>

    </div>

    <motion.a
      href="/subscription-silver"
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="block w-full mt-4 cursor-pointer text-sm py-2 text-center bg-[#895C40] text-white rounded-full font-medium"
    >
      PROCEED TO CHECKOUT
    </motion.a>

  </div>

  {/* CATEGORIES COVERED BOX */}
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-sm font-bold font-merriweather text-gray-800 mb-3 pb-2 tracking-wide">
      Categories Covered
    </h2>

    <div className="space-y-2 font-roboto">
      {categories.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <img
            src={item.icon}
            alt={item.name}
            className="w-10 h-10 object-contain"
          />
          <span className="font-medium text-gray-700">
            {item.name}
          </span>
        </div>
      ))}
    </div>

  </div>

</div>
    </div>
  </div>
</div>


);
};

export default RyviveSilver;
