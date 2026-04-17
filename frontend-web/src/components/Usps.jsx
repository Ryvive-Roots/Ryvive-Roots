import React from "react";

const ScrollingText = () => {
  const items = [
    "Authentic taste, never pre-made",
    "Subscription + dietitian support",
    "100% natural & freshly made daily",
    "No preservatives or chemicals",
  ];

  return (
    <section className="relative overflow-hidden bg-[#8D5B3F] py-5 premium-wave">
      {/* Background subtle premium gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light bg-[radial-gradient(circle_at_0%_0%,#F8E3D0_0,transparent_55%),radial-gradient(circle_at_100%_100%,#D9B08C_0,transparent_55%)]" />

      {/* TOP + BOTTOM PREMIUM SMOOTH WAVES */}
      <div className="premium-wave-top" />
      <div className="premium-wave-bottom" />

      <div className="relative">
        <div className="flex items-center">
          {/* container */}
          <div className="scroll-container flex whitespace-nowrap">
            {/* first scroll line */}
            <div className="flex items-center gap-24 animate-marquee">
              {items.map((text, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-5 px-6 text-[15px] md:text-base tracking-[0.20em] font-semibold uppercase text-[#FFF5E8]"
                  style={{
                    paddingRight: idx === items.length - 1 ? "6rem" : "0",
                  }} // << FIX
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F6D7B0]" />
                  {text}
                </span>
              ))}
            </div>

            {/* duplicate for loop */}
            <div
              className="flex items-center gap-24 animate-marquee"
              aria-hidden="true"
            >
              {items.map((text, idx) => (
                <span
                  key={`dup-${idx}`}
                  className="flex items-center gap-5 px-2 text-[15px] md:text-base tracking-[0.20em] font-semibold uppercase text-[#FFF5E8]"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#F6D7B0]" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waves (CSS below) */}
      <style>{`
        /* PREMIUM SMOOTH WAVES */
        .premium-wave-top,
        .premium-wave-bottom {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 26px;
          background-repeat: repeat-x;
          background-size: 380px 40px;
          opacity: 0.45;
          animation: smoothWaveMove 18s linear infinite;
        }

        .premium-wave-top {
          top: -14px;
          background-image: url("data:image/svg+xml;utf8,
            <svg xmlns='http://www.w3.org/2000/svg' width='380' height='40'>
              <path d='M0 20 Q50 0 100 20 T200 20 T300 20 T380 20'
                fill='none' stroke='%23F9E7D8' stroke-width='3' stroke-linecap='round'/>
            </svg>");
        }

        .premium-wave-bottom {
          bottom: -14px;
          background-image: url("data:image/svg+xml;utf8,
            <svg xmlns='http://www.w3.org/2000/svg' width='380' height='40'>
              <path d='M0 20 Q50 0 100 20 T200 20 T300 20 T380 20'
                fill='none' stroke='%23F9E7D8' stroke-width='3' stroke-linecap='round'/>
            </svg>");
        }

        @keyframes smoothWaveMove {
          from { background-position-x: 0; }
          to { background-position-x: 380px; }
        }

        /* Slow premium marquee movement */
        .animate-marquee {
          animation: marqueeScroll 35s linear infinite;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
};

export default ScrollingText;
