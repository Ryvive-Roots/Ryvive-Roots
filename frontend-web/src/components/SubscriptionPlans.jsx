import React, { useState } from "react";

export default function MealPlanner() {




  const [week, setWeek] = useState(1);

  const meals = [
    {
      img:"/meal1.png",
      title:"Grilled shrimps with lemon, basmati rice, peas and carrots",
      info:"260.2 kcal · 250 g · Lunch"
    },
    {
      img:"/meal2.png",
      title:"Grandma’s meatballs with roasted potato and veggies",
      info:"449 kcal · 300 g · Dinner"
    }
  ]

  return (

<div className="bg-[#f7f7f7] mt-20 min-h-screen p-8">

<div className="max-w-7xl mx-auto flex gap-6">

{/* LEFT SECTION */}

<div className="flex-1 bg-white rounded-3xl p-6 shadow-sm">

{/* PLAN SELECT */}
<div className="flex w-full border border-gray-300 rounded-xl overflow-hidden mb-6">

  {/* Light */}
  <button className="flex-1 py-4 text-center bg-purple-100 border-r border-gray-300">
    <p className="text-purple-600 font-medium">Light</p>
   
  </button>

  {/* Base */}
  <button className="flex-1 py-4 text-center border-r border-gray-300">
    <p className="font-medium text-gray-700">Base</p>
   
  </button>

  {/* Plus */}
  <button className="flex-1 py-4 text-center">
    <p className="font-medium text-gray-700">Plus</p>
   
  </button>

</div>




{/* WEEK PLAN */}
<div className="flex border rounded-xl overflow-hidden mb-6">

{[1,2,3,4].map((w)=>(
<button
key={w}
onClick={()=>setWeek(w)}
className={`flex-1 py-3 text-center text-sm ${
week===w
? "bg-purple-100 text-purple-600"
: "text-gray-500"
}`}
>
Week {w}
</button>
))}

</div>




{/* MEAL CARDS */}

<div className="flex gap-6">

{meals.map((meal,index)=>(

<div key={index} className="w-64">

<div className="bg-gray-100 rounded-2xl p-3 shadow">

<img
src={meal.img}
alt=""
className="rounded-xl w-full h-40 object-cover"
/>

</div>

<p className="mt-3 text-sm text-gray-700 leading-relaxed">
{meal.title}
</p>

<p className="text-xs text-gray-400 mt-1">
{meal.info}
</p>

</div>

))}

</div>

</div>


{/* RIGHT SECTION */}

<div className="w-[340px]">

<div className="bg-white rounded-3xl p-6 shadow sticky top-6">

<div className="flex items-center gap-2 mb-4">

<span className="line-through text-gray-400 text-lg">
836
</span>

<span className="text-4xl font-bold">
799
</span>

<span className="text-gray-500">AED</span>

</div>


{/* MONTH SELECT */}

<div className="flex border rounded-xl overflow-hidden text-sm mb-6">

<button className="px-4 py-2 bg-purple-100 text-purple-600">
Month
<div className="text-xs">4%</div>
</button>

<button className="px-4 py-2 text-gray-500">
Trial Week
<div className="text-xs">0%</div>
</button>

<button className="px-4 py-2 text-gray-500">
2 Months
<div className="text-xs">10%</div>
</button>

</div>


{/* TOGGLE */}

<div className="flex justify-between items-center mb-4">

<span className="text-sm text-gray-600">
For friends & family
</span>

<div className="w-10 h-5 bg-gray-200 rounded-full"></div>

</div>


{/* SUMMARY */}

<div className="text-sm text-gray-500 space-y-2 mb-6">

<div className="flex justify-between">
<span>40 meals, 20 meal days</span>
<span>39.9 AED / Day</span>
</div>

<div className="flex justify-between">
<span>Discount</span>
<span className="text-pink-500">-37 AED</span>
</div>

<div className="flex justify-between">
<span>Delivery</span>
<span>0 AED</span>
</div>

</div>


{/* PHONE */}

<input
type="text"
placeholder="+971 000000000"
className="w-full border rounded-lg px-4 py-2 mb-6"
/>


{/* BUTTON */}

<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium">
Get started!
</button>

</div>

</div>

</div>

</div>

  );
}