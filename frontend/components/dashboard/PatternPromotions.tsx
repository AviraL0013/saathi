"use client";

/**
 * PatternPromotions — Phase 9
 *
 * Shows the lifecycle of household patterns:
 *   PROMOTED — observed long enough to become a household rule
 *   DEMOTED  — routine changed, model auto-updated
 *   RETIRED  — behaviour no longer present
 *
 * Data source: /patterns (already loaded as part of DashboardData)
 * Uses `learnedToday` and `learning` from existing DashboardData.
 *
 * We derive this from the raw patterns via the BackendPattern type
 * passed in as a separate prop to avoid duplicating service calls.
 */

import { motion } from "framer-motion";
import type { RawPattern } from "@/services/intelligence.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MEMBER_NAMES: Record<string, string> = {
  mbr_dadaji_001: "Dadaji",
  mbr_dadiji_002: "Dadiji",
  mbr_papa_003:   "Rajesh",
  mbr_mama_004:   "Sunita",
  mbr_rohan_005:  "Rohan",
  mbr_ananya_006: "Ananya",
};

function memberName(id?: string) {
  if (!id) return undefined;
  return MEMBER_NAMES[id] ?? id;
}

/** Format an ISO timestamp as "N days ago" or a date string */
function daysAgo(iso?: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    if (diff < 30) return `${diff} days ago`;
    if (diff < 60) return "about a month ago";
    return `${Math.round(diff / 30)} months ago`;
  } catch {
    return null;
  }
}

/** Format "HH:MM-HH:MM" → "8:00 PM" (start of window) */
function formatTimeWindow(tw?: string | null): string | null {
  if (!tw) return null;
  const start = tw.split("-")[0];
  if (!start) return null;
  const [hStr, mStr] = start.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = parseInt(mStr ?? "0", 10);
  if (isNaN(h)) return tw;
  const period = h >= 12 ? "PM" : "AM";
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const dm = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
  return `${dh}${dm} ${period}`;
}

/** Shorten day pattern array to abbreviated string */
function formatDayPattern(days?: string[] | null): string | null {
  if (!days || days.length === 0) return null;
  if (days.length === 7) return "Every day";
  const SHORT: Record<string, string> = {
    Mon: "M", Tue: "T", Wed: "W", Thu: "Th", Fri: "F", Sat: "Sa", Sun: "Su",
  };
  return days.map((d) => SHORT[d] ?? d).join(" · ");
}

function confidenceBar(pct: number, color: string) {
  return (
    <div className="flex items-center gap-2">
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

// ─── Card types ───────────────────────────────────────────────────────────────

function PromotedCard({ p }: { p: RawPattern }) {
  const name = memberName(p.member_id);
  const pct = Math.round(p.confidence * 100);
  const label = p.description ?? p.pattern_id.replace(/^ptn_/, "").replace(/_/g, " ");
  const promotedAgo = daysAgo(p.promoted_at);
  const firstSeenAgo = daysAgo(p.first_observed);
  const lastSeenAgo = daysAgo(p.last_observed);
  const timeLabel = formatTimeWindow(p.time_window);
  const daysLabel = formatDayPattern(p.day_pattern);

  return (
    <div className="border border-[#ede9fe] bg-[#faf9ff] rounded-xl p-3">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-semibold text-[#7c3aed] bg-[#ede9fe] px-1.5 py-0.5 rounded">New Household Rule</span>
        {name && <span className="text-[11px] text-[#9ca3af]">{name}</span>}
      </div>

      {/* Title */}
      <p className="text-[13px] font-semibold text-[#111827] leading-tight mb-1.5 capitalize">{label}</p>

      {/* Stats */}
      <div className="mb-2">
        {confidenceBar(pct, "#8b5cf6")}
      </div>

      {/* Timeline metadata */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] text-[#9ca3af]">Observed {p.observation_days} days</span>
          {p.total_observations && p.total_matches && (
            <span className="font-mono text-[11px] text-[#9ca3af]">{p.total_matches}/{p.total_observations} matched</span>
          )}
        </div>
        {firstSeenAgo && (
          <span className="font-mono text-[11px] text-[#9ca3af]">First seen: {firstSeenAgo}</span>
        )}
        {promotedAgo && (
          <span className="font-mono text-[11px] text-[#7c3aed]">Promoted: {promotedAgo}</span>
        )}
        {lastSeenAgo && (
          <span className="font-mono text-[11px] text-[#9ca3af]">Last confirmed: {lastSeenAgo}</span>
        )}
      </div>

      {/* Schedule */}
      {(timeLabel || daysLabel) && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {timeLabel && (
            <span className="text-[11px] bg-[#f0fdf4] text-[#059669] px-2 py-0.5 rounded-full font-mono">
              {timeLabel}
            </span>
          )}
          {daysLabel && (
            <span className="text-[11px] bg-[#f3f4f6] text-[#6b7280] px-2 py-0.5 rounded-full font-mono">
              {daysLabel}
            </span>
          )}
        </div>
      )}

      {/* Promoted rule */}
      {p.promoted_rule_id && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#9ca3af]">Rule</span>
          <code className="text-[10px] bg-[#ede9fe] text-[#7c3aed] px-1.5 py-0.5 rounded font-mono">{p.promoted_rule_id}</code>
        </div>
      )}
    </div>
  );
}

function DemotedCard({ p }: { p: RawPattern }) {
  const name = memberName(p.member_id);
  const label = p.description ?? p.pattern_id.replace(/^ptn_/, "").replace(/_/g, " ");
  const demotedAgo = daysAgo(p.demoted_at);
  const lastSeenAgo = daysAgo(p.last_observed);
  const timeLabel = formatTimeWindow(p.time_window);

  return (
    <div className="border border-[#fde68a] bg-[#fffbeb] rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-semibold text-[#b45309] bg-[#fef9c3] px-1.5 py-0.5 rounded">Routine Changed</span>
        {name && <span className="text-[11px] text-[#9ca3af]">{name}</span>}
      </div>
      <p className="text-[13px] font-semibold text-[#111827] leading-tight mb-1 capitalize">{label}</p>
      {timeLabel && (
        <span className="inline-block text-[11px] bg-[#fef9c3] text-[#b45309] px-2 py-0.5 rounded-full font-mono mb-1.5">{timeLabel}</span>
      )}
      <div className="flex flex-col gap-0.5">
        {(p.consecutive_misses ?? 0) > 0 && (
          <p className="text-[12px] text-[#6b7280]">{p.consecutive_misses} consecutive misses detected.</p>
        )}
        {demotedAgo && (
          <p className="font-mono text-[11px] text-[#b45309]">Demoted: {demotedAgo}</p>
        )}
        {lastSeenAgo && (
          <p className="font-mono text-[11px] text-[#9ca3af]">Last observed: {lastSeenAgo}</p>
        )}
      </div>
      <p className="text-[11px] text-[#9ca3af] mt-1.5 font-mono">Model updated automatically</p>
    </div>
  );
}

function RetiredCard({ p }: { p: RawPattern }) {
  const name = memberName(p.member_id);
  const label = p.description ?? p.pattern_id.replace(/^ptn_/, "").replace(/_/g, " ");
  const retiredAgo = daysAgo((p as { retired_at?: string }).retired_at);
  const lastSeenAgo = daysAgo(p.last_observed);

  return (
    <div className="border border-[#e5e7eb] bg-[#f9fafb] rounded-xl p-3 opacity-70">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-semibold text-[#9ca3af] bg-[#f3f4f6] px-1.5 py-0.5 rounded">Retired Pattern</span>
        {name && <span className="text-[11px] text-[#9ca3af]">{name}</span>}
      </div>
      <p className="text-[13px] font-semibold text-[#6b7280] leading-tight mb-1 capitalize">{label}</p>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] text-[#9ca3af]">Behaviour no longer observed after {p.observation_days} days.</p>
        {lastSeenAgo && (
          <p className="font-mono text-[11px] text-[#9ca3af]">Last observed: {lastSeenAgo}</p>
        )}
        {retiredAgo && (
          <p className="font-mono text-[11px] text-[#9ca3af]">Retired: {retiredAgo}</p>
        )}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PatternPromotionsProps {
  patterns: RawPattern[];
}

export function PatternPromotions({ patterns }: PatternPromotionsProps) {
  const promoted = patterns.filter((p) => p.confidence_band === "PROMOTED")
    .sort((a, b) => b.confidence - a.confidence);
  const demoted  = patterns.filter((p) => p.confidence_band === "DEMOTED");
  const retired  = patterns.filter((p) => p.confidence_band === "RETIRED").slice(0, 2);

  const hasAnything = promoted.length + demoted.length + retired.length > 0;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Pattern lifecycle</p>
        <p className="text-[12px] text-[#6b7280] mt-0.5">How observations become household rules</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {!hasAnything && (
          <p className="text-[13px] text-[#9ca3af] text-center py-4">No promoted patterns yet. Seed the database and run simulations.</p>
        )}

        {/* Promoted */}
        {promoted.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8b5cf6] mb-2 px-1">
              {promoted.length} pattern{promoted.length > 1 ? "s" : ""} became household rules
            </p>
            <div className="flex flex-col gap-2">
              {promoted.map((p, i) => (
                <motion.div
                  key={p.pattern_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <PromotedCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Demoted */}
        {demoted.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#b45309] mb-2 px-1 mt-1">
              {demoted.length} routine{demoted.length > 1 ? "s" : ""} changed
            </p>
            <div className="flex flex-col gap-2">
              {demoted.map((p, i) => (
                <motion.div key={p.pattern_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <DemotedCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Retired */}
        {retired.length > 0 && (
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#9ca3af] mb-2 px-1 mt-1">
              retired
            </p>
            <div className="flex flex-col gap-2">
              {retired.map((p, i) => (
                <motion.div key={p.pattern_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <RetiredCard p={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
