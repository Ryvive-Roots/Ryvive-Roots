import React, { useRef } from 'react'
import { motion } from "framer-motion";
import SubscriptionTypes from '../components/SubscriptionsTypes';
import WhySubscribe from '../components/WhySubscription';
import HowItWorks from '../components/HowWorks';
import Banner from "../assets/BannerSub.png";

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
    <div className='overflow-hidden'>
      {/* Banner Section */}
      <div className="relative mt-20">
        <img
          src={Banner}
          alt="Subscription Banner"
          className="w-full h-auto  md:h-[90vh] object-cover object-top"
        />
      </div>

      <WhySubscribe />
      <HowItWorks />

      {/* 👇 Target section */}
      <div ref={subscriptionRef}>
        <SubscriptionTypes />
      </div>
    </div>
  );
}

export default Subscription;
