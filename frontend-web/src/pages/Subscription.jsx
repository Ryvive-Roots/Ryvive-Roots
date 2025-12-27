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
      <div className="relative mt-24">
        <img
          src={Banner}
          alt="Subscription Banner"
          className="w-full h-[95vh] md:h-[75vh] object-cover object-top-left"
        />

        <div className="absolute inset-0 bg-[#FEF7F0]/60"></div>

        {/* Animated Text */}
        <motion.div
          className="absolute mt-10 top-1/2 left-[4%] 
          transform -translate-y-1/2 
          text-[#243E36] font-cinzel 
          px-4 space-y-10 w-[90%] md:w-[40%] text-left"
          initial={{ x: -150, y: -150, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold uppercase">
          Fresh. Clean. Delivered.
          </h1>

          <p className="text-base md:text-xl max-w-[70%] text-black">
          24 Days of clean, nourishing meals, curated by Revive Roots and delivered across Dombivli - so you can eat better without the daily stress.
          </p>

          {/* Button */}
          <button
            onClick={handleScroll}  // 👈 attach scroll
           className="relative px-8 py-3 uppercase rounded-full cursor-pointer border-2 border-[#243E36] text-[#243E36] text-lg font-medium hover:bg-[#243E36] hover:text-white hover:font-semibold transition before:rounded-full before:absolute before:inset-0 before:-m-2 before:border-2 before:border-[#243E36] before:content-[''] hover:before:-m-3 hover:before:border-[1px]"
          >
           Start My 24-Day Journey
          </button>
        </motion.div>
      </div>

      <FeatureCarousel />
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
