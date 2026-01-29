import { FaInstagram } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";
import Logo from "../assets/optimized/logo.webp";
import useIsMobile from "./useIsMobile";

// ✅ GPU-safe animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    transform: "translateY(20px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <motion.footer
      className="bg-[#ffffff] shadow-2xl font-montserrat text-black py-12"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* TOP SECTION */}
      <div className="flex md:flex-row flex-col gap-10 md:justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">

        {/* Logo + Description */}
        <motion.div variants={itemVariants} className="text-left">
          <img src={Logo} alt="Ryvive Roots Logo" className="w-50 mb-4" />

          <p className="text-black/75 max-w-xs font-semibold">
            Experience a menu crafted with balance, freshness, and honest
            flavours. Wholesome food made to nourish your body and make you feel
            good every day.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 my-6 text-2xl">
            <a
              href="https://www.instagram.com/ryvive__roots/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Ryvive Roots on Instagram"
              className="cursor-pointer hover:text-[#895C40] transition-colors duration-200 text-black"
            >
              <FaInstagram />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="text-left">
          <h3 className="uppercase font-semibold mb-6 text-lg tracking-wide text-black">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm font-montserrat">
            {[
              { name: "Home", path: "/" },
              { name: "Our Story", path: "/our-story" },
              { name: "Menu", path: "/menu" },
              { name: "Subscription", path: "/subscription" },
              { name: "Franchise", path: "/franchise" },
              { name: "Career", path: "/career" },
              { name: "Contact Us", path: "/contact" },
            ].map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className="uppercase hover:text-[#895C40] font-semibold transition-colors duration-200 text-black/75"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Help & Policies */}
        <motion.div variants={itemVariants} className="text-left">
          <h3 className="uppercase font-semibold mb-6 text-lg tracking-wide text-black">
            Help & Policies
          </h3>

          <ul className="space-y-3 text-sm font-montserrat">
            {[
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Terms & Conditions", path: "/terms-conditions" },
              { name: "Cancellation & Refund Policy", path: "/cancellation-refund" },
              { name: "Shipping & Delivery Policy", path: "/shipping-delivery" },
            ].map((link, index) => (
              <li key={index}>
                <a
                  href={link.path}
                  className="uppercase hover:text-[#895C40] font-semibold transition-colors duration-200 text-black/75"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants} className="text-left">
          <h3 className="uppercase font-semibold mb-6 text-lg tracking-wide text-black">
            Contact
          </h3>

          <div className="text-sm font-montserrat space-y-4 text-black">

            {/* Phone */}
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-[#895C40] text-lg" />
              <span className="text-black/75 font-semibold">
                +91 9076000468 / 9765600701
              </span>
            </div>

            <hr className="border-gray-300" />

            {/* Email */}
            <div className="flex items-center space-x-3">
              <MdEmail className="text-[#895C40] text-lg" />
              <span className="text-black/75 font-semibold">
                contact@ryviveroots.com
              </span>
            </div>

            <hr className="border-gray-300" />

            {/* Address */}
            <div className="flex items-start space-x-3">
              <FaLocationDot className="text-[#895C40] text-lg mt-1" />
              <div className="text-black/75 font-semibold">
                <p>Shop No 01, Saraswati Bhuvan,</p>
                <p>Near Roshan Automobile, Phadke Road,</p>
                <p>Opp. Hotel Nav Gomantak,</p>
                <p>Dombivli, Maharashtra 421201.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* BOTTOM SECTION */}
      <motion.div
        className="flex md:flex-row flex-col mt-10 items-center justify-center border-t border-gray-300 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
        variants={itemVariants}
      >
        <div className="font-spectral-sc-regular pt-6 text-base text-black/75 font-semibold">
          &copy; {new Date().getFullYear()} Ryvive Roots. All rights reserved.
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
