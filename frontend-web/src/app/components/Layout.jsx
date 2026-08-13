import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { CREAM, DARK, SAGE } from '../theme';

export function Layout() {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash]);
    return (<div style={{ background: DARK }} className="min-h-screen overflow-x-hidden relative">
      <SiteHeader />
      <Outlet />
      <SiteFooter />

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.a
        href="https://wa.me/919076000468"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.28 }}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '999px',
          background: 'rgba(20,17,15,0.92)',
          border: `1px solid rgba(139,149,121,0.35)`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 28px -8px rgba(20,17,15,0.45)',
          zIndex: 9999,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {/* WhatsApp SVG icon — inline, styled to match site */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.66 1.438 5.168L2 22l4.98-1.418A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke={SAGE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 9.5c.5 1 1.5 3 3.5 4s3.5.5 4 0" stroke={SAGE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: CREAM,
          fontWeight: 400,
          whiteSpace: 'nowrap',
        }}>
          WhatsApp
        </span>
      </motion.a>
    </div>);
}