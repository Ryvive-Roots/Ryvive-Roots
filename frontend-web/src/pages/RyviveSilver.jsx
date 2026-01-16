import React from "react";
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import BgImage from "../assets/BgImage.png"

const RyviveSilver = () => {
  const categories = [
    { name: "Salads", icon: saladIcon },
    { name: "Wraps + Juice Combos", icon: wrapIcon },
    { name: "Juices", icon: juiceIcon },
    { name: "Chaat", icon: chaatIcon },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-top mt-20 bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen w-full py-20  px-6 md:px-20">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LEFT — CART TOTALS */}
          <div className="md:col-span-2 bg-white/70 rounded-xl shadow-md p-6 text-sm">
            <h1 className="text-xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-3">
              Ryvive Silver
            </h1>

            <p className="text-black font-bold  mb-2 font-roboto">
              Ryvive Silver is the ideal starting point for healthier
              eating—without drastic lifestyle changes. Designed to be simple
              and stress-free, it offers light, nourishing meals that support
              energy and digestion.
            </p>

            <p className="text-black font-bold  mb-4 font-roboto">
              With fresh salads, protein-balanced wraps, functional juices, and
              clean chaat options, this plan helps you gradually replace
              unhealthy choices with better ones. Perfect for beginners, busy
              professionals, and anyone starting their wellness journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  What’s Included
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Elegantly crafted, vegetable-forward salads and nourishing
                    bowls
                  </li>{" "}
                  <li>
                    Elegantly crafted, vegetable-forward salads and nourishing
                    bowls
                  </li>{" "}
                  <li>Immunity- and stamina-enhancing juice blends</li>{" "}
                  <li>Light, clean chaat prepared with mindful techniques</li>{" "}
                  <li>Rotating weekly menu for variety</li>
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
          <div className="bg-white/80 rounded-xl shadow-md p-5 h-fit">
            <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
              CART TOTALS
            </h2>

            <div className="space-y-2 text-sm text-black font-manrope">
              <div className="flex font-bold justify-between">
                <span>Subtotal</span>
                <span>₹4,999</span>
              </div>

              <div className="flex font-bold justify-between">
                <span>Food Delivery Fee</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹4,999</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <a
              href="/subscription-silver"
              className="block w-full mt-4 cursor-pointer text-sm py-2 text-center bg-[#895C40] text-white rounded-xl font-medium hover:bg-[#B38E6A] transition"
            >
              PROCEED TO CHECKOUT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RyviveSilver;
