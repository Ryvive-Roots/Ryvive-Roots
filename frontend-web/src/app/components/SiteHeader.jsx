import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, User, MapPin, ChevronDown } from 'lucide-react';
import { CREAM, INK, SAGE } from '../theme';
import Logo from '../images/LOGO.png';
import { BurgerMenu } from './BurgerMenu';

const OUTLETS = ['Dombivali East', 'Runwal Gardens'];

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [overLight, setOverLight] = useState(false);
    const [outletsOpen, setOutletsOpen] = useState(false);
    const outletsRef = useRef(null);
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            const lightZones = Array.from(document.querySelectorAll('[data-tone="light"]'));
            const y = window.scrollY + 36;
            setOverLight(lightZones.some((el) => el.offsetTop !== undefined && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight));
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [location.pathname]);

    // Close the outlets dropdown when clicking outside it
    useEffect(() => {
        const onClickOutside = (e) => {
            if (outletsRef.current && !outletsRef.current.contains(e.target)) {
                setOutletsOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    // Close on route change
    useEffect(() => {
        setOutletsOpen(false);
    }, [location.pathname]);

    const headerText = overLight ? INK : CREAM;
    const headerMuted = overLight ? 'rgba(42,37,32,0.72)' : 'rgba(244,239,230,0.72)';
    const headerBorder = overLight ? 'rgba(42,37,32,0.15)' : 'rgba(244,239,230,0.15)';

    const links = [
        { label: 'Story', to: '/story' },
        { label: 'Menu', to: '/menu' },
        { label: 'Subscription', to: '/subscription' },
        { label: 'Franchise', to: '/franchise' },
            { label: 'Offers', to: '/franchise' },
        { label: 'Career', to: '/career' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-500" style={{
            background: (scrolled || isDashboard) ? (overLight ? 'rgba(244,239,230,0.92)' : 'rgba(20,17,15,0.9)') : 'transparent',
            backdropFilter: (scrolled || isDashboard) ? 'blur(16px)' : 'none',
            borderBottom: (scrolled || isDashboard) ? `1px solid ${headerBorder}` : '1px solid transparent',
        }}>
            <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
                <div className="flex items-center justify-between h-[72px]">
                    <Link to="/" className="transition-opacity duration-300">
                        <img src={Logo} alt="Ryvive Roots" style={{
                            height: '72px',
                            width: 'auto',
                            objectFit: 'contain',
                            opacity: 0.95,
                            transition: 'filter 0.5s ease',
                            filter: overLight ? 'none' : 'brightness(0) saturate(100%) invert(93%) sepia(8%) saturate(400%) hue-rotate(20deg) brightness(103%) contrast(92%)',
                        }}/>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        {links.map((item) => {
                            const isCurrent = location.pathname === item.to;
                            return (
                                <Link key={item.label} to={item.to} className="tracking-[0.2em] uppercase transition-colors duration-300 relative" style={{ fontSize: '13px', fontWeight: 500, color: isCurrent ? headerText : headerMuted }} onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.color = headerText; }} onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.color = headerMuted; }}>
                                    {item.label}
                                    {isCurrent && (<span style={{ position: 'absolute', left: 0, right: 0, bottom: '-6px', height: '1px', background: SAGE }}/>)}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Outlets dropdown */}
                        <div ref={outletsRef} className="hidden md:block relative">
                            <button
                                type="button"
                                onClick={() => setOutletsOpen((o) => !o)}
                                className="inline-flex items-center gap-2 tracking-[0.2em] uppercase transition-colors duration-300"
                                style={{ fontSize: '12px', fontWeight: 500, color: outletsOpen ? headerText : headerMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = headerText; }}
                                onMouseLeave={(e) => { if (!outletsOpen) e.currentTarget.style.color = headerMuted; }}
                                aria-haspopup="true"
                                aria-expanded={outletsOpen}
                            >
                                <MapPin size={14} strokeWidth={1.6}/> Outlets
                                <ChevronDown
                                    size={12}
                                    strokeWidth={1.8}
                                    style={{ transition: 'transform 0.25s ease', transform: outletsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                            </button>

                            {outletsOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 mt-4 py-2 min-w-[180px]"
                                    style={{
                                        top: '100%',
                                        background: overLight ? 'rgba(244,239,230,0.98)' : 'rgba(20,17,15,0.97)',
                                        border: `1px solid ${headerBorder}`,
                                        backdropFilter: 'blur(16px)',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                                    }}
                                >
                                    {OUTLETS.map((outlet) => (
                                        <Link
                                            key={outlet}
                                            to={`/outlets/${outlet.toLowerCase()}`}
                                            role="menuitem"
                                            className="block tracking-[0.15em] uppercase transition-colors duration-200"
                                            style={{ fontSize: '12px', fontWeight: 500, color: headerMuted, padding: '10px 18px' }}
                                            onClick={() => setOutletsOpen(false)}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = headerText; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = headerMuted; }}
                                        >
                                            {outlet}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/login" className="hidden md:inline-flex items-center gap-2 tracking-[0.2em] uppercase transition-colors duration-300" style={{ fontSize: '12px', fontWeight: 500, color: headerMuted }} onMouseEnter={(e) => { e.currentTarget.style.color = headerText; }} onMouseLeave={(e) => { e.currentTarget.style.color = headerMuted; }}>
                            <User size={14} strokeWidth={1.6}/> Login
                        </Link>

                        {/* Mobile Login Icon */}
                        <Link 
                            to="/login" 
                            className="inline-flex md:hidden items-center justify-center w-10 h-10 transition-transform duration-300 hover:scale-105"
                            style={{ color: headerMuted }}
                            aria-label="Login"
                        >
                            <User size={20} strokeWidth={1.5} />
                        </Link>

                        <BurgerMenu headerText={headerText} headerMuted={headerMuted}/>
                    </div>
                </div>
            </div>
        </header>
    );
}