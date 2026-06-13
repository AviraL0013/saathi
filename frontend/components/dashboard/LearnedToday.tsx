"use client";

import { motion } from "framer-motion";
import type { LearnedItem } from "@/services/dashboard.service";

const typeColor: Record<string, string> = {
  timing:   "#8b5cf6",
  pattern:  "#0ea5e9",
  behavior: "#f59e0b",
  routine:  "#10b981",
};

export function LearnedToday({ items }: { items: LearnedItem[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">SAATHI learned today</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="px-5 py-3.5"
          >
            <div className="flex items-start gap-3">
              <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: typeColor[item.type] ?? "#8b5cf6" }} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#111827] leading-snug mb-0.5">{item.observation}</p>
                <p className="text-[12px] text-[#6b7280] leading-relaxed">{item.detail}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  {item.member && <span className="font-mono text-[10px] text-[#9ca3af]">{item.member}</span>}
                  <span className="font-mono text-[10px] text-[#9ca3af]">{item.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
