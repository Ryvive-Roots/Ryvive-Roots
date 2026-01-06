import React, { useState } from 'react'
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/Wraps.png";
import juiceIcon from "../assets/subscription.png";
import chaatIcon from "../assets/subscription.png";




const RyviveSilver = () => {
  const categories = [
    { name: "Salads", icon: saladIcon },
    { name: "Wraps + Juice Combos", icon: wrapIcon },
    { name: "Juices", icon: juiceIcon },
    { name: "Chaat", icon: chaatIcon },
  ];
  return (

    <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6">Ryvive Silver</h1>
        <p className="text-gray-600 mb-6 font-manrope">
          Ryvive Silver is the ideal starting point for healthier eating—without drastic lifestyle changes. Designed to be simple and stress-free, it offers light, nourishing meals that support energy and digestion.
        </p>

        <p className="text-gray-600 mb-6 font-manrope">

           <p className="text-gray-600 mb-6 font-manrope">
With fresh salads, protein-balanced wraps, functional juices, and clean chaat options, this plan helps you gradually replace unhealthy choices with better ones.
Perfect for beginners, busy professionals, and anyone starting their wellness journey.

        </p>
        </p>




        <div className="mt-8 grid grid-cols-1  gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>Elegantly crafted, vegetable-forward salads and nourishing bowls</li>
              <li>Elegantly crafted, vegetable-forward salads and nourishing bowls</li>
              <li>Immunity- and stamina-enhancing juice blends</li>
              <li>Light, clean chaat prepared with mindful techniques</li>
              <li>Rotating weekly menu for variety</li>
            </ul>
          </div>

          <div className="bg-gray-100 font-manrope rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Categories Covered
            </h2>

            <div className="flex flex-col gap-3">
              {categories.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 px-4 py-2   text-base text-gray-700"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className=" font-roboto" >{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="/subscription-form"
            className="px-8 py-3 cursor-pointer bg-[#B38E6A] text-white rounded-xl font-medium hover:bg-[#B38E6A] transition"
          >
            Start Your Wellness  Plan
          </a>


        </div>
      </div>
    </div>


  )
}

export default RyviveSilver;