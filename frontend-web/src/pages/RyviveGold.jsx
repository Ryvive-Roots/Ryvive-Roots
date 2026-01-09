import React from 'react'
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif/";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import Pasta from "../assets/pasta.png"


const RyviveGold = () => {
   const categories = [
      { name: "Salads", icon: saladIcon },
      { name: "Wraps + Juice Combos", icon: wrapIcon },
      { name: "Juices", icon: juiceIcon },
      { name: "Chaat", icon: chaatIcon },
      { name: "Pasta", icon: Pasta },
    ]
  return (
   <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6 text-center">Ryvive Gold </h1>
       <h2 className=' font-semibold text-xl font-manrope mb-5'>More variety. More function. More nourishment. </h2>
        <p className="text-gray-600 mb-6 font-manrope">
         Ryvive Gold is crafted for those who move through full days with purpose and presence. Designed to support both performance and balance, it offers a deeper, more considered approach to everyday nourishment.
        </p>

       
         <p className="text-gray-600 mb-6 font-manrope">
         Ryvive Gold is crafted for those who move through full days with purpose and presence. Designed to support both performance and balance, it offers a deeper, more considered approach to everyday nourishment.
        </p>
       

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2   gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>High-protein salads featuring chickpeas, paneer, and nourishing legumes</li>
              <li>Balanced wrap and juice pairings for sustained daily energy </li>
              <li>Functional juice blends that support immunity, stamina, brain health, skin, and vitality</li>
              <li>Clean indulgences, including thoughtfully prepared pasta and zoodle meals</li>
              <li>An expanded weekly menu rotation to support consistency and long-term adherence</li>
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
                    className="w-14 h-14- object-contain"
                  />
                  <span className=" font-roboto font-bold" >{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

         <div className="text-center mt-10">
      <a
            href="/subscription-form"
        className="px-8 py-3 cursor-pointer bg-[#895C40]- text-white rounded-xl font-medium hover:bg-[#B38E6A] transition"
      >
        Start Your Wellness  Plan
      </a>

     
    </div>
      </div>
    </div>
  )
}

export default RyviveGold;