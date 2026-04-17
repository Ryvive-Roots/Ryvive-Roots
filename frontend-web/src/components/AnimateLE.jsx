import { motion } from "framer-motion";

// 🔹 Parent (controls lines)
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.6, // 👈 delay between lines (SLOW 🔥)
    },
  },
};

// 🔹 Line wrapper
const lineWrapper = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06, // 👈 letters speed
    },
  },
};

// 🔹 Each letter
const letter = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

// ✅ Your component
const AnimatedText = ({ text }) => {
  return (
    <motion.div variants={lineWrapper} className="block">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;