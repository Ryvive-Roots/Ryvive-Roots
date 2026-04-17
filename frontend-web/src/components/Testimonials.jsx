import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

import Coma from "../assets/optimized/coma.png";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Monika Korgaonkar",
      text:
        "One of the best dining experiences I’ve had. The ingredients were fresh, the flavors were perfect, and the presentation was excellent. Highly recommended for food lovers.",
    },
    {
      name: "Dileep Kumar",
      text:
        "Tried this place for the first time today and honestly didn’t expect healthy food to taste this good. Everything was fresh and nicely seasoned. Definitely coming back.",
    },
    {
      name: "Deepak World Vacation",
      text:
        "Best healthy food option in Dombivli right now. Clean packaging, good portions, and consistent taste. Been ordering for 3 weeks straight.",
    },
    {
      name: "Santosh Gupta",
      text:
        "I Tried the immunity booster and libido booster. I feel energetic and it tastes so good . Thank you Ryvive roots for giving me such a good experience and ambeience is so good.",
    },
    {
      name: "Rajan jadhav",
      text:
        "Loved the detox juices here. Very refreshing and natural taste.",
    },
    {
      name: "Afroza khan",
      text:
        "Loved the detox juices here. Very refreshing and natural taste.",
    },
    {
      name: "Shashi Shetty",
      text:
        "Excellent ambience and soulful food.",
    },
    {
      name: "Vishal Shetty",
      text:
        "This place is a hidden gem! If you guys are into concious and healthy eating, look no further.",
    },
     {
      name: "Sonali Ovhal",
      text:
        "It's outstanding ossam and healthy plz try be fit stay healthy.",
    },
     {
      name: "The Alok Tamhankar Show",
      text:
        "A super healthy Alternative to unwanted junk food... Bon appetite ... Must try",
    },
  ];

  return (
    <div className="w-full bg-[#0d2009] overflow-hidden py-10 relative">
      <h3 style={{ fontFamily: "MyFont" }} className=" md:text-4xl text-xl text-center uppercase font-semibold text-[#c9a666] pb-10">
        Client Diaries
      </h3>

      {/* Custom Arrows */}
      <div className="absolute left-3 top-1/2 z-20 cursor-pointer swiper-prev">
        <FiChevronLeft className="text-3xl md:text-4xl text-[#c9a666]" />
      </div>

      <div className="absolute right-3 top-1/2 z-20 cursor-pointer swiper-next">
        <FiChevronRight className="text-3xl md:text-4xl text-[#c9a666]" />
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 1,
          },
        }}
        className="px-6 md:px-20"
      >
        {testimonials.map((item, index) => (
         <SwiperSlide key={index}>
  <div className="flex flex-col items-center justify-center text-center px-6 md:px-20 ">
    
    {/* Quote Icon */}
    <img src={Coma} alt="quote" className="w-12 mb-6 opacity-70" />

    {/* Text */}
    <p  className="text-white tracking-wider text-lg md:text-2xl font-playfair-display leading-relaxed max-w-4xl ">
      {item.text}
    </p>

    {/* Author */}
    <h3 className="mt-6 text-[#c9a666] text-lg md:text-xl font-semibold tracking-widest">
      {item.name}
    </h3>

    
  </div>
</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
