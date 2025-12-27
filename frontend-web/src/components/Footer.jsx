import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 2,
      ease: "easeOut",
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Footer = () => {
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
          <img src={Logo} alt="logo" className="w-50 mb-4" />
          <motion.p className="text-black/75 max-w-xs font-semibold" variants={itemVariants}>
           Experience a menu crafted with balance, freshness, and honest flavours.
Wholesome food made to nourish your body and make you feel good every day.
          </motion.p>
          {/* Social Icons */}
          <motion.div
            className="flex gap-4 my-6 text-2xl"
            variants={containerVariants}
          >
            <motion.a
              href="https://x.com/lorinzazenix"
              target="_blank"
              className="cursor-pointer hover:text-[#895C40] transition-colors duration-200 text-black"
              variants={itemVariants}
            >
              <FaXTwitter />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/lorinzazenix_digital.agency"
              target="_blank"
              className="cursor-pointer hover:text-[#895C40] transition-colors duration-200 text-black"
              variants={itemVariants}
            >
              <FaInstagram />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/company/lorinzazenix"
              target="_blank"
              className="cursor-pointer hover:text-[#895C40] transition-colors duration-200 text-black"
              variants={itemVariants}
            >
              <FaLinkedin />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="text-left">
          <motion.h3
            className="uppercase font-cormorant-text font-semibold mb-6 text-lg tracking-wide font-spectral-sc-regular text-black"
            variants={itemVariants}
          >
            Quick Links
          </motion.h3>

          <motion.ul
            className="space-y-3 text-sm font-montserrat"
            variants={containerVariants}
          >
            {[
              { name: "Home", path: "/" },
              { name: "Our Story", path: "/our-story" },
              { name: "Menu", path: "/menu" },
              { name: "Subscription", path: "/subscription" },
              { name: "Franchise", path: "/franchise" },
              { name: "Career", path: "/career" },
              { name: "Contact Us", path: "/contact" },
            ].map((link, index) => (
              <motion.li key={index} variants={itemVariants}>
                <a
                  href={link.path}
                  className="uppercase hover:text-[#895C40] font-semibold transition-colors duration-200 text-black/75"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="text-left">
          <motion.h3
            className="uppercase font-cormorant-text font-semibold mb-6 text-lg tracking-wide font-spectral-sc-regular text-black"
            variants={itemVariants}
          >
          Help & Policies
          </motion.h3>

          <motion.ul
            className="space-y-3 text-sm font-montserrat"
            variants={containerVariants}
          >
            {[
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Terms & Conditions", path: "/terms-conditions" },
              { name: "Cancellation & Refund Policy", path: "/menu" },
              { name: "Shipping & Delivery Policy", path: "/subscription" },
           
            ].map((link, index) => (
              <motion.li key={index} variants={itemVariants}>
                <a
                  href={link.path}
                  className="uppercase hover:text-[#895C40] font-semibold transition-colors duration-200 text-black/75"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants} className="text-left">
          <motion.h3
            className="uppercase font-cormorant-text font-semibold mb-6 text-lg tracking-wide font-spectral-sc-regular text-black"
            variants={itemVariants}
          >
            Contact
          </motion.h3>

          <motion.div
            className="text-sm font-montserrat space-y-4 text-black"
            variants={containerVariants}
          >
            {/* Phone */}
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
            >
              <FaPhoneAlt className="text-[#895C40] text-lg" />
              <span className="text-black/75 font-semibold">+91 9076000468 / 97656 00701</span>
            </motion.div>
            <hr className="border-gray-300" />

            {/* Email */}
            <motion.div
              className="flex items-center space-x-3"
              variants={itemVariants}
            >
              <MdEmail className="text-[#895C40] text-lg" />
              <span className="text-black/75 font-semibold">contact@ryviveroots.com</span>
            </motion.div>
            <hr className="border-gray-300" />

            {/* Address */}
            <motion.div
              className="flex items-start space-x-3"
              variants={itemVariants}
            >
              <FaLocationDot className="text-[#895C40] text-lg mt-1" />
              <div className="text-black/75 font-semibold">
                <p>Shop No 01, Saraswati Bhuvan,</p>
                <p>Near Roshan Automobile, Phadke Road,</p>
                <p>Opp. Hotel Nav Gomantak,</p>
                <p>Dombivli, Maharashtra 421201.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM SECTION */}
      <motion.div
        className="flex md:flex-row flex-col mt-10 items-center justify-center border-t border-gray-300 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
        variants={containerVariants}
      >
        <motion.div
          className="font-spectral-sc-regular pt-6 text-base text-black/75 font-semibold "
          variants={itemVariants}
        >
          &copy; {new Date().getFullYear()} Ryvive Roots. All rights reserved.
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
