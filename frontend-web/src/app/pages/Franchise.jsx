import { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, TrendingUp, HeartHandshake, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
const benefits = [
    { icon: Sprout, title: 'Proven Concept', desc: 'A refined, season-led model built on craft, consistency, and quiet luxury.' },
    { icon: TrendingUp, title: 'Strong Unit Economics', desc: 'Healthy margins and a loyal, high-spend clientele built into the foundation.' },
    { icon: HeartHandshake, title: 'End-to-End Partnership', desc: 'Site selection, training, supply chain, and ongoing operational guidance.' },
    { icon: Award, title: 'A Considered Brand', desc: 'Design, identity, and recipes — every detail curated to the last gram.' },
];
const details = [
    { label: 'Operational Support', value: 'End-to-end onboarding and launch guidance.' },
    { label: 'Training Program', value: 'Comprehensive staff and operations training.' },
    { label: 'Marketing Assistance', value: 'Brand, digital and local marketing support.' },
    { label: 'Relationship Team', value: 'Continuous guidance for long-term growth.' },
];
export default function Franchise() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', capacity: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));
  const [loading, setLoading] = useState(false);

const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();

  formData.append("access_key", "7b1d39a2-f749-448d-87f2-f41a09741bc7");
  formData.append("subject", "New Franchise Inquiry - Ryvive Roots");

  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("phone", form.phone);
  formData.append("city", form.city);
  formData.append("investment_capacity", form.capacity);
  formData.append("message", form.message);

  const response = await fetch(
    "https://api.web3forms.com/submit",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  setLoading(false);

  if (data.success) {
    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      capacity: "",
      message: "",
    });
  } else {
    alert("Failed to submit inquiry.");
  }
};
    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: `1px solid ${SAGE_DARK}`,
        padding: '14px 2px',
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
    return (<>
      {/* HERO — DARK */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden" style={{ background: DARK_2 }}>
        <div className="absolute inset-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80" alt="Franchise hero" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,17,15,0.55) 0%, rgba(20,17,15,0.55) 50%, rgba(20,17,15,0.96) 100%)' }}/>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-14 w-full pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 rounded-sm" style={{ border: `1px solid ${CREAM}`, fontSize: '10px', letterSpacing: '0.42em', textTransform: 'uppercase', color: CREAM, fontWeight: 600 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: CREAM, display: 'inline-block' }}/>
              Coming Soon
            </div>
            <h1 className="font-serif mb-10" style={{ fontSize: 'clamp(46px, 7vw, 92px)', lineHeight: 1.02, letterSpacing: '-0.015em', color: CREAM, fontWeight: 300 }}>
              Franchise with<br />
              <em style={{ fontStyle: 'italic', color: SAGE }}>Ryvive Roots.</em>
            </h1>
            <p className="mx-auto" style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(244,239,230,0.65)', maxWidth: '580px' }}>
              We are quietly inviting a small circle of partners to bring our table to new cities — built on craft, restraint, and a deep respect for the season.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHY — LIGHT */}
      <section data-tone="light" className="py-28 lg:py-36" style={{ background: CREAM }}>
        <div className="max-w-[1300px] mx-auto px-8 lg:px-14">
          <div className="text-center mb-20">
            <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>— The Partnership</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(32px, 4vw, 54px)', lineHeight: 1.1, color: INK, fontWeight: 300 }}>
              Why partner <em style={{ fontStyle: 'italic' }}>with us.</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {benefits.map((b, i) => {
            const Icon = b.icon;
            return (<motion.div key={b.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="p-8 transition-all duration-500" style={{ background: CREAM_2, border: `1px solid rgba(42,37,32,0.08)` }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(42,37,32,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <Icon size={28} strokeWidth={1.2} color={SAGE_DARK}/>
                  <h3 className="font-serif mt-7 mb-3" style={{ fontSize: '21px', color: INK, fontWeight: 400, lineHeight: 1.3 }}>{b.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.75 }}>{b.desc}</p>
                </motion.div>);
        })}
          </div>
        </div>
      </section>

      {/* WHAT YOU RECEIVE — DARK */}
      <section className="py-28 lg:py-36" style={{ background: DARK }}>
        <div className="max-w-[1300px] mx-auto px-8 lg:px-14">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: CREAM, fontWeight: 600 }}>— Support</div>
              <h2 className="font-serif mb-8" style={{ fontSize: 'clamp(30px, 3.6vw, 48px)', lineHeight: 1.1, color: CREAM, fontWeight: 300 }}>
                A comprehensive <em style={{ fontStyle: 'italic', color: SAGE }}>partnership.</em>
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(244,239,230,0.65)', lineHeight: 1.85, maxWidth: '460px' }}>
                We believe in setting up our partners for success from day one. We provide complete operational, training, and marketing support to ensure alignment with our standards.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(244,239,230,0.12)' }}>
                {details.map((d) => (<div key={d.label} className="p-8" style={{ background: DARK }}>
                    <div className="tracking-[0.3em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE, fontWeight: 600 }}>{d.label}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(244,239,230,0.65)', lineHeight: 1.75 }}>{d.value}</div>
                  </div>))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION — LIGHT */}
      <section data-tone="light" className="py-28 lg:py-36" style={{ background: CREAM_2 }}>
        <div className="max-w-[1000px] mx-auto px-8 lg:px-14 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>— Our Vision</div>
            <h2 className="font-serif mb-10" style={{ fontSize: 'clamp(30px, 3.6vw, 48px)', lineHeight: 1.15, color: INK, fontWeight: 300 }}>
              A quiet network of <em style={{ fontStyle: 'italic' }}>thoughtful tables</em> —<br />
              built slowly, the only way worth building.
            </h2>
            <p className="mx-auto" style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.85, maxWidth: '560px' }}>
              We see Ryvive Roots in a handful of cities over the next decade — never more than the season and our standards can hold.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FORM — LIGHT */}
      <section data-tone="light" className="py-28 lg:py-36" style={{ background: CREAM }}>
        <div className="max-w-[820px] mx-auto px-8 lg:px-14">
          <div className="text-center mb-16">
            <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '11px', color: SAGE_DARK, fontWeight: 600 }}>— Express Interest</div>
            <h2 className="font-serif mb-6" style={{ fontSize: 'clamp(30px, 3.6vw, 46px)', lineHeight: 1.1, color: INK, fontWeight: 300 }}>
              Begin a <em style={{ fontStyle: 'italic' }}>conversation.</em>
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.85 }}>
              Share a few details and our partnerships team will be in touch within five working days.
            </p>
          </div>

          {submitted ? (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20" style={{ border: `1px solid ${SAGE}`, background: CREAM_2 }}>
              <div className="font-serif mb-3" style={{ fontSize: '28px', color: INK, fontWeight: 300 }}>
                Thank you.
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(42,37,32,0.65)', lineHeight: 1.8 }}>
                Your interest is received. We will write to you shortly.
              </p>
            </motion.div>) : (<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div style={labelStyle}>Full Name</div>
                <input required value={form.name} onChange={onChange('name')} style={inputStyle}/>
              </div>
              <div>
                <div style={labelStyle}>Email</div>
                <input type="email" required value={form.email} onChange={onChange('email')} style={inputStyle}/>
              </div>
              <div>
                <div style={labelStyle}>Phone</div>
                <input required value={form.phone} onChange={onChange('phone')} style={inputStyle}/>
              </div>
              <div>
                <div style={labelStyle}>City</div>
                <input required value={form.city} onChange={onChange('city')} style={inputStyle}/>
              </div>
              <div className="md:col-span-2">
                <div style={labelStyle}>Investment Capacity</div>
                <select value={form.capacity} onChange={onChange('capacity')} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Select a range</option>
                  <option value="1.0-1.5">₹1.0 – 1.5 Cr</option>
                  <option value="1.5-2.0">₹1.5 – 2.0 Cr</option>
                  <option value="2.0+">₹2.0 Cr +</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <div style={labelStyle}>Message</div>
                <textarea rows={4} value={form.message} onChange={onChange('message')} style={{ ...inputStyle, resize: 'none' }}/>
              </div>
              <div className="md:col-span-2 mt-4">
               <button
  type="submit"
  disabled={loading}
  className="px-10 py-4 tracking-[0.24em] uppercase transition-all duration-300"
  style={{
    fontSize: '11px',
    background: loading ? SAGE_DARK : INK,
    color: CREAM,
    border: `1px solid ${loading ? SAGE_DARK : INK}`,
    borderRadius: '1px',
    cursor: loading ? 'not-allowed' : 'pointer'
  }}
>
  {loading ? "Submitting..." : "Submit Interest"}
</button>
              </div>
            </form>)}
        </div>
      </section>
    </>);
}
