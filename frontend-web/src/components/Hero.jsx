import { lazy, Suspense, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Bowl from "../assets/bowl.avif";
import HJuice from "../assets/optimized/HJuice.webp"
import Chaat from "../assets/Chaat.webp"
import Sandwitch1 from "../assets/Sandwitch2.webp"

import BgDesktop from "../assets/optimized/HeroL.webp";
import BgMobile from "../assets/optimized/BgMobile-small.webp";
import Sustainable from "../assets/optimized/sustainable.png";
import useIsMobile from "./useIsMobile";


const ScrollingText = lazy(() => import("./Usps"));
const MenuCarousel = lazy(() => import("./MenuCarousal"));
const TestimonialsSection = lazy(() => import("./Testimonials"));


const HeroSection = () => {

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



  return (
    <>
      <section className="flex cursor-pointer flex-col lg:flex-row items-center justify-between  overflow-x-hidden">
        {/* LEFT TEXT WITH ANIMATION */}
     <div className="relative w-full min-h-[90vh] flex items-start md:items-center overflow-x-hidden">

      
      {/* 🌄 Responsive Background Image */}
      <picture className="absolute inset-0 -z-10 w-full h-full">
        <source media="(max-width: 768px)" srcSet={BgMobile} />
        <source media="(min-width: 769px)" srcSet={BgDesktop} />
     <img
  src={BgDesktop}
  alt="Hero Background"
  loading={isMobile ? "eager" : "lazy"}
  fetchPriority={isMobile ? "high" : "auto"}
  decoding="async"
  width="1200"
  height="1600"
  className="w-full h-full object-cover"
/>


      </picture>

      {/* 📝 Text Content */}
      <div className="relative px-6 pt-24 md:pt-0 md:px-20 text-left">

        {/* Heading */}
        <motion.h1
        initial={
    isMobile
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(30px)" }
  }
  animate={{ opacity: 1, transform: "translateY(0px)" }}
  transition={{ duration: isMobile ? 0.3 : 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase font-cinzel text-[#ba9453] leading-tight mb-6"
        >
          Welcome <br /> to{" "}
          <span className="text-[#243f36]">Ryvive Roots</span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
      initial={
    isMobile
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(30px)" }
  }
  animate={{ opacity: 1, transform: "translateY(0px)" }}
  transition={{ duration: isMobile ? 0.3 : 0.7, ease: "easeOut", delay: 0.5 }}
          className="text-[#6f5849] max-w-xl text-sm md:text-lg font-merriweather mb-8"
        >
          Explore a menu crafted for balance, freshness, and flavour. Feel good about your food every bit.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={
    isMobile
      ? { opacity: 0 }
      : { opacity: 0, transform: "translateY(30px)" }
  }
  animate={{ opacity: 1, transform: "translateY(0px)" }}
  transition={{ duration: isMobile ? 0.3 : 0.7, ease: "easeOut", delay: 0.7 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.20)",
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/subscription")}
          className="bg-[#6f5849] font-merriweather rounded-4xl cursor-pointer text-white px-8 py-3 transition-all"
        >
          Subscription
        </motion.button>

      </div>
    </div>



        {/* RIGHT SLIDER WITH ANIMATION */}
        {/* <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full lg:w-[40%] h-[50vh] lg:h-[90vh]"
        >
         
          <Slider ref={sliderRef} {...settings}>
           {images.map((img, i) => (
  <div key={i} className="w-full h-[50vh] lg:h-[90vh]">
    <img
      src={img}
      alt={imageAlts[i]}
      loading={i === 0 ? "eager" : "lazy"}
      fetchPriority={i === 0 ? "high" : "auto"}
      className="w-full h-full object-cover object-top"
    />
  </div>
))}

          </Slider>
         
         
        </motion.div> */}
      </section>

      {/* PARALLAX SECTION */}
      {/* <section
        className="relative bg-fixed bg-center bg-cover bg-top h-[40vh] md:h-[40vh]"
        style={{ backgroundImage: `url(${Parallax})` }}
      >
        <img
          src={Texture2}
          className="absolute bottom-0 left-0 w-full h-[200px] object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </section> */}
       {/* <section
      ref={parallaxRef}
      className="relative overflow-hidden  bg-center bg-cover  h-[30vh] md:h-[40vh]"
      style={{ backgroundImage: `url(${Para})` }}
    >
      <img
        src={Texture2}
         loading="lazy"
        alt="Organic texture design representing eco-friendly and natural food theme"
        className="absolute bottom-0 left-0 w-full h-[100px] object-cover opacity-90"
      />

      <div className="absolute inset-0 bg-black/10"></div>
    </section> */}

      {/* PROMO SECTION - ANIMATED LEFT + RIGHT */}
      {/* <motion.section
initial="hidden"
whileInView="visible"
viewport={{ once: true, amount: 0.25 }}
variants={containerVariant}
className="relative flex flex-col lg:flex-row items-center justify-center bg-white px-8 overflow-visible"
>
<div className="relative w-full flex flex-col lg:flex-row items-center lg:items-start gap-10 justify-center">
<motion.img
src={Dietisian}
alt="Free Breakfast Offer"
variants={imageVariant}
className="relative -top-20 translate-x-0 shadow-2xl lg:translate-x-40 w-[500px] lg:w-[550px] h-[300px] lg:h-[400px] object-cover"
/>


<motion.div
variants={textVariant}
className="w-full font-manrope lg:w-1/2 py-8 text-center lg:text-left lg:ml-16 lg:pl-20"
>
<h3 className="text-3xl md:text-4xl font-bold font-cinzel uppercase text-[#4b3b2a] mb-8">
Get Personalized Diet Guidance
</h3>


<p className="text-base max-w-xl pb-8 text-gray-800">
Personalized Guidance for Real Transformation. Our certified dietitian
helps create a plan tailored to your lifestyle, health concerns, and body goals.
</p>


<motion.button
whileHover={{
scale: 1.07,
y: -3,
boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.25)",
}}
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.15, ease: "easeOut" }}
onClick={() => navigate("/consultation")}
className="bg-[#895C40] cursor-pointer text-white px-8 py-3 tracking-wide font-semibold"
>
Book a Consultation
</motion.button>
</motion.div>
</div>
</motion.section> */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={containerVariant}
        className="relative flex flex-col lg:flex-row items-center justify-center bg-white md:px-20  px-8 overflow-visible"
      >
        <div className="relative w-full flex flex-col lg:flex-row items-center lg:items-start gap-0 md:gap-10 justify-center">
          <motion.img
            src={Sustainable}
            alt="Fresh healthy salad bowl in eco friendly sustainable packaging by Ryvive Roots in Dombivli"
             loading="lazy"
            variants={imageVariant}
           className="relative -top-10 rounded-xl shadow-2xl w-[500px] lg:w-[520px] h-[300px] lg:h-[340px] object-cover"
          />

          <motion.div
            variants={textVariant}
            className="w-full font-manrope lg:w-1/2 md: py-8 text-center lg:text-left "
          >
            <h2 className="text-3xl md:text-4xl font-bold font-cinzel uppercase text-[#4b3b2a] mb-8">
              SUSTAINABLE PACKAGING
            </h2>

            <h3 className="text-xl md:text-2xl font-semibold font-manrop  text-[#4b3b2a] mb-8">
              Healthy for You & the Planet
            </h3>

            <p className="text-base max-w-xl pb-8 text-gray-800">
              {" "}
              Explore a menu crafted for balance, freshness and flavour.
              Eco-friendly packaging made from sustainable materials. Because
              wellness isn’t complete without caring for the earth.
            </p>

            <motion.button
              whileHover={{
                scale: 1.07,
                y: -3,
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.25)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={() => navigate("/our-story")}
              className="bg-[#895C40] rounded-full cursor-pointer text-white px-8 py-3 tracking-wide font-semibold"
            >
              Our Story
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <Suspense fallback={<div className="h-20" />}>
  <ScrollingText />
</Suspense>


      {/* MENU SECTION with Fade Up */}
      <section className="text-center">
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
      </section>

      {/* PARALLAX SECTION */}

     <Suspense fallback={<div className="h-[300px]" />}>
  <TestimonialsSection />
</Suspense>

    </>
  );
};

export default HeroSection;
