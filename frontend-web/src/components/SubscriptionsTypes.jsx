import React from "react";
import Icon from "../assets/icon.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SubscriptionTypes = () => {
   const navigate = useNavigate();
  const plans = [
    {
      title: "Ryvive Silver",
   
      desc: "Thoughtfully curated healthy meals designed for everyday refined living.",
     
    },
    {
      title: "Ryvive Gold",
    
      desc: "An elevated monthly selection offering greater variety and enhanced value.",
      
    },
    {
      title: "Ryvive Platinum",
     
      desc: `A distinguished wellness experience with exclusive selections and premium privileges.`,
      
    },
  ];

  return (
    <div className="w-full bg-[#FEF7F0] py-14 flex flex-col items-center">
      <motion.h3
        initial={{ opacity: 0, y: 80 }}   // comes from lower bottom
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-4xl text-center font-cinzel uppercase font-semibold text-[#243E36] pb-10"
      >
      Subscription Pricing
      </motion.h3>
     

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full  px-6 max-w-7xl">
        {plans.map((plan, i) => (
          <div
            key={i}
            className="relative p-7 flex flex-col items-center justify-center bg-white border rounded-3xl shadow-sm hover:shadow-md hover:scale-105 transition-all"
          >
            <h3 className="text-xl font-semibold mb-1 text-center font-cinzel uppercase py-5">{plan.title}</h3>
            <p className="text-gray-700  text-base mb-4 text-center font-manrope pb-4">{plan.desc}</p>

          

            {/* Button */}
            <button
            onClick={() => navigate(`/${plan.id}`)}
            className="relative px-8 py-3 uppercase rounded-full cursor-pointer border-2 border-[#243E36] text-[#243E36] text-lg 
  font-medium
  hover:bg-[#243E36] hover:text-white hover:font-semibold
  transition
  before:rounded-full
  before:absolute before:inset-0 before:-m-2 
  before:border-2 before:border-[#243E36] before:content-['']
  hover:before:-m-3 hover:before:border-[1px]"

            >
              Start Your Plan
            </button>

            <hr className="mt-6 border-t border-gray-200" />

            {/* Features */}
            {/* <ul className="mt-6 space-y-2 font-manrope text-base">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <img src={Icon} className="h-5 w-5" alt="" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTypes;
