import { useState, useEffect } from "react";

// ---- Brand tokens (Ryvive Roots) ----
const GREEN_DARK = "#2d5016";
const GREEN = "#3d6b1f";
const GOLD = "#d4af37";
const CREAM = "#faf7f0";

const TODAY = () => new Date().toISOString().split("T")[0];

const addDays = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ---- Seed data (replace with real client list / wire to your existing dashboard) ----
const SEED_CLIENTS = [
  { id: "c1", name: "Ritika Shah", plan: "Platinum", totalDays: 30, startDate: "2026-07-01" },
  { id: "c2", name: "Aman Verma", plan: "Gold", totalDays: 30, startDate: "2026-07-01" },
  { id: "c3", name: "Priya Nair", plan: "Silver", totalDays: 30, startDate: "2026-07-03" },
  { id: "c4", name: "Karan Mehta", plan: "Platinum", totalDays: 90, startDate: "2026-06-15" },
  { id: "c5", name: "Sneha Iyer", plan: "Gold", totalDays: 30, startDate: "2026-07-05" },
  { id: "c6", name: "Yashwant Rao", plan: "Silver", totalDays: 30, startDate: "2026-07-01" },
];

function seedState() {
  const clients = {};
  SEED_CLIENTS.forEach((c) => {
    clients[c.id] = {
      ...c,
      consumedDays: 0,
      extensionDays: 0,
      deliveredDates: {}, // { '2026-07-13': true }
      extensionLog: [], // [{date, reason, addedDays}]
    };
  });
  return clients;
}

export default function RyviveDeliveryAdmin() {
  const [clients, setClients] = useState(null); // null = loading
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("daily"); // daily | extend | overview
  const [toast, setToast] = useState(null);

  // Daily delivery form state
  const [deliveryDate, setDeliveryDate] = useState(TODAY());
  const [checkedClients, setCheckedClients] = useState({});

  // Non-delivery / extension form state
  const [extendDate, setExtendDate] = useState(TODAY());
  const [reason, setReason] = useState("");
  const [affectAll, setAffectAll] = useState(true);
  const [selectedForExtend, setSelectedForExtend] = useState({});

  // ---- Load from persistent storage ----
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("ryvive-clients", false);
        if (result && result.value) {
          setClients(JSON.parse(result.value));
        } else {
          const seeded = seedState();
          setClients(seeded);
          await window.storage.set("ryvive-clients", JSON.stringify(seeded), false);
        }
      } catch (e) {
        const seeded = seedState();
        setClients(seeded);
        try {
          await window.storage.set("ryvive-clients", JSON.stringify(seeded), false);
        } catch (_) {}
      }
    })();
  }, []);

  const persist = async (next) => {
    setClients(next);
    setSaving(true);
    try {
      await window.storage.set("ryvive-clients", JSON.stringify(next), false);
    } catch (e) {
      console.error("Storage save failed", e);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  if (!clients) {
    return (
      <div style={{ padding: 40, fontFamily: "Inter, sans-serif", color: GREEN_DARK }}>
        Loading client data…
      </div>
    );
  }

  const clientList = Object.values(clients);

  // Remaining days = total plan days - days actually consumed (delivered)
  const remainingDays = (c) => Math.max(c.totalDays - c.consumedDays, 0);

  // End date = start + total plan days + all extension days granted
  const endDate = (c) => addDays(c.startDate, c.totalDays + c.extensionDays - 1);

  const status = (c) => {
    const rem = remainingDays(c);
    if (rem <= 0) return { label: "Completed", color: "#9ca3af" };
    if (rem <= 3) return { label: "Ending soon", color: "#c2410c" };
    return { label: "Active", color: GREEN };
  };

  // ---- Handler: submit daily delivery log ----
  const submitDelivery = async () => {
    const ids = Object.keys(checkedClients).filter((id) => checkedClients[id]);
    if (ids.length === 0) {
      showToast("Select at least one client who received delivery.");
      return;
    }
    const next = { ...clients };
    let skipped = 0;
    ids.forEach((id) => {
      const c = { ...next[id] };
      if (c.deliveredDates[deliveryDate]) {
        skipped += 1;
        return;
      }
      c.deliveredDates = { ...c.deliveredDates, [deliveryDate]: true };
      c.consumedDays = c.consumedDays + 1;
      next[id] = c;
    });
    await persist(next);
    setCheckedClients({});
    showToast(
      skipped > 0
        ? `Delivery logged. ${skipped} client(s) already had an entry for ${fmt(deliveryDate)}, skipped.`
        : `Delivery logged for ${ids.length} client(s) on ${fmt(deliveryDate)}.`
    );
  };

  // ---- Handler: apply non-delivery / red-alert extension ----
  const applyExtension = async () => {
    const ids = affectAll
      ? clientList.map((c) => c.id)
      : Object.keys(selectedForExtend).filter((id) => selectedForExtend[id]);

    if (ids.length === 0) {
      showToast("Select at least one client, or choose 'All clients'.");
      return;
    }
    if (!reason.trim()) {
      showToast("Add a short reason (e.g. Red alert / weather).");
      return;
    }

    const next = { ...clients };
    let skipped = 0;
    ids.forEach((id) => {
      const c = { ...next[id] };
      const alreadyLogged = c.extensionLog.some((e) => e.date === extendDate);
      if (alreadyLogged) {
        skipped += 1;
        return;
      }
      c.extensionDays = c.extensionDays + 1;
      c.extensionLog = [
        ...c.extensionLog,
        { date: extendDate, reason: reason.trim(), addedDays: 1 },
      ];
      next[id] = c;
    });
    await persist(next);
    setReason("");
    setSelectedForExtend({});
    showToast(
      skipped > 0
        ? `Extension applied. ${skipped} client(s) already had an entry for ${fmt(extendDate)}, skipped.`
        : `${fmt(extendDate)} marked as non-delivery for ${ids.length} client(s). Their end date moved by 1 day.`
    );
  };

  const tabs = [
    { key: "daily", label: "Daily Delivery Log" },
    { key: "extend", label: "Non-Delivery / Extension" },
    { key: "overview", label: "Client Overview" },
  ];

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        background: CREAM,
        minHeight: "100%",
        padding: "24px 20px 60px",
        color: "#1f2a1a",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 1.5, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>
            Ryvive Roots · Admin
          </div>
          <h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: GREEN_DARK }}>
            Delivery & Subscription Tracker
          </h1>
        </div>
        <div style={{ fontSize: 12, color: saving ? GOLD : "#7a8a6f", fontWeight: 600 }}>
          {saving ? "Saving…" : "All changes saved"}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            background: GREEN_DARK,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `2px solid #e5e0d0`, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: tab === t.key ? GREEN_DARK : "#8a9080",
              borderBottom: tab === t.key ? `2px solid ${GREEN_DARK}` : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- DAILY DELIVERY TAB ---- */}
      {tab === "daily" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 13, color: "#5b6152", marginTop: 0, marginBottom: 16 }}>
            Mark who received their delivery today. Each checked client gets +1 consumed day, and their remaining days update automatically.
          </p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK, display: "block", marginBottom: 6 }}>
              Delivery date
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d9d4c2", fontSize: 14 }}
            />
          </div>

          <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
            {clientList.map((c) => {
              const already = !!c.deliveredDates[deliveryDate];
              return (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: already ? "#f2f6ec" : "#faf9f5",
                    border: "1px solid #ece7d8",
                    opacity: already ? 0.65 : 1,
                    cursor: already ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    disabled={already}
                    checked={!!checkedClients[c.id]}
                    onChange={(e) =>
                      setCheckedClients({ ...checkedClients, [c.id]: e.target.checked })
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#8a9080" }}>
                      {c.plan} · {remainingDays(c)} days left
                    </div>
                  </div>
                  {already && (
                    <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Already logged</span>
                  )}
                </label>
              );
            })}
          </div>

          <button
            onClick={submitDelivery}
            style={{
              background: GREEN_DARK,
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save delivery log
          </button>
        </div>
      )}

      {/* ---- NON-DELIVERY / EXTENSION TAB ---- */}
      {tab === "extend" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 13, color: "#5b6152", marginTop: 0, marginBottom: 16 }}>
            Use this when delivery couldn't go out for a reason like a red alert or weather. Selected clients' end date pushes forward by 1 day automatically — nobody loses a day of their plan.
          </p>

          <div style={{ display: "grid", gap: 14, marginBottom: 16, maxWidth: 420 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK, display: "block", marginBottom: 6 }}>
                Non-delivery date
              </label>
              <input
                type="date"
                value={extendDate}
                onChange={(e) => setExtendDate(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d9d4c2", fontSize: 14, width: "100%" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: GREEN_DARK, display: "block", marginBottom: 6 }}>
                Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Red alert – heavy rain"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d9d4c2", fontSize: 14, width: "100%" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: GREEN_DARK }}>
              <input
                type="checkbox"
                checked={affectAll}
                onChange={(e) => setAffectAll(e.target.checked)}
              />
              Apply to all clients
            </label>
          </div>

          {!affectAll && (
            <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
              {clientList.map((c) => (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "#faf9f5",
                    border: "1px solid #ece7d8",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedForExtend[c.id]}
                    onChange={(e) =>
                      setSelectedForExtend({ ...selectedForExtend, [c.id]: e.target.checked })
                    }
                  />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#8a9080" }}>({c.plan})</div>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={applyExtension}
            style={{
              background: GOLD,
              color: "#2d240a",
              border: "none",
              padding: "10px 22px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: affectAll ? 8 : 0,
            }}
          >
            Apply extension
          </button>
        </div>
      )}

      {/* ---- OVERVIEW TAB ---- */}
      {tab === "overview" && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: GREEN_DARK, borderBottom: `2px solid #ece7d8` }}>
                <th style={{ padding: "8px 10px" }}>Client</th>
                <th style={{ padding: "8px 10px" }}>Plan</th>
                <th style={{ padding: "8px 10px" }}>Total Days</th>
                <th style={{ padding: "8px 10px" }}>Consumed</th>
                <th style={{ padding: "8px 10px" }}>Remaining</th>
                <th style={{ padding: "8px 10px" }}>Extension</th>
                <th style={{ padding: "8px 10px" }}>End Date</th>
                <th style={{ padding: "8px 10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clientList.map((c) => {
                const s = status(c);
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f2f0e6" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: "8px 10px" }}>{c.plan}</td>
                    <td style={{ padding: "8px 10px" }}>{c.totalDays}</td>
                    <td style={{ padding: "8px 10px" }}>{c.consumedDays}</td>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: GREEN }}>{remainingDays(c)}</td>
                    <td style={{ padding: "8px 10px" }}>
                      {c.extensionDays > 0 ? `+${c.extensionDays} day${c.extensionDays > 1 ? "s" : ""}` : "—"}
                    </td>
                    <td style={{ padding: "8px 10px" }}>{fmt(endDate(c))}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 14, color: GREEN_DARK, marginBottom: 8 }}>Extension history</h3>
            {clientList.every((c) => c.extensionLog.length === 0) && (
              <div style={{ fontSize: 13, color: "#8a9080" }}>No extensions logged yet.</div>
            )}
            {clientList.map(
              (c) =>
                c.extensionLog.length > 0 && (
                  <div key={c.id} style={{ marginBottom: 8, fontSize: 13 }}>
                    <strong>{c.name}:</strong>{" "}
                    {c.extensionLog
                      .map((e) => `${fmt(e.date)} (${e.reason})`)
                      .join(", ")}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
