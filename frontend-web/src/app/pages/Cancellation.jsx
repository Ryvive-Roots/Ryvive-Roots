import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Ban, Wallet, ShieldCheck, ArrowLeft } from "lucide-react";
import { CREAM, CREAM_2, INK, SAGE_DARK } from "../theme";

// ─── Theme Tokens (kept identical to Dashboard1 / PrivacyPolicy / TermsAndConditions) ─
const GOLD_LIGHT  = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";

// ─── Policy Content (mirrors the source document's own 1 / 1.1 / 1.2… numbering) ────
const SECTIONS = [
  {
    icon: Ban,
    title: "Cancellation",
    clauses: [
      {
        num: "1.1",
        text: "All subscription plans and one-time orders placed with Ryvive Roots LLP are non-cancellable once payment has been successfully completed.",
      },
      {
        num: "1.2",
        text: "Subscription plans are billed in advance and shall be deemed activated after forty-eight (48) hours from the confirmation of successful payment.",
      },
      {
        num: "1.3",
        text: "Once a subscription is activated, the Customer shall not be entitled to cancel, transfer, suspend, or terminate the subscription.",
      },
      {
        num: "1.4",
        text: "Missed or unsuccessful deliveries resulting from customer unavailability, incorrect or incomplete delivery address, incorrect contact details, refusal to accept delivery, or absence at the registered delivery location shall be considered as successfully fulfilled deliveries and shall not be eligible for any refund, replacement, or compensation.",
      },
    ],
  },
  {
    icon: Wallet,
    title: "Refund",
    clauses: [
      {
        num: "2.1",
        text: "Refunds shall be considered only under the following limited circumstances:",
        bullets: [
          "Duplicate payment made for the same order",
          "Amount debited but the order was not successfully placed",
          "Inability of Ryvive Roots LLP to provide the subscribed service",
          "Delivery of an incorrect item, subject to verification",
          "Valid quality-related complaints raised within 24 hours of delivery and verified by Ryvive Roots LLP",
        ],
      },
      {
        num: "2.2",
        text: "Refunds shall not be provided for the following:",
        bullets: [
          "Partial consumption of meals or products",
          "Early discontinuation or non-utilization of subscription plans",
          "Paused days within a subscription",
          "Natural variations in taste, texture, appearance, or portion size",
          "Complaints raised after the stipulated complaint window",
        ],
      },
      {
        num: "2.3",
        text: "All approved refunds shall be processed within seven (7) to ten (10) business days to the original mode of payment through EaseBuzz, subject to banking timelines.",
      },
    ],
  },
];


// ─── Page ───────────────────────────────────────────────────────────────────────
export default function CancellationRefundPolicy() {
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
            Cancellation & Refund Policy
          </motion.h1>
          <p style={{ fontSize: ".95rem", color: "rgba(42,37,32,0.68)", maxWidth: 640, lineHeight: 1.75, marginBottom: ".75rem" }}>
            This policy explains when subscriptions and orders can be cancelled, and the limited
            circumstances under which a refund is available for services provided by Ryvive Roots LLP.
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

                    <div style={{ display: "grid", gap: "0.9rem" }}>
                      {section.clauses.map((clause) => (
                        <div key={clause.num}>
                          <p style={{ margin: 0, color: "rgba(42,37,32,0.68)", fontSize: ".9rem", lineHeight: 1.75 }}>
                            <span style={{ color: SAGE_DARK, fontWeight: 600, marginRight: ".5rem" }}>{clause.num}</span>
                            {clause.text}
                          </p>
                          {clause.bullets && (
                            <ul style={{ listStyle: "none", margin: ".6rem 0 0 1.65rem", padding: 0 }}>
                              {clause.bullets.map((b) => (
                                <li
                                  key={b}
                                  style={{ display: "flex", alignItems: "flex-start", gap: ".55rem", marginBottom: ".4rem", fontSize: ".85rem", color: "rgba(42,37,32,0.62)", lineHeight: 1.6 }}
                                >
                                  <span style={{ color: SAGE_DARK, marginTop: "1px", flexShrink: 0 }}>—</span> {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
              For refund or cancellation queries, reach us at{" "}
              <strong>customersupport@ryviveroots.com</strong> or +91&nbsp;97656&nbsp;00701.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}