import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const phoneNumber = "919765600701";

  return (
    <motion.div
  className="fixed right-5 bottom-16 cursor-pointer z-50"
  animate={{
    scale: [1, 1.15, 1],
  }}
  transition={{
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>

      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp" // ✅ Accessibility fix
        className="text-green-500  rounded-full  flex items-center justify-center"
      >
        <FaWhatsapp size={60} />
      </a>
    </motion.div>
  );
};

export default WhatsAppButton;