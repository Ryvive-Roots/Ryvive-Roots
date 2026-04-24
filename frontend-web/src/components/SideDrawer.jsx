import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Insta from "../assets/optimized/ins.png";
import Link from "../assets/optimized/link.png";
import YuTU from "../assets/optimized/you.png";

const SideDrawer = ({ isOpen, onClose }) => {
  const phoneNumber = "919765600701";

  // ✅ Optimized images (faster loading)
  const images = [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=60",
    "https://images.unsplash.com/photo-1514516430037-4f71c7d1c4d0?w=300&q=60",
    "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=300&q=60",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=60",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] hidden lg:flex">

          {/* 🔲 Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 👉 Drawer */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
            className="relative ml-auto w-[420px] h-full bg-[#F5EFEA] p-10 flex flex-col overflow-y-auto will-change-transform"
          >

            {/* ❌ Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-2xl text-[#8B6B4A] hover:scale-110 transition"
            >
              ✕
            </button>

            {/* 🏷 Title */}
            <h2 className="text-5xl font-playfair-display mb-6">
              Ryvive Roots
            </h2>

            {/* 📝 Description */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Crafted for balance, freshness, and flavour.
            </p>

            {/* 📸 Image Grid */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  loading="lazy"
                  alt="food"
                  className="w-full h-[70px] object-cover rounded-md"
                />
              ))}
            </div>

            {/* 🌐 Social Icons */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/ryvive_roots/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center transition hover:scale-110"
              >
                <img src={Insta} alt="Instagram" className="w-5 h-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/ryvive-roots-750b533a7/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center transition hover:scale-110"
              >
                <img src={Link} alt="LinkedIn" className="w-5 h-5" />
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/channel/UCLmGUQhHC7kmN7lCaQ4PoDg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-400 rounded-full flex items-center justify-center transition hover:scale-110"
              >
                <img src={YuTU} alt="YouTube" className="w-5 h-5" />
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gray-400 text-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>

            {/* 📍 Address */}
            <div className="text-center text-gray-700 text-sm mt-auto leading-relaxed">
              <p>Shop No 01, Saraswati Bhuvan,</p>
              <p>Near Roshan Automobile, Phadke Cross Road,</p>
              <p>Opp. Hotel Nav Gomantak,</p>
              <p>Dombivli East, Maharashtra 421201.</p>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;