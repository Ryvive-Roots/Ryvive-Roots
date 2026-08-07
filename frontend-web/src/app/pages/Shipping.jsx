import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MapPin, CalendarClock, Truck, Salad, ShieldCheck, ArrowLeft } from "lucide-react";
import { CREAM, CREAM_2, INK, SAGE_DARK } from "../theme";

// ─── Theme Tokens (kept identical to Dashboard1 / PrivacyPolicy / TermsAndConditions) ─
const GOLD_LIGHT  = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";

// ─── Policy Content (mirrors the source document's own 1 / 2 / 3 / 4 numbering) ─────
const SECTIONS = [
  {
    icon: MapPin,
    title: "Delivery Locations",
    paragraphs: [
      "Ryvive Roots LLP currently provides delivery services within a radius of ten (10) kilometers from its café location, subject to route serviceability, operational feasibility, and delivery partner availability.",
    ],
  },
  {
    icon: CalendarClock,
    title: "Delivery Schedule",
    paragraphs: [
      "Delivery slot and delivery location selection is completed by the Customer at the time of initiating the subscription plan. The Customer may request a change in delivery location and/or delivery slot only on a weekly basis. Such requests must be submitted exclusively on Saturdays, on or before 5:00 PM, by emailing customersupport@ryviveroots.com. Any approved change shall be applicable for the immediately following subscription week only. Requests received after the stipulated timeline shall not be considered.",
      "The Customer is required to ensure availability at the registered delivery address during the assigned delivery window.",
    ],
  },
  {
    icon: Truck,
    title: "Delivery Conditions",
    paragraphs: [
      "The Customer is required to ensure availability at the registered delivery address during the assigned delivery window.",
      "In case of customer unavailability, incorrect address, unreachable contact number, or refusal to accept delivery, the order shall be treated as delivered and shall not be eligible for any refund or redelivery.",
      "Delays due to traffic, weather conditions, government restrictions, or unforeseen operational circumstances shall not entitle the Customer to any refund or compensation.",
    ],
  },
  {
    icon: Salad,
    title: "Fresh Food Disclaimer",
    paragraphs: [
      "All meals are freshly prepared and intended for immediate consumption.",
      "Ryvive Roots LLP shall not be responsible for any deterioration in food quality caused by delayed consumption, improper storage, or mishandling by the Customer after delivery.",
    ],
  },
];



// ─── Page ───────────────────────────────────────────────────────────────────────
export default function ShippingDeliveryPolicy() {
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
            Shipping & Delivery Policy
          </motion.h1>
          <p style={{ fontSize: ".95rem", color: "rgba(42,37,32,0.68)", maxWidth: 640, lineHeight: 1.75, marginBottom: ".75rem" }}>
            This policy explains where and how Ryvive Roots LLP delivers, how delivery slots and locations
            can be changed, and what to expect around freshness and delivery timing.
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
                  transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.2) }}
                  className="policy-card"
                  style={{ ...card, padding: "1.5rem 1.75rem", display: "flex", gap: "1.25rem" }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, background: CREAM_2, border: `1px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} color={SAGE_DARK} strokeWidth={1.5} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-baseline gap-2 mb-3 flex-wrap">
                      <span style={{ ...labelStyle, color: "rgba(42,37,32,0.35)" }}>{String(idx + 1).padStart(2, "0")}</span>
                      <h3 className="font-serif" style={{ margin: 0, color: INK, fontSize: "1.15rem", fontWeight: 400 }}>
                        {section.title}
                      </h3>
                    </div>

                    <div style={{ display: "grid", gap: "0.65rem" }}>
                      {section.paragraphs.map((p, i) => (
                        <p key={i} style={{ margin: 0, color: "rgba(42,37,32,0.68)", fontSize: ".9rem", lineHeight: 1.75 }}>
                          {p}
                        </p>
                      ))}
                    </div>
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
              For delivery slot or location change requests, email us at{" "}
              <strong>customersupport@ryviveroots.com</strong> on or before 5:00 PM on Saturday, or call
              +91&nbsp;97656&nbsp;00701.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}