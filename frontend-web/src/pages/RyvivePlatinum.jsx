import React from 'react'

const RyvivePlatinum = () => {
  return (
 <div className="min-h-screen mt-24 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] mb-6 text-center">Ryvive Platinum </h1>
       <h2 className=' font-semibold text-xl font-manrope mb-5'>Complete nutrition for a consistent, healthy lifestyle.  </h2>
        <p className="text-gray-600 mb-6 font-manrope">
     Ryvive Platinum is crafted for those who demand excellence in every choice—where food is not just fuel, but a foundation for a vibrant, purposeful lifestyle.
        </p>


    <p className="text-gray-600 mb-6 font-manrope">
   This plan features high-protein meals, premium ingredients, and thoughtfully paired combinations designed to support energy, recovery, and holistic vitality.
        </p>
       
       

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-xl font-manrope font-semibold text-gray-800 mb-3">
              What’s Included
            </h2>
            <ul className="list-disc font-manrope list-inside text-gray-600 space-y-2">
              <li>Exquisite high-protein salads with paneer, creamy avocado, tender broccoli, earthy mushrooms, and wholesome legumes, crafted to delight the senses</li>
              <li>Artisan wrap and pasta creations, paired with functional juices designed to nourish and sustain </li>
              <li>Signature functional juice blends to support metabolism, recovery, radiant skin, and sustained energy, made from the finest ingredients </li>
              <li>Refined chaat options, carefully balanced for flavor, freshness, and clean indulgence</li>
              <li>A meticulously curated weekly menu, offering unmatched variety and culinary sophistication

</li>
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
        className="px-8 py-3 cursor-pointer bg-[#895C40] text-white rounded-xl font-medium hover:bg-[#B38E6A] transition"
      >
        Start Your Wellness  Plan
      </a>

     
    </div>
      </div>
    </div>
  )
}

export default RyvivePlatinum;