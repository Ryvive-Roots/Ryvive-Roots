import React from "react";
import Icon from "../assets/icon.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BgImage from "../assets/subsBg.jpg"
import PricingCard from "./PricingCard";

const SubscriptionTypes = () => {
  const navigate = useNavigate();
  const plans = [
    {
      title: "Ryvive ",
      titleName: "Silver",
      price: "₹4,999",
      color: "#bbda7c",
      btnColor: "#bbda7c",
      features: [
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: false },
        { text: "Lorem Ipsum Dolor Sit", check: false },
      ],
    },
    {
      title: "Ryvive",
      titleName: "Gold",
      price: "₹5,999",
      color: "#156935",
      btnColor: "#156935",
      features: [
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: false },
      ],
    },
    {
      title: "Ryvive",
       titleName: "Platinum",
      price: "₹6,999",
      color: "#203d36",
      btnColor: "#203d36",
      features: [
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
        { text: "Lorem Ipsum Dolor Sit", check: true },
      ],
    },
  ];

  const plansS = [
    {
      title: "Ryvive Silver",
      id: "subscription/silver",
      desc: "Thoughtfully curated healthy meals designed for everyday refined living.",
    },
    {
      title: "Ryvive Gold",
      id: "subscription/gold",
      desc: "An elevated monthly selection offering greater variety and enhanced value.",
    },
    {
      title: "Ryvive Platinum",
      id: "subscription/platinum",
      desc: `A distinguished wellness experience with exclusive selections and premium privileges.`,
    },
  ];

  return (
    <div className="relative w-full h-[120vh] shadow-2xl py-10 flex flex-col items-center justify-center ">

      {/* Background Image */}
      <img
        src={BgImage}  // <-- replace with your image path
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-50  -z-10"
      />

      <motion.h3
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="md:text-3xl text-2xl text-center font-cinzel uppercase font-semibold text-[#243E36] pb-10"
      >
        
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 w-full px-6 md:px-30">
         {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTypes;
