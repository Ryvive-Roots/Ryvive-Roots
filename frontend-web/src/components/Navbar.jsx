import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../assets/optimized/logo.png";
import { RiMenuUnfold4Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { IoPersonOutline } from "react-icons/io5"; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // 👈 Get current route
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  setIsLoggedIn(!!token);
}, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "Menu", href: "/menu" },
    { label: "Subscription", href: "/subscription" },
    { label: "Franchise", href: "/franchise" },
    { label: "Career", href: "/career" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white-30 backdrop-blur-3xl shadow-md" : "bg-[#FEF7F0]"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-20 py-4">
          {/* LEFT SIDE: Logo + Nav Links */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img
                src={Logo}
                alt="Logo"
                className="w-48 object-contain"
              />
            </a>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 font-manrope text-3xl font-semibold text-[#243E36]">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.href; // 👈 Check active link
                return (
                 <a
  key={index}
  href={item.href}
  className={`text-lg font-bold transition-colors duration-200 ${
    isActive
      ? "text-[#895C40]"
      : "text-[#243E36] hover:text-[#895C40]"
  }`}
  style={{
    WebkitTextStroke: "0.5px #243E36",
    textShadow: `
      1px 1px 0 #ffffff,
      -1px 1px 0 #ffffff,
      1px -1px 0 #ffffff,
      -1px -1px 0 #ffffff
    `
  }}
>
  {item.label}
</a>
                );
              })}
            </nav>
          </div>

          {/* RIGHT SIDE: Button */}
        <div className="hidden lg:flex items-center gap-6">
  {!isLoggedIn ? (
    /* 🔓 NOT LOGGED IN → LOGIN BUTTON */
    <motion.a
      whileHover={{
        scale: 1.05,
        y: -2,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.20)",
      }}
      whileTap={{ scale: 0.97 }}
      href="/login"
      className="bg-[#895C40] flex items-center gap-2 rounded-full text-white px-6 py-2"
    >
      <IoPersonOutline className="text-xl" />
      Login
    </motion.a>
  ) : (
    /* 🔐 LOGGED IN → SHOW ICON */
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      href="/dashboard"
      className="w-12 h-12 flex items-center justify-center rounded-full bg-[#895C40] text-white"
    >
      <IoPersonOutline className="text-2xl" />
    </motion.a>
  )}
</div>

          {/* MOBILE MENU BUTTON */}
          <button
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden block"
          >
            <RiMenuUnfold4Fill className="w-7 h-7 mr-4 object-contain" />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-[#FEF7F0] px-6 py-4 shadow-md space-y-4">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-[#C9A666]"
                      : "text-[#3A3222] hover:text-[#C9A666]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}

          {!isLoggedIn ? (
  <a
    href="/login"
    onClick={() => setMenuOpen(false)}
    className="bg-[#895C40] inline-flex w-fit items-center gap-2 rounded-full text-white px-8 py-3"
  >
    <IoPersonOutline className="text-xl" />
    Login
  </a>
) : (
  <a
    href="/dashboard"
    onClick={() => setMenuOpen(false)}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#895C40] text-white"
  >
    <IoPersonOutline className="text-2xl" />
  </a>
)}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
