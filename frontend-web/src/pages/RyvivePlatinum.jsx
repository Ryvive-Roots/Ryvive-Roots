import React from 'react'

const RyvivePlatinum = () => {
  return (
 <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6 text-center">Ryvive Platinum </h1>
       <h2 className=' font-semibold text-xl font-manrope mb-5'>Complete nutrition for a consistent, healthy lifestyle.  </h2>
        <p className="text-gray-600 mb-6 font-manrope">
       Ryvive Platinum is designed for those who are deeply committed to their health and 
everyday choices. Every meal is carefully curated to deliver higher nutritional value, 
balanced energy, and long-term benefits, without compromising on taste or variety.  
        </p>

        <div className="space-y-4 text-gray-600 font-manrope">
          <p>
           This plan includes higher protein meals, premium ingredients, and thoughtfully paired 
combinations that support energy, recovery, and overall vitality. With diverse flavours and 
functional nutrition built into every meal, Ryvive Platinum makes consistent healthy eating 
effortless and sustainable. 
          </p>
          <p>
         Ryvive Platinum is ideal for individuals who see food as a foundation for their lifestyle and 
goals. It doesn’t just support healthy eating, it helps you maintain it at a higher standard, 
every single day. 
          </p>
         
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>High-protein gourmet salads with paneer, avocado, broccoli, mushrooms, and 
legumes</li>
              <li>Premium wrap and pasta combinations paired with functional juices  </li>
              <li>Advanced juice blends supporting metabolism, recovery, skin, and energy </li>
              <li>Thoughtfully balanced chaat options made clean </li>
              <li>The widest and most diverse weekly menu</li>
            </ul>
          </div>

          <div className="bg-gray-100 font-manrope rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              Categories Covered
            </h2>
            <div className="flex flex-wrap gap-3">
              {[
                "Salads",
                "Wrap + Juice combinations",
                "Pasta + Juice combinations",
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

export default RyvivePlatinum;