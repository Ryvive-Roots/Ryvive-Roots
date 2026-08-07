import { useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ShieldCheck, CreditCard, Cpu, Target, Share2, Lock,
  Cookie, UserCheck, Archive, ExternalLink, RefreshCw, ArrowLeft,
} from "lucide-react";
import { CREAM, CREAM_2, INK, SAGE_DARK } from "../theme";

// ─── Theme Tokens (kept identical to Dashboard1) ──────────────────────────────
const GOLD        = "#d4af37";
const GOLD_LIGHT  = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";

// ─── Policy Content ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "Information We Collect",
    body: "We may collect personal information such as name, contact details, delivery address, date of birth, subscription details, order history, and any dietary preferences or allergies you disclose to us.",
  },
  {
    icon: CreditCard,
    title: "Payment Information",
    body: "All payments are processed securely through Easebuzz. Ryvive Roots does not store, process, or retain any card details, UPI IDs, banking credentials, or wallet information.",
  },
  {
    icon: Cpu,
    title: "Technical & Usage Information",
    body: "We may collect technical information such as IP address, browser type, device details, and website usage data through cookies or analytics tools.",
  },
  {
    icon: Target,
    title: "Purpose of Data Collection",
    body: "Information is collected solely for order processing, subscription management, delivery coordination, customer support, grievance handling, internal analytics, and legal or regulatory compliance.",
  },
  {
    icon: Share2,
    title: "Disclosure of Information",
    body: "User data may be shared only with delivery partners, service providers, payment gateways, or legal authorities when required by law. We do not sell or trade personal data.",
  },
  {
    icon: Lock,
    title: "Data Security",
    body: "We implement reasonable security practices to protect personal data from unauthorized access, misuse, or disclosure. However, no digital system is completely secure.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    body: "Our website may use cookies to enhance user experience and analyze traffic. You may disable cookies through your browser settings, though some features may not function properly.",
  },
  {
    icon: UserCheck,
    title: "User Obligations",
    body: "Users must provide accurate information, update details when required, disclose allergies responsibly, and ensure availability at the delivery address.",
  },
  {
    icon: Archive,
    title: "Data Retention",
    body: "Personal data is retained only as long as necessary for service delivery, legal compliance, dispute resolution, and to send marketing communications or offers.",
  },
  {
    icon: ExternalLink,
    title: "Third-Party Links",
    body: "Our website may contain links to third-party websites. Ryvive Roots is not responsible for their privacy practices or content.",
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    body: "We reserve the right to amend or update this Privacy Policy at any time. Any changes will be communicated to customers and will become effective 48 hours after being posted on this page.",
  },
];



// ─── Page ───────────────────────────────────────────────────────────────────────
export default function PrivacyPolicy() {
  useEffect(() => {
    const cards = document.querySelectorAll(".policy-card");
    if (cards && cards.length) {
      gsap.from(cards, { y: 14, opacity: 0, stagger: 0.045, duration: 0.7, ease: "power2.out" });
    }
  }, []);

  const labelStyle = { fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", color: SAGE_DARK, fontWeight: 600 };
  const card = { background: CREAM, borderRadius: "4px", border: `1px solid ${CARD_BORDER}`, boxShadow: "0 1px 8px rgba(42,37,32,0.03)" };

  return (
    <div className="min-h-screen policy-root" style={{ background: CREAM_2 }} data-tone="light">
      <style>{`
        .policy-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-weight:300; letter-spacing: 0.01em; color: ${INK}; }
        .policy-root .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight:300; letter-spacing: 0.005em; }
        .policy-card { position: relative; transition: transform .28s ease, box-shadow .3s ease; }
        .policy-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(26,22,19,0.05); }
        .policy-back { transition: transform .2s ease, color .2s ease; }
        .policy-back:hover { transform: translateX(-3px); color: ${INK}; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: GOLD_LIGHT, borderBottom: `1px solid ${CARD_BORDER}`, paddingTop: "72px" }}>
        <div className="max-w-[960px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
          <Link
            to="/"
            className="policy-back inline-flex items-center gap-2 mb-8"
            style={{ fontSize: "11px", color: "rgba(42,37,32,0.5)", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            <ArrowLeft size={13} strokeWidth={1.6} /> Back to Ryvive Roots
          </Link>
          <div className="tracking-[0.42em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE_DARK, fontWeight: 600 }}>
            — Legal
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-serif"
            style={{ fontSize: "clamp(32px,5vw,52px)", color: INK, fontWeight: 300, marginBottom: "1rem" }}
          >
            Privacy Policy
          </motion.h1>
          <p style={{ fontSize: ".95rem", color: "rgba(42,37,32,0.68)", maxWidth: 640, lineHeight: 1.75, marginBottom: ".75rem" }}>
            Ryvive Roots is committed to safeguarding the privacy of its users. This policy describes how we
            collect, use, disclose, and protect your information when you access our website, place orders, or
            use our services. By accessing or using our website or services, you agree to the collection and use
            of information in accordance with this Privacy Policy.
          </p>
          
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <main className="px-5 sm:px-8 lg:px-12 py-14 lg:py-16">
        <div className="max-w-[960px] mx-auto w-full">
          <div style={{ display: "grid", gap: "1.1rem" }}>
            {SECTIONS.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: Math.min(idx * 0.02, 0.2) }}
                  className="policy-card"
                  style={{ ...card, padding: "1.5rem 1.75rem", display: "flex", gap: "1.25rem" }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, background: CREAM_2, border: `1px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} color={SAGE_DARK} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                      <span style={{ ...labelStyle, color: "rgba(42,37,32,0.35)" }}>{String(idx + 1).padStart(2, "0")}</span>
                      <h3 className="font-serif" style={{ margin: 0, color: INK, fontSize: "1.15rem", fontWeight: 400 }}>
                        {section.title}
                      </h3>
                    </div>
                    <p style={{ margin: 0, color: "rgba(42,37,32,0.68)", fontSize: ".9rem", lineHeight: 1.75 }}>
                      {section.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Closing note */}
          <div
            className="flex items-start gap-3 px-6 py-5 mt-6"
            style={{ background: "rgba(139,149,121,0.08)", border: `1px solid rgba(139,149,121,0.18)` }}
          >
            <ShieldCheck size={17} color={SAGE_DARK} style={{ flexShrink: 0, marginTop: "2px" }} />
            <p style={{ margin: 0, fontSize: ".85rem", color: SAGE_DARK, lineHeight: 1.7 }}>
              Questions about this policy or how your data is handled? Reach us at{" "}
              <strong>customersupport@ryviveroots.com</strong> or +91&nbsp;97656&nbsp;00701.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}