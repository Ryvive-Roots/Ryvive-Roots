import React, { useState } from "react";
import { motion } from "framer-motion";

export default function MealPlanner() {

const [plan, setPlan] = useState("PLATINUM");
const [duration, setDuration] = useState("3");
const [week, setWeek] = useState(1);

const prices = {
  SILVER: {
    "1": { price: 4999, original: 4999 },
    "3": { price: 13999, original: 14997 }
  },
  GOLD: {
    "1": { price: 5999, original: 5999 },
    "3": { price: 15999, original: 17997 }
  },
  PLATINUM: {
    "1": { price: 6999, original: 6999 },
    "3": { price: 18897, original: 20997 }
  }
};

const features = {

PLATINUM: [
"Chef’s signature menu",
"3 pauses / month",
"Glow, metabolism & recovery juices",
"Guilt-Free Wraps & Zoodle Options",
"Elite combinations",
"Surprise upgrades"
],

GOLD: [
"6 High-protein meals / week",
"2 pauses / month",
"Gut & Skin-Friendly Meals",
"Advanced energy juices",
"Boost Energy Levels",
"Naturally Detoxifying Ingredients"
],

SILVER: [
"Clean Meals",
duration === "1" ? "No pause available" : "1 pause available / month",
"Easy Digestion",
"Weekly Variety",
"Functional Juices",
"No calorie stress"
]

};

const { price, original } = prices[plan][duration];
const save = original - price;

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
];

return (

<div className="bg-white sm:bg-[#f7f7f7] mt-16 sm:mt-20 min-h-screen p-4 sm:p-8">

<div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

{/* LEFT SECTION */}

<div
className={`flex-1 p-4 sm:p-6 transition-all duration-300
bg-white sm:rounded-3xl sm:shadow-sm
${plan === "PLATINUM" ? "sm:bg-[#aa7c13]/40" : ""}
${plan === "GOLD" ? "sm:bg-[#ceac56]/40" : ""}
${plan === "SILVER" ? "sm:bg-[#aba492]/40" : ""}
`}
>

{/* PLAN SELECT */}

<div className="flex w-full mb-6 rounded-xl overflow-hidden border">

<button
onClick={()=>setPlan("PLATINUM")}
className={`flex-1 py-3 text-sm sm:text-base font-bold font-cinzel
${plan==="PLATINUM"?"bg-[#aa7c13] text-white":"bg-white text-gray-700"}
`}
>
PLATINUM
</button>

<button
onClick={()=>setPlan("GOLD")}
className={`flex-1 py-3 text-sm sm:text-base font-bold font-cinzel border-l border-r
${plan==="GOLD"?"bg-[#ceac56] text-white":"bg-white text-gray-700"}
`}
>
GOLD
</button>

<button
onClick={()=>setPlan("SILVER")}
className={`flex-1 py-3 text-sm sm:text-base font-bold font-cinzel
${plan==="SILVER"?"bg-[#aba492] text-white":"bg-white text-gray-700"}
`}
>
SILVER
</button>

</div>

{/* PLAN FEATURES */}

<div className="mb-6 flex justify-center">

<div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-roboto font-bold text-gray-800 max-w-xl">

{features[plan].map((item,index)=>(
<div key={index} className="flex items-start gap-2">
<span className="text-gray-700 text-lg">•</span>
<p>{item}</p>
</div>
))}

</div>

</div>

{/* WEEK PLAN */}

<div className="grid grid-cols-2 sm:grid-cols-4 border rounded-xl overflow-hidden mb-6">

{[1,2,3,4].map((w)=>(
<button
key={w}
onClick={()=>setWeek(w)}
className={`py-3 text-sm ${
week===w
?"bg-purple-100 text-purple-600"
:"text-gray-500"
}`}
>
Week {w}
</button>
))}

</div>

{/* MEAL CARDS */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

{meals.map((meal,index)=>(

<div key={index} className="w-full">

<div className="bg-gray-100 rounded-2xl p-3 shadow overflow-hidden">

<img
src={meal.img}
alt=""
className="rounded-xl w-full h-40 object-cover"
/>

</div>

<p className="mt-3 text-sm text-gray-700">
{meal.title}
</p>

<p className="text-xs text-gray-400">
{meal.info}
</p>

</div>

))}

</div>

</div>

{/* RIGHT SECTION */}

<div className="w-full lg:w-[340px] font-roboto">

<div className="bg-white rounded-3xl shadow-md p-6 sticky top-6">

{/* PRICE */}

<div className="flex items-end gap-3 mb-5">

{save>0 &&(
<span className="relative text-gray-500 font-bold text-lg">
₹{original.toLocaleString()}
<span className="absolute left-0 top-1/2 w-full h-[1px] bg-[#978f8a] rotate-[-10deg]"></span>
</span>
)}

<span className="text-3xl sm:text-4xl font-bold text-gray-800">
₹{price.toLocaleString()}
</span>

</div>

{/* MONTH SELECT */}

<div className="flex border rounded-xl overflow-hidden text-sm mb-6">

<button
onClick={()=>setDuration("3")}
className={`flex-1 py-2 ${
duration==="3"
?"bg-green-100 text-green-700"
:"text-gray-500"
}`}
>
3 Months
<div className="text-xs">Save ₹{save}</div>
</button>

<button
onClick={()=>setDuration("1")}
className={`flex-1 py-2 ${
duration==="1"
?"bg-green-100 text-green-700"
:"text-gray-500"
}`}
>
1 Month
<div className="text-xs">Regular</div>
</button>

</div>

{/* CART TOTAL */}

<h2 className="text-sm font-semibold mb-3 border-b pb-2">
CART TOTAL
</h2>

<div className="space-y-3 text-sm mb-6">

<div className="flex justify-between">
<span>Subtotal</span>
<span>₹{original.toLocaleString()}</span>
</div>

{save>0 &&(
<div className="flex justify-between text-green-600">
<span>Discount</span>
<span>-₹{save.toLocaleString()}</span>
</div>
)}

<div className="flex justify-between">
<span>Food Delivery</span>
<span className="text-green-600">Free</span>
</div>

<div className="flex justify-between border-t pt-3 font-semibold">
<span>Total</span>
<span>₹{price.toLocaleString()}</span>
</div>

</div>

{/* BUTTON */}

<motion.a
href={`/subscription-${plan}?duration=${duration}`}
whileHover={{scale:1.04,y:-2}}
whileTap={{scale:0.96}}
transition={{type:"spring",stiffness:250,damping:18}}
className="block w-full text-center py-3 bg-[#895C40] hover:bg-[#774c33] text-white rounded-full font-medium"
>
Get Started!
</motion.a>

</div>

</div>

</div>

</div>

);
}