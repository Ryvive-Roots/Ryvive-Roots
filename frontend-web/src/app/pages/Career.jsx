import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CREAM, CREAM_2, DARK, DARK_2, INK, SAGE, SAGE_DARK } from '../theme';
import CareerBg from '../images/Career-hero.jpg';
import emailjs from "@emailjs/browser";

const ease = [0.22, 1, 0.36, 1];
const jobCategories = [
    'Graphic Designer',
    'Management',
    'Sales Executive',
    'Head Chef',
    'Server',
    'Cashier',
    'Restaurant Manager',
    'Delivery Executive',
    'Kitchen Helper',
];
const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(42,37,32,0.22)`,
    padding: '14px 2px',
    fontSize: '15px',
    color: INK,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
};
const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: SAGE_DARK,
    marginBottom: '6px',
    fontWeight: 600,
};
function FieldWrapper({ children }) {
    return (<div style={{ position: 'relative' }} onFocusCapture={(e) => {
            const input = e.currentTarget.querySelector('input, select, textarea');
            if (input)
                input.style.borderBottomColor = SAGE_DARK;
        }} onBlurCapture={(e) => {
            const input = e.currentTarget.querySelector('input, select, textarea');
            if (input)
                input.style.borderBottomColor = 'rgba(42,37,32,0.22)';
        }}>
      {children}
    </div>);
}
export default function Career() {
    const formRef = useRef();
    const fileRef = useRef();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        category: '',
        experience: '',
        resume: null,
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const onChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
    };
    const onFileChange = (file) => {
        if (file && file.type === 'application/pdf') {
            setForm((s) => ({ ...s, resume: file }));
        }
    };
    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        onFileChange(file ?? null);
    };

    const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    "ryviveroots_candidate-resume_website"
  );

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dinb2vv9u/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  return data.secure_url;
};

   const onSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    let resumeUrl = "";

    if (form.resume) {
      resumeUrl = await uploadResume(form.resume);
    }

    await emailjs.send(
      "service_5on2fww",
      "template_9jof6ig",
      {
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        experience: form.experience,
        job_category: form.category,
        message: form.message,
        resume_url: resumeUrl,
      },
      "3AfFnBmZMg4f0Kq0I"
    );

    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Failed to submit application");
  } finally {
    setLoading(false);
  }
};

    return (<div style={{ background: CREAM }} className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden text-center" style={{ minHeight: '88vh', background: DARK_2 }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <ImageWithFallback src={CareerBg} alt="Ryvive Roots team at work" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}/>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(20,17,15,0.46) 0%, rgba(20,17,15,0.54) 40%, rgba(20,17,15,0.96) 100%)',
        }}/>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-14 w-full pt-36 pb-24 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }} className="flex flex-col items-center gap-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-sm" style={{
            border: `1px solid ${CREAM}`,
            fontSize: '10px',
            letterSpacing: '0.44em',
            textTransform: 'uppercase',
            color: CREAM,
            fontWeight: 600,
        }}>
              <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: CREAM,
            display: 'inline-block',
        }}/>
              Join Our Journey
            </div>

            {/* H1 */}
            <h1 className="font-serif" style={{
            fontSize: 'clamp(44px, 7vw, 100px)',
            lineHeight: 1.0,
            color: CREAM,
            fontWeight: 300,
            letterSpacing: '-0.02em',
            maxWidth: '860px',
        }}>
              Build Something{' '}
              <em style={{ fontStyle: 'italic', color: SAGE }}>Meaningful</em>
            </h1>

            {/* Sub */}
            <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            lineHeight: 1.85,
            color: 'rgba(244,239,230,0.66)',
            maxWidth: '480px',
        }}>
              Come grow with us at Ryvive Roots
            </p>

            {/* Scroll indicator */}
            <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} style={{ marginTop: '28px' }}>
              <div style={{
            width: '1px',
            height: '52px',
            background: `linear-gradient(180deg, ${SAGE} 0%, transparent 100%)`,
            margin: '0 auto',
            opacity: 0.7,
        }}/>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── INTRO BAND ──────────────────────────────────── */}
      <section data-tone="light" className="py-20 lg:py-28 text-center px-6" style={{ background: CREAM_2 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="max-w-[700px] mx-auto">
          <div className="tracking-[0.42em] uppercase mb-7" style={{ fontSize: '10px', color: SAGE_DARK, fontWeight: 600 }}>
            — Careers at Ryvive Roots
          </div>
          <h2 className="font-serif mb-7" style={{
            fontSize: 'clamp(28px, 3.6vw, 48px)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: INK,
        }}>
            A place where craft meets{' '}
            <em style={{ fontStyle: 'italic' }}>purpose.</em>
          </h2>
          <p style={{
            fontSize: '15px',
            lineHeight: 1.9,
            color: 'rgba(42,37,32,0.65)',
            maxWidth: '520px',
            margin: '0 auto',
        }}>
            We believe in nourishing people — both our guests and our team. If you share a
            devotion to quality, seasonality, and quiet excellence, we would love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* ── APPLICATION FORM ────────────────────────────── */}
      <section data-tone="light" className="px-5 sm:px-8 lg:px-14 pt-24 pb-32 lg:pb-40" style={{ background: CREAM }}>
        <div className="max-w-[860px] mx-auto">
          {/* Section heading */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="text-center mb-16 lg:mb-20">
            <div className="tracking-[0.42em] uppercase mb-6" style={{ fontSize: '10px', color: SAGE_DARK, fontWeight: 600 }}>
              — Open Application
            </div>
            <h2 className="font-serif mb-5" style={{
            fontSize: 'clamp(30px, 3.8vw, 52px)',
            fontWeight: 300,
            lineHeight: 1.08,
            color: INK,
        }}>
              Apply to{' '}
              <em style={{ fontStyle: 'italic' }}>join us.</em>
            </h2>
            <p style={{
            fontSize: '14px',
            lineHeight: 1.85,
            color: 'rgba(42,37,32,0.6)',
            maxWidth: '440px',
            margin: '0 auto',
        }}>
              Share your details below. Our team reviews every application with care and will be
              in touch within five working days.
            </p>
          </motion.div>

          {/* ── FORM / SUCCESS STATE ── */}
          <AnimatePresence mode="wait">
            {submitted ? (
        /* ── Success ── */
        <motion.div key="success" initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.65, ease }} className="text-center py-24 px-10" style={{
                background: CREAM_2,
                border: `1px solid ${SAGE}`,
                borderRadius: '3px',
            }}>
                <CheckCircle2 size={40} strokeWidth={1.2} color={SAGE_DARK} style={{ margin: '0 auto 24px' }}/>
                <div className="font-serif mb-4" style={{ fontSize: 'clamp(26px, 3vw, 38px)', color: INK, fontWeight: 300 }}>
                  Application received.
                </div>
                <p style={{
                fontSize: '14px',
                color: 'rgba(42,37,32,0.62)',
                lineHeight: 1.85,
                maxWidth: '380px',
                margin: '0 auto',
            }}>
                  Thank you for reaching out. We will review your application and write to you
                  shortly.
                </p>
              </motion.div>) : (
        /* ── Form ── */
        <motion.form
                key="form"
                ref={formRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.65, ease }}
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
              >
                {/* Full Name */}
                <FieldWrapper>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    required
                    name="full_name"
                    value={form.name}
                    onChange={onChange('name')}
                    placeholder="Your full name"
                    style={inputStyle}
                  />
                </FieldWrapper>

                {/* Email */}
                <FieldWrapper>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange('email')}
                    placeholder="you@email.com"
                    style={inputStyle}
                  />
                </FieldWrapper>

                {/* Phone */}
                <FieldWrapper>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange('phone')}
                    placeholder="+91 00000 00000"
                    style={inputStyle}
                  />
                </FieldWrapper>

                {/* Experience */}
                <FieldWrapper>
                  <label style={labelStyle}>Experience (Years)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="50"
                    name="experience"
                    value={form.experience}
                    onChange={onChange('experience')}
                    placeholder="e.g. 3"
                    style={inputStyle}
                  />
                </FieldWrapper>

                {/* Job Category */}
                <div className="md:col-span-2">
                  <FieldWrapper>
                    <label style={labelStyle}>Job Category</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        required
                        name="job_category"
                        value={form.category}
                        onChange={onChange('category')}
                        style={{
                          ...inputStyle,
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          cursor: 'pointer',
                          paddingRight: '32px',
                          color: form.category ? INK : 'rgba(42,37,32,0.4)',
                        }}
                      >
                        <option value="" disabled>Select a role</option>
                        {jobCategories.map((cat) => (
                          <option key={cat} value={cat} style={{ color: INK }}>{cat}</option>
                        ))}
                      </select>
                      {/* Chevron icon */}
                      <div style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: SAGE_DARK,
                      }}>
                        <Briefcase size={14} strokeWidth={1.4}/>
                      </div>
                    </div>
                  </FieldWrapper>
                </div>

                {/* Resume Upload */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>Upload Resume (PDF Only)</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    style={{
                      marginTop: '8px',
                      border: `1.5px dashed ${dragOver ? SAGE_DARK : 'rgba(42,37,32,0.22)'}`,
                      borderRadius: '3px',
                      padding: '32px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragOver ? 'rgba(139,149,121,0.06)' : 'transparent',
                      transition: 'border-color 0.3s, background 0.3s',
                    }}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      name="resume"
                      accept=".pdf"
                      required
                      style={{ display: 'none' }}
                      onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                    />
                    <Upload size={22} strokeWidth={1.3} color={SAGE_DARK} style={{ margin: '0 auto 12px' }}/>
                    {form.resume ? (
                      <div>
                        <div style={{ fontSize: '14px', color: INK, fontWeight: 500 }}>
                          {form.resume.name}
                        </div>
                        <div style={{ fontSize: '11px', color: SAGE_DARK, marginTop: '4px', letterSpacing: '0.12em' }}>
                          {(form.resume.size / 1024).toFixed(0)} KB · Click to replace
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '13px', color: 'rgba(42,37,32,0.65)' }}>
                          Drag your résumé here or{' '}
                          <span style={{ color: SAGE_DARK, textDecoration: 'underline' }}>browse</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(42,37,32,0.4)', marginTop: '6px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                          PDF only · Max 10 MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <FieldWrapper>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={onChange('message')}
                      placeholder="Tell us about yourself…"
                      style={{ ...inputStyle, resize: 'none', paddingTop: '16px', lineHeight: 1.75 }}
                    />
                  </FieldWrapper>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 mt-6">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.015, y: -2 } : undefined}
                    whileTap={!loading ? { scale: 0.98 } : undefined}
                    transition={{ duration: 0.3, ease }}
                    className="w-full flex items-center justify-center gap-4 tracking-[0.28em] uppercase"
                    style={{
                      fontSize: '11px',
                      padding: '20px 32px',
                      background: loading ? SAGE_DARK : INK,
                      color: CREAM,
                      border: `1px solid ${loading ? SAGE_DARK : INK}`,
                      borderRadius: '2px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                      boxShadow: '0 8px 28px -10px rgba(42,37,32,0.28)',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = '#895C40';
                        e.currentTarget.style.borderColor = '#895C40';
                        e.currentTarget.style.boxShadow = '0 14px 40px -10px rgba(137,92,64,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = INK;
                        e.currentTarget.style.borderColor = INK;
                        e.currentTarget.style.boxShadow = '0 8px 28px -10px rgba(42,37,32,0.28)';
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{
                            display: 'inline-block',
                            width: '14px',
                            height: '14px',
                            border: `1.5px solid rgba(244,239,230,0.3)`,
                            borderTopColor: CREAM,
                            borderRadius: '50%',
                          }}
                        />
                        Submitting…
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight size={14} strokeWidth={1.5}/>
                      </>
                    )}
                  </motion.button>
                  <p className="text-center mt-5" style={{
                    fontSize: '11px',
                    color: 'rgba(42,37,32,0.42)',
                    lineHeight: 1.7,
                    letterSpacing: '0.04em',
                  }}>
                    We respect your privacy. Your information is only used for recruitment purposes.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CLOSING QUOTE ───────────────────────────────── */}
      <section className="py-20 lg:py-28 text-center" style={{ background: DARK }}>
        <div className="max-w-[640px] mx-auto px-6">
          <p style={{
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            color: 'rgba(244,239,230,0.5)',
            lineHeight: 1.9,
            letterSpacing: '0.03em',
            fontStyle: 'italic',
        }}>
            "We grow slowly, intentionally — and we want people around our table who believe the
            same."
          </p>
          <div style={{
            width: '36px',
            height: '1px',
            background: SAGE,
            margin: '24px auto 0',
            opacity: 0.55,
        }}/>
        </div>
      </section>
    </div>);
}
