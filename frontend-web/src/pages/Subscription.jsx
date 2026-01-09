import React, { useRef } from 'react'
import { motion } from "framer-motion";
import Banner from "../assets/bannerSSS.jpg";
import SubscriptionTypes from '../components/SubscriptionsTypes';
import FeatureCarousel from '../components/Esp';
import WhySubscribe from '../components/WhySubscription';
import HowItWorks from '../components/HowWorks';

const Subscription = () => {

  // 👇 create ref
  const subscriptionRef = useRef(null);

  // 👇 scroll function
  const handleScroll = () => {
    subscriptionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div>
      {/* Banner Section */}
      <div className="relative ">
        <img
          src="https://res.cloudinary.com/dvugjpjoj/image/upload/v1767089824/bgImage_zgzldf.png"
          alt="Subscription Banner"
          className="w-full h-[95vh] md:h-[85*3vh] object-cover object-top"
        />

        <div className="absolute inset-0 bg-[#FEF7F0]/40"></div>

        {/* Animated Text */}
        <motion.div
          className="absolute mt-10 top-1/2 left-[4%] 
          transform -translate-y-1/2 
          text-[#243E36] font-cinzel 
          px-4 space-y-10 w-[90%] md:w-[45%] text-left"
          initial={{ x: -150, y: -150, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-2xl font-cinzel md:text-2xl lg:text-2xl font-semibold uppercase">
         Your Daily Healthy Meals Freshly Cooked & Delivered
          </h1>

          <p className="text-base font-roboto font-semibold  md:text-base max-w-[70%] text-black">
          24 days of clean, nourishing meals curated by Ryvive Roots and delivered to your doorstep.
          </p>

          {/* Button */}
          <button
            onClick={handleScroll}  // 👈 attach scroll
           className="relative font-roboto px-8 py-3 bg-[#FEF7F0] uppercase rounded-full cursor-pointer border-2 border-[#243E36] text-[#243E36] text-lg font-medium hover:bg-[#243E36] hover:text-white hover:font-semibold transition before:rounded-full before:absolute before:inset-0 before:-m-2 before:border-2 before:border-[#243E36] before:content-[''] hover:before:-m-3 hover:before:border-[1px]"
          >
           Start My 24-Day Journey
          </button>


        </motion.div>
        
       {/* Features Bar on Bottom */}
{/* Features Bar on Bottom Left */}
<div
  className="absolute bottom-6 left-6 
  flex md:flex-row flex-col items-center gap-10
  px-6 py-4 font-manrope6"
>
 
  <div className="flex items-center gap-2">
    <span className="text-xl">🌿</span>
    <p className="text-gray-800 font-medium">No preservatives</p>
  </div>
 <div className="flex items-center gap-2">
    <span className="text-xl">🚫</span>
    <p className="text-gray-800 font-medium">No Oil/ No Sugar</p>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-xl">🥗</span>
    <p className="text-gray-800 font-medium">Freshly cooked daily</p>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-xl">🚚</span>
    <p className="text-gray-800 font-medium">Doorstep delivery</p>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-xl">🕰</span>
    <p className="text-gray-800 font-medium">Morning & Evening slots</p>
  </div>
  
</div>


      </div>

     
      <WhySubscribe />
      <HowItWorks />

      {/* 👇 Target section */}
      <div ref={subscriptionRef}>
        <SubscriptionTypes />
      </div>

    </div>
  )
}

export default Subscription;
