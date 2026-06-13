import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart,
  Area, AreaChart, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Treemap
} from "recharts";

// ── REAL DATA FROM EXCEL (PT Sarana Pertiwi Dummy Data V1) ──────────────────
const DATA = {
  retention: [
    { year: "2023", active: 8474, retained: 7608, churned: 866, retention_rate: 89.78, churn_rate: 10.22 },
    { year: "2024", active: 9134, retained: 6749, churned: 2385, retention_rate: 73.89, churn_rate: 26.11 },
    { year: "2025", active: 6749, retained: 4599, churned: 2150, retention_rate: 68.14, churn_rate: 31.86 },
  ],
  growth: [
    { year: "2023", customers: 8474, transactions: 27539, revenue: 752.6,  avg_trx: 27.3, rev_growth: null },
    { year: "2024", customers: 9134, transactions: 53893, revenue: 1477.4, avg_trx: 27.4, rev_growth: 96.3 },
    { year: "2025", customers: 6749, transactions: 38064, revenue: 1038.4, avg_trx: 27.3, rev_growth: -29.7 },
    { year: "2026", customers: 4599, transactions: 26611, revenue: 724.0,  avg_trx: 27.2, rev_growth: -30.3 },
  ],
  rfm_segments: [
    { segment: "Champions",           count: 2877, color: "#2563eb" },
    { segment: "Lost / Churned",      count: 2864, color: "#dc2626" },
    { segment: "Loyal Customers",     count: 1716, color: "#16a34a" },
    { segment: "Potential Loyalists", count: 1287, color: "#0891b2" },
    { segment: "At Risk",             count: 1136, color: "#ea580c" },
    { segment: "Cannot Lose Them",    count: 118,  color: "#7c3aed" },
    { segment: "Need Attention",      count: 2,    color: "#ca8a04" },
  ],
  risk_buckets: [
    { bucket: "Low Risk",    count: 4593, pct: 45.9, color: "#16a34a" },
    { bucket: "Medium Risk", count: 2930, pct: 29.3, color: "#ca8a04" },
    { bucket: "High Risk",   count: 2477, pct: 24.8, color: "#dc2626" },
  ],
  product_revenue: [
    { product: "Pupuk A",      revenue: 676.5, trx: 24567, pct: 16.94 },
    { product: "NPK Premium",  revenue: 667.7, trx: 24553, pct: 16.72 },
    { product: "Organik Plus", revenue: 666.9, trx: 24534, pct: 16.70 },
    { product: "Pupuk B",      revenue: 663.1, trx: 24128, pct: 16.61 },
    { product: "Pestisida",    revenue: 661.2, trx: 24146, pct: 16.56 },
    { product: "Bibit Unggul", revenue: 657.1, trx: 24203, pct: 16.46 },
  ],
  channel_revenue: [
    { channel: "Online",       revenue: 1003.9, trx: 36809, pct: 25.14 },
    { channel: "Distributor",  revenue: 1001.5, trx: 36483, pct: 25.09 },
    { channel: "Retail Store", revenue: 998.7,  trx: 36490, pct: 25.01 },
    { channel: "Direct Sales", revenue: 988.4,  trx: 36340, pct: 24.76 },
  ],
  payment_revenue: [
    { method: "TOP 30",   revenue: 1003.0, trx: 36533, pct: 25.12 },
    { method: "Transfer", revenue: 1001.8, trx: 36606, pct: 25.09 },
    { method: "TOP 60",   revenue: 998.7,  trx: 36773, pct: 25.01 },
    { method: "Cash",     revenue: 988.9,  trx: 36190, pct: 24.77 },
  ],
  monthly_trend: [
    { ym:"2023-01",rev:0.68,trx:29,custs:29 }, { ym:"2023-02",rev:7.36,trx:272,custs:270 },
    { ym:"2023-03",rev:20.38,trx:753,custs:738 }, { ym:"2023-04",rev:34.24,trx:1225,custs:1200 },
    { ym:"2023-05",rev:45.48,trx:1667,custs:1622 }, { ym:"2023-06",rev:57.98,trx:2099,custs:2053 },
    { ym:"2023-07",rev:68.42,trx:2472,custs:2404 }, { ym:"2023-08",rev:76.82,trx:2788,custs:2697 },
    { ym:"2023-09",rev:83.52,trx:3044,custs:2938 }, { ym:"2023-10",rev:89.32,trx:3249,custs:3120 },
    { ym:"2023-11",rev:93.64,trx:3420,custs:3274 }, { ym:"2023-12",rev:175.32,trx:6501,custs:5918 },
    { ym:"2024-01",rev:198.41,trx:7225,custs:6544 }, { ym:"2024-02",rev:198.28,trx:7219,custs:6530 },
    { ym:"2024-03",rev:147.57,trx:5374,custs:5088 }, { ym:"2024-04",rev:99.78,trx:3641,custs:3492 },
    { ym:"2024-05",rev:85.64,trx:3126,custs:2986 }, { ym:"2024-06",rev:79.43,trx:2895,custs:2764 },
    { ym:"2024-07",rev:75.21,trx:2742,custs:2616 }, { ym:"2024-08",rev:73.14,trx:2669,custs:2547 },
    { ym:"2024-09",rev:71.82,trx:2618,custs:2498 }, { ym:"2024-10",rev:72.63,trx:2643,custs:2521 },
    { ym:"2024-11",rev:73.91,trx:2693,custs:2563 }, { ym:"2024-12",rev:102.17,trx:3858,custs:3617 },
    { ym:"2025-01",rev:112.43,trx:4123,custs:3842 }, { ym:"2025-02",rev:101.82,trx:3716,custs:3474 },
    { ym:"2025-03",rev:88.71,trx:3243,custs:3028 }, { ym:"2025-04",rev:74.53,trx:2726,custs:2551 },
    { ym:"2025-05",rev:65.82,trx:2405,custs:2252 }, { ym:"2025-06",rev:62.41,trx:2283,custs:2139 },
    { ym:"2025-07",rev:59.74,trx:2185,custs:2049 }, { ym:"2025-08",rev:58.21,trx:2131,custs:1998 },
    { ym:"2025-09",rev:57.83,trx:2117,custs:1982 }, { ym:"2025-10",rev:58.62,trx:2144,custs:2009 },
    { ym:"2025-11",rev:60.14,trx:2200,custs:2061 }, { ym:"2025-12",rev:79.15,trx:2791,custs:2568 },
    { ym:"2026-01",rev:82.34,trx:3014,custs:2748 }, { ym:"2026-02",rev:76.42,trx:2795,custs:2549 },
    { ym:"2026-03",rev:68.91,trx:2521,custs:2299 }, { ym:"2026-04",rev:62.14,trx:2274,custs:2076 },
    { ym:"2026-05",rev:57.83,trx:2116,custs:1931 }, { ym:"2026-06",rev:54.21,trx:1983,custs:1811 },
    { ym:"2026-07",rev:51.74,trx:1893,custs:1728 }, { ym:"2026-08",rev:50.21,trx:1837,custs:1677 },
    { ym:"2026-09",rev:49.83,trx:1823,custs:1663 }, { ym:"2026-10",rev:50.62,trx:1852,custs:1690 },
    { ym:"2026-11",rev:52.14,trx:1907,custs:1741 }, { ym:"2026-12",rev:23.61,trx:596,custs:560 },
  ],
  top_customers: [
    { name: "UD Saptono Damanik",   region: "Palembang", segment: "Distributor",  revenue: 3.412, trx: 146, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "PD Oktaviani Tbk",     region: "Jakarta",   segment: "Distributor",  revenue: 3.398, trx: 142, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "UD Santoso",           region: "Jakarta",   segment: "Wholesale",    revenue: 3.387, trx: 139, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "UD Gunawan Tbk",       region: "Medan",     segment: "Distributor",  revenue: 3.376, trx: 141, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "Perum Purnawati Tbk",  region: "Bandung",   segment: "Wholesale",    revenue: 3.364, trx: 138, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "CV Agung Pratama",     region: "Surabaya",  segment: "Distributor",  revenue: 3.351, trx: 137, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "PT Maju Jaya",         region: "Semarang",  segment: "Wholesale",    revenue: 3.339, trx: 135, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "UD Sari Agro",         region: "Makassar",  segment: "Distributor",  revenue: 3.327, trx: 133, years: 4, rfm: "Champions",       risk: "Low Risk" },
    { name: "PD Karya Tani",        region: "Bandung",   segment: "Wholesale",    revenue: 3.314, trx: 132, years: 3, rfm: "Loyal Customers", risk: "Low Risk" },
    { name: "CV Subur Makmur",      region: "Palembang", segment: "Distributor",  revenue: 3.302, trx: 130, years: 3, rfm: "Loyal Customers", risk: "Low Risk" },
  ],
  heatmap: [
    { year:2023, month:1, rev:0.68 }, { year:2023, month:2, rev:7.36 },
    { year:2023, month:3, rev:20.38 }, { year:2023, month:4, rev:34.24 },
    { year:2023, month:5, rev:45.48 }, { year:2023, month:6, rev:57.98 },
    { year:2023, month:7, rev:68.42 }, { year:2023, month:8, rev:76.82 },
    { year:2023, month:9, rev:83.52 }, { year:2023, month:10, rev:89.32 },
    { year:2023, month:11, rev:93.64 }, { year:2023, month:12, rev:175.32 },
    { year:2024, month:1, rev:198.41 }, { year:2024, month:2, rev:198.28 },
    { year:2024, month:3, rev:147.57 }, { year:2024, month:4, rev:99.78 },
    { year:2024, month:5, rev:85.64 }, { year:2024, month:6, rev:79.43 },
    { year:2024, month:7, rev:75.21 }, { year:2024, month:8, rev:73.14 },
    { year:2024, month:9, rev:71.82 }, { year:2024, month:10, rev:72.63 },
    { year:2024, month:11, rev:73.91 }, { year:2024, month:12, rev:102.17 },
    { year:2025, month:1, rev:112.43 }, { year:2025, month:2, rev:101.82 },
    { year:2025, month:3, rev:88.71 }, { year:2025, month:4, rev:74.53 },
    { year:2025, month:5, rev:65.82 }, { year:2025, month:6, rev:62.41 },
    { year:2025, month:7, rev:59.74 }, { year:2025, month:8, rev:58.21 },
    { year:2025, month:9, rev:57.83 }, { year:2025, month:10, rev:58.62 },
    { year:2025, month:11, rev:60.14 }, { year:2025, month:12, rev:79.15 },
    { year:2026, month:1, rev:82.34 }, { year:2026, month:2, rev:76.42 },
    { year:2026, month:3, rev:68.91 }, { year:2026, month:4, rev:62.14 },
    { year:2026, month:5, rev:57.83 }, { year:2026, month:6, rev:54.21 },
    { year:2026, month:7, rev:51.74 }, { year:2026, month:8, rev:50.21 },
    { year:2026, month:9, rev:49.83 }, { year:2026, month:10, rev:50.62 },
    { year:2026, month:11, rev:52.14 }, { year:2026, month:12, rev:23.61 },
  ],
  segment_profile: [
    { segment: "Champions",           count: 2877, avg_recency: 124, avg_frequency: 21.4, avg_monetary: 1.82, total_monetary: 5238 },
    { segment: "Loyal Customers",     count: 1716, avg_recency: 201, avg_frequency: 15.8, avg_monetary: 0.94, total_monetary: 1613 },
    { segment: "Potential Loyalists", count: 1287, avg_recency: 312, avg_frequency: 10.2, avg_monetary: 0.41, total_monetary: 528 },
    { segment: "At Risk",             count: 1136, avg_recency: 489, avg_frequency: 5.1,  avg_monetary: 0.21, total_monetary: 239 },
    { segment: "Cannot Lose Them",    count: 118,  avg_recency: 612, avg_frequency: 18.3, avg_monetary: 0.89, total_monetary: 105 },
    { segment: "Lost / Churned",      count: 2864, avg_recency: 891, avg_frequency: 3.2,  avg_monetary: 0.09, total_monetary: 258 },
  ],
};

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:       "#0f1117",
  surface:  "#1a1d27",
  border:   "#252836",
  text:     "#e8eaf0",
  muted:    "#6b7280",
  accent:   "#3b82f6",
  green:    "#22c55e",
  red:      "#ef4444",
  amber:    "#f59e0b",
  purple:   "#a855f7",
  teal:     "#14b8a6",
};

const NAV_ITEMS = [
  { id: "overview",     label: "Overview",     icon: "◈" },
  { id: "retention",    label: "Retention & Churn", icon: "↺" },
  { id: "segmentation", label: "Segmentasi",   icon: "⬡" },
  { id: "highvalue",    label: "High Value",   icon: "★" },
  { id: "behavior",     label: "Behavior",     icon: "⊙" },
  { id: "insight",      label: "Insight & Rekomendasi", icon: "💡" },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
const fmtB   = (v) => `Rp ${v.toFixed(1)}B`;
const fmtT   = (v) => `Rp ${(v / 1000).toFixed(2)}T`;
const fmtNum = (v) => v?.toLocaleString("id-ID") ?? "-";
const MONTHS  = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const Badge = ({ label, color }) => (
  <span style={{
    background: `${color}22`, color, border: `1px solid ${color}44`,
    borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600
  }}>{label}</span>
);

const KPI = ({ label, value, sub, accent, delta }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: accent || C.accent
    }} />
    <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
    <div style={{ color: C.text, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>{sub}</div>}
    {delta != null && (
      <div style={{
        marginTop: 6, fontSize: 12, fontWeight: 600,
        color: delta >= 0 ? C.green : C.red
      }}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}% YoY</div>
    )}
  </div>
);

const Card = ({ title, children, action }) => (
  <div style={{
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 24
  }}>
    <div style={{ display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: 20 }}>
      <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>{title}</div>
      {action}
    </div>
    {children}
  </div>
);

const InsightBox = ({ type, text }) => {
  const colors = { warning: C.amber, danger: C.red, success: C.green, info: C.accent };
  const icons  = { warning: "⚠", danger: "✗", success: "✓", info: "i" };
  const c = colors[type] || C.accent;
  return (
    <div style={{
      background: `${c}12`, border: `1px solid ${c}30`,
      borderLeft: `3px solid ${c}`, borderRadius: 8,
      padding: "12px 16px", marginBottom: 8,
      display: "flex", gap: 10, alignItems: "flex-start"
    }}>
      <span style={{ color: c, fontWeight: 700, marginTop: 1 }}>{icons[type]}</span>
      <span style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{text}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e2130", border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 12
    }}>
      <div style={{ color: C.muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// ── HEATMAP COMPONENT ────────────────────────────────────────────────────────
const Heatmap = ({ data }) => {
  const years = [2023, 2024, 2025, 2026];
  const maxRev = Math.max(...data.map(d => d.rev));
  const getCell = (yr, mo) => data.find(d => d.year === yr && d.month === mo);

  const getColor = (rev) => {
    if (!rev) return "#1a1d27";
    const t = rev / maxRev;
    if (t > 0.8) return "#1e3a5f";
    if (t > 0.6) return "#1d4ed8";
    if (t > 0.4) return "#3b82f6";
    if (t > 0.2) return "#60a5fa";
    return "#bfdbfe";
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "separate", borderSpacing: 3, width: "100%" }}>
        <thead>
          <tr>
            <th style={{ color: C.muted, fontSize: 11, textAlign: "left", paddingBottom: 4 }}>Tahun</th>
            {MONTHS.map(m => (
              <th key={m} style={{ color: C.muted, fontSize: 10, textAlign: "center",
                fontWeight: 500, paddingBottom: 4, minWidth: 36 }}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {years.map(yr => (
            <tr key={yr}>
              <td style={{ color: C.muted, fontSize: 11, paddingRight: 8, fontWeight: 600 }}>{yr}</td>
              {MONTHS.map((_, mi) => {
                const cell = getCell(yr, mi + 1);
                const rev = cell?.rev || 0;
                return (
                  <td key={mi} title={`${yr}-${MONTHS[mi]}: Rp ${rev.toFixed(1)}B`}
                    style={{
                      background: getColor(rev),
                      borderRadius: 4, height: 28, textAlign: "center",
                      fontSize: 8, color: rev > 0 ? "#fff" : "transparent",
                      cursor: "default", transition: "opacity 0.2s"
                    }}>
                    {rev > 50 ? rev.toFixed(0) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
        <span style={{ color: C.muted, fontSize: 10 }}>Rendah</span>
        {["#bfdbfe","#60a5fa","#3b82f6","#1d4ed8","#1e3a5f"].map(c => (
          <div key={c} style={{ width: 24, height: 10, background: c, borderRadius: 2 }} />
        ))}
        <span style={{ color: C.muted, fontSize: 10 }}>Tinggi</span>
      </div>
    </div>
  );
};

// ── SEGMENT BADGE ────────────────────────────────────────────────────────────
const SEG_COLORS = {
  "Champions": "#3b82f6",
  "Loyal Customers": "#22c55e",
  "Potential Loyalists": "#14b8a6",
  "At Risk": "#f59e0b",
  "Cannot Lose Them": "#a855f7",
  "Lost / Churned": "#ef4444",
  "Need Attention": "#f59e0b",
};
const RISK_COLORS = { "Low Risk": "#22c55e", "Medium Risk": "#f59e0b", "High Risk": "#ef4444" };

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const OverviewPage = () => {
  const totalRev = DATA.growth.reduce((a, g) => a + g.revenue, 0);
  const totalTrx = DATA.growth.reduce((a, g) => a + g.transactions, 0);
  const totalCust = 10000;
  const champions = DATA.rfm_segments.find(s => s.segment === "Champions");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #1a1d27 0%, #1e2538 100%)`,
        border: `1px solid ${C.border}`, borderRadius: 12, padding: 28,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ color: C.muted, fontSize: 12, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            PT Sarana Pertiwi — Analytics Dashboard
          </div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>
            Executive Overview
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            Data Periode: Jan 2023 – Des 2026 · 10.000 Customer · 146.144 Transaksi
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Total Lifetime Revenue</div>
          <div style={{ color: C.accent, fontSize: 32, fontWeight: 800 }}>
            {fmtT(totalRev * 1e9)}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KPI label="Total Customer" value={fmtNum(totalCust)} sub="10 ribu terdaftar" accent={C.accent} />
        <KPI label="Total Transaksi" value={fmtNum(totalTrx)} sub="4 tahun kumulatif" accent={C.teal} />
        <KPI label="Champions" value={fmtNum(champions?.count)} sub="28.8% dari total customer" accent={C.accent} delta={null} />
        <KPI label="Avg. Order Value" value="Rp 27,3 Juta" sub="per transaksi" accent={C.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Revenue & Growth */}
        <Card title="Revenue & Pertumbuhan per Tahun">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={DATA.growth}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="year" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
              <YAxis yAxisId="rev" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }}
                tickFormatter={v => `${v.toFixed(0)}B`} />
              <YAxis yAxisId="growth" orientation="right" stroke={C.muted}
                tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="rev" dataKey="revenue" name="Revenue (B)" fill={C.accent} opacity={0.8} radius={[4,4,0,0]} />
              <Line yAxisId="growth" dataKey="rev_growth" name="Growth %" stroke={C.amber}
                strokeWidth={2} dot={{ fill: C.amber, r: 4 }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
          <InsightBox type="warning" text="Revenue turun 29.7% di 2025 dan 30.3% di 2026 setelah peak di 2024. Perlu investigasi penyebab penurunan." />
        </Card>

        {/* Risk Bucket */}
        <Card title="Distribusi Customer berdasarkan Risk Bucket">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={DATA.risk_buckets} dataKey="count" nameKey="bucket"
                cx="50%" cy="50%" outerRadius={80} innerRadius={48}
                paddingAngle={3}>
                {DATA.risk_buckets.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmtNum(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
            {DATA.risk_buckets.map(d => (
              <div key={d.bucket} style={{ textAlign: "center" }}>
                <div style={{ color: d.color, fontWeight: 700, fontSize: 18 }}>{d.pct}%</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{d.bucket}</div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{fmtNum(d.count)}</div>
              </div>
            ))}
          </div>
          <InsightBox type="danger" text="24.8% customer masuk High Risk — butuh program win-back segera untuk 2.477 customer berisiko." />
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card title="Tren Revenue Bulanan 2023–2026">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={DATA.monthly_trend}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="ym" stroke={C.muted} tick={{ fill: C.muted, fontSize: 9 }}
              interval={3} angle={-30} textAnchor="end" height={40} />
            <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }}
              tickFormatter={v => `${v.toFixed(0)}B`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="rev" name="Revenue (B)" stroke={C.accent}
              fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <InsightBox type="info" text="Peak revenue terjadi Jan-Feb 2024 (Rp ~198B/bulan) sesuai musim tanam Januari. Pola seasonal tahunan terlihat jelas." />
      </Card>
    </div>
  );
};

// ── RETENTION PAGE ────────────────────────────────────────────────────────────
const RetentionPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 20
    }}>
      <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
        📐 Metodologi Retention & Churn
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#0f1117", borderRadius: 8, padding: 16 }}>
          <div style={{ color: C.accent, fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Definisi Retention</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
            Customer dinyatakan <span style={{ color: C.green }}>RETAINED</span> jika aktif bertransaksi di tahun Y <em>dan</em> tahun Y+1.<br />
            <strong style={{ color: C.text }}>Retention Rate = Retained ÷ Active(Y) × 100%</strong>
          </div>
        </div>
        <div style={{ background: "#0f1117", borderRadius: 8, padding: 16 }}>
          <div style={{ color: C.red, fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Definisi Churn</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
            Customer dinyatakan <span style={{ color: C.red }}>CHURNED</span> jika aktif di tahun Y tetapi tidak ada transaksi di tahun Y+1.<br />
            <strong style={{ color: C.text }}>Churn Rate = Churned ÷ Active(Y) × 100%</strong>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, color: C.muted, fontSize: 12 }}>
        ⚠ Alasan pakai Year-over-Year: Bisnis distribusi agrikultur mengikuti siklus tanam tahunan (musim tanam Jan & Jul). Monthly retention kurang relevan.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {DATA.retention.map((r) => (
        <div key={r.year} style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 20
        }}>
          <div style={{ color: C.muted, fontSize: 12, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.06em" }}>Cohort {r.year}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <div>
              <div style={{ color: C.muted, fontSize: 11 }}>Retention Rate</div>
              <div style={{ color: C.green, fontSize: 28, fontWeight: 800 }}>{r.retention_rate}%</div>
            </div>
            <div>
              <div style={{ color: C.muted, fontSize: 11 }}>Churn Rate</div>
              <div style={{ color: C.red, fontSize: 28, fontWeight: 800 }}>{r.churn_rate}%</div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.muted }}>Total Aktif</span>
              <span style={{ color: C.text, fontWeight: 600 }}>{fmtNum(r.active)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.green }}>Retained → {+r.year + 1}</span>
              <span style={{ color: C.green, fontWeight: 600 }}>{fmtNum(r.retained)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: C.red }}>Churned</span>
              <span style={{ color: C.red, fontWeight: 600 }}>{fmtNum(r.churned)}</span>
            </div>
          </div>
          {/* Mini bar */}
          <div style={{ marginTop: 12, background: C.red, borderRadius: 4, height: 8, overflow: "hidden" }}>
            <div style={{ width: `${r.retention_rate}%`, background: C.green, height: "100%" }} />
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Retention vs Churn Rate — Tren Tahunan">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={DATA.retention}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} domain={[0, 100]}
              tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line dataKey="retention_rate" name="Retention Rate %" stroke={C.green}
              strokeWidth={3} dot={{ fill: C.green, r: 6 }} />
            <Line dataKey="churn_rate" name="Churn Rate %" stroke={C.red}
              strokeWidth={3} dot={{ fill: C.red, r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
        <InsightBox type="danger" text="Retention turun 21.64 poin (89.78% → 68.14%) dalam 2 tahun. Churn meningkat 3x lipat dari 866 menjadi 2.150 customer." />
      </Card>

      <Card title="Customer Movement — Aktif vs Retained vs Churned">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={DATA.retention} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} />
            <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }}
              tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="active"   name="Total Aktif" fill="#374151"  radius={[4,4,0,0]} />
            <Bar dataKey="retained" name="Retained"    fill={C.green}  radius={[4,4,0,0]} />
            <Bar dataKey="churned"  name="Churned"     fill={C.red}    radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <InsightBox type="warning" text="Penurunan customer aktif dari 9.134 (2024) ke 6.749 (2025) menunjukkan krisis retensi yang perlu ditangani segera." />
      </Card>
    </div>

    <Card title="🎯 Rekomendasi Strategis — Retention">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InsightBox type="danger" text="URGENT: Retention 2025 turun ke 68.14% — ambang batas bisnis sehat umumnya di atas 75%. Perlu task force retensi." />
        <InsightBox type="warning" text="2.150 customer churned di 2025 — program win-back dengan diskon khusus bagi customer yang belum transaksi >180 hari." />
        <InsightBox type="info" text="Implementasi early warning: customer yang tidak transaksi dalam 60 hari (di luar low season) masuk antrian follow-up sales." />
        <InsightBox type="success" text="Retention 2023 yang tinggi (89.78%) menjadi benchmark. Identifikasi faktor yang membuat customer aktif di 2023 tetap bertahan." />
      </div>
    </Card>
  </div>
);

// ── SEGMENTATION PAGE ─────────────────────────────────────────────────────────
const SegmentationPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {/* Logic box */}
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
      <div style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
        ⬡ RFM Segmentation — Logic & Parameter
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "R — Recency", color: C.accent, desc: "Hari sejak transaksi terakhir (ref: 31 Des 2026). Makin kecil = makin baru = score lebih tinggi." },
          { label: "F — Frequency", color: C.green, desc: "Jumlah transaksi unik. Makin sering transaksi = customer lebih loyal = score lebih tinggi." },
          { label: "M — Monetary", color: C.amber, desc: "Total nilai transaksi lifetime. Makin besar kontribusi revenue = score lebih tinggi." },
        ].map(item => (
          <div key={item.label} style={{ background: "#0f1117", borderRadius: 8, padding: 14 }}>
            <div style={{ color: item.color, fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ color: C.muted, fontSize: 12 }}>
        Scoring menggunakan <strong style={{ color: C.text }}>NTILE(5)</strong> — tiap dimensi dibagi 5 kuintil (skor 1–5). Total skor = R + F + M (range 3–15).
        Segmentasi menggunakan kombinasi skor total DAN pola individual R/F/M untuk hasil yang lebih presisi.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16 }}>
      {/* Segment distribution */}
      <Card title="Distribusi RFM Segment">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DATA.rfm_segments.map(s => {
            const pct = (s.count / 10000 * 100).toFixed(1);
            return (
              <div key={s.segment}>
                <div style={{ display: "flex", justifyContent: "space-between",
                  marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: C.text }}>{s.segment}</span>
                  <span style={{ color: C.muted }}>{fmtNum(s.count)} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%",
                    background: SEG_COLORS[s.segment] || C.accent, borderRadius: 4
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Risk bucket pie */}
      <Card title="Risk Bucket Distribution">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={DATA.risk_buckets} dataKey="count" nameKey="bucket"
              cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={4}>
              {DATA.risk_buckets.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip formatter={v => fmtNum(v)} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {DATA.risk_buckets.map(d => (
            <div key={d.bucket} style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%",
                  background: d.color, display: "inline-block" }} />
                <span style={{ color: C.text }}>{d.bucket}</span>
              </span>
              <span style={{ color: d.color, fontWeight: 700 }}>
                {fmtNum(d.count)} ({d.pct}%)
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Segment profile table */}
    <Card title="Profil Rata-rata per Segmen">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["Segment", "Jumlah", "Avg Recency (hari)", "Avg Frequency", "Avg Monetary (B)", "Total Monetary (B)", "Aksi"].map(h => (
                <th key={h} style={{ color: C.muted, fontWeight: 600, padding: "8px 12px",
                  textAlign: "left", fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATA.segment_profile.map((s, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${C.border}`,
                background: i % 2 === 0 ? "transparent" : "#ffffff04"
              }}>
                <td style={{ padding: "10px 12px" }}>
                  <Badge label={s.segment} color={SEG_COLORS[s.segment] || C.accent} />
                </td>
                <td style={{ padding: "10px 12px", color: C.text, fontWeight: 600 }}>{fmtNum(s.count)}</td>
                <td style={{ padding: "10px 12px", color: C.text }}>{fmtNum(s.avg_recency)}</td>
                <td style={{ padding: "10px 12px", color: C.text }}>{s.avg_frequency}x</td>
                <td style={{ padding: "10px 12px", color: C.text }}>Rp {s.avg_monetary}B</td>
                <td style={{ padding: "10px 12px", color: C.text, fontWeight: 600 }}>Rp {s.total_monetary}B</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: C.muted, fontSize: 11 }}>
                    {s.segment === "Champions" ? "Reward & Upsell" :
                     s.segment === "Loyal Customers" ? "Cross-sell" :
                     s.segment === "Potential Loyalists" ? "Nurturing" :
                     s.segment === "At Risk" ? "Re-engagement" :
                     s.segment === "Cannot Lose Them" ? "Win-back SEGERA" :
                     "Reaktivasi / Write-off"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16 }}>
        <InsightBox type="info" text="Champions (28.8%) menyumbang ±65% total revenue — konfirmasi prinsip Pareto 80/20. Prioritas pertama: jaga Champions tetap aktif." />
        <InsightBox type="danger" text="Lost/Churned setara jumlahnya dengan Champions (2.864 vs 2.877). Setiap Champion yang hilang tidak tergantikan secara langsung." />
      </div>
    </Card>
  </div>
);

// ── HIGH VALUE PAGE ───────────────────────────────────────────────────────────
const HighValuePage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <KPI label="Champions (LTV Tertinggi)" value="2.877" sub="28.8% customer" accent={C.accent} />
      <KPI label="Top Customer LTV" value="Rp 3.41B" sub="UD Saptono Damanik" accent={C.green} />
      <KPI label="Customer 4 Tahun Aktif" value="~1.200" sub="aktif 2023–2026 penuh" accent={C.amber} />
      <KPI label="Avg LTV Champions" value="Rp 1.82B" sub="vs Rp 0.09B Lost" accent={C.purple} />
    </div>

    {/* Top 10 table */}
    <Card title="★ Top 10 Customer berdasarkan Lifetime Value">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {["#","Nama Customer","Region","Segmen Bisnis","LTV (Miliar)","Transaksi","Tahun Aktif","RFM Segment","Risk"].map(h => (
                <th key={h} style={{ color: C.muted, fontWeight: 600, padding: "8px 10px",
                  textAlign: "left", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATA.top_customers.map((c, i) => (
              <tr key={i} style={{
                borderBottom: `1px solid ${C.border}`,
                background: i === 0 ? `${C.accent}08` : i % 2 === 0 ? "transparent" : "#ffffff04"
              }}>
                <td style={{ padding: "10px 10px", color: i === 0 ? C.amber : C.muted,
                  fontWeight: i === 0 ? 800 : 400 }}>{i === 0 ? "🥇" : i + 1}</td>
                <td style={{ padding: "10px 10px", color: C.text, fontWeight: 600,
                  whiteSpace: "nowrap" }}>{c.name}</td>
                <td style={{ padding: "10px 10px", color: C.muted }}>{c.region}</td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge label={c.segment} color={C.teal} />
                </td>
                <td style={{ padding: "10px 10px", color: C.green, fontWeight: 700 }}>
                  Rp {c.revenue.toFixed(3)}B
                </td>
                <td style={{ padding: "10px 10px", color: C.text }}>{fmtNum(c.trx)}</td>
                <td style={{ padding: "10px 10px", color: C.text }}>{c.years} thn</td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge label={c.rfm} color={SEG_COLORS[c.rfm] || C.accent} />
                </td>
                <td style={{ padding: "10px 10px" }}>
                  <Badge label={c.risk} color={RISK_COLORS[c.risk] || C.amber} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Customer Loyalty Distribution */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card title="Top 10 — Revenue Chart">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={DATA.top_customers} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
              tickFormatter={v => `${v.toFixed(1)}B`} />
            <YAxis type="category" dataKey="name" stroke={C.muted}
              tick={{ fill: C.muted, fontSize: 10 }} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" name="LTV (Miliar IDR)" fill={C.accent} radius={[0,4,4,0]}>
              {DATA.top_customers.map((_, i) => (
                <Cell key={i} fill={i === 0 ? C.amber : C.accent} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Karakteristik High Value Customer">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Profil Dominan", value: "Distributor & Wholesale dari kota besar (Jakarta, Palembang, Medan)", color: C.accent },
            { label: "Frekuensi Transaksi", value: "130–146 transaksi per customer (vs avg 14.6 untuk semua customer)", color: C.green },
            { label: "Tahun Aktif", value: "Mayoritas 4 tahun (2023–2026) — loyal jangka panjang penuh", color: C.teal },
            { label: "Risk Profile", value: "Semua masuk Low Risk & Champions — customer terbaik = customer paling aman", color: C.green },
            { label: "Revenue Gap", value: "Top 10 LTV rata-rata Rp 3.35B vs avg customer Rp 399M (8x lipat)", color: C.amber },
            { label: "Future Potential", value: "Customer baru 2025-2026 dengan frekuensi >20 trx/tahun = kandidat Champions berikutnya", color: C.purple },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#0f1117", borderRadius: 8, padding: "12px 14px",
              borderLeft: `3px solid ${item.color}`
            }}>
              <div style={{ color: item.color, fontSize: 11, fontWeight: 700,
                marginBottom: 4, textTransform: "uppercase" }}>{item.label}</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.5 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// ── BEHAVIOR PAGE ─────────────────────────────────────────────────────────────
const BehaviorPage = () => {
  const [activeTab, setActiveTab] = useState("product");
  const tabs = [
    { id: "product", label: "Produk" },
    { id: "channel", label: "Channel" },
    { id: "payment", label: "Pembayaran" },
    { id: "seasonal", label: "Seasonal" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tab Nav */}
      <div style={{ display: "flex", gap: 8 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            background: activeTab === t.id ? C.accent : C.surface,
            color: activeTab === t.id ? "#fff" : C.muted,
            fontWeight: activeTab === t.id ? 700 : 400, fontSize: 13,
            transition: "all 0.15s"
          }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "product" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card title="Revenue per Kategori Produk">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA.product_revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="product" stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
                    angle={-15} textAnchor="end" height={50} />
                  <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
                    tickFormatter={v => `${v.toFixed(0)}B`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue (B)" radius={[4,4,0,0]}>
                    {DATA.product_revenue.map((_, i) => (
                      <Cell key={i} fill={[C.accent, C.teal, C.green, C.purple, C.amber, "#f43f5e"][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Kontribusi Revenue per Produk">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={DATA.product_revenue} dataKey="revenue" nameKey="product"
                    cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={2}>
                    {DATA.product_revenue.map((_, i) => (
                      <Cell key={i} fill={[C.accent, C.teal, C.green, C.purple, C.amber, "#f43f5e"][i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => `Rp ${v.toFixed(1)}B`} />
                  <Legend formatter={v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <InsightBox type="info" text="Distribusi produk sangat merata (16.46%–16.94%). Tidak ada produk yang dominan — bisnis terdiversifikasi dengan baik." />
            </Card>
          </div>
          <Card title="Detail Statistik per Produk">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Produk","Revenue (B)","Transaksi","Customer","Kontribusi"].map(h => (
                      <th key={h} style={{ color: C.muted, padding: "8px 12px", textAlign: "left", fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATA.product_revenue.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "9px 12px", color: C.text, fontWeight: 600 }}>{p.product}</td>
                      <td style={{ padding: "9px 12px", color: C.green }}>Rp {p.revenue.toFixed(1)}B</td>
                      <td style={{ padding: "9px 12px", color: C.text }}>{fmtNum(p.trx)}</td>
                      <td style={{ padding: "9px 12px", color: C.text }}>{fmtNum(p.customers)}</td>
                      <td style={{ padding: "9px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 6, overflow: "hidden" }}>
                            <div style={{ width: `${p.pct * 6}%`, height: "100%",
                              background: [C.accent, C.teal, C.green, C.purple, C.amber, "#f43f5e"][i] }} />
                          </div>
                          <span style={{ color: C.muted, fontSize: 11, minWidth: 36 }}>{p.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "channel" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card title="Revenue per Sales Channel">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA.channel_revenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
                    tickFormatter={v => `${v.toFixed(0)}B`} />
                  <YAxis type="category" dataKey="channel" stroke={C.muted}
                    tick={{ fill: C.muted, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue (B)" radius={[0,4,4,0]}>
                    {DATA.channel_revenue.map((_, i) => (
                      <Cell key={i} fill={[C.accent, C.teal, C.green, C.amber][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Share Channel">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={DATA.channel_revenue} dataKey="revenue" nameKey="channel"
                    cx="50%" cy="50%" outerRadius={100} paddingAngle={3}>
                    {DATA.channel_revenue.map((_, i) => (
                      <Cell key={i} fill={[C.accent, C.teal, C.green, C.amber][i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => `Rp ${v.toFixed(1)}B`} />
                  <Legend formatter={v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="Insight Channel">
            <InsightBox type="info" text="Distribusi channel sangat merata (24.76%–25.14%). Keempat channel berkontribusi hampir sama — strategi multi-channel terbukti efektif." />
            <InsightBox type="success" text="Online channel memimpin tipis (25.14%) — tren digitalisasi transaksi B2B agrikultur mulai terlihat. Investasi teknologi justified." />
            <InsightBox type="warning" text="Direct Sales terendah (24.76%) meski memiliki cost tertinggi. Review efisiensi tim sales lapangan vs ROI per channel." />
          </Card>
        </div>
      )}

      {activeTab === "payment" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card title="Revenue per Metode Pembayaran">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DATA.payment_revenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                  <XAxis type="number" stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
                    tickFormatter={v => `${v.toFixed(0)}B`} />
                  <YAxis type="category" dataKey="method" stroke={C.muted}
                    tick={{ fill: C.muted, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue (B)" radius={[0,4,4,0]}>
                    {DATA.payment_revenue.map((_, i) => (
                      <Cell key={i} fill={[C.amber, C.accent, C.red, C.green][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="Analisis Risiko Pembayaran">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { method: "TOP 30", pct: 25.12, rev: 1003.0, risk: "Medium", note: "Piutang 30 hari — manageable, perlu monitoring koleksi" },
                  { method: "Transfer", pct: 25.09, rev: 1001.8, risk: "Low", note: "Pembayaran di muka — zero risk, preferensikan untuk High Risk customer" },
                  { method: "TOP 60", pct: 25.01, rev: 998.7, risk: "High", note: "Piutang 60 hari — risiko tertinggi, batasi untuk High Risk customer" },
                  { method: "Cash", pct: 24.77, rev: 988.9, risk: "Low", note: "Risiko nol — ideal untuk transaksi retail dan customer baru" },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: "#0f1117", borderRadius: 8, padding: 14,
                    borderLeft: `3px solid ${p.risk === "Low" ? C.green : p.risk === "Medium" ? C.amber : C.red}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: C.text, fontWeight: 700 }}>{p.method}</span>
                      <Badge label={`${p.risk} Risk`}
                        color={p.risk === "Low" ? C.green : p.risk === "Medium" ? C.amber : C.red} />
                    </div>
                    <div style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>Rp {p.rev.toFixed(1)}B ({p.pct}%)</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{p.note}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card title="🚨 Alert: Risiko Piutang">
            <InsightBox type="danger" text="TOP 60 menyumbang 25.01% revenue (Rp 998.7B). Jika collection rate turun 5%, exposure piutang macet ~Rp 50B." />
            <InsightBox type="warning" text="Kombinasi TOP 30 + TOP 60 = 50.13% revenue dalam bentuk piutang. Pastikan customer menggunakan metode ini memiliki Risk Profile Low/Medium." />
            <InsightBox type="success" text="Transfer + Cash = 49.86% — hampir separuh revenue sudah dibayar di muka atau tunai. Posisi kas relatif sehat." />
          </Card>
        </div>
      )}

      {activeTab === "seasonal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Heatmap Revenue Bulanan × Tahun (Miliar IDR)">
            <Heatmap data={DATA.heatmap} />
            <div style={{ marginTop: 12 }}>
              <InsightBox type="info" text="Jan–Feb 2024 adalah periode peak tertinggi (Rp ~198B/bulan) — bertepatan musim tanam padi Januari yang membutuhkan pupuk & pestisida dalam jumlah besar." />
              <InsightBox type="warning" text="Des 2026 hanya Rp 23.6B — kemungkinan data belum lengkap (akhir tahun). Perlu dikonfirmasi dengan tim data." />
            </div>
          </Card>
          <Card title="Tren Bulanan — Revenue & Customer Aktif">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={DATA.monthly_trend}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.accent} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="ym" stroke={C.muted} tick={{ fill: C.muted, fontSize: 8 }}
                  interval={5} angle={-30} textAnchor="end" height={40} />
                <YAxis yAxisId="rev" stroke={C.muted} tick={{ fill: C.muted, fontSize: 10 }}
                  tickFormatter={v => `${v.toFixed(0)}B`} />
                <YAxis yAxisId="cust" orientation="right" stroke={C.muted}
                  tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area yAxisId="rev" type="monotone" dataKey="rev" name="Revenue (B)"
                  stroke={C.accent} fill="url(#areaGrad)" strokeWidth={2} />
                <Line yAxisId="cust" type="monotone" dataKey="custs" name="Customer Aktif"
                  stroke={C.amber} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
            <InsightBox type="success" text="Pola seasonal terkonfirmasi: Q1 (Jan–Mar) selalu menjadi peak season, diikuti penurunan bertahap Q2–Q3, dan recovery ringan Q4." />
          </Card>
        </div>
      )}
    </div>
  );
};

// ── INSIGHT PAGE ──────────────────────────────────────────────────────────────
const InsightPage = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {/* Executive Summary */}
    <div style={{
      background: `linear-gradient(135deg, #1a1d27, #1e2538)`,
      border: `1px solid ${C.border}`, borderRadius: 12, padding: 24
    }}>
      <div style={{ color: C.accent, fontSize: 12, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Executive Summary
      </div>
      <div style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
        PT Sarana Pertiwi menghadapi tekanan retensi yang serius pasca-peak 2024
      </div>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.8 }}>
        Revenue tumbuh 96.3% dari 2023 ke 2024, namun kemudian turun 29.7% (2025) dan 30.3% (2026).
        Churn rate yang meningkat dari 10.22% ke 31.86% menjadi sinyal utama. Di sisi lain,
        fondasi bisnis masih kuat: 2.877 Champions, distribusi produk dan channel yang sehat,
        serta 4.599 customer yang masih aktif di 2026 — peluang untuk recovery tetap ada.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Temuan Kritis */}
      <Card title="🔍 Temuan Kritis">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <InsightBox type="danger" text="KRISIS RETENSI: Churn 2025 (31.86%) melampaui ambang batas kritikal. 2.150 customer hilang dalam setahun." />
          <InsightBox type="danger" text="LOST/CHURNED setara Champions: 2.864 customer 'lost' hampir sama dengan 2.877 Champions — setiap customer terbaik yang pergi sangat mahal." />
          <InsightBox type="warning" text="REVENUE DECLINE: -30% dua tahun berturut-turut. Total revenue 2026 lebih rendah dari 2023 padahal basis customer sudah terbangun." />
          <InsightBox type="warning" text="HIGH RISK 24.8%: 2.477 customer berisiko tinggi memegang potensi churn wave berikutnya jika tidak ditangani." />
          <InsightBox type="info" text="PIUTANG EXPOSURE: 50.13% revenue dalam bentuk kredit (TOP 30 + TOP 60). Monitor collection intensif untuk High Risk customer." />
        </div>
      </Card>

      {/* Peluang */}
      <Card title="✨ Peluang Bisnis">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <InsightBox type="success" text="MULTI-CHANNEL SEIMBANG: Keempat channel merata (24–25%) — ada ruang untuk investasi di channel dengan margin tertinggi." />
          <InsightBox type="success" text="PRODUK TERDIVERSIFIKASI: Tidak ada ketergantungan pada satu produk — risiko business continuity rendah." />
          <InsightBox type="success" text="SEASONAL PATTERN JELAS: Peak Jan–Feb terprediksi setiap tahun — bisa dioptimalkan dengan perencanaan stok dan promo terstruktur." />
          <InsightBox type="success" text="CANNOT LOSE THEM (118): Kelompok ini pernah sangat aktif (avg 18.3x) tapi sudah lama tidak beli — win-back dengan pendekatan personal kemungkinan berhasil tinggi." />
          <InsightBox type="info" text="DIGITAL TREND: Online channel memimpin (25.14%) — percepat digitalisasi ordering & pembayaran untuk efisiensi." />
        </div>
      </Card>
    </div>

    {/* Rekomendasi */}
    <Card title="📋 Rekomendasi Strategis — Prioritas & Timeline">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          {
            phase: "JANGKA PENDEK", timeframe: "0–3 Bulan",
            color: C.red,
            items: [
              "Task force retensi untuk 2.477 High Risk customer",
              "Program win-back 'Cannot Lose Them' (118 customer) — personal outreach",
              "Early warning: auto-flag customer tidak aktif >60 hari",
              "Stop kredit TOP 60 untuk High Risk customer baru",
            ]
          },
          {
            phase: "JANGKA MENENGAH", timeframe: "3–6 Bulan",
            color: C.amber,
            items: [
              "Loyalty tier program berbasis RFM score (Champion Gold, Silver, Bronze)",
              "Cross-sell NPK Premium & Organik Plus ke Loyal Customers",
              "Seasonal campaign khusus sebelum Q1 (November) untuk pre-order",
              "Review credit policy — hubungkan credit limit dengan Risk Profile",
            ]
          },
          {
            phase: "JANGKA PANJANG", timeframe: "6–12 Bulan",
            color: C.green,
            items: [
              "Predictive churn model berbasis RFM score drop (≥3 poin dalam 1 kuartal)",
              "Customer Success program untuk Champions — dedicated account manager",
              "Ekspansi Potential Loyalists (1.287) ke Loyal — target jadi 2.000+",
              "Dashboard real-time untuk monitoring RFM movement mingguan",
            ]
          },
        ].map((phase, i) => (
          <div key={i} style={{
            background: "#0f1117", borderRadius: 10, padding: 16,
            borderTop: `3px solid ${phase.color}`
          }}>
            <div style={{ color: phase.color, fontSize: 11, fontWeight: 800,
              letterSpacing: "0.06em", marginBottom: 2 }}>{phase.phase}</div>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 12 }}>{phase.timeframe}</div>
            <ul style={{ margin: 0, padding: "0 0 0 16px", display: "flex",
              flexDirection: "column", gap: 8 }}>
              {phase.items.map((item, j) => (
                <li key={j} style={{ color: C.text, fontSize: 12, lineHeight: 1.5 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>

    {/* KPI Target */}
    <Card title="🎯 Target KPI 2027 (Pasca-Implementasi)">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Retention Rate", current: "68.14%", target: "≥ 78%", color: C.green },
          { label: "Churn Rate",     current: "31.86%", target: "≤ 20%", color: C.red },
          { label: "Champions",      current: "2.877",  target: "3.200+", color: C.accent },
          { label: "Revenue Growth", current: "-30.3%", target: "+15%",  color: C.amber },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: "#0f1117", borderRadius: 10, padding: 16,
            borderLeft: `3px solid ${kpi.color}`
          }}>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <div style={{ color: C.muted, fontSize: 10 }}>Sekarang</div>
                <div style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>{kpi.current}</div>
              </div>
              <div style={{ fontSize: 20 }}>→</div>
              <div>
                <div style={{ color: C.muted, fontSize: 10 }}>Target</div>
                <div style={{ color: kpi.color, fontSize: 16, fontWeight: 700 }}>{kpi.target}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState("overview");

  const pages = {
    overview:     <OverviewPage />,
    retention:    <RetentionPage />,
    segmentation: <SegmentationPage />,
    highvalue:    <HighValuePage />,
    behavior:     <BehaviorPage />,
    insight:      <InsightPage />,
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif",
      display: "flex"
    }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.accent, fontWeight: 800, fontSize: 14, letterSpacing: "0.04em" }}>
            PT SARANA PERTIWI
          </div>
          <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>
            Analytics Dashboard · 2023–2026
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: activePage === item.id ? `${C.accent}20` : "transparent",
              color: activePage === item.id ? C.accent : C.muted,
              fontWeight: activePage === item.id ? 700 : 400, fontSize: 13,
              marginBottom: 2, textAlign: "left", transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ color: C.muted, fontSize: 10, lineHeight: 1.6 }}>
            Data: 10.000 customer<br />
            146.144 transaksi<br />
            Sumber: Excel V1
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          padding: "14px 28px", display: "flex", justifyContent: "space-between",
          alignItems: "center", position: "sticky", top: 0, zIndex: 10
        }}>
          <div style={{ color: C.text, fontSize: 15, fontWeight: 700 }}>
            {NAV_ITEMS.find(n => n.id === activePage)?.label}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["2023","2024","2025","2026"].map(yr => (
              <span key={yr} style={{
                background: `${C.accent}18`, color: C.accent,
                border: `1px solid ${C.accent}30`,
                borderRadius: 4, padding: "3px 10px", fontSize: 11, fontWeight: 600
              }}>{yr}</span>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: 24 }}>
          {pages[activePage]}
        </div>
      </div>
    </div>
  );
}
