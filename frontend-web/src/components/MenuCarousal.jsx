import React from "react";
import Slider from "react-slick";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const MenuCarousel = () => {
  const navigate = useNavigate();
   const cloudinaryImages = { 
     Soup: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765283057/soup_qxivj6.jpg",
     Juice : "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765350053/kiwiJuice_n8lsue.jpg",
      Salad: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765347810/Salad3_guopxm.webp",
      Pasta: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765350520/Pasta_be09n6.jpg",
       Sandwitch: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765276783/Sandwitch_zyfnbq.jpg",
       Wraps: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765350641/wrap_w1rao3.jpg"
  }

  const cards = [
    {
      img: cloudinaryImages.Salad,
      title: "Healthy Salads",
      text: "A refreshing mix of greens crafted for pure balance. Light, nutritious, and made to keep you feeling fresh.",
    },
    {
      img: cloudinaryImages.Juice,
      title: "Healthy Juices",
      text: "Wholesome blends made from the freshest ingredients. A natural boost to energize your day, one sip at a time.",
    },
    {
      img: cloudinaryImages.Pasta,
      title: "Healthy Pasta",
      text: "Comfort food with a clean, healthy twist. Flavorful, satisfying, and perfect for every craving.",
    },
    {
      img: cloudinaryImages.Sandwitch,
      title: "Healthy Sandwitch",
      text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment.",
    },
    {
      img: cloudinaryImages.Wraps,
      title: "Healthy Wraps",
      text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment.",
    },
    {
      img: cloudinaryImages.Soup,
      title: "Healthy Soup",
      text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment.",
    },
  ];

 const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: false,

  responsive: [
    {
      breakpoint: 1024, // Tablet
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768, // Small Tablet
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480, // Mobile
      settings: {
        slidesToShow: 1, // ✅ MOBILE = ONE SLIDE
      },
    },
  ],
};


  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden group relative">
              <div className="relative overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-72 md:h-52 xl:h-52 object-cover transition-all duration-500 group-hover:scale-110"
                />

                {/* Title at top-left */}
                <div className="absolute top-3 left-3 bg-white/80 px-3 py-1 rounded">
                  <h3 className="text-[#4b3b2a] text-lg font-semibold font-manrope">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 font-manrope text-sm">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Next Button */}
      <button
        onClick={() => navigate("/menu")}
        className="absolute top-1/2 right-2 md:-right-6 transform -translate-y-1/2 
        bg-[#4b3b2a] text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
        rounded-full shadow-xl hover:scale-110 transition"
      >
        <FaArrowRight size={18} />
      </button>
    </div>
  );
};

export default MenuCarousel;
