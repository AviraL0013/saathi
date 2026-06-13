"use client";

import { motion } from "framer-motion";
import type { HouseholdMemory as HouseholdMemoryData } from "@/services/dashboard.service";

const sentimentStyle: Record<string, { dot: string; text: string }> = {
  positive:  { dot: "#10b981", text: "#111827" },
  neutral:   { dot: "#9ca3af", text: "#374151" },
  attention: { dot: "#f59e0b", text: "#374151" },
};

export function HouseholdMemory({ memory, familyName }: { memory: HouseholdMemoryData; familyName: string }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold mb-1">Household memory</p>
        <p className="text-[17px] font-semibold text-[#111827] leading-snug" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          This week in the {familyName} home.
        </p>
      </div>

      {/* Memory entries */}
      <div className="px-6 py-4 flex flex-col gap-3">
        {memory.entries.map((entry, i) => {
          const s = sentimentStyle[entry.sentiment];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
              <p className="text-[14px] leading-relaxed" style={{ color: s.text }}>{entry.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
