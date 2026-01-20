import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

const MenuCarousel = () => {
  const navigate = useNavigate();

  const cloudinaryImages = {
    Soup: "https://res.cloudinary.com/dvugjpjoj/image/upload/f_auto,q_auto/v1765283057/soup_qxivj6.jpg",
    Juice: "https://ik.imagekit.io/aaejjrx7t/3MSB4038.JPG",
    Salad: "https://ik.imagekit.io/aaejjrx7t/3MSB3918.JPG",
    Pasta: "https://ik.imagekit.io/aaejjrx7t/3MSB3903.JPG",
    Sandwitch: "https://ik.imagekit.io/aaejjrx7t/3MSB4143.JPG",
    Wraps: "https://ik.imagekit.io/aaejjrx7t/3MSB4127.JPG",
  };

  const cards = [
    { img: cloudinaryImages.Salad, title: "Healthy Salads", text: "A refreshing mix of greens crafted for pure balance. Light, nutritious, and made to keep you feeling fresh." },
    { img: cloudinaryImages.Juice, title: "Healthy Juices", text: "Wholesome blends made from the freshest ingredients. A natural boost to energize your day, one sip at a time." },
    { img: cloudinaryImages.Pasta, title: "Healthy Pasta", text: "Comfort food with a clean, healthy twist. Flavorful, satisfying, and perfect for every craving." },
    { img: cloudinaryImages.Sandwitch, title: "Healthy Sandwich", text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment." },
    { img: cloudinaryImages.Wraps, title: "Healthy Wraps", text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment." },
    { img: cloudinaryImages.Soup, title: "Healthy Soup", text: "Packed with proteins and fresh veggies, perfect for clean eating and daily nourishment." },
  ];

  return (
    <div className="relative w-full">
      {/* Custom Arrows */}
      <button
  aria-label="Previous menu"
  className="menu-prev hidden md:flex absolute left-0 top-1/2 -translate-y-1/2
    bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center
    hover:scale-110 transition z-10"
>
  <FaChevronLeft aria-hidden="true" />
</button>

<button
  aria-label="Next menu"
  className="menu-next hidden md:flex absolute right-0 top-1/2 -translate-y-1/2
    bg-white shadow-lg w-10 h-10 rounded-full items-center justify-center
    hover:scale-110 transition z-10"
>
  <FaChevronRight aria-hidden="true" />
</button>


      {/* Go To Menu */}
      <button
        aria-label="Go to menu"
        onClick={() => navigate("/menu")}
        className="absolute top-1/2 right-2 md:-right-6 -translate-y-1/2
          bg-[#4b3b2a] text-white w-10 h-10 md:w-12 md:h-12
          flex items-center justify-center rounded-full
          shadow-xl hover:scale-110 transition z-20"
      >
        <FaArrowRight size={18} />
      </button>

      <Swiper
        modules={[Autoplay, Navigation]}
        loop
        spaceBetween={16}
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".menu-prev",
          nextEl: ".menu-next",
        }}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          640: { slidesPerView: 1.8 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4 },
        }}
        className="px-2"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden group h-full">
              <div className="relative overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-64 sm:h-60 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-3 left-3 bg-white/85 px-3 py-1 rounded-lg">
                  <h3 className="text-[#4b3b2a] text-base sm:text-lg font-semibold font-manrope">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="text-gray-600 font-manrope text-sm leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MenuCarousel;
