import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const phoneNumber = "919765600701";
  const [show, setShow] = useState(false);

  // ⏳ Delay rendering (improves performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000); // show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed right-5 bottom-16 cursor-pointer z-50"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{
        duration: 2,          // slower animation = less CPU
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="text-green-500 rounded-full flex items-center justify-center"
      >
        <FaWhatsapp size={56} />
      </a>
    </motion.div>
  );
};

export default WhatsAppButton;
