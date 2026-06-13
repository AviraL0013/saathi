"use client";

import { motion } from "framer-motion";
import type { ReasoningEntry } from "@/services/dashboard.service";

const routeLabel: Record<string, string> = {
  RULE_ENGINE: "Rule Engine",
  BEDROCK:     "Bedrock AI",
  PATTERN:     "Pattern",
};

export function ReasoningFeed({ entries }: { entries: ReasoningEntry[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">How SAATHI reasoned today</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="px-5 py-4"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-[13px] font-semibold text-[#111827]">{entry.observation}</p>
              <span className="font-mono text-[10px] text-[#9ca3af] shrink-0">{entry.timestamp}</span>
            </div>
            {/* Reasoning block */}
            <div className="bg-[#fafafa] rounded-xl border border-[#f0eff8] px-4 py-3 mb-2">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#9ca3af] mb-1">Reasoning</p>
              <p className="text-[12px] text-[#374151] leading-relaxed">{entry.reasoning}</p>
            </div>
            {/* Footer */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[10px] text-[#9ca3af]">via {routeLabel[entry.route] ?? entry.route}</span>
              <span className="text-[#e5e7eb]">·</span>
              <span className="font-mono text-[10px] text-[#8b5cf6]">{entry.confidence}% confidence</span>
              {entry.suggestedAction && (
                <>
                  <span className="text-[#e5e7eb]">·</span>
                  <span className="text-[11px] text-[#6b7280] italic">{entry.suggestedAction}</span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
