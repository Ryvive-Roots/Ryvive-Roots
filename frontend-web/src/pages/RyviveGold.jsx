import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import Pasta from "../assets/pasta.png"
import BgImage from "../assets/goldbg.png"

const RyviveGold = () => {
  const categories = [
      { name: "Salads", icon: saladIcon },
      { name: "Wraps + Juice Combos", icon: wrapIcon },
      { name: "Juices", icon: juiceIcon },
      { name: "Chaat", icon: chaatIcon },
      { name: "Pasta", icon: Pasta },
    ]

    const location = useLocation();
    const navigate = useNavigate();
    const fallbackPrices = {
  GOLD: {
    "1": { price: 5999 },
    "3": { price: 17997 }
  }
};
const plan = location.state?.plan || "GOLD";
const duration = location.state?.duration || "1";

const price =
  location.state?.price ||
  fallbackPrices[plan][duration].price;

const monthlyPrice =
  location.state?.monthlyPrice ||
  fallbackPrices[plan]["1"].price;
  return (
    <div
      className="min-h-screen bg-cover bg-top mt-20 bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen w-full py-20  px-6 md:px-20 ">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LEFT — CART TOTALS */}
          <div className="md:col-span-2 bg-white/55 rounded-xl shadow-md p-6 text-sm">
            <h1 className="text-xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-3">
              Ryvive Gold
            </h1>
            <h2 className=" font-semibold text-xl font-manrope mb-5">
              More variety. More function. More nourishment.{" "}
            </h2>

            <p className="text-black font-bold mb-2 font-roboto">
              Ryvive Gold is crafted for those who move through full days with
              purpose and presence. Designed to support both performance and
              balance, it offers a deeper, more considered approach to everyday
              nourishment.
            </p>

            <p className="text-black font-bold mb-4 font-roboto">
              With elevated protein options, functional juices, and a wider
              selection of refined meals, Ryvive Gold sustains energy while
              honoring the body’s rhythm.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  What’s Included
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    High-protein salads featuring chickpeas, paneer, and
                    nourishing legumes
                  </li>
                  <li>
                    Balanced wrap and juice pairings for sustained daily energy{" "}
                  </li>
                  <li>
                    Functional juice blends that support immunity, stamina,
                    brain health, skin, and vitality
                  </li>
                  <li>
                    Clean indulgences, including thoughtfully prepared pasta and
                    zoodle meals
                  </li>
                  <li>
                    An expanded weekly menu rotation to support consistency and
                    long-term adherence
                  </li>
                </ul>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  Categories Covered
                </h2>

                <div className="space-y-2">
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

          {/* RIGHT — CONTENT */}
          <div className="bg-white/70 rounded-xl shadow-md p-5 h-fit">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
              CART TOTALS
            </h2>

            <div className="space-y-2 text-sm  text-black  font-manrope">
             <div className="flex justify-between">
  <span>Subtotal</span>

  <div className="text-right">
    {duration === "3" && (
      <p className="text-gray-500 text-xs">
        ₹{monthlyPrice.toLocaleString()} × 3
      </p>
    )}

    <p>₹{price.toLocaleString()}</p>
  </div>
</div>

              <div className="flex justify-between">
                <span>Food Delivery Fee</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{price.toLocaleString()}</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
           <motion.button
  onClick={() =>
    navigate("/subscription-gold", {
      state: {
        plan,
        duration,
        price,
        monthlyPrice: location.state?.monthlyPrice
      }
    })
  }
  whileHover={{ scale: 1.03, y: -3 }}
  whileTap={{ scale: 0.95, y: 0 }}
  transition={{ type: "spring", stiffness: 250, damping: 18 }}
  className="block w-full mt-4 cursor-pointer text-sm py-2 text-center bg-[#895C40] text-white rounded-full font-medium"
>
  PROCEED TO CHECKOUT
</motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RyviveGold;
