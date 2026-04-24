import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Bowl from "../assets/bowl.avif";
import HJuice from "../assets/optimized/HJuice.webp";
import Chaat from "../assets/Chaat.webp";
import Sandwitch1 from "../assets/Sandwitch2.webp";

import BgDesktop from "../assets/optimized/Land1.png";

import BgMobile from "../assets/optimized/LandMB.jpg";

import img1 from "../assets/optimized/sustainable.png";
import img2 from "../assets/optimized/LandMB.jpg";
import img3 from "../assets/optimized/Land1.png";
import img4 from "../assets/Chaat.webp";
import useIsMobile from "./useIsMobile";
import Image from "../assets/optimized/about3.png";
import MobileImage from "../assets/optimized/mobileA2.png";
import Image2 from "../assets/optimized/menu3.png";
import MobileImage2 from "../assets/optimized/mobileA3.png";
import AnimatedText from "./AnimateLE";



const ScrollingText = lazy(() => import("./Usps"));
const MenuCarousel = lazy(() => import("./MenuCarousal"));
const TestimonialsSection = lazy(() => import("./Testimonials"));


const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06, // 👈 slower letters (increase for more slow)
    },
  },
};

const letter = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.95,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6, // 👈 slower transition
      ease: [0.25, 0.8, 0.25, 1], // smooth premium easing
    },
  },
};



const HeroSection = () => {
  const [index, setIndex] = useState(0);
    const sectionData = [
  {
    title: "SUSTAINABLE PACKAGING",
    subtitle: "Healthy for You & the Planet",
    description:
      "Eco-friendly packaging made from sustainable materials.",
    image: img1,
  },
  {
    title: "FRESH INGREDIENTS",
    subtitle: "Straight from Nature",
    description: "We use only fresh and organic ingredients.",
    image: img2,
  },
  {
    title: "CHEF SPECIAL",
    subtitle: "Crafted with Passion",
    description: "Every dish is made with love and creativity.",
    image: img3,
  },
  {
    title: "FAST DELIVERY",
    subtitle: "Quick & Reliable",
    description: "Hot and fresh food delivered to your doorstep.",
    image: img4,
  },
]; 

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % sectionData.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? sectionData.length - 1 : prev - 1
    );
  };

  const current = sectionData[index];


  const isMobile = useIsMobile();

  const cloudinaryImages = {
    Sandwitch: Sandwitch1,
    Juice:HJuice,
    Salad:Bowl,
     Chaat : Chaat
  };

  const images = [
    cloudinaryImages.Salad,
    cloudinaryImages.Sandwitch,
    cloudinaryImages.Juice,
    cloudinaryImages.Chaat,
  
  ];
  const imageAlts = [
    "Healthy fresh salad bowl at Ryvive Roots cafe",
    "Grilled sandwich made with fresh ingredients at Ryvive Roots",
    "Cold pressed fresh fruit juice at Ryvive Roots cafe",
    "Healthy Indian chaat prepared with natural ingredients at Ryvive Roots",
  ];

  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    arrows: false,
  };

  // Animation variants
 const containerVariant = {
  hidden: { opacity: 0, transform: "translateY(40px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};


  const imageVariant = {
  hidden: { opacity: 0, transform: "translateX(-50px)", scale: 0.95 },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const textVariant = {
  hidden: { opacity: 0, transform: "translateX(50px)" },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.9, ease: "easeOut", delay: 0.2 },
  },
};


  // 🔥 Parent container (controls stagger)
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5, // delay between each item
      },
    },
  };

  // 🔥 Each item animation
  const item = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut",
      },
    },
  };


    const parallaxRef = useRef(null);

useEffect(() => {
  if (isMobile) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (parallaxRef.current) {
          const scrollY = window.scrollY;
          parallaxRef.current.style.backgroundPositionY = `${scrollY * 0.3}px`;
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [isMobile]);




useEffect(() => {
  const interval = setInterval(() => {
    nextSlide();
  }, 4000);

  return () => clearInterval(interval);
}, []);

 
  return (
    <>

    <div >
<div className="relative overflow-hidden h-screen w-full">

  {/* 🌄 Background Image */}
  <div className="absolute inset-0 z-0">
  <picture className="w-full h-full">
    <source media="(max-width: 768px)" srcSet={BgMobile} />
    <source media="(min-width: 769px)" srcSet={BgDesktop} />
    <img
      src={BgDesktop}
      alt="Background"
      className="w-full h-full object-cover object-top"
    />
  </picture>

  {/* 🔥 DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/30"></div>
</div>

  {/* 📝 Centered Content */}
  <div className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-20 text-center">

    <div>
      {/* Tagline */}
      <motion.p
        initial={
          isMobile
            ? { opacity: 0 }
            : { opacity: 0, y: 30 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isMobile ? 0.3 : 0.7,
          ease: "easeOut",
          delay: 0.5,
        }}
      className="text-white uppercase tracking-widest max-w-xl text-sm md:text-sm font-merriweather mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
      >
        Crafted for balance, freshness, and flavour.
      </motion.p>

      {/* Heading */}
      <motion.h1
        initial={
          isMobile
            ? { opacity: 0 }
            : { opacity: 0, y: 30 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isMobile ? 0.3 : 0.7,
          ease: "easeOut",
          delay: 0.2,
        }}
       className="text-4xl md:text-3xl lg:text-6xl xl:text-5xl text-white leading-tight mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
      >
      <p className="text-xl font-merriweather drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          Welcome to <br />
        </p>

       <span
  className="text-white font-myfont drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
  style={{ fontFamily: "Angeletta W04 Regular" }}
>
          Ryvive Roots
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={
          isMobile
            ? { opacity: 0 }
            : { opacity: 0, y: 30 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isMobile ? 0.3 : 0.7,
          ease: "easeOut",
          delay: 0.5,
        }}
      className="text-white tracking-widest max-w-xl text-sm md:text-lg font-merriweather mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" 
      >
        Live better, relive your natural energy, and believe in the power of authentic food.
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{
          scale: 1.07,
          y: -3,
          boxShadow: "0px 10px 22px rgba(0,0,0,0.2)",
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.23, ease: "easeOut" }}
        onClick={() => navigate("/subscription")}
        className="bg-transparent tracking-[0.20em] rounded-3xl shadow-2xl border border-white cursor-pointer text-white px-8 py-3 font-semibold"
      >
        Subscription
      </motion.button>
    </div>

  </div>
</div>

      <div className=" md:relative w-full  h-screen">
 {/* ✅ Background Images */}
  
  {/* Desktop Image */}
  <img
    src={Image}
    alt="Wellness"
    className="hidden md:block w-full h-full object-cover"
  />

  {/* Mobile Image */}
  <img
    src={MobileImage}
    alt="Wellness"
    className="block md:hidden w-full h-[55vh] "
  />

  {/* Overlay Content */}
  <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    className="md:absolute md:inset-0 bg-[#fff9ee] py-10 md:bg-transparent flex flex-col md:flex-row items-center md:items-center justify-start md:justify-end px-6 md:px-16 -mt-6 md:mt-0"
    >
      <div className="max-w-xl md:pl-20 pl-0">

        {/* Small Heading */}
        <motion.p
          variants={item}
          className="text-sm tracking-widest font-manropeee text-[#9c7b5b] uppercase mb-4"
        >
          Where Wellness Begin
        </motion.p>

        {/* Main Heading */}
        <motion.h1
  variants={container} // 👈 controls line-by-line animation
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  className="text-3xl md:text-5xl font-myfont text-[#2d2d2d] leading-tight mb-6"
    style={{ fontFamily: "MyFont" }}
>
  <AnimatedText text="REAL FOOD." />
  <AnimatedText text="REAL INGREDIENTS." />
  <AnimatedText text="REAL CHANGE." />
</motion.h1>
       

        {/* Description */}
        <motion.p
          variants={item}
          className="text-sm md:text-base font-manrope text-[#8a6f5a] leading-relaxed mb-6"
        >
          At Ryvive Roots, nothing is accidental. Every bowl, every wrap,
          every juice is built around what your body genuinely needs — clean
          proteins, natural boosters, real vegetables, zero compromise.
          For those who believe that living well begins with eating well.
        </motion.p>
  
        {/* Signature */}
        <motion.p
          variants={item}
          className="text-[#9c7b5b] text-2xl text-right italic"
          style={{ fontFamily: "Angeletta W04 Regular" }} // 👈 your imported font
        >
          Ryvive Roots
        </motion.p>

        {/* Button */}
        <motion.button
          variants={item}
          whileHover={{
            scale: 1.07,
            y: -3,
            boxShadow: "0px 10px 22px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate("/our-story")}
          style={{ fontFamily: "MyFont" }}
          className="mt-6 bg-[#895C40] rounded-3xl shadow-2xl cursor-pointer text-white px-8 py-3 tracking-wide font-semibold"
        >
          About Us
        </motion.button>

      </div>
    </motion.div>
</div>

 <div className=" md:relative w-full my-46 md:my-0   h-screen">
 {/* ✅ Background Images */}
  
  {/* Desktop Image */}
  <img
  src={Image2}
    alt="Wellness"
    className="hidden md:block w-full h-full object-cover"
  />

  {/* Mobile Image */}
  <img
    src={MobileImage2}
    alt="Wellness"
    className="block md:hidden w-full h-[55vh] "
  />

  {/* Overlay Content */}
  <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    className="md:absolute md:inset-0 bg-[#fff9ee] py-10 md:bg-transparent flex flex-col md:flex-row items-center md:items-center justify-start px-6 md:px-16 -mt-6 md:mt-0"
    >
      <div className="max-w-xl pl-0">

        {/* Small Heading */}
        <motion.p
          variants={item}
          className="text-sm tracking-widest font-manropeee text-[#9c7b5b] uppercase mb-4"
        >
          WHAT WE SERVE
        </motion.p>

        {/* Main Heading */}
        <motion.h1
  variants={container} // 👈 controls line-by-line animation
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  className="text-3xl md:text-5xl font-myfont text-[#2d2d2d] leading-tight mb-6"
    style={{ fontFamily: "MyFont" }}
>
   <AnimatedText text="NOURISHMENT" />
  <AnimatedText text="WITHOUT" />
  <AnimatedText text="COMPROMISE" />
</motion.h1>
       

        {/* Description */}
        <motion.p
          variants={item}
          className="text-sm md:text-base font-manrope text-[#8a6f5a] leading-relaxed mb-6"
        >
         At Ryvive Roots, nothing is accidental. From sandwiches and salads to wraps and pasta, soups and  juices to reimagined chaat every dish is built around what your body genuinely needs. Clean proteins, fresh vegetables, real ingredients, zero compromise. For those who believe that living well begins with eating well.
        </motion.p>
  
      

        {/* Button */}
         <motion.button
          variants={item}
          whileHover={{
            scale: 1.07,
            y: -3,
            boxShadow: "0px 10px 22px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.25 }}
          onClick={() => navigate("/menu")}
          style={{ fontFamily: "MyFont" }}
          className="mt-6 bg-[#895C40] rounded-3xl shadow-2xl cursor-pointer text-white px-8 py-3 tracking-wide font-semibold"
        >
          Explore Our Menu
        </motion.button>

      </div>
    </motion.div>
</div>



<div>

   

</div>
      {/* <Suspense fallback={<div className="h-20" />}>
  <ScrollingText />
</Suspense> */}
 


      {/* MENU SECTION with Fade Up */}
    {/* <section className="text-center bg-white pt-10">
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className=" mx-auto pb-10 px-6 md:px-20"
        >
          <h2 className="text-4xl font-cinzel font-bold text-[#4b3b2a] uppercase mb-8">
            Our Menu
          </h2>
          <p className="text-gray-600 font-manrope max-w-2xl mx-auto mb-12">
            Explore a menu crafted for balance, freshness and flavour.
          </p>

         <Suspense fallback={<div className="h-[300px]" />}>
  <MenuCarousel />
</Suspense>

        </motion.div>
      </section>  */}

      {/* PARALLAX SECTION */}

     <Suspense fallback={<div className="h-[300px]" />}>
  <TestimonialsSection />
</Suspense>
</div>
    </>
  );
};

export default HeroSection;

