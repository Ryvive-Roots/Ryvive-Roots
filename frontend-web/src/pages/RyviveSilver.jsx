import React from "react";
import { motion } from "framer-motion";
import saladIcon from "../assets/bowl1.png";
import wrapIcon from "../assets/wraps.avif";
import juiceIcon from "../assets/juices.png";
import chaatIcon from "../assets/chat.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BgImage from "../assets/optimized/ImgP.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay  } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";



const RyviveSilver = () => {
const categories = [
{ name: "Salads", icon: saladIcon },
{ name: "Wraps + Juice Combos", icon: wrapIcon },
{ name: "Juices", icon: juiceIcon },
{ name: "Chaat", icon: chaatIcon },
];

const weeklyMenus = [
  {
    week: "Week 1",
    items: [
      "Healthy Heart",
      "Chilli Crunch Salad",
      "Paneer Crunch Wrap + Orange Pine Twist",
      "Chickpea Paneer Fuse",
      "Corn N Cheese Chaat",
      "Veg Protein Supreme Wrap + Golden Pine",
    ],
  },
  {
    week: "Week 2",
    items: [
      "Stamina Booster",
      "Creamy Double Chickpea",
      "Beetroot Cheese Wrap + Calm Cucumber",
      "Rajma Paneer Power",
      "Soya Protein Wrap + Vrive Carrot",
      "Immuni Boost Plus",
    ],
  },
  {
    week: "Week 3",
    items: [
      "Red Ryvive",
      "Corn Paneer Balance Bowl",
      "Sprout Energy Wrap + Dr. Carrot",
      "Roasted Zucchini Bowl",
      "Sprout Supreme Chaat",
      "Spinach Corn Cheese Wrap + Beet Blend",
    ],
  },
  {
    week: "Week 4",
    items: [
      "APB Shake",
      "High Protein Paneer Salad",
      "Spinach Corn Cheese Wrap + Beet Blend",
      "Chilli Lime Soya Salad",
      "Soya Protein Wrap + Vrive Carrot",
      "Sweet Potato & Pea Chaat",
    ],
  },
];

return ( <div className="relative min-h-screen mt-20 flex items-center justify-center overflow-hidden">


  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-top bg-no-repeat"
    style={{
      backgroundImage: `url(${BgImage})`,
    }}
  />

  {/* Blur Layer */}
  <div className="absolute inset-0 "></div>

  {/* Gradient Overlay */}
  <div className="absolute inset-0 "></div>
 
 {/* Main Content */}
<div className="relative min-h-screen py-20 px-6 md:px-20 flex justify-center">
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* LEFT — PLAN DETAILS */}
      <div className="md:col-span-2  rounded-xl  text-sm">
        <h1 className="text-3xl text-center font-cinzel uppercase font-bold text-black mb-4">
          Ryvive Silver
        </h1>

        <p className="text-black text-base text-center mb-2 font-roboto">
          Ryvive Silver is the ideal starting point for healthier eating, without drastic lifestyle changes.
          Designed to be simple and stress-free, it offers light, nourishing meals that support
          energy and digestion.
        </p>

        <p className="text-black text-base text-center mb-7 font-roboto">
          With fresh salads, protein-balanced wraps, functional juices, and clean chaat options,
          this plan helps you gradually replace unhealthy choices with better ones. Perfect for
          beginners, busy professionals, and anyone starting their wellness journey.
        </p>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{/* WHAT'S INCLUDED */}
<div className="bg-gray-100 rounded-xl p-6">
  <h2 className="font-semibold text-center font-merriweather text-gray-800 mb-2">
    What’s Included
  </h2>

  <ul className="list-disc list-inside font-roboto text-gray-600 space-y-1">
    <li>Elegantly crafted, vegetable-forward salads and nourishing bowls</li>
    <li>Protein-balanced wraps designed for sustained energy</li>
    <li>Immunity- and stamina-enhancing juice blends</li>
    <li>Light, clean chaat prepared with mindful techniques</li>
    <li>Rotating weekly menu for variety</li>
  </ul>
</div>

{/* WEEKLY MENU SWIPER */}
<div className="relative bg-gray-100 rounded-xl p-6">

<h2 className="font-semibold font-merriweather text-gray-800 mb-3 text-center">
4 Week Rotating Menu
</h2>

{/* LEFT ARROW */}
<button className="prevBtn absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-[#895C40] text-lg">
 <FaChevronLeft />
</button>

{/* RIGHT ARROW */}
<button className="nextBtn absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-[#895C40] text-lg">
 <FaChevronRight />
</button>

<Swiper
modules={[Navigation, Autoplay]}
spaceBetween={20}
slidesPerView={1}
navigation={{
prevEl: ".prevBtn",
nextEl: ".nextBtn",
}}
autoplay={{
delay: 3000,
disableOnInteraction: false,
}}
loop={true}
>

{weeklyMenus.map((menu, index) => (
<SwiperSlide key={index}>

<div className="bg-[#F5E8DA] rounded-lg p-4">

<h3 className="text-center font-semibold text-[#895C40] mb-3">
{menu.week}
</h3>

<ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
{menu.items.map((item, i) => (
<li key={i}>{item}</li>
))}
</ul>

</div>

</SwiperSlide>
))}

</Swiper>

</div>

</div>
      </div>

   
 {/* RIGHT SIDE */}
<div className="space-y-4">

  {/* CART TOTAL */}
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2 tracking-wide">
      CART TOTAL
    </h2>

    <div className="space-y-2 text-sm font-manrope">

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹4,999</span>
      </div>

      <div className="flex justify-between">
        <span>Food Delivery Fee</span>
        <span>Free</span>
      </div>

      <div className="flex justify-between font-bold border-t pt-2">
        <span>Total</span>
        <span>₹4,999</span>
      </div>

    </div>

    <motion.a
      href="/subscription-silver"
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.95, y: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="block w-full mt-4 cursor-pointer text-sm py-2 text-center bg-[#895C40] text-white rounded-full font-medium"
    >
      PROCEED TO CHECKOUT
    </motion.a>

  </div>

  {/* CATEGORIES COVERED BOX */}
  <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-sm font-bold font-merriweather text-gray-800 mb-3 pb-2 tracking-wide">
      Categories Covered
    </h2>

    <div className="space-y-2 font-roboto">
      {categories.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <img
            src={item.icon}
            alt={item.name}
            className="w-10 h-10 object-contain"
          />
          <span className="font-medium text-gray-700">
            {item.name}
          </span>
        </div>
      ))}
    </div>

  </div>

</div>
    </div>
  </div>
</div>


);
};

export default RyviveSilver;
