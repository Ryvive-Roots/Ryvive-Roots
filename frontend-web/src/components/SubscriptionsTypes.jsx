import React from "react";
import { useNavigate } from "react-router-dom";


import BgImage from "../assets/optimized/StoryBgg.webp";



import ScrollToTop from "./ScrollToTop";
import { useState } from "react";

const SubscriptionTypes = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("PLATINUM");
  const [duration, setDuration] = useState("3");
  
  const planColors = {
    SILVER: "#C0C0C0",
    GOLD: "#eab041",
    PLATINUM: "#b68413"
  };
  

  const planStyles = {
  SILVER:
    "text-black bg-gradient-to-r from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0]",
    
  GOLD:
    "text-white bg-gradient-to-r from-[#b68413] via-[#ceac56] to-[#b68413]",
    
  PLATINUM:
    "text-white bg-gradient-to-r from-[#2c2c2c] via-[#6e6e6e] to-[#2c2c2c]"
};
  
  const planBackgrounds = {
    SILVER: "#ADA794",
    GOLD: "#CEAC56",
    PLATINUM: "#BB8714"
  };
  
  const prices = {
  SILVER: {
  "1": { price: 4999, original: 4999 },
  "3": { price: 14997, original: 14997 }
  },
  GOLD: {
  "1": { price: 5999, original: 5999 },
  "3": { price: 17997, original: 17997 }
  },
  PLATINUM: {
  "1": { price: 6999, original: 6999 },
  "3": { price: 20997, original: 20997 }
  }
  };
  
    // ✅ Dynamic Features (IMPORTANT CHANGE)
  const features = {
    PLATINUM: {
      "1": [
        "Chef’s signature menu",
        "3 Pauses Available",
        "Glow juices",
        "Elite combinations"
      ],
      "3": [
        "Premium nutrition combinations",
        "3 pauses / month",
        "Custom meal adjustments",
        "Priority delivery",
        "Exclusive chef curated dishes",
        "Surprise upgrades"
      ]
    },

    GOLD: {
      "1": [
        "4 High-protein meals / week",
        "2 Pauses Available",
        "Gut-friendly meals",
        "Energy juices"
      ],
      "3": [
        "More nutritional variety",
        "2 pauses / month",
        "Gut & Skin-Friendly Meals",
        "Advanced energy juices",
        "Boost Energy Levels",
        "Naturally Detoxifying Ingredients"
      ]
    },

    SILVER: {
      "1": [
        "Clean Meals",
        "No pause available",
        "Easy Digestion",
        "Weekly Variety"
      ],
      "3": [
        "Clean Meals",
        "1 pause available / month",
        "Easy Digestion",
        "Weekly Variety",
        "Functional Juices",
        "No calorie stress"
      ]
    }
  };


  return (
    <>
      <ScrollToTop />

      {/* MAIN WRAPPER */}
     <div className="relative w-full min-h-screen overflow-hidden
  bg-gradient-to-b
  from-[#a3a3a3]   /* Platinum */
  via-[#f0c022]   /* Gold */
  to-[#969696]    /* Silver */
  md:bg-none
">

        {/* BACKGROUND */}
       <img
  src={BgImage}
  alt="background"
  className="hidden md:block blur-xl absolute inset-0 w-full h-full object-top -z-10"
/>

<div className=" font-roboto   min-h-screen p-6">

<div className="max-w-7xl mx-auto">

<h2 className="text-2xl text-white font-merriweather text-center font-bold mb-8">
Choose Your Plan
</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:mx-20 lg:grid-cols-3 gap-6">

{["PLATINUM","GOLD","SILVER"].map((plan)=>{

const planPrices = prices[plan];
const save = planPrices["3"].original - planPrices["3"].price;
const isActive = selectedPlan === plan;

return (

<div
  key={plan}
  onClick={() => setSelectedPlan(plan)}
  className={`relative rounded-3xl p-6 transition-all cursor-pointer 
   bg-black/20 backdrop-blur-md border border-white/30
  ${isActive ? "shadow-xl scale-[1.02]" : "hover:shadow-md"}
  `}
  
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
? "border-[#eab041] bg-green-50 "
: "border-gray-200 hover:border-[#eab041]"}
`}
>

<div className="flex items-start gap-3">

<div className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
${isActive && duration==="1" ? "border-[#eab041]" : "border-white"}
`}>

{isActive && duration==="1" && (
<div className="w-2 h-2 bg-[#eab041] rounded-full"/>
)}

</div>

<div>
<p className={`font-medium ${isActive && duration==="1" ? "text-black" : "text-white"}`}>
  1 Month
</p>
</div>

</div>

<p className={`font-semibold ${isActive && duration==="1" ? "text-black" : "text-white"}`}>
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
? "border-[#eab041] bg-green-50"
: "border-gray-200 hover:border-[#eab041]"}
`}
>



<div className="flex items-start gap-3">

<div className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center
${isActive && duration==="3" ? "border-[#eab041]" : "border-white"}
`}>

{isActive && duration==="3" && (
<div className="w-2 h-2 bg-[#eab041] rounded-full"/>
)}

</div>

<div>

<p className={`font-semibold ${isActive && duration==="3" ? "text-black" : "text-white"}`}>
  3 Months
</p>


{/* <span className="relative text-gray-500 font-bold ">
₹{planPrices["3"].original.toLocaleString()}
<span className="absolute left-0 top-1/2 w-full h-[1px] bg-[#978f8a] rotate-[-10deg]"></span>
</span> */}




</div>

</div>

<p className={`font-bold ${isActive && duration==="3" ? "text-black" : "text-white"}`}>
  ₹{planPrices["3"].original.toLocaleString()}
</p>

</div>

</div>

{/* BUTTON */}

<div className="flex mb-4 justify-center">

<button
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/subscription/${plan.toLowerCase()}`, {
      state: {
        plan,
        duration,
        price: prices[plan][duration].price,
        monthlyPrice: prices[plan]["1"].price
      }
    });
  }}
  className={`shine-effect relative px-5 py-2 rounded-xl font-semibold shadow ${planStyles[plan]}`}
>
  <span>Start Your Plan</span>  {/* 👈 IMPORTANT */}
</button>

</div>

{/* FEATURES */}

<div className="text-sm text-white space-y-2 mb-6">

{features[plan][duration].map((feature, i) => (
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


      </div>
    </>
  );
};

export default SubscriptionTypes; 
 