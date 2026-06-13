"use client";

import type { Observation } from "@/services/dashboard.service";

const trendGlyph: Record<string, { glyph: string; color: string }> = {
  up:     { glyph: "↑", color: "#8b5cf6" },
  down:   { glyph: "↓", color: "#f59e0b" },
  stable: { glyph: "→", color: "#10b981" },
};

const categoryLabel: Record<string, string> = {
  health:  "Health",
  routine: "Routine",
  device:  "Device",
  family:  "Family",
};

export function SaathiObservations({ observations }: { observations: Observation[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Observations</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {observations.map((obs) => {
          const t = trendGlyph[obs.trend];
          return (
            <div key={obs.id} className="px-5 py-3.5 flex items-start gap-3">
              <span className="text-[13px] font-bold shrink-0 mt-0.5 w-4 text-right" style={{ color: t.color }}>{t.glyph}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[#374151] leading-relaxed">{obs.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-[#d1d5db] uppercase tracking-wide">{categoryLabel[obs.category]}</span>
                  {obs.member && <><span className="text-[#e5e7eb] text-[10px]">·</span><span className="font-mono text-[10px] text-[#9ca3af]">{obs.member}</span></>}
                  <span className="text-[#e5e7eb] text-[10px]">·</span>
                  <span className="font-mono text-[10px] text-[#9ca3af]">{obs.confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
