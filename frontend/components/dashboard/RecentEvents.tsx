"use client";

import type { MockActivity } from "@/mocks/activity";

const routeStyle: Record<string, { label: string; color: string; bg: string }> = {
  RULE_ENGINE: { label: "Rule",    color: "#7c3aed", bg: "#f5f3ff" },
  BEDROCK:     { label: "AI",      color: "#0284c7", bg: "#e0f2fe" },
  SUPPRESS:    { label: "Skip",    color: "#9ca3af", bg: "#f3f4f6" },
  PATTERN:     { label: "Pattern", color: "#b45309", bg: "#fef9c3" },
};

const severityDot: Record<string, string> = {
  success:  "#10b981",
  warning:  "#f59e0b",
  critical: "#ef4444",
  info:     "#8b5cf6",
};

export function RecentEvents({ events }: { events: MockActivity[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Recent events</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {events.slice(0, 8).map((ev) => {
          const rs = routeStyle[ev.route] ?? routeStyle.SUPPRESS;
          return (
            <div key={ev.id} className="px-5 py-3 flex items-start gap-3">
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: severityDot[ev.severity] }} />
                <span className="font-mono text-[10px] text-[#9ca3af] w-[52px]">{ev.timestamp}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[13px] font-semibold text-[#111827]">{ev.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold" style={{ color: rs.color, backgroundColor: rs.bg }}>
                    {rs.label}
                  </span>
                </div>
                {ev.actionTaken && <p className="text-[12px] text-[#6b7280]">{ev.actionTaken}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
