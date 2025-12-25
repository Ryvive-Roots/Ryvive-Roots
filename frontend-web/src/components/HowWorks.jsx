import { motion } from "framer-motion";
import Step1 from "../assets/subscription.png";
import Step2 from "../assets/step2.png";
import Step3 from "../assets/step3.png";
import Step4 from "../assets/step4.png";

export default function HowItWorks() {
  const steps = [
    { image: Step1, title: "Choose your Plan", desc: "Silver / Gold / Platinum" },
    { image: Step2, title: "Select Your Plan", desc: "4 combos per plan" },
    { image: Step3, title: "Pick Delivery Time Slot", desc: "Morning / Evening / Both" },
   
     { image: Step4, title: "Meals delivered fresh daily", desc: "Fresh food daily" },

  ];

  return (
    <section className="w-full cursor-pointer py-20 bg-[#FEF7F0]">
       <motion.h3
        initial={{ opacity: 0, y: 80 }}   // comes from lower bottom
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-2xl md:text-3xl text-center font-cinzel uppercase font-semibold text-[#243E36] pb-10"
      >
       How It Works
      </motion.h3>
     

      <div className="md:px-30 mx-auto relative px-4 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">

        {/* Desktop Base Line */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[3px] bg-gray-300 -z-10"></div>

        {/* Mobile Line */}
        <div className="md:hidden absolute left-1/2 top-0 h-full w-[3px] bg-gray-300 -z-10"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{
              y: -10,
              scale: 1.03,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut"
            }}
            className="group relative  shadow-md rounded-full p-5 text-center w-56 md:w-64  transition-all"
          >

            {/* Desktop Connector */}
            {index < steps.length - 1 && (
              <motion.div
                className="hidden md:block absolute top-1/2 left-full w-16 h-[3px] bg-[#243E36]"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "2rem", opacity: 1 }}
                transition={{ delay: index * 0.3 + 0.4, duration: 0.4 }}
                viewport={{ once: true }}
              />
            )}

            {/* Mobile Connector */}
            {index < steps.length - 1 && (
              <motion.div
                className="md:hidden absolute left-1/2 top-full h-10 w-[3px] bg-[#243E36]"
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: "2.5rem", opacity: 1 }}
                transition={{ delay: index * 0.3 + 0.4, duration: 0.4 }}
                viewport={{ once: true }}
              />
            )}

            {/* ICON */}
            <div className="mb-3 flex justify-center items-center h-16">
              <motion.img
                src={step.image}
                alt={step.title}
                className="w-14 h-14 object-contain transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-2"
              />
            </div>

            {/* TITLE */}
            <h3 className="font-bold font-cinzel uppercase text-base md:text-lg leading-tight text-[#895C40] transition-all duration-300">
              {step.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-700 text-base mb-4 text-center font-manrope mt-1">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
