import { useEffect } from "react";
import bowlImg from "../assets/bowl.png";
import appleImg from "../assets/apple.png";
import kiwiImg from "../assets/kiwi.png";
import avacodoImg from "../assets/avacodo.png";
import grapsImg from "../assets/graps.png";
import pairImg from "../assets/pair.png";
import orangeImg from "../assets/orange.png";
import latusImg from "../assets/luttus.png";
import lemonImg from "../assets/lemon.png";
import gingerImg from "../assets/ginger.png";
import spinachImg from "../assets/spinach.png";
import tomattoImg from "../assets/tomatto.png";
import mangoImg from "../assets/mango.png";
import beetrootImg from "../assets/beetroot.png";
import cucumberImg from "../assets/cucumber.png";
import pomogranateImg from "../assets/pomogranate.png";
import walnutImg from "../assets/walnut.png";
import cashewImg from "../assets/cashew.png";

const fruitsData = [
  { src: mangoImg, alt: "mango" },
  { src: appleImg, alt: "apple" },
  { src: pomogranateImg, alt: "pomo" },
  { src: kiwiImg, alt: "kiwi" },
  { src: avacodoImg, alt: "avocado" },
  { src: grapsImg, alt: "graps" },
  { src: pairImg, alt: "pair" },
  { src: walnutImg, alt: "walnut" },
  { src: cashewImg, alt: "cashew" },
  { src: orangeImg, alt: "orange" },
  { src: latusImg, alt: "lutus" },
  { src: lemonImg, alt: "lemon" },
  { src: cucumberImg, alt: "cucumber" },
  { src: gingerImg, alt: "ginger" },
  { src: spinachImg, alt: "spinach" },
  { src: tomattoImg, alt: "tomato" },
  { src: beetrootImg, alt: "beetroot" },
];

export default function LandingPage() {
  useEffect(() => {
    // Fruits start slightly after bowl toss peak
    const timeout = setTimeout(() => {
      const fruits = document.querySelectorAll(".fruit");
      fruits.forEach((fruit) => fruit.classList.add("fly"));
    }, 1400);
    return () => clearTimeout(timeout);
  }, []);

const getRandomX = (index, total) => {
  const spacing = 80 / total; // base even spacing
  const baseX = 6 + index * spacing; // ensures equal distance
  const randomOffset = Math.random() * 3 - 1.5; // small random variation (-1.5vw to +1.5vw)
  return baseX + randomOffset; // mix even spacing + randomness
};


  return (
    <div className="relative md:h-screen h-[75vh] overflow-y-hidden w-full bg-white overflow-hidden pt-[80px]">
      {/* Bowl tossing animation */}
      <div className="absolute inset-0 bg-[#EFF9F0] p-96">
      <img
        src={bowlImg}
        alt="bowl"
        className="bowl absolute bottom-[-45px] left-0 w-[30vh] md:w-[35vw] translate-x-[-27%] z-10 animate-bowl-toss "
      />

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-berkshire-swash font-bold text-[#333] mb-4 leading-tight">
          Start your healthy journey,
          <span className="block">one bite at a time.</span>
        </h1>
        <button className="mt-6 px-6 py-3 bg-[#ff7f50] text-white rounded-full hover:bg-[#ff6333] transition text-sm sm:text-base">
          See More
        </button>
      </div>

      {/* Fruits */}
      {fruitsData.map((fruit, index) => (
        <img
          key={index}
          src={fruit.src}
          alt={fruit.alt}
          className="fruit absolute w-10 sm:w-20 md:w-24 bottom-[10px] left-[7%] opacity-0 z-20"
          style={{
            animationDelay: `${1.4 + Math.random() * 0.15}s`,
            "--x": `${getRandomX(index, fruitsData.length)}vw`,
          }}
        />
      ))}

     </div>

      {/* Animations */}
      <style>
        {`
          /* 🥣 Bowl toss and settle animation */
          @keyframes bowl-toss {
            0% {
              transform: translateX(-100%) rotate(20deg);
              opacity: 0;
            }
            40% {
              transform: translateX(0) rotate(45deg);
              opacity: 1;
            }
            55% {
              transform: translateY(-30px) rotate(10deg); /* toss up */
            }
            70% {
              transform: translateY(0px) rotate(65deg); /* back down */
            }
            85% {
              transform: translateY(-10px) rotate(45deg);
            }
            100% {
              transform: translateY(0px) rotate(45deg);
              opacity: 1;
            }
          }
          .animate-bowl-toss {
            animation: bowl-toss 1.8s ease-out forwards;
          }

          /* 🍎 Fruit toss and fall animation */
          @keyframes fruitFly {
            0% {
              transform: translate(0, 0) scale(0.4);
              opacity: 0;
            }
            20% { opacity: 1; }
            50% {
              transform: translate(var(--x), -50vh) rotate(180deg);
              opacity: 1;
            }
            75% {
              transform: translate(var(--x), -10vh) rotate(270deg);
            }
            90% {
              transform: translate(var(--x), 0) rotate(360deg);
            }
            95% {
              transform: translate(var(--x), -3vh) rotate(360deg);
            }
            100% {
              transform: translate(var(--x), 0) rotate(360deg);
              opacity: 1;
            }
          }

          .fruit {
            opacity: 0;
            animation: fruitFly 3s cubic-bezier(0.25, 0.8, 0.5, 1) forwards;
          }

          @media (max-width: 640px) {
            .fruit { width: 48px; }
          }
        `}
      </style>
    </div>
  );
}
