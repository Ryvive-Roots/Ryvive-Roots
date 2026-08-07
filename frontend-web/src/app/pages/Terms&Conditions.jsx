import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ShieldCheck, Utensils, Repeat, CreditCard, Gift, UserCheck, Ban,
  PauseCircle, HeartPulse, Leaf, MessageSquare, Radio, SlidersHorizontal,
  PowerOff, Copyright, CloudLightning, Scale, Puzzle, FileCheck, ArrowLeft,
} from "lucide-react";
import { CREAM, CREAM_2, INK, SAGE_DARK } from "../theme";

// ─── Theme Tokens (kept identical to Dashboard1 / PrivacyPolicy) ─────────────
const GOLD_LIGHT  = "#fffdf0";
const CARD_BORDER = "rgba(42,37,32,0.06)";

// ─── Policy Content ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    icon: ShieldCheck,
    title: "Privacy Policy",
    body: "RYVIVE ROOTS is committed to protecting customer privacy. We collect personal information including name, contact details, delivery address, date of birth, disclosed allergies or medical conditions, subscription preferences, and order history solely for service fulfilment and communication purposes. Payments are securely processed through Easebuzz, and RYVIVE ROOTS does not store any banking or card details. Customer data is shared only with essential service partners or when required by applicable law.",
  },
  {
    icon: Utensils,
    title: "Services Offered",
    body: "RYVIVE ROOTS provides healthy food and beverage options, including soups, salads, sandwiches, wraps, chaat, pasta, and fresh juices, through one-time orders and subscription-based services.",
  },
  {
    icon: Repeat,
    title: "Subscription Plans",
    body: "Subscriptions are billed monthly in advance and are non-transferable. Once activated, subscriptions are non-cancellable except in cases where service is unavailable from RYVIVE ROOTS. Subscriptions are valid only for the registered customer and the registered delivery address. Missed deliveries due to customer unavailability or incorrect details are not eligible for compensation, refunds, or replacements.",
  },
  {
    icon: CreditCard,
    title: "Pricing & Payments",
    body: "All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely via Easebuzz. Failed, delayed, or unsuccessful payments may result in temporary suspension or cancellation of services.",
  },
  {
    icon: Gift,
    title: "Offers & Benefits",
    body: "Offers and benefits may vary by city, location, and participating partners and are subject to specific terms, validity periods, and availability.",
    bullets: [
      "Available only on RYVIVE ROOTS platforms",
      "Non-transferable and non-cashable",
      "Not combinable with other promotions",
      "Subject to modification or withdrawal without prior notice",
      "Valid only for eligible subscribed users and selected locations",
    ],
  },
  {
    icon: UserCheck,
    title: "User Responsibilities",
    body: "Customers agree to provide accurate and complete information, ensure availability at the delivery location, disclose any allergies or medical conditions in advance, follow food storage and consumption guidelines, and use the services lawfully and respectfully.",
  },
  {
    icon: Ban,
    title: "Prohibited Uses",
    body: "Users shall not use RYVIVE ROOTS services for:",
    bullets: [
      "Any unlawful or fraudulent purpose",
      "Reselling or redistributing meals or subscriptions",
      "Providing false information or impersonation",
      "Interfering with service operations",
      "Violating applicable laws or regulations",
    ],
    footnote: "Violation of these terms may result in immediate suspension or termination of services without refund.",
  },
  {
    icon: PauseCircle,
    title: "Pause / Hold Policy",
    body: "Subscriptions may be paused up to two (2) times per month for the Gold plan and up to three (3) times per month for the Platinum plan. Each pause may be taken for a minimum of one (1) day and a maximum of fifteen (15) days. Pause requests must be submitted at least one (1) day in advance, no later than 5:00 PM on the previous day. Same-day pause requests are not permitted. All paused days will be adjusted at the end of the subscription period, and no refunds will be provided for paused days.",
  },
  {
    icon: HeartPulse,
    title: "Food Safety & Health Disclaimer",
    body: "Food is prepared following standard hygiene and safety practices; however, allergen-free meals cannot be guaranteed. RYVIVE ROOTS shall not be liable for adverse reactions resulting from undisclosed allergies or medical conditions. Meals are not intended to diagnose, treat, cure, or prevent any medical condition.",
  },
  {
    icon: Leaf,
    title: "Natural Food Variation Disclaimer",
    body: "Due to the use of fresh and natural ingredients, variations in taste, texture, portion size, and appearance may occur and shall not qualify for refunds or replacements.",
  },
  {
    icon: MessageSquare,
    title: "Complaint & Feedback Policy",
    body: "Complaints related to food quality, packaging, or delivery must be reported within twenty-four (24) hours of delivery. Complaints raised after this period may not be considered. RYVIVE ROOTS reserves the right to verify all complaints.",
  },
  {
    icon: Radio,
    title: "Operational & Communication Policy",
    body: "RYVIVE ROOTS may assign delivery personnel, coordinators, or service partners as required. All subscription-related communication must be conducted through official RYVIVE ROOTS communication channels only.",
  },
  {
    icon: SlidersHorizontal,
    title: "Service Modifications",
    body: "RYVIVE ROOTS reserves the right to modify menus, pricing, delivery schedules, or services due to operational requirements without prior notice.",
  },
  {
    icon: PowerOff,
    title: "Service Suspension / Termination",
    body: "Services may be suspended or terminated without refund in cases of abusive behaviour, repeated misuse of policies, provision of false information, or violation of these Terms & Conditions.",
  },
  {
    icon: Copyright,
    title: "Intellectual Property",
    body: "All content, branding, logos, images, packaging, and materials are the intellectual property of RYVIVE ROOTS and may not be copied, reproduced, or used without prior written authorization.",
  },
  {
    icon: CloudLightning,
    title: "Force Majeure",
    body: "RYVIVE ROOTS shall not be liable for service delays or failures caused by events beyond reasonable control, including but not limited to natural disasters, government actions, strikes, pandemics, or transportation disruptions.",
  },
  {
    icon: Scale,
    title: "Limitation of Liability",
    body: "To the maximum extent permitted by law, RYVIVE ROOTS shall not be liable for any indirect, incidental, or consequential damages. Liability, if any, shall be limited to the subscription amount paid by the customer.",
  },
  {
    icon: Puzzle,
    title: "Severability",
    body: "If any provision of these Terms & Conditions is held to be invalid or unenforceable, the remaining provisions shall continue to remain in full force and effect.",
  },
  {
    icon: FileCheck,
    title: "Acceptance of Terms",
    body: "By subscribing to or using RYVIVE ROOTS services, customers confirm that they have read, understood, and agreed to these Terms & Conditions.",
  },
];



// ─── Page ───────────────────────────────────────────────────────────────────────
export default function TermsAndConditions() {
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
            <ArrowLeft size={13} strokeWidth={1.6} /> Back
          </Link>
          <div className="tracking-[0.42em] uppercase mb-4" style={{ fontSize: "10px", color: SAGE_DARK, fontWeight: 600 }}>
            — Legal
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="font-serif"
            style={{ fontSize: "clamp(32px,5vw,52px)", color: INK, fontWeight: 300, marginBottom: "1rem" }}
          >
            Terms & Conditions
          </motion.h1>
          <p style={{ fontSize: ".95rem", color: "rgba(42,37,32,0.68)", maxWidth: 640, lineHeight: 1.75, marginBottom: ".75rem" }}>
            These Terms & Conditions govern your use of RYVIVE ROOTS services, including one-time orders and
            subscription plans. By subscribing to or using our services, you agree to be bound by the terms set
            out below.
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
                  transition={{ duration: 0.45, delay: Math.min(idx * 0.015, 0.2) }}
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
                    {section.bullets && (
                      <ul style={{ listStyle: "none", margin: ".75rem 0 0 0", padding: 0 }}>
                        {section.bullets.map((b) => (
                          <li
                            key={b}
                            style={{ display: "flex", alignItems: "flex-start", gap: ".55rem", marginBottom: ".4rem", fontSize: ".85rem", color: "rgba(42,37,32,0.62)", lineHeight: 1.6 }}
                          >
                            <span style={{ color: SAGE_DARK, marginTop: "1px", flexShrink: 0 }}>—</span> {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.footnote && (
                      <p style={{ margin: ".75rem 0 0 0", color: "#8b6914", fontSize: ".82rem", lineHeight: 1.65, fontWeight: 500 }}>
                        {section.footnote}
                      </p>
                    )}
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
              RYVIVE ROOTS reserves the right to update these Terms & Conditions at any time. Changes take
              effect immediately after being posted or notified. Questions? Reach us at{" "}
              <strong>customersupport@ryviveroots.com</strong> or +91&nbsp;97656&nbsp;00701.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}