import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, INK, SAGE_DARK } from '../theme';
export default function Login() {
      const [membershipId, setMembershipId] = useState("");
      const [identifier, setIdentifier] = useState(""); // email or phone
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
    
      const location = useLocation();

useEffect(() => {
  if (location.state?.identifier) {
    setIdentifier(location.state.identifier);
  }
}, [location.state]);
    
    const handleLogin = async () => {
      if (!membershipId || !identifier) {
        alert("Please enter Membership ID and Email or Phone");
        return;
      }
    
      try {
        setLoading(true);
        setError(""); // clear old error
    
        const res = await fetch("https://api.ryviveroots.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            membershipId,
            identifier,
          }),
        });
    
        const data = await res.json();
    
        if (data.success) {
          localStorage.setItem("token", "loggedin");
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("membershipId", data.membershipId);
    
          window.location.href = "/dashboard";
        } else {
          setError("invalid"); // 👈 trigger error
        }
      } catch (error) {
        console.error("❌ Login error:", error);
        alert("Server error. Try again.");
      } finally {
        setLoading(false);
      }
    };
    
      useEffect(() => {
        const savedMembershipId = localStorage.getItem("membershipId");
    
        if (savedMembershipId) {
          setMembershipId(savedMembershipId);
        }
      }, []);
  
    const [remember, setRemember] = useState(true);
    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${SAGE_DARK}`,
        padding: '12px 2px',
        fontSize: '14px',
        color: INK,
        outline: 'none',
        fontFamily: 'inherit',
    };
    
    const labelStyle = {
        fontSize: '10px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: SAGE_DARK,
        fontWeight: 600,
    };
    return (<section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: DARK }}>
      <div className="absolute inset-0">
        <ImageWithFallback src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=80" alt="Café" className="w-full h-full object-cover" style={{ filter: 'blur(8px) brightness(0.55)' }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,15,0.55) 0%, rgba(20,17,15,0.7) 100%)' }}/>
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-[460px] mx-6 my-20 p-12" style={{ background: CREAM, border: `1px solid rgba(244,239,230,0.2)`, boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
        <button 
          onClick={() => window.history.back()} 
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 tracking-[0.22em] uppercase transition-colors duration-300" 
          style={{ fontSize: '10px', color: 'rgba(42,37,32,0.5)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.color = INK; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(42,37,32,0.5)'; }}
          aria-label="Go back"
        >
          <ArrowLeft size={13} strokeWidth={1.5} /> BACK
        </button>

        <div className="text-center mb-10">
          <Link to="/" className="font-serif tracking-[0.22em] uppercase" style={{ fontSize: '13px', color: INK }}>
            RYVIVE <span style={{ color: SAGE_DARK }}>ROOTS</span>
          </Link>
          <div className="tracking-[0.42em] uppercase mt-10 mb-5" style={{ fontSize: '10px', color: SAGE_DARK }}>— MEMBERS</div>
          <h1 className="font-serif" style={{ fontSize: '36px', lineHeight: 1.15, color: INK, fontWeight: 300 }}>
            Welcome <em style={{ fontStyle: 'italic' }}>back.</em>
          </h1>
          <p className="mt-4" style={{ fontSize: '13px', color: 'rgba(42,37,32,0.6)', lineHeight: 1.7 }}>
            Sign in to manage your subscription and orders.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div>
            <div style={labelStyle}>Membership ID</div>
            <input value={membershipId} onChange={(e) => setMembershipId(e.target.value)} style={inputStyle}/>
          </div>

         <div>
  <div style={labelStyle}>Email or Phone</div>
  <input
    value={identifier}
    onChange={(e) => {
      setIdentifier(e.target.value);
      setError("");
    }}
    style={inputStyle}
  />
</div>

{error === "invalid" && (
  <p
    style={{
      color: "red",
      fontSize: "12px",
      marginTop: "8px",
    }}
  >
    Please enter your registered Email ID or Phone Number.
  </p>
)}

          <div className="flex items-center justify-between" style={{ fontSize: '11px' }}>
            <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'rgba(42,37,32,0.7)', letterSpacing: '0.08em' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: SAGE_DARK }}/>
              Remember me
            </label>
          </div>

        <button
  type="button"
  disabled={loading}
  onClick={handleLogin}
  className="block w-full text-center px-9 py-4 tracking-[0.24em] uppercase transition-all duration-300"
  style={{
    fontSize: "11px",
    background: INK,
    color: CREAM,
    border: `1px solid ${INK}`,
    borderRadius: "1px",
    opacity: loading ? 0.7 : 1,
    cursor: loading ? "not-allowed" : "pointer",
  }}
>
  {loading ? "SIGNING IN..." : "SIGN IN"}
</button>
         
        </form>
      </motion.div>
    </section>);
}
