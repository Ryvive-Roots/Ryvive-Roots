import React from "react";

const PricingCard = ({
  title,
  titleName,
  price,
  color,
  features,
  btnColor,
}) => {
  return (
    <div className="relative md:w-[270px] mx-auto w-full">

      {/* 🔵 TOP COLORED CIRCLE (VISIBLE OUTSIDE CARD) */}
      <div
        className="absolute font-merriweather cursor-pointer 
        -top-26 left-1/2 -translate-x-1/2 
        w-38 h-38 rounded-full flex flex-col items-center justify-center 
        text-center  text-white font-semibold text-2xl shadow-2xl
         z-20"
        style={{ backgroundColor: color }}
      >
        <h3>{title}</h3>
        <h4>{titleName}</h4>
      </div>

      {/* 🟦 CARD BODY */}
      <div className="relative bg-[#293e43] text-white rounded-3xl shadow-xl pt-20 pb-6">

        {/* 🔒 CLIPPING WRAPPER (BLACK CIRCLE WILL BE HIDDEN) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">

          {/* ⚫ BLACK CIRCLE (CLIPPED) */}
          <div
            className="absolute -top-30 left-1/2 -translate-x-1/2 
            w-44 h-44 rounded-full bg-[#15121a] z-0"
          ></div>

        </div>

        {/* 💰 PRICE */}
        <div className="relative text-center  z-10">
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

        {/* 📖 READ MORE */}
        <div className="relative flex justify-center mt-6 z-10">
          <button className="px-4 py-2 border border-gray-500 rounded-lg text-xs">
            READ MORE
          </button>
        </div>

        {/* 🟢 SIGN UP */}
        <div className="relative flex justify-center mt-4 z-10">
          <button
            className="px-6 py-2 rounded-lg font-semibold text-sm text-white"
            style={{ backgroundColor: btnColor }}
          >
            SIGN UP
          </button>
        </div>

      </div>
    </div>
  );
};

export default PricingCard;
