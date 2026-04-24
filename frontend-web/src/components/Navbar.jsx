import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../assets/optimized/logoW.png";
import { RiMenuUnfold4Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { IoPersonOutline } from "react-icons/io5"; 
import SideDrawer from "./SideDrawer";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // 👈 Get current route
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

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
    { label: "Pages", href: "/our-story" },
     { label: "Subscription", href: "/subscription" },
     { label: "Login", href: "/login" },
    // { label: "Our Story", href: "/our-story" },
  
    // { label: "Menu", href: "/menu" },
   
    // { label: "Franchise", href: "/franchise" },
    // { label: "Career", href: "/career" },
    // { label: "Contact Us", href: "/contact" },
  ];

  const pageDropdown = [
  { label: "Our Story", href: "/our-story" },
  { label: "Menu", href: "/menu" },
  { label: "Franchise", href: "/franchise" },
  { label: "Career", href: "/career" },
  { label: "Contact Us", href: "/contact" },
];

  return (
    <>
<div
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-[#0d2009]/90 backdrop-blur-md shadow-md"
      : "bg-transparent"
  }`}
>

       <div className="h-[80px]  flex items-center justify-between px-6">
          {/* LEFT SIDE: Logo + Nav Links */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img
                src={Logo}
                alt="Logo"
                className="w-28 object-contain"
              />
            </a>

            {/* Nav Links */}
           <nav className="hidden  lg:flex gap-8 items-start text-white relative">
  {navItems.map((item, index) => {
    const isPages = item.label === "Pages";

    return (
    <div
  key={index}
  className="relative group flex flex-col items-center"
>
  <a href={item.href} className=" text-sm tracking-[0.20em] cursor-pointer">
    {item.label}
  </a>

  {/* ✅ Active diamond */}
  {location.pathname === item.href && (
    <div className="diamond active-diamond"></div>
  )}

  {/* ✅ Hover diamond (only for non-active) */}
  {location.pathname !== item.href && (
    <div className="diamond hover-diamond"></div>
  )}


  {/* Dropdown */}
  {isPages && (
  <div
  className="absolute top-full left-0 mt-4 w-40 bg-white text-black shadow-lg 
  overflow-hidden 
  max-h-0 
  group-hover:max-h-96 
  transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
>
  <div className="grid grid-cols-1 gap-x-10 px-8 py-4">
  {pageDropdown.map((subItem, i) => (
    <a
      key={i}
      href={subItem.href}
      className="dropdown-link inline-block font-roboto py-2"
    >
      <span className="dropdown-text">
        {subItem.label}
      </span>
    </a>
  ))}
</div>
</div>
  )}
</div>
    );
  })}
</nav>
          </div>

          {/* RIGHT SIDE: Button */}
        <div className="hidden   items-center gap-6">
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
<div className="flex items-center gap-6">
 <div>
<p className="phone-text font-semibold text-white font-cinzel whitespace-nowrap tracking-[0.20em] text-xs">
  +91 97656 00701
</p>
 </div>
          {/* MOBILE MENU BUTTON */}
     <button
  onClick={() => {
    if (window.innerWidth >= 1024) {
      setDesktopMenuOpen(true); // 💻
    } else {
      setMobileMenuOpen(!mobileMenuOpen); // 📱
    }
  }}
  className="menu-btn"
>
  <span></span>
  <span></span>
  <span></span>
</button>
          </div>
        </div>

        {/* MOBILE MENU */}
{mobileMenuOpen  && (
          <div className=" bg-[#FEF7F0] px-6 py-4 shadow-md space-y-4">
    {navItems.map((item, index) => {
      const isActive = location.pathname === item.href;
      return (
        <a
          key={index}
          href={item.href}
         onClick={() => setMobileMenuOpen(false)}
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

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setMenuOpen(false)}
      className="absolute top-6 right-6 text-3xl"
    >
      ✕
    </button>
  </div>
)}
      </div>
     <SideDrawer 
  isOpen={desktopMenuOpen} 
  onClose={() => setDesktopMenuOpen(false)} 
  navItems={navItems}
/>
    </>
  );
};

export default Navbar;
