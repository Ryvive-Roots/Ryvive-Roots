import React from 'react'
import { motion } from "framer-motion";
import Banner from "../assets/bannerSSS.jpg";
import SubscriptionTypes from '../components/SubscriptionsTypes';
import FeatureCarousel from '../components/Esp';
import WhySubscribe from '../components/WhySubscription';
import HowItWorks from '../components/HowWorks';
import SubscriptionPlan from '../components/SubscriptionPlan';
import Coming from "../assets/Coming.jpg";

const Subscription = () => {
  return (
    <div>
      {/* Banner Section */}
      <div className="relative">
        <img
          src={Banner}
          alt="Subscription Banner"
          className="w-full h-[95vh] md:h-[65vh] object-cover object-top-left "
        />

        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-[#FEF7F0]/60"></div>

        {/* Animated Text */}
     <motion.div
  className="absolute mt-10
             top-1/2 left-[4%] 
             transform -translate-y-1/2 
             text-[#243E36] font-cinzel 
             px-4 space-y-10 w-[90%] md:w-[40%] text-left"
  initial={{ x: -150, y: -150, opacity: 0 }}
  animate={{ x: 0, y: 0, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
>
  {/* Heading */}
  <h1 className="text-3xl md:text-5xl font-semibold uppercase leading-tight">
    Healthy Made Effortless
  </h1>

  {/* Subheading */}
  <p className="text-base font-semibold text-black md:text-2xl font-light max-w-[70%]">
    Daily salads & juices, prepared fresh and delivered to your door.
  </p>

  {/* Buttons */}
  <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-10">
   
     <button
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




  </div>

 
  
</motion.div>



      </div>

       <FeatureCarousel />
        <WhySubscribe />
        <HowItWorks />

      <SubscriptionTypes />
      
    </div>
  )
}

export default Subscription;
