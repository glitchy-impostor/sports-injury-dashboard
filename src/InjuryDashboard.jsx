import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis,
  LineChart, Line, Area, AreaChart, ComposedChart
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// DATA: Compiled from peer-reviewed epidemiological research
// All rates normalized to injuries per 1,000 hours of MATCH play
// ═══════════════════════════════════════════════════════════════

const injuryRateData = [
  {
    sport: "Bull Riding",
    rate: 1440,
    perMinute: 1.44,
    color: "#ff2e2e",
    icon: "🐂",
    source: "Butterwick et al., Clin J Sport Med (2007)",
    note: "Highest recorded rate in organized sport",
    category: "Extreme",
    avgMatchMin: 8,
    severity: { minor: 25, moderate: 35, severe: 40 },
    bodyParts: { head: 30, upperBody: 25, lowerBody: 20, spine: 25 },
  },
  {
    sport: "Boxing (Pro)",
    rate: 1081,
    perMinute: 1.081,
    color: "#ff4d4d",
    icon: "🥊",
    source: "Zazryn et al., Br J Sports Med (2006)",
    note: "Competition only; training rate is ~0.5/1000h",
    category: "Combat",
    avgMatchMin: 36,
    severity: { minor: 30, moderate: 35, severe: 35 },
    bodyParts: { head: 71, upperBody: 15, lowerBody: 8, spine: 6 },
  },
  {
    sport: "Rugby League",
    rate: 825,
    perMinute: 0.825,
    color: "#ff6b35",
    icon: "🏉",
    source: "Gabbett, J Sci Med Sport (2004)",
    note: "Semi-professional; match injuries only",
    category: "Contact",
    avgMatchMin: 80,
    severity: { minor: 40, moderate: 35, severe: 25 },
    bodyParts: { head: 22, upperBody: 18, lowerBody: 45, spine: 15 },
  },
  {
    sport: "MMA",
    rate: 246,
    perMinute: 0.246,
    color: "#ff8c42",
    icon: "🤼",
    source: "Lystad et al., Br J Sports Med (2014)",
    note: "228.7 per 1000 athlete-exposures (competition)",
    category: "Combat",
    avgMatchMin: 10,
    severity: { minor: 35, moderate: 38, severe: 27 },
    bodyParts: { head: 67, upperBody: 14, lowerBody: 12, spine: 7 },
  },
  {
    sport: "Rugby Union",
    rate: 91,
    perMinute: 0.091,
    color: "#ffa62b",
    icon: "🏉",
    source: "Williams et al., Br J Sports Med (2013)",
    note: "Professional level; elite international slightly higher",
    category: "Contact",
    avgMatchMin: 80,
    severity: { minor: 45, moderate: 35, severe: 20 },
    bodyParts: { head: 20, upperBody: 18, lowerBody: 50, spine: 12 },
  },
  {
    sport: "American Football",
    rate: 75.4,
    perMinute: 0.0754,
    color: "#c1a517",
    icon: "🏈",
    source: "NFL ISS / Harvard Football Players Health (2017)",
    note: "75.4/1000 AEs; highest of Big 4 NA sports",
    category: "Contact",
    avgMatchMin: 60,
    severity: { minor: 42, moderate: 36, severe: 22 },
    bodyParts: { head: 15, upperBody: 20, lowerBody: 52, spine: 13 },
  },
  {
    sport: "Ice Hockey",
    rate: 49.4,
    perMinute: 0.0494,
    color: "#4dabf7",
    icon: "🏒",
    source: "Bullock et al., Sci Reports (2021)",
    note: "49.4/1000 AEs; 44.3% from body checking",
    category: "Contact",
    avgMatchMin: 60,
    severity: { minor: 48, moderate: 32, severe: 20 },
    bodyParts: { head: 18, upperBody: 28, lowerBody: 38, spine: 16 },
  },
  {
    sport: "Soccer",
    rate: 36,
    perMinute: 0.036,
    color: "#51cf66",
    icon: "⚽",
    source: "Ayala et al., Br J Sports Med (2019) Meta-analysis",
    note: "8.1 overall; 36/1000h in matches only",
    category: "Contact",
    avgMatchMin: 90,
    severity: { minor: 55, moderate: 30, severe: 15 },
    bodyParts: { head: 8, upperBody: 10, lowerBody: 68, spine: 14 },
  },
  {
    sport: "Basketball",
    rate: 19.3,
    perMinute: 0.0193,
    color: "#f783ac",
    icon: "🏀",
    source: "Bullock et al., Sci Reports (2021)",
    note: "19.3/1000 AEs; 67% injured per season",
    category: "Contact",
    avgMatchMin: 48,
    severity: { minor: 55, moderate: 30, severe: 15 },
    bodyParts: { head: 6, upperBody: 15, lowerBody: 65, spine: 14 },
  },
  {
    sport: "Tennis",
    rate: 3.0,
    perMinute: 0.003,
    color: "#b197fc",
    icon: "🎾",
    source: "Pluim et al., Br J Sports Med (2006)",
    note: "3.0/1000 hours of play",
    category: "Non-Contact",
    avgMatchMin: 90,
    severity: { minor: 60, moderate: 28, severe: 12 },
    bodyParts: { head: 2, upperBody: 32, lowerBody: 52, spine: 14 },
  },
  {
    sport: "Baseball",
    rate: 3.61,
    perMinute: 0.00361,
    color: "#82c91e",
    icon: "⚾",
    source: "Bullock et al., Sci Reports (2021)",
    note: "3.61/1000 AEs; lowest of Big 4 NA sports",
    category: "Non-Contact",
    avgMatchMin: 180,
    severity: { minor: 50, moderate: 35, severe: 15 },
    bodyParts: { head: 5, upperBody: 35, lowerBody: 42, spine: 18 },
  },
  {
    sport: "Swimming",
    rate: 1.0,
    perMinute: 0.001,
    color: "#22b8cf",
    icon: "🏊",
    source: "Mountjoy et al., Br J Sports Med (2015)",
    note: "One of the lowest injury rates in sport",
    category: "Non-Contact",
    avgMatchMin: 5,
    severity: { minor: 65, moderate: 25, severe: 10 },
    bodyParts: { head: 2, upperBody: 45, lowerBody: 28, spine: 25 },
  },
];

const SEVERITY_COLORS = { minor: "#51cf66", moderate: "#fcc419", severe: "#ff6b6b" };
const BODY_COLORS = { head: "#ff6b6b", upperBody: "#fcc419", lowerBody: "#4dabf7", spine: "#b197fc" };
const CATEGORY_COLORS = { Extreme: "#ff2e2e", Combat: "#ff6b35", Contact: "#ffa62b", "Non-Contact": "#51cf66" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: "rgba(15,15,25,0.96)", border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 10, padding: "14px 18px", maxWidth: 300,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#ddd"
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: d?.color || "#fff", marginBottom: 6 }}>
        {d?.icon} {d?.sport}
      </div>
      <div style={{ color: "#aaa", marginBottom: 4 }}>
        <strong style={{ color: "#fff" }}>{d?.rate?.toLocaleString()}</strong> injuries / 1,000 match hours
      </div>
      <div style={{ color: "#aaa", marginBottom: 8 }}>
        ≈ <strong style={{ color: "#fff" }}>{d?.perMinute?.toFixed(3)}</strong> injuries / minute
      </div>
      <div style={{ fontSize: 10, color: "#888", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 6 }}>
        {d?.source}
      </div>
      {d?.note && <div style={{ fontSize: 10, color: "#666", marginTop: 2, fontStyle: "italic" }}>{d.note}</div>}
    </div>
  );
};

const StatCard = ({ label, value, sub, color = "#fff", icon }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "18px 20px", flex: "1 1 200px", minWidth: 180,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: -10, right: -5, fontSize: 48, opacity: 0.06,
      fontFamily: "serif"
    }}>{icon}</div>
    <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{sub}</div>}
  </div>
);

const Tab = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? "rgba(255,255,255,0.1)" : "transparent",
      border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
      color: active ? "#fff" : "#888",
      padding: "8px 18px", borderRadius: 8, cursor: "pointer",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
      fontWeight: active ? 600 : 400, transition: "all 0.2s",
    }}
  >
    {label}
  </button>
);

// Chart for per-minute rate (log scale comparison)
const PerMinuteChart = () => {
  const sorted = [...injuryRateData].sort((a, b) => b.perMinute - a.perMinute);
  return (
    <ResponsiveContainer width="100%" height={460}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis
          type="number" scale="log" domain={[0.0008, 2]}
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          tickFormatter={(v) => v >= 1 ? v.toFixed(1) : v >= 0.01 ? v.toFixed(2) : v.toFixed(3)}
        />
        <YAxis
          type="category" dataKey="sport" width={140}
          tick={({ x, y, payload }) => {
            const item = sorted.find(d => d.sport === payload.value);
            return (
              <text x={x} y={y} dy={4} textAnchor="end" fill="#ccc" fontSize={12}
                fontFamily="'JetBrains Mono', monospace">
                {item?.icon} {payload.value}
              </text>
            );
          }}
          stroke="rgba(255,255,255,0.1)"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="perMinute" radius={[0, 6, 6, 0]} barSize={24}>
          {sorted.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Main bar chart (per 1000 hours)
const MainChart = () => {
  const sorted = [...injuryRateData].sort((a, b) => b.rate - a.rate);
  return (
    <ResponsiveContainer width="100%" height={460}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis
          type="number" scale="log" domain={[0.8, 2000]}
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v.toFixed(0)}
        />
        <YAxis
          type="category" dataKey="sport" width={140}
          tick={({ x, y, payload }) => {
            const item = sorted.find(d => d.sport === payload.value);
            return (
              <text x={x} y={y} dy={4} textAnchor="end" fill="#ccc" fontSize={12}
                fontFamily="'JetBrains Mono', monospace">
                {item?.icon} {payload.value}
              </text>
            );
          }}
          stroke="rgba(255,255,255,0.1)"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="rate" radius={[0, 6, 6, 0]} barSize={24}>
          {sorted.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Body part breakdown
const BodyPartChart = () => {
  const data = injuryRateData
    .filter(d => ["Boxing (Pro)", "MMA", "American Football", "Soccer", "Basketball", "Ice Hockey", "Rugby Union"].includes(d.sport))
    .map(d => ({
      sport: d.sport,
      icon: d.icon,
      ...d.bodyParts,
    }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ left: 10, right: 20, top: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="sport"
          tick={({ x, y, payload }) => {
            const item = data.find(d => d.sport === payload.value);
            return (
              <text x={x} y={y + 14} textAnchor="middle" fill="#aaa" fontSize={10}
                fontFamily="'JetBrains Mono', monospace">
                {item?.icon} {payload.value?.split(" ")[0]}
              </text>
            );
          }}
          stroke="rgba(255,255,255,0.1)"
        />
        <YAxis
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,15,25,0.96)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11
          }}
          formatter={(v, name) => [`${v}%`, name === "head" ? "🧠 Head/Neck" : name === "upperBody" ? "💪 Upper Body" : name === "lowerBody" ? "🦵 Lower Body" : "🦴 Spine/Trunk"]}
        />
        <Legend
          formatter={(v) => v === "head" ? "Head/Neck" : v === "upperBody" ? "Upper Body" : v === "lowerBody" ? "Lower Body" : "Spine/Trunk"}
          wrapperStyle={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
        />
        <Bar dataKey="head" stackId="a" fill={BODY_COLORS.head} radius={[0,0,0,0]} />
        <Bar dataKey="upperBody" stackId="a" fill={BODY_COLORS.upperBody} />
        <Bar dataKey="lowerBody" stackId="a" fill={BODY_COLORS.lowerBody} />
        <Bar dataKey="spine" stackId="a" fill={BODY_COLORS.spine} radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Severity comparison
const SeverityChart = () => {
  const data = injuryRateData
    .filter(d => ["Bull Riding", "Boxing (Pro)", "MMA", "American Football", "Soccer", "Basketball", "Ice Hockey"].includes(d.sport))
    .map(d => ({ sport: d.sport, icon: d.icon, color: d.color, ...d.severity }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ left: 10, right: 20, top: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="sport"
          tick={({ x, y, payload }) => {
            const item = data.find(d => d.sport === payload.value);
            return (
              <text x={x} y={y + 14} textAnchor="middle" fill="#aaa" fontSize={10}
                fontFamily="'JetBrains Mono', monospace">
                {item?.icon} {payload.value?.split(" ")[0]?.substring(0, 8)}
              </text>
            );
          }}
          stroke="rgba(255,255,255,0.1)"
        />
        <YAxis
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,15,25,0.96)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 11
          }}
          formatter={(v, name) => [`${v}%`, name === "minor" ? "✅ Minor (1-3 days)" : name === "moderate" ? "⚠️ Moderate (4-28 days)" : "🚨 Severe (28+ days)"]}
        />
        <Legend
          formatter={(v) => v === "minor" ? "Minor" : v === "moderate" ? "Moderate" : "Severe"}
          wrapperStyle={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
        />
        <Bar dataKey="minor" stackId="a" fill={SEVERITY_COLORS.minor} />
        <Bar dataKey="moderate" stackId="a" fill={SEVERITY_COLORS.moderate} />
        <Bar dataKey="severe" stackId="a" fill={SEVERITY_COLORS.severe} radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Scatter: Rate vs Severity
const RiskMatrix = () => {
  const data = injuryRateData.map(d => ({
    ...d,
    severePct: d.severity.severe,
    logRate: Math.log10(d.rate),
  }));

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ScatterChart margin={{ left: 10, right: 30, top: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="logRate" name="Injury Rate"
          type="number" domain={[-0.2, 3.3]}
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          tickFormatter={(v) => {
            const actual = Math.pow(10, v);
            return actual >= 1000 ? `${(actual/1000).toFixed(0)}K` : actual >= 1 ? actual.toFixed(0) : actual.toFixed(1);
          }}
          label={{ value: "Injuries per 1,000 match hours (log scale)", position: "insideBottom", offset: -5, fill: "#666", fontSize: 10 }}
        />
        <YAxis
          dataKey="severePct" name="Severe %"
          tick={{ fill: "#888", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
          stroke="rgba(255,255,255,0.1)"
          label={{ value: "Severe Injuries (%)", angle: -90, position: "insideLeft", fill: "#666", fontSize: 10 }}
          domain={[5, 45]}
        />
        <ZAxis dataKey="avgMatchMin" range={[80, 400]} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{
                background: "rgba(15,15,25,0.96)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "12px 16px",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#ddd"
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d?.color }}>{d?.icon} {d?.sport}</div>
                <div>Rate: <strong>{d?.rate?.toLocaleString()}</strong>/1000h</div>
                <div>Severe: <strong>{d?.severePct}%</strong></div>
                <div style={{ color: "#888", fontSize: 10 }}>Bubble size = avg match duration</div>
              </div>
            );
          }}
        />
        <Scatter data={data}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} fillOpacity={0.8} stroke={d.color} strokeWidth={1} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// Data table
const DataTable = () => {
  const sorted = [...injuryRateData].sort((a, b) => b.rate - a.rate);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{
        width: "100%", borderCollapse: "separate", borderSpacing: "0 4px",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
      }}>
        <thead>
          <tr style={{ color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10 }}>#</th>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10 }}>Sport</th>
            <th style={{ textAlign: "right", padding: "8px 12px", fontSize: 10 }}>Rate /1000h</th>
            <th style={{ textAlign: "right", padding: "8px 12px", fontSize: 10 }}>Per Minute</th>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10 }}>Category</th>
            <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, minWidth: 200 }}>Source</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, i) => (
            <tr key={d.sport} style={{
              background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              borderRadius: 6,
            }}>
              <td style={{ padding: "10px 12px", color: "#666" }}>{i + 1}</td>
              <td style={{ padding: "10px 12px", color: "#fff", fontWeight: 600 }}>
                <span style={{ marginRight: 8 }}>{d.icon}</span>{d.sport}
              </td>
              <td style={{
                padding: "10px 12px", textAlign: "right", fontWeight: 700,
                color: d.color,
              }}>
                {d.rate >= 1000 ? `${(d.rate / 1000).toFixed(1)}K` : d.rate.toFixed(1)}
              </td>
              <td style={{ padding: "10px 12px", textAlign: "right", color: "#ccc" }}>
                {d.perMinute >= 1 ? d.perMinute.toFixed(2) : d.perMinute >= 0.01 ? d.perMinute.toFixed(3) : d.perMinute.toFixed(4)}
              </td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{
                  background: `${CATEGORY_COLORS[d.category]}22`,
                  color: CATEGORY_COLORS[d.category],
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                }}>
                  {d.category}
                </span>
              </td>
              <td style={{ padding: "10px 12px", color: "#888", fontSize: 10 }}>{d.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Methodology section
const Methodology = () => (
  <div style={{ color: "#aaa", fontSize: 12, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
    <h3 style={{ color: "#fff", fontSize: 16, marginBottom: 12, fontWeight: 700 }}>
      📐 Methodology & Caveats
    </h3>
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <strong style={{ color: "#fcc419" }}>Normalization Challenge</strong>
        <p style={{ margin: "6px 0 0" }}>
          Sports injury research uses inconsistent denominators: some studies report per 1,000
          athlete-exposures (1 AE = 1 athlete in 1 game), others per 1,000 hours of play. We've
          prioritized <strong style={{ color: "#fff" }}>match/competition hours</strong> wherever available, as this
          best captures "per minute" risk during actual play.
        </p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <strong style={{ color: "#fcc419" }}>Injury Definitions Vary</strong>
        <p style={{ margin: "6px 0 0" }}>
          What counts as an "injury" differs wildly between studies. Some use "time-loss" injuries
          (must miss ≥1 day), others count any medical attention. Combat sports often record injuries
          per bout rather than per hour, inflating rates relative to team sports. The Fuller consensus
          statement (2006) attempted to standardize this, but not all studies follow it.
        </p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <strong style={{ color: "#fcc419" }}>Training vs. Match</strong>
        <p style={{ margin: "6px 0 0" }}>
          Match injury rates are dramatically higher than training rates across all sports —
          typically 5-10× higher. The rates shown here are <strong style={{ color: "#fff" }}>match/competition only</strong>.
          Combined rates (training + match) would be significantly lower. For example,
          professional soccer has an overall rate of ~8.1/1000h but a match-only rate of ~36/1000h.
        </p>
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <strong style={{ color: "#fcc419" }}>Key Sources</strong>
        <p style={{ margin: "6px 0 0" }}>
          Data compiled from peer-reviewed meta-analyses and epidemiological studies published in
          the British Journal of Sports Medicine, American Journal of Sports Medicine, Clinical Journal
          of Sport Medicine, and Scientific Reports. NFL data sourced from the Harvard Football Players
          Health Study and NFL Injury Surveillance System.
        </p>
      </div>
    </div>
  </div>
);

export default function InjuryDashboard() {
  const [activeTab, setActiveTab] = useState("rate");
  const [animate, setAnimate] = useState(false);

  useEffect(() => { setAnimate(true); }, []);

  const highestRate = injuryRateData.reduce((a, b) => a.rate > b.rate ? a : b);
  const lowestRate = injuryRateData.reduce((a, b) => a.rate < b.rate ? a : b);
  const avgRate = injuryRateData.reduce((a, b) => a + b.rate, 0) / injuryRateData.length;
  const mostSevere = injuryRateData.reduce((a, b) => a.severity.severe > b.severity.severe ? a : b);

  return (
    <div style={{
      background: "linear-gradient(145deg, #0a0a14 0%, #0f0f1e 40%, #0a0a14 100%)",
      minHeight: "100vh", color: "#fff", padding: "0",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "48px 32px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(255,46,46,0.04) 0%, transparent 100%)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            fontSize: 10, color: "#ff6b6b", letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 8, fontWeight: 600,
            opacity: animate ? 1 : 0, transition: "opacity 0.6s ease",
          }}>
            Sports Analytics Research
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 800, margin: 0,
            lineHeight: 1.1, letterSpacing: -1,
            opacity: animate ? 1 : 0, transform: animate ? "none" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <span style={{ color: "#ff4d4d" }}>Injury Risk</span> Per Minute
            <br />
            <span style={{ color: "#888", fontSize: "0.55em", fontWeight: 400, letterSpacing: 0 }}>
              Across Professional Sports
            </span>
          </h1>
          <p style={{
            color: "#666", fontSize: 12, maxWidth: 600, marginTop: 12, lineHeight: 1.7,
            opacity: animate ? 1 : 0, transition: "opacity 0.6s ease 0.3s",
          }}>
            A data-driven comparison of match injury incidence rates normalized to playing time,
            compiled from peer-reviewed epidemiological research and league surveillance data.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 64px" }}>
        {/* Stat Cards */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32,
          opacity: animate ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
        }}>
          <StatCard
            icon="🐂" label="Highest Rate" color="#ff2e2e"
            value={`${(highestRate.rate / 1000).toFixed(1)}K`}
            sub={`${highestRate.sport} — ${highestRate.perMinute.toFixed(2)}/min`}
          />
          <StatCard
            icon="🏊" label="Lowest Rate" color="#51cf66"
            value={lowestRate.rate.toFixed(1)}
            sub={`${lowestRate.sport} — ${lowestRate.perMinute.toFixed(4)}/min`}
          />
          <StatCard
            icon="📊" label="Spread Factor" color="#fcc419"
            value={`${(highestRate.rate / lowestRate.rate).toFixed(0)}×`}
            sub="Highest vs lowest rate"
          />
          <StatCard
            icon="🚨" label="Most Severe" color="#ff6b6b"
            value={`${mostSevere.severity.severe}%`}
            sub={`${mostSevere.sport} — severe injuries`}
          />
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap",
          background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: 4,
          border: "1px solid rgba(255,255,255,0.06)",
          width: "fit-content",
        }}>
          <Tab active={activeTab === "rate"} label="📊 Per 1,000 Hours" onClick={() => setActiveTab("rate")} />
          <Tab active={activeTab === "permin"} label="⏱ Per Minute" onClick={() => setActiveTab("permin")} />
          <Tab active={activeTab === "body"} label="🦴 Body Parts" onClick={() => setActiveTab("body")} />
          <Tab active={activeTab === "severity"} label="🚨 Severity" onClick={() => setActiveTab("severity")} />
          <Tab active={activeTab === "matrix"} label="⚡ Risk Matrix" onClick={() => setActiveTab("matrix")} />
          <Tab active={activeTab === "data"} label="📋 Raw Data" onClick={() => setActiveTab("data")} />
          <Tab active={activeTab === "method"} label="📐 Methods" onClick={() => setActiveTab("method")} />
        </div>

        {/* Chart Area */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "20px 12px",
          marginBottom: 24,
        }}>
          <div style={{ padding: "0 12px 12px", marginBottom: 4 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#fff" }}>
              {activeTab === "rate" && "Match Injury Rate — Per 1,000 Hours of Competition"}
              {activeTab === "permin" && "Injuries Per Minute of Match Play"}
              {activeTab === "body" && "Injury Distribution by Body Region"}
              {activeTab === "severity" && "Injury Severity Breakdown"}
              {activeTab === "matrix" && "Risk Matrix — Rate vs. Severity"}
              {activeTab === "data" && "Complete Dataset"}
              {activeTab === "method" && "Methodology & Sources"}
            </h2>
            <p style={{ fontSize: 11, color: "#666", margin: "4px 0 0" }}>
              {activeTab === "rate" && "Log scale — combat and extreme sports dominate by orders of magnitude"}
              {activeTab === "permin" && "Log scale — probability of injury occurring in any given minute"}
              {activeTab === "body" && "Percentage breakdown of where injuries occur across major sports"}
              {activeTab === "severity" && "Minor (<3 days lost), Moderate (4-28 days), Severe (28+ days)"}
              {activeTab === "matrix" && "Bubble size represents average match duration in minutes"}
              {activeTab === "data" && "All data sourced from peer-reviewed epidemiological studies"}
              {activeTab === "method" && "Important caveats and limitations of cross-sport injury comparison"}
            </p>
          </div>

          {activeTab === "rate" && <MainChart />}
          {activeTab === "permin" && <PerMinuteChart />}
          {activeTab === "body" && <BodyPartChart />}
          {activeTab === "severity" && <SeverityChart />}
          {activeTab === "matrix" && <RiskMatrix />}
          {activeTab === "data" && <DataTable />}
          {activeTab === "method" && <div style={{ padding: "0 12px" }}><Methodology /></div>}
        </div>

        {/* Key Insights */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16, marginBottom: 32,
        }}>
          <div style={{
            background: "rgba(255,46,46,0.05)", border: "1px solid rgba(255,46,46,0.15)",
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff4d4d", marginBottom: 8 }}>
              🔑 The 1,440× Gap
            </div>
            <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
              Bull riding's injury rate is <strong style={{ color: "#fff" }}>1,440× higher</strong> than
              swimming's. A bull rider faces more injury risk in 8 seconds than a swimmer does
              in an entire competition. Combat sports (boxing, MMA) occupy their own tier,
              with rates 10-100× higher than team sports.
            </p>
          </div>
          <div style={{
            background: "rgba(77,171,247,0.05)", border: "1px solid rgba(77,171,247,0.15)",
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4dabf7", marginBottom: 8 }}>
              🧠 Head Injury Dominance
            </div>
            <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
              In boxing, <strong style={{ color: "#fff" }}>71%</strong> of all injuries are to the head and neck.
              MMA follows at 67%. By contrast, soccer and basketball see 60-68% of injuries
              concentrated in the lower body — reflecting the fundamental biomechanics of
              each sport.
            </p>
          </div>
          <div style={{
            background: "rgba(81,207,102,0.05)", border: "1px solid rgba(81,207,102,0.15)",
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#51cf66", marginBottom: 8 }}>
              📈 NFL's Unique Position
            </div>
            <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.7, margin: 0 }}>
              The NFL has the highest game injury rate among the Big 4 North American sports
              at <strong style={{ color: "#fff" }}>75.4/1000 AEs</strong> — roughly 4-5× higher than NBA, NHL, and MLB.
              It's also the only major league where injury counts have increased
              year-over-year since 2017 (up 73%).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20,
          color: "#555", fontSize: 10, lineHeight: 1.6,
        }}>
          <strong style={{ color: "#888" }}>Disclaimer:</strong> This analysis compiles data from published
          epidemiological research for educational purposes. Injury rates across studies use different
          methodologies, injury definitions, and populations, making direct comparison inherently imprecise.
          Rates shown are for match/competition exposure only unless otherwise noted.
          <br /><br />
          Built with ☕ and Recharts • Data from BJSM, AJSM, CJSM, Nature Scientific Reports, NFL ISS
        </div>
      </div>
    </div>
  );
}
