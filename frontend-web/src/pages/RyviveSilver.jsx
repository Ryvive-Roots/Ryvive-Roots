import React, { useState } from 'react'


const RyviveSilver = () => {
 
  return (
 
    <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6 text-center">Ryvive Silver</h1>
        <p className="text-gray-600 mb-6 font-manrope">
          Ryvive Silver is the ideal place to begin if you want to eat healthier
          without changing your entire lifestyle overnight. It’s designed to
          make clean eating feel easy, familiar, and stress-free.
        </p>

        <div className="space-y-4 text-gray-600 font-manrope">
          <p>
            This plan offers light yet nourishing meals that keep you energized
            through the day while being gentle on your digestion. With a balanced
            mix of fresh salads, wholesome wraps, and functional juices, Ryvive
            Silver helps you replace unhealthy food choices naturally and
            gradually.
          </p>
          <p>
            There’s no pressure to follow strict rules or complicated plans. You
            simply receive clean, thoughtfully prepared meals that fit
            seamlessly into your daily routine.
          </p>
          <p>
            Ryvive Silver makes healthy eating feel achievable, enjoyable, and
            sustainable — perfect for beginners or anyone seeking reliable,
            clean meals throughout the week.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>Fresh vegetable-based salads and bowls</li>
              <li>Protein-balanced wraps with functional juices</li>
              <li>Immunity & stamina boosting juice blends</li>
              <li>Light chaat options prepared cleanly</li>
              <li>Rotating weekly menu for variety</li>
            </ul>
          </div>

          <div className="bg-gray-100 font-manrope rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              Categories Covered
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Salads",
                "Wrap + Juice Combos",
                "Juices",
                "Chaat",
              ].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-white rounded-full shadow text-sm text-gray-700"
                >
                  {item}
                </span>
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