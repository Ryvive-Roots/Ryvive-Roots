


import React from 'react'
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif/";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import Pasta from "../assets/pasta.png"
import BgImage from "../assets/platinumbg.png"






const RyvivePlatinum = () => {
  const categories = [
      { name: "Salads", icon: saladIcon },
      { name: "Wraps + Juice Combos", icon: wrapIcon },
      { name: "Juices", icon: juiceIcon },
      { name: "Chaat", icon: chaatIcon },
      { name: "Pasta", icon: Pasta },
    ]

  return (
    <div
      className="min-h-screen bg-cover bg-top mt-20 bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen font-roboto w-full py-20  px-6 md:px-20 ">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LEFT — CART TOTALS */}
          <div className="md:col-span-2 bg-white/70 rounded-xl shadow-md p-6 text-sm">
            <h1 className="text-xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-3">
              Ryvive Platinum
            </h1>
            <h2 className=" font-semibold text-xl font-manrope mb-5">
              Complete nutrition for a consistent, healthy lifestyle.{" "}
            </h2>

            <p className="text-black font-bold mb-2 font-roboto">
              Ryvive Platinum is crafted for those who demand excellence in
              every choice—where food is not just fuel, but a foundation for a
              vibrant, purposeful lifestyle.
            </p>

            <p className="text-black font-bold mb-4 font-roboto">
              This plan features high-protein meals, premium ingredients, and
              thoughtfully paired combinations designed to support energy,
              recovery, and holistic vitality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h2 className="font-semibold text-gray-800 mb-2">
                  What’s Included
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>
                    Exquisite high-protein salads with paneer, creamy avocado,
                    tender broccoli, earthy mushrooms, and wholesome legumes,
                    crafted to delight the senses
                  </li>
                  <li>
                    Artisan wrap and pasta creations, paired with functional
                    juices designed to nourish and sustain{" "}
                  </li>
                  <li>
                    Signature functional juice blends to support metabolism,
                    recovery, radiant skin, and sustained energy, made from the
                    finest ingredients{" "}
                  </li>
                  <li>
                    Refined chaat options, carefully balanced for flavor,
                    freshness, and clean indulgence
                  </li>
                  <li>
                    A meticulously curated weekly menu, offering unmatched
                    variety and culinary sophistication
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

            <div className="space-y-2 text-sm text-black font-manrope">
              <div className="flex font-bold justify-between">
                <span>Subtotal</span>
                <span>₹6,999</span>
              </div>

              <div className="flex font-bold justify-between">
                <span>Food Delivery Fee</span>
                <span>Free </span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹6,999</span>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <a
              href="/subscription-platinum"
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

export default RyvivePlatinum;
