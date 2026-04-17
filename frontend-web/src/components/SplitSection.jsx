import { motion } from "framer-motion";

const SplitSection = ({ title, subtitle, description, image, reverse }) => {
  return (
    <section className="relative w-full h-[450px] overflow-hidden bg-black text-white">

      {/* ✅ IMAGE */}
      <motion.img
        src={image}
        alt={title}
        initial={{ x: reverse ? -200 : 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`absolute top-0 ${
          reverse ? "left-0" : "right-0"
        } w-[70%] h-full object-cover`}
      />

      {/* ✅ TEXT */}
      <motion.div
        initial={{ x: reverse ? 200 : -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`relative z-10 w-full lg:w-[55%] h-full flex flex-col justify-center px-8 md:px-20 ${
          reverse ? "ml-auto text-right" : "text-left"
        }`}
      >
        <h3 className="text-xl md:text-2xl mb-4">{subtitle}</h3>

        <h2 className="text-3xl md:text-4xl font-bold font-cinzel uppercase mb-4">
          {title}
        </h2>

        <p className="max-w-xl mb-6">
          {description}
        </p>

        <button className="bg-[#895C40] w-fit rounded-full px-8 py-3 font-semibold hover:scale-105 transition">
          Our Story
        </button>
      </motion.div>

      {/* ✅ OPTIONAL DARK OVERLAY */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
    </section>
  );
};

export default SplitSection;


 <div className="bg-white text-black">
      <section className="relative w-full h-[400px] overflow-hidden">

        {/* 🔥 IMAGE */}
        <div className="absolute top-0 right-0 w-[70%] h-[60vh] overflow-hidden">
  <AnimatePresence mode="wait">
   <motion.img
  key={current.image}
  src={current.image}
  initial={{ x: "100%", scale: 1.05 }}
  animate={{ x: "0%", scale: 1 }}
  exit={{ x: "-100%", scale: 1.05 }}
  transition={{ duration: 1.2, ease: "easeInOut" }}  // 👈 slower
  className="absolute top-0 left-0 w-full h-full object-cover"
/>
  </AnimatePresence>
</div>

        {/* 🔥 TEXT */}
        <div className="relative z-10 mt-5 w-full lg:w-[55%] h-full flex flex-col px-8 md:px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl md:text-2xl mb-4">
                {current.subtitle}
              </h3>

              <h2 className="text-3xl md:text-4xl font-bold font-cinzel uppercase mb-4">
                {current.title}
              </h2>

              <p className="max-w-xl mb-6">
                {current.description}
              </p>

              <button className="bg-[#895C40] rounded-full px-8 py-3">
                Our Story
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

       

      </section>
</div> 