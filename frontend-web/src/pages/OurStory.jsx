import React, { useState } from "react";
import { motion } from "framer-motion";
import Banner from "../assets/StoryBanner.jpg";
import What from "../assets/what.jpg";
import { GiFruitTree, GiLotus, GiForkKnifeSpoon } from "react-icons/gi";
import Story from "../assets/wellness.png";
import Storyy from "../assets/Storryy.jpeg";
import Value from "../assets/chef.png";
import Mission from "../assets/valuei.png";
import WhatIsRyviveRoots from "../components/WhatRevive";
import AboutPromise from "../components/OurPromise";
import BgImage from "../assets/BggImg.png"

const OurStory = () => {
    const [showMore, setShowMore] = useState(false);

  const paragraphs = [
    "It all started with a simple struggle to find food we could truly trust. Every time we stepped out to eat, we found ourselves asking the same questions: Is this food really fresh? How authentic are these ingredients? Are we eating what our bodies actually need? The answers were rarely reassuring. Most places we visited relied on frozen, pre-made, or chemical-filled ingredients that lacked both soul and nourishment. We missed the feeling of eating something genuinely natural food that didn’t just fill the stomach but revived the body and mind.",
    "That’s when the idea for Ryvive Roots began to grow. We wanted to create a place that brought people back to what food was meant to be: fresh, honest, and made with intention. A place where every dish is prepared from scratch, where the dressings are made in-house, and where no artificial flavours, sauces, or colours ever make their way into your bowl.",
    "We didn’t want to just serve meals, we wanted to serve a mindset. A mindset that respects both the body and the environment. That’s why every order at Ryvive Roots is served in eco-friendly sugarcane-based packaging, a conscious step to support balance in nature while providing nourishment for you. We believe health and sustainability must go hand in hand because true well-being comes from harmony, not convenience.",
    "The name Ryvive Roots reflects exactly what we stand for reviving your roots, your connection to real and wholesome nourishment. Our tagline is Live. Relive. Believe. beautifully sums up our philosophy. Live better, relive your natural energy, and believe in the power of authentic food.",
    "At Ryvive Roots, we believe that health isn’t about dieting, it’s about revival. We’ve moved beyond the fad-driven idea of “healthy eating” and built our menu around the actual needs of your body. Every ingredient we choose has a purpose to support digestion, strengthen immunity, enhance brain function, and nourish organs like the liver and thyroid. Each recipe is designed to work with your body, not against it.",
    "We want to bring back the joy of eating the kind that leaves you feeling light, happy, and energized. Every dish we create tells a story of farmers who grow with care, of ingredients that retain their natural goodness, and of a belief that what’s real will always be enough. Our kitchen isn’t powered by shortcuts or preservatives—it’s powered by passion, patience, and a promise to serve only what we ourselves would eat every day.",
    "Because we believe true health isn’t made in factories. It’s grown from the soil, nurtured by nature, revived with honesty, and served with love.",
    "At Ryvive Roots, this isn’t just food—it’s our way of helping you live better, relive your natural energy, and believe once again in the magic of authentic nourishment.",
  ];

  const visibleParagraphs = showMore ? paragraphs : paragraphs.slice(0, 3);
  return (
    <section >
      {/* Banner Section */}
    <div className="h-[50vh] mt-28 relative overflow-hidden flex items-center justify-center">
  {/* Background Image */}
  <img
    src={BgImage}
    alt="Our Story Background"
    className="absolute inset-0 w-full h-full object-cover object-bottom"
  />

  {/* Dark Overlay (optional but recommended) */}
  <div className="absolute inset-0 "></div>

  {/* Animated Text */}
  <motion.h1
    className="relative z-10 text-[#895C40] font-semibold font-cinzel uppercase 
               text-5xl md:text-7xl text-center"
    initial={{ x: -150, y: -150, opacity: 0 }}
    animate={{ x: 0, y: 0, opacity: 1 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
  >
    Our Story
  </motion.h1>
</div>




     {/* Info Section */}
<motion.div
  className="bg-[#FEF7F0] py-10 md:py-16 lg:py-20 xl:py-30 px-6 md:px-26 
             grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 lg:gap-16"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
>
  {/* Vision */}
  <div className="flex items-start gap-4 text-left w-full">
    <img src={Story} className="h-16 w-16" alt="vision icon" />
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#895C40] font-quicksand">Our Vision</h3>
      <p className="text-[#6c5840] font-semibold font-manrope mt-2 text-base leading-relaxed">
        We believe health should be simple, effortless, and a natural part of daily life. Our aim is to make 
wholesome, balanced eating accessible so people can feel lighter, clearer, and more in tune with 
themselves.
      </p>
    </div>
  </div>

  {/* Mission */}
  <div className="flex items-start gap-4 text-left w-full">
    <img src={Value} className="h-16 w-16" alt="mission icon" />
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#895C40] font-quicksand">Our Mission</h3>
      <p className="text-[#6c5840] font-semibold font-manrope mt-2 text-base leading-relaxed">
       To make healthy eating easy, enjoyable, and accessible for all through mindful preparation, quality 
ingredients, and balanced nutrition.
      </p>
    </div>
  </div>

  {/* Value */}
  <div className="flex items-start gap-4 text-left w-full">
    <img src={Mission} className="h-16 w-16" alt="value icon" />
    <div className="w-full">
      <h3 className="text-xl font-bold text-[#895C40] font-quicksand">Our Value</h3>
      <p className="text-[#6c5840] font-semibold font-manrope mt-2 text-base leading-relaxed">
        We strive to redefine healthy eating across India by making nutritious, sustainable, wholesome food easy 
for everyone. We aim to create a future where good health is a lifestyle, not a privilege.
      </p>
    </div>
  </div>
</motion.div>


  <div className="w-full flex flex-col md:flex-row items-start justify-center gap-10 xl:px-24 lg:px-16 px-4 py-20 ">
    <div className="w-full md:w-1/2">
      <h1 className="md:text-2xl lg:text-3xl text-xl  font-cinzel uppercase font-semibold text-[#895C40]">
        Our Story
      </h1>

      {visibleParagraphs.map((text, index) => (
        <p key={index} className=" text-base font-manrope py-2">
          {text}
        </p>
      ))}

      {/* Read more / Read less button */}
      <button
        className="text-[#895C40] font-semibold mt-2 underline"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Read Less..." : "Read More..."}
      </button>
    </div>
       <div className="w-full md:w-1/2">
       <img src={Storyy} alt="" /></div>
    </div>


      <div className="w-full flex flex-col md:flex-row items-start justify-center gap-10 xl:px-24 lg:px-16 px-4 pb-20 ">
      
       <div className="w-full md:w-1/2">
       <img src={What} alt="" /></div>
      <WhatIsRyviveRoots />
    </div>

     {/* === Progress Stats Cards Section === */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-16 bg-white"
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: true }}
>
  {/* Box 1 - Progress Info */}
  {/* <div className="bg-[#e7dbcf] p-10 flex flex-col justify-center text-left hover:scale-105 transition-transform duration-300">
    <h4 className="text-sm uppercase text-[#6c5840] font-semibold mb-2 tracking-wide">
      Progress
    </h4>
    <h2 className="text-xl md:text-2xl font-semibold text-[#895C40] leading-snug">
      Every day we
      <br />
      Get Better for You
    </h2>
  </div> */}

  {/* Box 2 - Served Dishes */}
  {/* <div className="bg-[#d5bda3] p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
    <h2 className="text-5xl font-bold text-white mb-2">5934</h2>
    <p className="text-white">Served Dishes</p>
  </div> */}

  {/* Box 3 - Served Customers */}
  {/* <div className="bg-[#b89b7b] p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
    <h2 className="text-5xl font-bold text-[#fff] mb-2">9211</h2>
    <p className="text-[#f7f3ec]">Served Customers</p>
  </div> */}

  {/* Box 4 - Served Projects */}
  {/* <div className="bg-[#a28363] p-8 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-300">
    <h2 className="text-5xl font-bold text-[#fff] mb-2">8672</h2>
    <p className="text-[#f7f3ec]">Served Projects</p>
  </div> */}
</motion.div>



  
<AboutPromise />

    </section>
  );
};

export default OurStory;
