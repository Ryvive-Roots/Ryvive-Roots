


import React from 'react'
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif/";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import Pasta from "../assets/pasta.png"





const RyvivePlatinum = () => {
  const categories = [
      { name: "Salads", icon: saladIcon },
      { name: "Wraps + Juice Combos", icon: wrapIcon },
      { name: "Juices", icon: juiceIcon },
      { name: "Chaat", icon: chaatIcon },
      { name: "Pasta", icon: Pasta },
    ]

  return (
    <div className="min-h-screen mt-20 bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT — CART TOTALS */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 text-sm">
          <h1 className="text-xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-3">
            Ryvive Platinum
          </h1>
          <h2 className=" font-semibold text-xl font-manrope mb-5">
            Complete nutrition for a consistent, healthy lifestyle.{" "}
          </h2>

          <p className="text-gray-600 mb-2 font-roboto">
            Ryvive Gold is crafted for those who move through full days with
            purpose and presence. Designed to support both performance and
            balance, it offers a deeper, more considered approach to everyday
            nourishment.
          </p>

          <p className="text-gray-600 mb-4 font-roboto">
            With fresh salads, protein-balanced wraps, functional juices, and
            clean chaat options, this plan helps you gradually replace unhealthy
            choices with better ones. Perfect for beginners, busy professionals,
            and anyone starting their wellness journey.
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
                  A meticulously curated weekly menu, offering unmatched variety
                  and culinary sophistication
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
        <div className="bg-white rounded-xl shadow-md p-5 h-fit">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
            CART TOTALS
          </h2>

          <div className="space-y-2 text-sm text-gray-700 font-manrope">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹5,999</span>
            </div>

            <div className="flex justify-between">
              <span>Food Delivery Fee</span>
              <span>₹00.00</span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹5,999</span>
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
  );
};

export default RyvivePlatinum;
