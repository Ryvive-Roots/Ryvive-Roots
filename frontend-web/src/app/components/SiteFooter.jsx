import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CREAM, SAGE } from '../theme';
import Logo from '../images/LOGO.png';
const footerImage = new URL('../images/FooterImg.jpeg', import.meta.url).href;
gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/ryvive_roots/",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/ryvive-roots-llp-a13a383b4/",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/channel/UCLmGUQhHC7kmN7lCaQ4PoDg",
  },
  {
    icon: Phone,
    href: "tel:+919765600701",
  },
];
export function SiteFooter() {
    const footerRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);
    const location = useLocation();
    // Ensure ScrollTrigger gets refreshed when navigating between pages
    useEffect(() => {
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
        return () => clearTimeout(timeout);
    }, [location.pathname]);
    useEffect(() => {
        const footer = footerRef.current;
        const content = contentRef.current;
        const image = imageRef.current;
        if (!footer || !content || !image)
            return;
        const leftGroup = footer.querySelector('[data-footer-left]');
        const columns = footer.querySelectorAll('[data-footer-column]');
        const rightGroup = footer.querySelector('[data-footer-right]');
        const bottomRow = footer.querySelector('[data-footer-bottom]');
        const navItems = footer.querySelectorAll('[data-footer-nav-item]');
        const contactItems = footer.querySelectorAll('[data-footer-contact-item]');
        const socialItems = footer.querySelectorAll('[data-footer-social-item]');
        const footerMarks = footer.querySelectorAll('[data-footer-mark]');
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set(content, { opacity: 0, y: 30 });
            gsap.set([leftGroup, Array.from(columns), rightGroup, bottomRow, navItems, contactItems, socialItems, footerMarks].flat().filter(Boolean), { y: 0, willChange: 'transform' });
            if (leftGroup) {
                gsap.fromTo(leftGroup, { y: 14 }, { y: -10, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom top', scrub: 1.15 } });
            }
            if (columns.length > 0) {
                columns.forEach((col, index) => {
                    gsap.fromTo(col, { y: 10 + index * 2 }, { y: -12 - index * 2, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 92%', end: 'bottom top', scrub: 1.2 } });
                });
            }
            if (rightGroup) {
                gsap.fromTo(rightGroup, { y: 12 }, { y: -8, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 88%', end: 'bottom top', scrub: 1.18 } });
            }
            if (bottomRow) {
                gsap.fromTo(bottomRow, { y: 8 }, { y: -6, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 84%', end: 'bottom top', scrub: 1.05 } });
            }
            navItems.forEach((item, index) => {
                gsap.fromTo(item, { y: 8 + index * 1.5 }, { y: -6 - index * 1.5, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 90%', end: 'bottom top', scrub: 1.15 } });
            });
            contactItems.forEach((item, index) => {
                gsap.fromTo(item, { y: 6 + index }, { y: -5 - index, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 88%', end: 'bottom top', scrub: 1.1 } });
            });
            socialItems.forEach((item, index) => {
                gsap.fromTo(item, { y: 5 + index }, { y: -4 - index, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 84%', end: 'bottom top', scrub: 1.08 } });
            });
            footerMarks.forEach((item, index) => {
                gsap.fromTo(item, { y: 4 + index }, { y: -4 - index, ease: 'none', scrollTrigger: { trigger: footer, start: 'top 86%', end: 'bottom top', scrub: 1.08 } });
            });
            // Fade in content as footer enters view
            gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 85%',
                }
            });
        }, footer);
        // CRITICAL: Refresh ScrollTrigger when page height changes
        const observer = new ResizeObserver(() => {
            ScrollTrigger.refresh();
        });
        observer.observe(footer);
        return () => {
            ctx.revert();
            observer.disconnect();
        };
    }, []);
    return (<footer ref={footerRef} data-tone="light" className="relative">
      <div className="absolute inset-0 bg-[#0f0c0a]"/>
      {/* Static background image */}
    <div ref={imageRef} className="absolute inset-0" style={{
            backgroundImage: `url(${footerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
        }}/>
      <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(10, 8, 7, 0.18) 0%, rgba(18, 14, 12, 0.46) 42%, rgba(18, 14, 12, 0.92) 100%)',
        }}/>
      <div className="absolute inset-0 opacity-70 mix-blend-soft-light" style={{
            background: 'radial-gradient(circle at 20% 18%, rgba(139,149,121,0.16), transparent 34%), radial-gradient(circle at 82% 78%, rgba(212,175,55,0.12), transparent 30%)',
        }}/>

      <div ref={contentRef} className="relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-14 pt-24 pb-10 lg:pt-28 lg:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.1fr_0.8fr] gap-10 lg:gap-14 items-start">
            
            {/* BRAND / LOGO COLUMN */}
            <div data-footer-left className="max-w-[26rem]">
              <div data-footer-mark className="mb-6">
                <img src={Logo} alt="Ryvive Roots" style={{
                    height: '63px',
                    width: 'auto',
                    objectFit: 'contain',
                    opacity: 0.95,
                    filter: 'brightness(0) saturate(100%) invert(93%) sepia(8%) saturate(400%) hue-rotate(20deg) brightness(103%) contrast(92%)',
                }}/>
              </div>
              <p data-footer-mark className="max-w-[22rem]" style={{ color: 'rgba(244,239,230,0.85)', fontSize: '14px', lineHeight: 1.9, fontWeight: 500 }}>
                Conscious dining, crafted with calm precision and warm hospitality.
              </p>
            </div>

            {/* EXPLORE COLUMN */}
          {/* EXPLORE COLUMN */}
<div data-footer-column>
  <div
    data-footer-mark
    className="tracking-[0.36em] uppercase mb-5"
    style={{ fontSize: '10px', color: CREAM, fontWeight: 600 }}
  >
    Explore
  </div>

  <ul className="space-y-3">
    {[
      { label: 'Story', to: '/story' },
      { label: 'Menu', to: '/menu' },
      { label: 'Subscription', to: '/subscription' },
      { label: 'Franchise', to: '/franchise' },
      { label: 'Career', to: '/career' },
      { label: 'Contact', to: '/contact' },
    ].map((item) => (
      <li key={item.label} data-footer-nav-item>
        <Link
          to={item.to}
          className="transition-colors"
          style={{
            color: 'rgba(244,239,230,0.85)',
            fontSize: '13px',
            letterSpacing: '0.04em',
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = CREAM)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color =
              'rgba(244,239,230,0.85)')
          }
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

            {/* HELP & POLICIES COLUMN */}
            <div data-footer-column>
              <div data-footer-mark className="tracking-[0.36em] uppercase mb-5" style={{ fontSize: '10px', color: CREAM, fontWeight: 600 }}>
                HELP & POLICIES
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'PRIVACY POLICY', href: '/PrivacyPolicy' },
                  { label: 'TERMS & CONDITIONS', href: '/TermsConditions' },
                  { label: 'CANCELLATION & REFUND POLICY', href: '/CancellationRefundPolicy' },
                  { label: 'SHIPPING & DELIVERY POLICY', href: '/Shipping&DeliveryPolicy' },
                ].map((item) => (<li key={item.label} data-footer-nav-item>
                    <a href={item.href} className="transition-colors" style={{ color: 'rgba(244,239,230,0.85)', fontSize: '13px', letterSpacing: '0.04em', fontWeight: 500 }} onMouseEnter={(e) => (e.currentTarget.style.color = CREAM)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,239,230,0.85)')}>
                      {item.label}
                    </a>
                  </li>))}
              </ul>
            </div>

            {/* CONTACT COLUMN */}
            <div data-footer-right>
              <div data-footer-mark className="tracking-[0.36em] uppercase mb-5" style={{ fontSize: '10px', color: CREAM, fontWeight: 600 }}>
                CONTACT
              </div>
              <ul className="space-y-3" style={{ color: 'rgba(244,239,230,0.85)', fontSize: '13px', fontWeight: 500 }}>
                <li data-footer-contact-item>+91 9076000468 / 9765600701</li>
                <li data-footer-contact-item>customersupport@ryviveroots.com</li>
                <li data-footer-contact-item>Dombivli East, Maharashtra (421201).</li>
              </ul>
            </div>
          </div>
          <div data-footer-bottom className="mt-16 pt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between" style={{ borderTop: '1px solid rgba(244,239,230,0.16)' }}>
            <div data-footer-mark style={{ color: 'rgba(244,239,230,0.75)', fontSize: '10px', letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 500 }}>
             © 2026 RYVIVE ROOTS All Rights Reserved.
            </div>
           <div className="flex items-center gap-5">
  {socialLinks.map(({ icon: Icon, href }, i) => (
    <a
      key={i}
      data-footer-social-item
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="transition-colors"
      style={{ color: "rgba(244,239,230,0.82)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = CREAM)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color =
          "rgba(244,239,230,0.82)")
      }
    >
      <Icon className="w-4 h-4" strokeWidth={1.3} />
    </a>
  ))}
</div>
          </div>
        </div>
      </div>
      <div className="relative z-10 h-12 lg:h-16" style={{
            background: 'linear-gradient(180deg, rgba(15,12,10,0) 0%, rgba(15,12,10,0.44) 100%)',
        }}/>
    </footer>);
}
