import React from "react";

const PricingCard = ({
  titleName,
  price,
  color,
  features,
  btnColor,
  pageLink,
  image,
  titleColor,
   titleImage,
}) => {
  return (
    <div className="relative font-source-sans md:w-[270px] mx-auto w-full">

      {/* 🔵 TOP CIRCLE */}
      <div
        className="absolute -top-26 left-1/2 -translate-x-1/2 
        w-38 h-38 rounded-full overflow-hidden
        flex items-center justify-center  z-20 animate-spin-slow"
         style={{
    transform: "translateX(-50%) perspective(600px) rotateX(8deg)",
  }}
      >
        <img
          src={image}
          alt={titleName}
          className="w-full h-full object-cover"
           style={{
      transform: "scale(1.08)", // slight zoom for 3D feel
    }}
        />
      </div>

      {/* 🟦 CARD BODY — now dynamic */}
      <div
        className="relative text-white rounded-3xl shadow-xl pt-20 pb-6"
        style={{ backgroundColor: color }}
      >

       {/* 🔒 CLIPPING WRAPPER (BLACK CIRCLE WILL BE HIDDEN) */} <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"> {/* ⚫ BLACK CIRCLE (CLIPPED) */} <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-[#15121a] z-0" ></div> </div>

        {/* 💰 PRICE */}
        <div className="relative text-center z-10">
       {/* TITLE AS IMAGE — POPPY EFFECT */}
<h2
  className="text-4xl font-semibold mb-5 uppercase font-cinzel"
  style={{
    color: titleColor,
    textShadow: `
      0 0 8px ${titleColor}55,
      0 0 15px ${titleColor}40
    `,
  }}
>
  {titleName}
</h2>



          <h2 className="text-4xl font-bold">{price}</h2>
          <p className="text-sm mt-1">Per User / Month</p>
        </div>

        {/* 📋 FEATURES */}
        <ul className="relative mt-6 space-y-3 px-8 text-sm z-10">
          {features.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                className={`${
                  item.check ? "text-green-400" : "text-red-400"
                } text-lg`}
              >
                {item.check ? "✔" : "✖"}
              </span>
              {item.text}
            </li>
          ))}
        </ul>

       
       

        {/* SIGN UP */}
<div className="relative flex justify-center mt-4 z-10">
  <a href={pageLink}>
    <button
      className="
        relative overflow-hidden cursor-pointer
        px-7 py-3
        rounded-xl
        font-fredoka font-semibold text-base text-white
        border-2 border-white/20
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl
        active:translate-y-0
        group
      "
      style={{ backgroundColor: btnColor }}
    >
      {/* Shine Effect */}
      <span
        className="
          absolute top-0 left-[-100%]
          w-full h-full
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          transition-all duration-700
          group-hover:left-[100%]
        "
      />

      {/* Button Text */}
      <span className="relative z-10">
        Start Your Plan
      </span>
    </button>
  </a>
</div>

      </div>
    </div>
  );
};

export default PricingCard;
