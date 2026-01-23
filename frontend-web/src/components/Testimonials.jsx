import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

import Coma from "../assets/quote.png";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "—Vishal Shah",
      text:
        "Revive Roots is a hidden gem for health enthusiasts! I tried the Clean Green juice ... Highly recommend it for anyone looking for delicious and pocket-friendly organic food options.",
    },
    {
      name: "—Teju More",
      text:
        "Loved the crispy texture and healthy, delicious taste.. quality and quantity were impressive!",
    },
    {
      name: "—Aditya Wadekar",
      text:
        "Good Initiative. Food is tasty. Ambience is hygenic. Service is good.",
    },
    {
      name: "—Madhuri Kale",
      text:
        "Today I visited the Revive roots... such a tasty sandwich i had ever...",
    },
    {
      name: "—Shriram Thakur",
      text:
        "Very nice. Quality, Quantity and Hygiene. Loved the atmosphere.",
    },
  ];

  return (
    <div className="w-full bg-[#FEF7F0] overflow-hidden py-20 relative">
      <h3 className=" md:text-4xl text-xl text-center font-cinzel uppercase font-semibold text-[#895C40] pb-10">
        What Our Customers Are Saying
      </h3>

      {/* Custom Arrows */}
      <div className="absolute left-3 top-1/2 z-20 cursor-pointer swiper-prev">
        <FiChevronLeft className="text-3xl md:text-4xl text-[#895C40]" />
      </div>

      <div className="absolute right-3 top-1/2 z-20 cursor-pointer swiper-next">
        <FiChevronRight className="text-3xl md:text-4xl text-[#895C40]" />
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={10}
        loop={true}
        autoplay={{
          delay: 2500,
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
            slidesPerView: 2,
          },
        }}
        className="px-6 md:px-20"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="py-10 px-2 flex justify-center">
              <div className="relative max-w-[500px] w-full">
                <img
                  src="https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765349846/Testimonials_c7f8qf.png"
                  alt="testimonial"
                   loading="lazy"
                  className="rounded-full shadow-md w-full aspect-[5/6] object-cover"
                />

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 space-y-3">
                  <img src={Coma} className="w-10 h-10" alt="quote"  loading="lazy" />

                  <p className="text-[#895C40] text-sm leading-relaxed font-merriweather max-h-[130px] overflow-y-auto">
                    {item.text}
                  </p>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg" />
                    ))}
                  </div>

                  <h3 className="text-[#895C40] font-semibold text-lg">
                    {item.name}
                  </h3>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
