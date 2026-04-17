import React, { useRef } from 'react'

import SubscriptionTypes from '../components/SubscriptionsTypes';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Sub1 from "../assets/sub1.png";
import Sub2 from "../assets/sub2.png";
import Sub3 from "../assets/sub3.png";

const Subscription = () => {

  const subscriptionRef = useRef(null);
  const swiperRef = useRef(null);

  return (
    <div className='overflow-hidden mt-24'>

      {/* 👇 Make this relative */}
      <div className="relative">

        {/* 🔴 Left Arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-1 md:left-2 top-1/2 z-[999] -translate-y-1/2  hover:bg-white p-2 md:p-3 rounded-full shadow-lg"
        >
          <FaChevronLeft size={20} className="text-black" />
        </button>

        {/* 🔴 Right Arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-1 md:right-2 top-1/2 z-[999] -translate-y-1/2  hover:bg-white p-2 md:p-3 rounded-full shadow-lg"
        >
          <FaChevronRight size={20} className="text-black" />
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          <SwiperSlide>
            <img src={Sub1} className="w-full h-60 md:h-[90vh] object-cover" />
          </SwiperSlide>

          <SwiperSlide>
            <img src={Sub2} className="w-full h-60 md:h-[90vh] object-cover" />
          </SwiperSlide>

          <SwiperSlide>
            <img src={Sub3} className="w-full h-60 md:h-[90vh] object-cover" />
          </SwiperSlide>
        </Swiper>

      </div>

      {/* Target section */}
      <div ref={subscriptionRef}>
        <SubscriptionTypes />
      </div>

    </div>
  );
}

export default Subscription;