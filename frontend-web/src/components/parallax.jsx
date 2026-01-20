import { useEffect, useRef } from "react";

const parallaxRef = useRef(null);

useEffect(() => {
  const handleScroll = () => {
    if (!parallaxRef.current) return;

    const scrollY = window.scrollY;
    parallaxRef.current.style.backgroundPositionY = `${scrollY * 0.4}px`;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
