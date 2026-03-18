import React, { useState } from "react";

export default function SubscriptionPlans() {

const [selectedPlan, setSelectedPlan] = useState("PLATINUM");
const [duration, setDuration] = useState("3");

const planColors = {
  SILVER: "#C0C0C0",
  GOLD: "#eab041",
  PLATINUM: "#b68413"
};

const planBackgrounds = {
  SILVER: "#ADA794",
  GOLD: "#CEAC56",
  PLATINUM: "#BB8714"
};

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
duration === "1"
? "No pause available"
: "1 pause available / month",
"Easy Digestion",
"Weekly Variety",
"Functional Juices",
"No calorie stress"
]

};

return (

<div className="bg-[#f7f7f7] font-roboto mt-20  min-h-screen p-6">

<div className="max-w-7xl mx-auto">

<h2 className="text-2xl font-roboto text-center font-bold mb-8">
Choose Your Plan
</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 mx-20 lg:grid-cols-3 gap-6">

{["PLATINUM","GOLD","SILVER"].map((plan)=>{

const planPrices = prices[plan];
const save = planPrices["3"].original - planPrices["3"].price;
const isActive = selectedPlan === plan;

return (

<div
key={plan}
onClick={()=>setSelectedPlan(plan)}
className={`relative rounded-3xl p-6 transition-all cursor-pointer
${isActive ? "shadow-xl scale-[1.02]" : "hover:shadow-md"}
`}
style={{
  borderColor: planColors[plan],
  background: planBackgrounds[plan]
}}
>

{/* top color bar */}

<div
className="absolute top-0  left-0 w-full"
style={{ background: planColors[plan] }}
></div>

{/* plan title */}

<h3
className="text-xl text-white  font-cinzel text-center font-bold mb-5 mt-2"

>
RYVIVE {plan}
</h3>


{/* PRICE OPTIONS */}

<div className="space-y-4 mb-6">

{/* 1 MONTH */}

<div
onClick={(e)=>{
e.stopPropagation();
setSelectedPlan(plan);
setDuration("1");
}}
className={`flex justify-between items-center rounded-xl border p-4
${isActive && duration==="1"
? "border-green-600 bg-green-50"
: "border-gray-200 hover:border-green-300"}
`}
>

<div className="flex items-start gap-3">

<div className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
${isActive && duration==="1" ? "border-green-600" : "border-gray-900"}
`}>

{isActive && duration==="1" && (
<div className="w-2 h-2 bg-green-600 rounded-full"/>
)}

</div>

<div>
<p className="font-medium">1 Month</p>
</div>

</div>

<p className="font-semibold">
₹{planPrices["1"].price.toLocaleString()}
</p>

</div>


{/* 3 MONTH */}

<div
onClick={(e)=>{
e.stopPropagation();
setSelectedPlan(plan);
setDuration("3");
}}
className={`relative flex justify-between items-center rounded-xl border p-4
${isActive && duration==="3"
? "border-green-600 bg-green-50"
: "border-gray-200 hover:border-green-300"}
`}
>



<div className="flex items-start gap-3">

<div className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
${isActive && duration==="3" ? "border-green-600" : "border-gray-900"}
`}>

{isActive && duration==="3" && (
<div className="w-2 h-2 bg-green-600 rounded-full"/>
)}

</div>

<div>

<p className="font-semibold text-black">
3 Months
</p>


{/* <span className="relative text-gray-500 font-bold ">
₹{planPrices["3"].original.toLocaleString()}
<span className="absolute left-0 top-1/2 w-full h-[1px] bg-[#978f8a] rotate-[-10deg]"></span>
</span> */}




</div>

</div>

<p className="font-bold text-black">
₹{planPrices["3"].original.toLocaleString()}
</p>

</div>

</div>

{/* BUTTON */}

<div className="flex mb-4 justify-center">

<button className="px-5 py-2 rounded-xl font-semibold bg-white text-black shadow">
Start Your Plan
</button>

</div>

{/* FEATURES */}

<div className="text-sm text-white space-y-2 mb-6">

{features[plan].map((feature,i)=>(
<div key={i} className="flex items-start  gap-2">

<span >•</span>

<span className={feature.includes("pause") ? "" : ""}>
{feature}
</span>

</div>
))}

</div>



</div>

);

})}

</div>

</div>

</div>

);

}