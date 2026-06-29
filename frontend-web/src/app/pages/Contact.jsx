import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Send, Instagram, CheckCircle2 } from 'lucide-react';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
import FooterImg from '../images/contact0.jpeg';
import ImgF from '../images/contact1.jpeg';
import emailjs from "@emailjs/browser";

const ease = [0.22, 1, 0.36, 1];

const contactDetails = [
    {
        icon: Phone,
        label: 'Call Us',
        lines: [
            { text: '+91 90760 00468', href: 'tel:+919076000468' },
            { text: '+91 97656 00701', href: 'tel:+919765600701' },
        ],
    },
    {
        icon: Mail,
        label: 'Write to Us',
        lines: [
            { text: 'customersupport@ryviveroots.com', href: 'mailto:customersupport@ryviveroots.com' },
           
        ],
    },
    {
        icon: MapPin,
        label: 'Visit Us',
        lines: [
            { text: 'Shop No 01, Saraswati Bhuvan, Near Roshan Automobile,' },
            { text: 'Phadke Cross Road, Opp. Hotel Nav Gomantak,' },
            { text: 'Dombivli East, Maharashtra 421201.' },
        ],
    },
];

export default function Contact() {
    const [form, setForm] = useState({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

const [submitted, setSubmitted] = useState(false);


    const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    // 📅 Date & Time
    const now = new Date();

    const submissionDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const submissionTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Append date & time to SheetDB
    formData.append("data[Date]", submissionDate);
    formData.append("data[Time]", submissionTime);

    try {
      // 1️⃣ Send to SheetDB
      const response = await fetch("https://sheetdb.io/api/v1/81mxcr1k0ouf7", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Submission to SheetDB failed. Please try again.");
        return;
      }

      // 2️⃣ Send Email via EmailJS
     const emailParams = {
  name: formData.get("data[Name]"),
  email: formData.get("data[Email]"),
  phone: formData.get("data[Phone]"),
  subject: formData.get("data[Subject]"),
  message: formData.get("data[Message]"),
  date: submissionDate,
  time: submissionTime,
};

      await emailjs.send(
        "service_oo5t5wf",
        "template_sorwe7i",
        emailParams,
        "3AfFnBmZMg4f0Kq0I"
      );

      alert(
        `Thank you ${emailParams.name}, your inquiry has been submitted successfully!`
      );

      await emailjs.send(
  "service_oo5t5wf",
  "template_j0bsfe4", // Auto-reply template
  {
    name: emailParams.name,
    email: emailParams.email,
    subject: emailParams.subject,
    phone: emailParams.phone,
    message: emailParams.message,
  },
  "3AfFnBmZMg4f0Kq0I"
);

formRef.current.reset();
      formRef.current.reset();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

    

    const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));


    return (
        <div style={{ background: DARK_2 }} className="min-h-screen">

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-end overflow-hidden">
                {/* BG image */}
                <div className="absolute inset-0">
                    <img
                        src={FooterImg}
                        alt=""
                        className="w-full h-full object-cover object-top-right"
                        style={{ filter: 'saturate(0.7) brightness(0.45)' }}
                    />
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to bottom, rgba(20,17,15,0.2) 0%, rgba(20,17,15,0.5) 50%, rgba(20,17,15,0.97) 100%)',
                    }} />
                </div>

                {/* Content — pinned to bottom */}
                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 lg:px-14 pb-20 pt-48">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease }}
                    >
                        {/* Eyebrow */}
                        <div className="flex items-center gap-4 mb-7">
                            <span style={{ width: 40, height: 1, background: SAGE, display: 'inline-block' }} />
                            <span className="tracking-[0.44em] uppercase" style={{ fontSize: '10px', color: SAGE }}>
                                Contact
                            </span>
                        </div>

                        {/* Headline */}
                        <h1
                            className="font-serif"
                            style={{
                                fontSize: 'clamp(52px, 9vw, 120px)',
                                lineHeight: 0.95,
                                fontWeight: 300,
                                letterSpacing: '-0.025em',
                                color: CREAM,
                                maxWidth: '820px',
                            }}
                        >
                            Let's start a<br />
                            <em style={{ fontStyle: 'italic', color: SAGE }}>conversation.</em>
                        </h1>

                        {/* Sub */}
                        <p className="mt-8 max-w-md" style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(244,239,230,0.55)' }}>
                            Whether it's a question, a collaboration, or simply curiosity — we'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── MAIN SECTION — light beige two-column ───────────── */}
            <section data-tone="light" style={{ background: CREAM }} className="py-24 lg:py-32">
                <div className="max-w-[1400px] mx-auto px-8 lg:px-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                        {/* LEFT — details */}
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease }}
                        >
                            <div className="tracking-[0.42em] uppercase mb-5" style={{ fontSize: '10px', color: SAGE_DARK }}>
                                — Find Us
                            </div>
                            <h2
                                className="font-serif mb-14"
                                style={{
                                    fontSize: 'clamp(34px, 4.4vw, 58px)',
                                    lineHeight: 1.05,
                                    fontWeight: 300,
                                    color: INK,
                                    letterSpacing: '-0.015em',
                                }}
                            >
                                We're always<br />
                                <em style={{ fontStyle: 'italic', color: SAGE_DARK }}>close by.</em>
                            </h2>

                            {/* Contact detail rows */}
                            <div className="flex flex-col gap-10">
                                {contactDetails.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.08, ease }}
                                        className="flex items-start gap-6"
                                        style={{ borderBottom: '1px solid rgba(42,37,32,0.1)', paddingBottom: '2.5rem' }}
                                    >
                                        {/* Icon circle */}
                                        <div
                                            className="flex-shrink-0 flex items-center justify-center"
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: '50%',
                                                border: '1px solid rgba(107,117,96,0.3)',
                                                background: 'rgba(107,117,96,0.07)',
                                            }}
                                        >
                                            <item.icon size={17} strokeWidth={1.3} color={SAGE_DARK} />
                                        </div>

                                        <div>
                                            <div className="tracking-[0.32em] uppercase mb-3" style={{ fontSize: '9px', color: SAGE_DARK }}>
                                                {item.label}
                                            </div>
                                            {item.lines.map((line, j) =>
                                                line.href ? (
                                                    <a
                                                        key={j}
                                                        href={line.href}
                                                        className="block transition-colors duration-300"
                                                        style={{ fontSize: '15px', color: INK, lineHeight: 1.7, fontWeight: 300 }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.color = SAGE_DARK)}
                                                        onMouseLeave={(e) => (e.currentTarget.style.color = INK)}
                                                    >
                                                        {line.text}
                                                    </a>
                                                ) : (
                                                    <p key={j} style={{ fontSize: '14px', color: 'rgba(42,37,32,0.6)', lineHeight: 1.75, fontWeight: 300 }}>
                                                        {line.text}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Social row */}
                            <div className="mt-10 flex items-center gap-5">
                                <span className="tracking-[0.32em] uppercase mr-2" style={{ fontSize: '9px', color: 'rgba(42,37,32,0.35)' }}>Follow</span>
                                <a
                                    href="https://www.instagram.com/ryvive_roots/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center transition-all duration-300"
                                    style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        border: '1px solid rgba(42,37,32,0.15)',
                                        color: 'rgba(42,37,32,0.45)',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = SAGE_DARK; e.currentTarget.style.color = SAGE_DARK; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(42,37,32,0.15)'; e.currentTarget.style.color = 'rgba(42,37,32,0.45)'; }}
                                >
                                    <Instagram size={15} strokeWidth={1.4} />
                                </a>
                            </div>
                        </motion.div>

                        {/* RIGHT — form panel on CREAM_2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease, delay: 0.1 }}
                            style={{
                                background: CREAM_2,
                                border: '1px solid rgba(42,37,32,0.07)',
                                borderRadius: '3px',
                                padding: '48px',
                                boxShadow: '0 20px 60px -20px rgba(42,37,32,0.08)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6, ease }}
                                        className="flex flex-col items-center justify-center text-center py-16"
                                    >
                                        <CheckCircle2 size={40} strokeWidth={1.2} color={SAGE_DARK} style={{ marginBottom: 24 }} />
                                        <div className="font-serif mb-4" style={{ fontSize: 'clamp(26px, 3vw, 36px)', color: INK, fontWeight: 300 }}>
                                            Message received.
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'rgba(42,37,32,0.6)', lineHeight: 1.85, maxWidth: 340 }}>
                                            Thank you for reaching out. Our team will be in touch with you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="mb-10">
                                            <div className="tracking-[0.42em] uppercase mb-4" style={{ fontSize: '10px', color: SAGE_DARK }}>
                                                — Send a Message
                                            </div>
                                            <h2 className="font-serif" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.1, color: INK, fontWeight: 300 }}>
                                                Begin a <em style={{ fontStyle: 'italic' }}>dialogue.</em>
                                            </h2>
                                        </div>

                                     <form
  ref={formRef}
  onSubmit={handleSubmit}
  className="flex flex-col gap-8"

>
                                            {[
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'email', label: 'Email Address', type: 'email' },
  { key: 'phone', label: 'Phone Number', type: 'tel' },
  { key: 'subject', label: 'Subject', type: 'text' },
].map(({ key, label, type }) => (
                                                <div key={key}>
                                                    <label style={formLabelStyle}>{label}</label>
                                                   <input
  name={
    key === "name"
      ? "data[Name]"
      : key === "email"
      ? "data[Email]"
      : key === "phone"
      ? "data[Phone]"
      : "data[Subject]"
  }
  required
  type={type}
  value={form[key]}
  onChange={onChange(key)}
  style={formInputStyle}
  onFocus={(e) =>
    (e.currentTarget.style.borderBottomColor = SAGE_DARK)
  }
  onBlur={(e) =>
    (e.currentTarget.style.borderBottomColor =
      "rgba(42,37,32,0.22)")
  }
/>
                                                </div>
                                            ))}

                                            <div>
                                                <label style={formLabelStyle}>Message</label>
                                               <textarea
  name="data[Message]"
  required
  rows={4}
  value={form.message}
  onChange={onChange('message')}
  style={{
    ...formInputStyle,
    resize: 'none',
    lineHeight: 1.75
  }}
/>
                                            </div>

                                            <div className="pt-2">
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="flex items-center gap-3 tracking-[0.26em] uppercase w-full justify-center"
                                                    style={{
                                                        fontSize: '11px',
                                                        padding: '18px 32px',
                                                        background: INK,
                                                        color: CREAM,
                                                        border: `1px solid ${INK}`,
                                                        borderRadius: '2px',
                                                        cursor: 'pointer',
                                                        fontWeight: 400,
                                                        fontFamily: 'inherit',
                                                        transition: 'background 0.3s, border-color 0.3s',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = SAGE_DARK;
                                                        e.currentTarget.style.borderColor = SAGE_DARK;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = INK;
                                                        e.currentTarget.style.borderColor = INK;
                                                    }}
                                                >
                                                    Send Message <Send size={13} strokeWidth={1.5} />
                                                </motion.button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ── MAP BAND ──────────────────────────────────────────────── */}
            <section style={{ background: DARK }} className="pt-0 pb-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease }}
                    className="relative overflow-hidden"
                    style={{ height: '420px' }}
                >
                    {/* Grayscale tinted map overlay */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{ background: 'rgba(20,17,15,0.18)', mixBlendMode: 'multiply' }}
                    />
                    <iframe
                        title="Ryvive Roots Location"
                        src="https://maps.google.com/maps?q=Shop%20No%2001,%20Saraswati%20Bhuvan,%20Near%20Roshan%20Automobile,%20Phadke%20Cross%20Road,%20Opp.%20Hotel%20Nav%20Gomantak,%20Dombivli%20East,%20Maharashtra%20421201&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{
                            border: 0,
                            display: 'block',
                            filter: 'grayscale(1) contrast(1.1) brightness(0.88)',
                        }}
                        allowFullScreen=""
                        loading="lazy"
                    />

                    {/* Address overlay tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3, ease }}
                        className="absolute bottom-6 left-6 z-20"
                        style={{
                            background: 'rgba(20,17,15,0.88)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(244,239,230,0.1)',
                            borderRadius: '3px',
                            padding: '16px 22px',
                            maxWidth: 280,
                        }}
                    >
                        <div className="tracking-[0.34em] uppercase mb-2" style={{ fontSize: '9px', color: SAGE }}>
                            Our Location
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(244,239,230,0.75)', lineHeight: 1.75 }}>
                            Shop No 01, Saraswati Bhuvan,<br />
                            Phadke Cross Road, Dombivli East,<br />
                            Maharashtra 421201.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── CLOSING QUOTE ─────────────────────────────────────────── */}
            <section className="relative py-28 lg:py-40 text-center overflow-hidden" style={{ background: DARK_2 }}>
                {/* Background image with heavy overlay */}
                <div className="absolute inset-0">
                    <img
                        src={ImgF}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: 'saturate(0.5) brightness(0.60)' }}
                    />
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(180deg, rgba(20,17,15,0.72) 0%, rgba(20,17,15,0.55) 50%, rgba(20,17,15,0.82) 100%)',
                    }} />
                    {/* Ambient sage radial glow */}
                    <div className="absolute inset-0 opacity-20" style={{
                        background: 'radial-gradient(ellipse at 50% 60%, rgba(139,149,121,0.55) 0%, transparent 65%)',
                    }} />
                </div>

                <div className="relative z-10 max-w-[720px] mx-auto px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease }}
                    >
                        <div className="tracking-[0.44em] uppercase mb-8 flex items-center justify-center gap-4" style={{ fontSize: '10px', color: SAGE }}>
                            <span style={{ width: 28, height: 1, background: SAGE, display: 'inline-block' }} />
                            A Final Note
                            <span style={{ width: 28, height: 1, background: SAGE, display: 'inline-block' }} />
                        </div>
                        <p
                            className="font-serif"
                            style={{
                                fontSize: 'clamp(24px, 3.2vw, 42px)',
                                color: CREAM,
                                lineHeight: 1.4,
                                fontWeight: 300,
                                fontStyle: 'italic',
                            }}
                        >
                            "Real food, real people —<br />
                            <em style={{ color: SAGE }}>real conversations.</em>"
                        </p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}

// ─── Static style objects ─────────────────────────────────────────────────────

const formLabelStyle = {
    display: 'block',
    fontSize: '9px',
    letterSpacing: '0.34em',
    textTransform: 'uppercase',
    color: SAGE_DARK,
    marginBottom: '10px',
    fontWeight: 500,
};

const formInputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(42,37,32,0.22)',
    padding: '12px 0',
    fontSize: '15px',
    color: INK,
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 300,
    transition: 'border-color 0.3s ease',
};
