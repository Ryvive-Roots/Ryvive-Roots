import React from 'react'

const RyviveGold = () => {
  return (
   <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6 text-center">Ryvive Gold </h1>
       <h2 className=' font-semibold text-xl font-manrope mb-5'>More variety. More function. More nourishment. </h2>
        <p className="text-gray-600 mb-6 font-manrope">
         Ryvive Gold is created for those who want their meals to support a more active and 
demanding lifestyle. It goes beyond basic clean eating by offering meals that not only taste 
good but also help you stay energized, focused, and satisfied throughout the day.
        </p>

        <div className="space-y-4 text-gray-600 font-manrope">
          <p>
           This plan includes higher protein options, functional juices, and more diverse meal 
choices, giving your body the nourishment it needs to perform better. From protein-rich 
salads and wraps to clean pasta meals and purpose-driven juice blends, every item is 
selected to keep you fuller for longer and better fueled between meals.
          </p>
          <p>
           Ryvive Gold is ideal if you already pay attention to what you eat and want food that 
supports your routine, whether that’s long workdays, workouts, or an overall active 
lifestyle. It offers the perfect balance between enjoying your food and getting measurable 
nutritional value from it. 
          </p>
         
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>High-protein salads with chickpeas, paneer, and legumes</li>
              <li>Wrap and juice combinations for balanced energy </li>
              <li>Functional juices for immunity, stamina, brain health, skin, and libido </li>
              <li>Clean indulgences like pasta and zoodle meals</li>
              <li>Wider weekly menu rotation for better adherence</li>
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
                "Pasta"
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

export default RyviveGold;