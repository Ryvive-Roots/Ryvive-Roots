import { useEffect, useRef } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Texture2 from "../assets/pattern-2.png";
import Para from "../assets/para.jpg";
import ScrollingText from "./Usps";
import MenuCarousel from "./MenuCarousal";
import { useNavigate } from "react-router-dom";
import TestimonialsSection from "./Testimonials";
import Bowl from "../assets/bowl.webp";
import HJuice from "../assets/HJuice.webp"
import Chaat from "../assets/Chaat.webp"
import Sandwitch1 from "../assets/Sandwitch1.webp"


const HeroSection = () => {
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const textVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut", delay: 0.2 },
    },
  };

    const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      parallaxRef.current.style.backgroundPositionY = `${scrollY * 0.4}px`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="flex cursor-pointer flex-col lg:flex-row items-center justify-between bg-[#FEF7F0] overflow-hidden">
        {/* LEFT TEXT WITH ANIMATION */}
        <motion.div
          initial={{ x: -120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex md:flex-row flex-col md:items-center min-h-auto lg:h-[90vh] md:justify-center overflow-hidden"
        >
          <img
            src="https://ik.imagekit.io/aaejjrx7t/RasBerrie.png?updatedAt=1768752205361"
            alt="Decorative raspberry texture background for healthy food cafe design"
            className="absolute bottom-[-10px] left-0 md:w-[300px] w-[200px] md:h-[300px] h-[120px] object-contain opacity-70 pointer-events-none select-none"
          />

          <img
            src="https://res.cloudinary.com/dvugjpjoj/image/upload/w_500,f_auto,q_auto/v1765279304/berries_k9vjje.png"
            alt="Fresh berries illustration symbolizing natural and organic ingredients"
            className="absolute top-[10px] right-[-2px] md:w-[200px] w-[150px] md:h-[250px] h-[120px] object-contain opacity-90 pointer-events-none select-none"
          />

          <div className="relative pt-30 sm:pt-0 p-14 md:pl-80">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase font-cinzel text-[#4b3b2a] leading-tight mb-6">
              Welcome <br /> to{" "}
              <span className="text-[#243E36]">Ryvive Roots</span>
            </h1>
            <p className="text-gray-600 text-sm md:text-lg font-merriweather mb-8 max-w-lg">
              Explore a menu crafted for balance, freshness, and flavour.
              Simple, honest food made to make you feel good.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.20)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{
                duration: 0.15, // ⚡ super quick animation
                ease: "easeOut",
              }}
              onClick={() => navigate("/our-story")}
              className="bg-[#895C40] cursor-pointer text-white px-8 py-3 mb-16 md:mb-0 transition-all"
            >
              Our Story
            </motion.button>
          </div>
        </motion.div>

        {/* RIGHT SLIDER WITH ANIMATION */}
        <motion.div
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
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ))}
          </Slider>

         
        </motion.div>
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
       <section
      ref={parallaxRef}
      className="relative overflow-hidden  bg-center bg-cover  h-[30vh] md:h-[40vh]"
      style={{ backgroundImage: `url(${Para})` }}
    >
      <img
        src={Texture2}
        alt="Organic texture design representing eco-friendly and natural food theme"
        className="absolute bottom-0 left-0 w-full h-[100px] object-cover opacity-90"
      />

      <div className="absolute inset-0 bg-black/10"></div>
    </section>

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
        className="relative flex flex-col lg:flex-row items-center justify-center bg-white px-8 overflow-visible"
      >
        <div className="relative w-full flex flex-col lg:flex-row items-center lg:items-start gap-0 md:gap-10 justify-center">
          <motion.img
            src="https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765360072/sustainable_r2gifi.png"
            alt="Eco-friendly sustainable food packaging used by Ryvive Roots healthy cafe"
            variants={imageVariant}
            className="relative -top-20 translate-x-0 shadow-2xl lg:translate-x-40 w-[500px] lg:w-[550px] h-[300px] lg:h-[400px] object-cover"
          />

          <motion.div
            variants={textVariant}
            className="w-full font-manrope lg:w-1/2 md: py-8 text-center lg:text-left lg:ml-16 lg:pl-20"
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
              onClick={() => navigate("/subscription")}
              className="bg-[#895C40] cursor-pointer text-white px-8 py-3 tracking-wide font-semibold"
            >
              Subscription
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <ScrollingText />

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

          <MenuCarousel />
        </motion.div>
      </section>

      {/* PARALLAX SECTION */}

      <TestimonialsSection />
    </>
  );
};

export default HeroSection;
