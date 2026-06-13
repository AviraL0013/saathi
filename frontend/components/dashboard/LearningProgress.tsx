"use client";

import { motion } from "framer-motion";
import type { LearningProgress as LP } from "@/services/dashboard.service";

function Bar({ pct }: { pct: number }) {
  const color = pct >= 85 ? "#8b5cf6" : pct >= 65 ? "#a78bfa" : "#d1d5db";
  return (
    <div className="flex-1 h-[4px] bg-[#f3f4f6] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function LearningProgress({ progress }: { progress: LP }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Learning progress</p>
      </div>

      {/* Overall */}
      <div className="px-5 py-4 border-b border-[#f3f4f6]">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[22px] font-bold text-[#111827]">{progress.overallPct}%</span>
          <span className="text-[13px] text-[#6b7280]">household confidence</span>
        </div>
        <div className="mb-3">
          <Bar pct={progress.overallPct} />
        </div>
        <p className="text-[12px] text-[#9ca3af]">
          {progress.patternsFound} patterns found · {progress.patternsPromoted} promoted to rules · {progress.daysLearning} days learning
        </p>
      </div>

      {/* Per member */}
      <div className="px-5 py-3 flex flex-col gap-2.5">
        {progress.byMember.map(({ name, pct }) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-[#374151] w-14 shrink-0">{name}</span>
            <Bar pct={pct} />
            <span className="font-mono text-[10px] text-[#9ca3af] w-7 text-right shrink-0">{pct}%</span>
          </div>
        ))}
      </div>

      {/* Missing insights */}
      {progress.missingInsights.length > 0 && (
        <div className="px-5 pb-4 border-t border-[#f3f4f6] pt-3">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#9ca3af] mb-2">Still learning</p>
          {progress.missingInsights.map((m, i) => (
            <div key={i} className="flex items-start gap-2 mb-1.5">
              <span className="text-[#d1d5db] text-[10px] mt-0.5 shrink-0">·</span>
              <span className="text-[12px] text-[#9ca3af]">{m}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
