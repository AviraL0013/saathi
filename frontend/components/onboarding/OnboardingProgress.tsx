"use client";

import { motion } from "framer-motion";

const STEPS = [
  "Welcome",
  "Household",
  "Family",
  "Care For",
  "Priorities",
  "Devices",
  "Your DNA",
  "Routines",
  "Reveal",
];

interface Props {
  current: number; // 0-indexed
  onNavigate?: (step: number) => void;
}

export function OnboardingProgress({ current, onNavigate }: Props) {
  const pct = ((current) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Step label row */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] tracking-widest uppercase text-[#9ca3af]">
          Step {current + 1} of {STEPS.length}
        </span>
        <span className="font-mono text-[11px] tracking-widest uppercase text-[#8b5cf6] font-bold">
          {STEPS[current]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-[3px] bg-[#e5e7eb] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #8b5cf6, #a78bfa)" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Dot row — only show on md+ */}
      <div className="hidden md:flex items-center justify-between mt-3">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <button
              key={label}
              onClick={() => onNavigate?.(i)}
              disabled={i > current}
              className="flex flex-col items-center gap-1 group disabled:cursor-default"
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  active
                    ? "bg-[#8b5cf6] scale-125"
                    : done
                    ? "bg-[#8b5cf6] opacity-60"
                    : "bg-[#d1d5db]"
                }`}
              />
              <span
                className={`font-mono text-[9px] tracking-wider uppercase transition-colors duration-200 ${
                  active ? "text-[#8b5cf6] font-bold" : done ? "text-[#9ca3af]" : "text-[#d1d5db]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
