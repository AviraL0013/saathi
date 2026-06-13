"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, ArrowLeft, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { demoService, type DemoData } from "@/services/demo.service";

// ─── Primitives ───────────────────────────────────────────────────────────────

function Dot({ color = "#8b5cf6", pulse = false }: { color?: string; pulse?: boolean }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${pulse ? "animate-pulse" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "purple" | "muted" | "warning" }) {
  const styles = {
    default: "bg-[#f3f4f6] text-[#6b7280]",
    purple: "bg-[#f5f3ff] text-[#7c3aed]",
    muted: "bg-[#f9fafb] text-[#9ca3af]",
    warning: "bg-[#fef9c3] text-[#854d0e]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-mono font-semibold tracking-wide ${styles[variant]}`}>
      {children}
    </span>
  );
}

function RouteTag({ route }: { route: string }) {
  const map: Record<string, { label: string; v: "default" | "purple" | "muted" | "warning" }> = {
    RULE_ENGINE: { label: "Rule", v: "purple" },
    BEDROCK: { label: "AI", v: "default" },
    SUPPRESS: { label: "Skip", v: "muted" },
    PATTERN: { label: "Pattern", v: "warning" },
  };
  const m = map[route] ?? map.SUPPRESS;
  return <Tag variant={m.v}>{m.label}</Tag>;
}

function ConfidenceBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "#8b5cf6" : pct >= 60 ? "#6b7280" : "#d1d5db";
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-[3px] bg-[#f3f4f6] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="font-mono text-[10px] text-[#9ca3af] w-7 text-right shrink-0">{pct}%</span>
    </div>
  );
}

// ─── Card shell ──────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#e5e7eb] rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ label }: { label: string }) {
  return (
    <div className="px-5 pt-4 pb-3 border-b border-[#f3f4f6]">
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">{label}</p>
    </div>
  );
}

// ─── Household graph (SVG-based relationship map) ────────────────────────────

function HouseholdGraph({ data }: { data: DemoData }) {
  const members = data.household.members;

  // Larger canvas and ring so name text never overlaps center or neighbors
  const W = 700;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const ringR = 150;   // distance from center to node center
  const nodeR = 28;    // node circle radius
  const labelR = 200;  // distance from center to edge-label text (outside the ring)

  const nodes = members.map((m, i) => {
    const angle = (i / members.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...m,
      x: cx + ringR * Math.cos(angle),
      y: cy + ringR * Math.sin(angle),
      angle,
    };
  });

  // Which nodes have an annotated edge
  const edgeMap: Record<string, string> = {
    "mbr_dadaji_001": "Medication",
    "mbr_rohan_005": "Study",
    "mbr_mama_004": "Kitchen",
    "mbr_papa_003": "Water",
  };

  const ageColors: Record<string, string> = {
    senior: "#8b5cf6",
    adult: "#374151",
    teen: "#0ea5e9",
    child: "#10b981",
  };

  return (
    <div className="w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">

        {/* Subtle guide ring */}
        <circle
          cx={cx} cy={cy}
          r={ringR}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="1"
          strokeDasharray="4 5"
        />

        {/* Draw all spoke lines first (behind nodes) */}
        {nodes.map((node) => {
          const hasEdge = !!edgeMap[node.id];
          return (
            <line
              key={`line-${node.id}`}
              x1={node.x} y1={node.y}
              x2={cx} y2={cy}
              stroke={hasEdge ? "#c4b5fd" : "#ebebeb"}
              strokeWidth={hasEdge ? "1.5" : "1"}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Edge labels — placed OUTSIDE the ring at labelR, not at midpoint */}
        {nodes.map((node) => {
          const label = edgeMap[node.id];
          if (!label) return null;
          // Position label along the spoke, beyond the node
          const lx = cx + labelR * Math.cos(node.angle);
          const ly = cy + labelR * Math.sin(node.angle);
          // Anchor: left/right depending on which side of center
          const anchor = node.x > cx + 10 ? "start" : node.x < cx - 10 ? "end" : "middle";
          return (
            <text
              key={`label-${node.id}`}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="11"
              fill="#8b5cf6"
              fontFamily="ui-monospace, monospace"
              fontWeight="600"
              letterSpacing="0.03em"
            >
              {label}
            </text>
          );
        })}

        {/* Member nodes */}
        {nodes.map((node) => {
          const color = ageColors[node.ageGroup] ?? "#6b7280";
          const hasCare = data.household.healthConditions.some(c => c.memberId === node.id);

          // Name label: always push outward from center so it never overlaps the node
          const namePush = 46;
          const nx = cx + (ringR + namePush) * Math.cos(node.angle);
          const ny = cy + (ringR + namePush) * Math.sin(node.angle);
          const nameAnchor = node.x > cx + 10 ? "start" : node.x < cx - 10 ? "end" : "middle";

          return (
            <g key={node.id}>
              {/* Care ring */}
              {hasCare && (
                <circle
                  cx={node.x} cy={node.y}
                  r={nodeR + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  opacity="0.25"
                  strokeDasharray="3 3"
                />
              )}

              {/* Node circle */}
              <circle
                cx={node.x} cy={node.y}
                r={nodeR}
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1.5"
              />

              {/* Initial */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="15"
                fontWeight="700"
                fill={color}
                fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
              >
                {node.name[0]}
              </text>

              {/* Name — pushed outside ring */}
              <text
                x={nx}
                y={ny - 6}
                textAnchor={nameAnchor}
                fontSize="12"
                fontWeight="600"
                fill="#374151"
                fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
              >
                {node.name}
              </text>
              {/* Age */}
              <text
                x={nx}
                y={ny + 9}
                textAnchor={nameAnchor}
                fontSize="10"
                fill="#9ca3af"
                fontFamily="ui-monospace, monospace"
              >
                {node.age}
              </text>
            </g>
          );
        })}

        {/* Center node — SAATHI */}
        <circle cx={cx} cy={cy} r={42} fill="#111827" />
        <circle cx={cx} cy={cy} r={47} fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3" />
        <text
          x={cx} y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fontWeight="700"
          fill="white"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.12em"
        >
          SAATHI
        </text>
        <text
          x={cx} y={cy + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="#a78bfa"
          fontFamily="ui-monospace, monospace"
        >
          {data.intelligenceStats.patternsDetected} patterns
        </text>
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoSharmaPage() {
  const [data, setData] = useState<DemoData | null>(null);
  const [tab, setTab] = useState<"overview" | "devices" | "routines" | "activity" | "alerts">("overview");

  useEffect(() => {
    demoService.load().then(setData);
  }, []);

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f3]">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#8b5cf6]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[13px] text-[#9ca3af] font-mono tracking-wide">Loading household…</span>
        </div>
      </div>
    );
  }

  const {
    household,
    devices,
    routines,
    activity,
    predictions,
    notifications,
    intelligenceStats,
    notificationStats,
  } = data;

  const pendingNotifs = notifications.filter((n) => !n.acknowledged).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const tabs: { id: typeof tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "devices", label: "Devices", count: devices.filter(d => d.status === "alert").length || undefined },
    { id: "routines", label: "Routines" },
    { id: "activity", label: "Activity" },
    { id: "alerts", label: "Alerts", count: pendingNotifs || undefined },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f3]">

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-[#faf7f3]/95 backdrop-blur-sm border-b border-[#e5e7eb]" style={{ minHeight: 0 }}>
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 flex items-center justify-between h-[56px] gap-4">

          {/* Left — nav + greeting */}
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 text-[#9ca3af] hover:text-[#374151] transition-colors shrink-0">
              <ArrowLeft size={14} strokeWidth={2} />
            </Link>
            <div className="w-px h-4 bg-[#e5e7eb] shrink-0" />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[14px] font-semibold text-[#111827]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {greeting}, {household.familyName} Family
                </span>
                <span className="text-[13px] text-[#6b7280] font-normal">
                  · SAATHI observed {intelligenceStats.actionsToday} household events today
                  {intelligenceStats.patternsDetected > 0 && ` and is learning ${intelligenceStats.patternsDetected} patterns`}.
                </span>
              </div>
            </div>
          </div>

          {/* Right — status indicators */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Source pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-white">
              <Dot color={data.source === "backend" ? "#10b981" : "#f59e0b"} />
              <span className="font-mono text-[10px] text-[#6b7280] tracking-wide">
                {data.source === "backend" ? "Live" : "Demo"}
              </span>
            </div>
            {/* Learning pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ede9fe] bg-[#f5f3ff]">
              <Sparkles size={10} className="text-[#8b5cf6]" />
              <span className="font-mono text-[10px] text-[#8b5cf6] tracking-wide">{household.daysLearning}d learning</span>
            </div>
            {/* Bell */}
            {pendingNotifs > 0 && (
              <button className="relative w-8 h-8 rounded-lg border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-[#f9fafb] transition-colors">
                <Bell size={13} className="text-[#374151]" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#8b5cf6] text-white text-[8px] font-bold flex items-center justify-center">
                  {pendingNotifs}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 flex gap-0 border-t border-[#f3f4f6]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? "text-[#111827] border-[#111827]"
                  : "text-[#9ca3af] border-transparent hover:text-[#6b7280]"
              }`}
            >
              {t.label}
              {t.count ? (
                <span className="w-4 h-4 rounded-full bg-[#8b5cf6] text-white text-[9px] font-bold flex items-center justify-center">
                  {t.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      {/* ─── Main content ────────────────────────────────────────────────── */}
      <main className="max-w-[1600px] mx-auto px-5 sm:px-8 py-5 pb-16">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >

          {/* ═════════════════════════════ OVERVIEW ═══════════════════════ */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

              {/* ── Left column ─────────────────────────────────── */}
              <div className="flex flex-col gap-4 min-w-0">

                {/* Intelligence cards row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1 — Understanding */}
                  <Card>
                    <div className="px-5 py-4">
                      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold mb-2">Household understanding</p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[24px] font-bold text-[#111827]">87%</span>
                        <span className="text-[13px] text-[#6b7280]">comprehension</span>
                      </div>
                      <p className="text-[13px] text-[#6b7280] leading-relaxed">
                        Medication routines fully learned. Study patterns still developing.
                      </p>
                      <div className="mt-3">
                        <ConfidenceBar pct={87} />
                      </div>
                    </div>
                  </Card>

                  {/* Card 2 — Learned today */}
                  <Card>
                    <div className="px-5 py-4">
                      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold mb-2">Learned today</p>
                      <p className="text-[13px] text-[#374151] leading-relaxed">
                        Family dinner now happens around <span className="text-[#111827] font-semibold">8:22 PM</span>.
                        Water motor usage drops on <span className="text-[#111827] font-semibold">Sundays</span>.
                      </p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <Dot color="#8b5cf6" />
                        <span className="text-[12px] text-[#9ca3af]">{intelligenceStats.patternsDetected} patterns tracked</span>
                      </div>
                    </div>
                  </Card>

                  {/* Card 3 — Attention */}
                  <Card>
                    <div className="px-5 py-4">
                      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold mb-2">Recommended attention</p>
                      <p className="text-[13px] text-[#374151] leading-relaxed">
                        Water usage increased <span className="text-[#111827] font-semibold">18%</span>.
                        Medication reminder due in <span className="text-[#111827] font-semibold">2 hours</span>.
                      </p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <Dot color="#f59e0b" pulse />
                        <span className="text-[12px] text-[#9ca3af]">1 action pending</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Household graph */}
                <Card>
                  <CardHeader label="Household knowledge graph" />
                  <div className="px-4 py-2">
                    <HouseholdGraph data={data} />
                  </div>
                  {/* Legend */}
                  <div className="px-5 pb-4 flex items-center gap-5 flex-wrap">
                    {[
                      { color: "#8b5cf6", label: "Elder" },
                      { color: "#374151", label: "Adult" },
                      { color: "#0ea5e9", label: "Teen" },
                      { color: "#10b981", label: "Child" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <Dot color={color} />
                        <span className="text-[12px] text-[#9ca3af]">{label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-px border-t border-dashed border-[#9ca3af]" />
                      <span className="text-[12px] text-[#9ca3af]">Active intelligence link</span>
                    </div>
                  </div>
                </Card>

                {/* Recent events */}
                <Card>
                  <CardHeader label="Recent events" />
                  <div className="divide-y divide-[#f3f4f6]">
                    {activity.slice(0, 6).map((act) => (
                      <div key={act.id} className="px-5 py-3 flex items-start gap-3">
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          <Dot
                            color={
                              act.severity === "success" ? "#10b981"
                              : act.severity === "warning" ? "#f59e0b"
                              : "#8b5cf6"
                            }
                          />
                          <span className="font-mono text-[11px] text-[#9ca3af] w-14">{act.timestamp}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[14px] font-semibold text-[#111827]">{act.title}</span>
                            <RouteTag route={act.route} />
                          </div>
                          {act.actionTaken && (
                            <p className="text-[13px] text-[#6b7280] mt-0.5 truncate">{act.actionTaken}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {activity.length > 6 && (
                    <div className="px-5 py-3 border-t border-[#f3f4f6]">
                      <button
                        className="text-[13px] text-[#8b5cf6] font-semibold hover:underline"
                        onClick={() => setTab("activity")}
                      >
                        View all {activity.length} events →
                      </button>
                    </div>
                  )}
                </Card>
              </div>

              {/* ── Right column ────────────────────────────────── */}
              <div className="flex flex-col gap-4">

                {/* Family status */}
                <Card>
                  <CardHeader label="Family status" />
                  <div className="divide-y divide-[#f3f4f6]">
                    {household.members.map((m) => {
                      const memberRoutines = routines.filter(r => r.memberId === m.id);
                      const promoted = memberRoutines.filter(r => r.confidenceBand === "PROMOTED");
                      const conditions = household.healthConditions.filter(c => c.memberId === m.id);
                      const ageColors: Record<string, string> = {
                        senior: "#8b5cf6",
                        adult: "#374151",
                        teen: "#0ea5e9",
                        child: "#10b981",
                      };
                      return (
                        <div key={m.id} className="px-5 py-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border border-[#e5e7eb] flex items-center justify-center text-[11px] font-bold shrink-0"
                                style={{ color: ageColors[m.ageGroup], borderColor: `${ageColors[m.ageGroup]}30`, backgroundColor: `${ageColors[m.ageGroup]}08` }}
                              >
                                {m.name[0]}
                              </div>
                              <span className="text-[14px] font-semibold text-[#111827]">{m.name}</span>
                              <span className="text-[12px] text-[#9ca3af]">{m.age}</span>
                              <span className="text-[11px] text-[#9ca3af] capitalize">{m.ageGroup}</span>
                            </div>
                            {promoted.length > 0 && (
                              <Tag variant="purple">{promoted.length} learned</Tag>
                            )}
                          </div>
                          {conditions.length > 0 && (
                            <p className="text-[12px] text-[#6b7280] pl-8">
                              {conditions.map(c => c.label).join(" · ")}
                            </p>
                          )}
                          {memberRoutines.length > 0 && promoted.length > 0 && (
                            <div className="pl-8 mt-1.5">
                              <ConfidenceBar pct={Math.round(promoted.reduce((a, r) => a + (r.confidence ?? 0), 0) / promoted.length * 100)} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Medicine tracking */}
                <Card>
                  <CardHeader label="Medication tracker" />
                  <div className="divide-y divide-[#f3f4f6]">
                    {household.medications.map((med) => {
                      const member = household.members.find((m) => m.id === med.memberId);
                      return (
                        <div key={med.id} className="px-5 py-3 flex items-center gap-3">
                          {med.takenToday
                            ? <CheckCircle2 size={15} className="text-[#10b981] shrink-0" />
                            : <AlertCircle size={15} className="text-[#f59e0b] shrink-0" />
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#111827] truncate">{med.name}</p>
                            <p className="text-[12px] text-[#9ca3af]">{member?.name} · {med.schedule}</p>
                          </div>
                          <span className={`font-mono text-[11px] font-semibold shrink-0 ${med.takenToday ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                            {med.takenToday ? "Done" : "Due"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Predictions */}
                <Card>
                  <CardHeader label="Intelligence" />
                  <div className="divide-y divide-[#f3f4f6]">
                    {predictions.slice(0, 4).map((pred) => (
                      <div key={pred.id} className="px-5 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#111827] mb-0.5">{pred.title}</p>
                            <p className="text-[12px] text-[#6b7280] leading-relaxed">{pred.description}</p>
                            {pred.scheduledFor && (
                              <p className="text-[11px] text-[#8b5cf6] font-mono mt-1">{pred.scheduledFor}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="font-mono text-[12px] font-bold text-[#111827]">{pred.confidencePct}%</span>
                            <Tag variant="muted">{pred.confidence}</Tag>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>
            </div>
          )}

          {/* ═════════════════════════════ DEVICES ════════════════════════ */}
          {tab === "devices" && (
            <div className="max-w-3xl">
              <Card>
                <CardHeader label={`${devices.length} connected devices`} />
                <div className="divide-y divide-[#f3f4f6]">
                  {devices.map((device) => {
                    const statusConfig: Record<string, { color: string; label: string; pulse: boolean }> = {
                      on: { color: "#10b981", label: "On", pulse: false },
                      off: { color: "#d1d5db", label: "Off", pulse: false },
                      alert: { color: "#f59e0b", label: "Alert", pulse: true },
                      standby: { color: "#9ca3af", label: "Standby", pulse: false },
                      protected: { color: "#8b5cf6", label: "Protected", pulse: false },
                    };
                    const sc = statusConfig[device.status] ?? statusConfig.off;
                    return (
                      <div key={device.id} className="px-5 py-4 flex items-start gap-4">
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          <Dot color={sc.color} pulse={sc.pulse} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-[14px] font-semibold text-[#111827]">{device.name}</span>
                            <span className="text-[12px] text-[#9ca3af]">{device.room}</span>
                            <Tag variant={device.status === "alert" ? "warning" : "muted"}>{sc.label}</Tag>
                          </div>
                          <p className="text-[13px] text-[#6b7280]">{device.detail}</p>
                          {device.saathiNote && (
                            <p className="text-[12px] text-[#8b5cf6] mt-1 font-medium">{device.saathiNote}</p>
                          )}
                        </div>
                        <span className="text-[12px] text-[#9ca3af] shrink-0 pt-0.5">{device.primaryUserName}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ═════════════════════════════ ROUTINES ═══════════════════════ */}
          {tab === "routines" && (
            <div className="max-w-3xl">
              <Card>
                <CardHeader label={`${routines.length} routines · ${routines.filter(r => r.confidenceBand === "PROMOTED").length} fully learned`} />
                <div className="divide-y divide-[#f3f4f6]">
                  {routines.map((routine) => {
                    const statusDot: Record<string, string> = {
                      completed: "#10b981",
                      active: "#8b5cf6",
                      upcoming: "#f59e0b",
                      missed: "#ef4444",
                    };
                    return (
                      <div key={routine.id} className="px-5 py-3.5 flex items-start gap-3">
                        <Dot color={statusDot[routine.status] ?? "#9ca3af"} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[14px] font-semibold text-[#111827]">{routine.description}</span>
                                {routine.confidenceBand && (
                                  <Tag variant={routine.confidenceBand === "PROMOTED" ? "purple" : "muted"}>
                                    {routine.confidenceBand}
                                  </Tag>
                                )}
                              </div>
                              <p className="text-[12px] text-[#9ca3af] mt-0.5">{routine.memberName} · {routine.timeWindow}</p>
                              {routine.note && (
                                <p className="text-[12px] text-[#9ca3af] italic mt-0.5">{routine.note}</p>
                              )}
                            </div>
                          </div>
                          {routine.confidence !== undefined && (
                            <div className="mt-2 max-w-[200px]">
                              <ConfidenceBar pct={Math.round(routine.confidence * 100)} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ═════════════════════════════ ACTIVITY ═══════════════════════ */}
          {tab === "activity" && (
            <div className="max-w-3xl">
              <Card>
                <CardHeader label={`${activity.length} events today · ${intelligenceStats.routesBreakdown.ruleEngine} rule · ${intelligenceStats.routesBreakdown.bedrock} AI · ${intelligenceStats.routesBreakdown.suppressed} suppressed`} />
                <div className="divide-y divide-[#f3f4f6]">
                  {activity.map((act) => (
                    <div key={act.id} className="px-5 py-3.5 flex items-start gap-4">
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <Dot
                          color={
                            act.severity === "success" ? "#10b981"
                            : act.severity === "warning" ? "#f59e0b"
                            : "#8b5cf6"
                          }
                        />
                        <span className="font-mono text-[11px] text-[#9ca3af] w-14 shrink-0">{act.timestamp}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[14px] font-semibold text-[#111827]">{act.title}</span>
                          <RouteTag route={act.route} />
                          {act.ruleLabel && (
                            <span className="text-[12px] text-[#9ca3af]">{act.ruleLabel}</span>
                          )}
                        </div>
                        <p className="text-[13px] text-[#6b7280] leading-relaxed">{act.description}</p>
                        {act.actionTaken && (
                          <p className="text-[12px] text-[#8b5cf6] mt-0.5 font-medium">{act.actionTaken}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ═════════════════════════════ ALERTS ════════════════════════ */}
          {tab === "alerts" && (
            <div className="max-w-3xl flex flex-col gap-4">
              {/* Stats row — minimal */}
              <div className="flex items-center gap-6 px-1">
                {[
                  { label: "Sent today", value: notificationStats.sentToday },
                  { label: "Acknowledged", value: notificationStats.acknowledged },
                  { label: "Pending", value: notificationStats.pending },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-baseline gap-2">
                    <span className="text-[22px] font-bold text-[#111827]">{value}</span>
                    <span className="text-[13px] text-[#9ca3af]">{label}</span>
                  </div>
                ))}
              </div>

              <Card>
                <CardHeader label="Notification log" />
                <div className="divide-y divide-[#f3f4f6]">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-5 py-4 flex items-start gap-3">
                      <Dot
                        color={notif.acknowledged ? "#d1d5db" : "#8b5cf6"}
                        pulse={!notif.acknowledged}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[14px] font-semibold text-[#111827]">{notif.targetMemberName}</span>
                          <span className="text-[13px] text-[#9ca3af]">{notif.channelEmoji}</span>
                          <span className="font-mono text-[11px] text-[#9ca3af]">{notif.timestamp}</span>
                          {!notif.acknowledged && <Tag variant="warning">Pending</Tag>}
                        </div>
                        <p className="text-[13px] text-[#374151] leading-relaxed mb-1">{notif.message}</p>
                        {notif.messageHindi && (
                          <p className="text-[12px] text-[#9ca3af] italic mb-1">{notif.messageHindi}</p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-[11px] text-[#9ca3af]">{notif.triggeredByLabel}</span>
                          {notif.acknowledgedAt && (
                            <span className="font-mono text-[11px] text-[#10b981]">✓ {notif.acknowledgedAt}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
