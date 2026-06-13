"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore, useOnboardingStore, Priority } from "@/lib/onboarding-store";

const PRIORITIES: {
  id: Priority;
  label: string;
  description: string;
  emoji: string;
  gradient: string;
  border: string;
  selectedBg: string;
}[] = [
  {
    id: "energy_saving",
    label: "Energy saving",
    description: "Reduce electricity bills through smart automation",
    emoji: "⚡",
    gradient: "from-[#fef9c3] to-[#fef08a]",
    border: "#fde047",
    selectedBg: "#eab308",
  },
  {
    id: "security",
    label: "Security",
    description: "Monitor access, detect anomalies, stay safe",
    emoji: "🔒",
    gradient: "from-[#fee2e2] to-[#fecaca]",
    border: "#fca5a5",
    selectedBg: "#ef4444",
  },
  {
    id: "family_health",
    label: "Family health",
    description: "Track routines, medicines, and wellness",
    emoji: "🩺",
    gradient: "from-[#d1fae5] to-[#a7f3d0]",
    border: "#6ee7b7",
    selectedBg: "#10b981",
  },
  {
    id: "comfort",
    label: "Comfort",
    description: "Perfect temperatures, lighting, and ambience",
    emoji: "🛋️",
    gradient: "from-[#ede9fe] to-[#ddd6fe]",
    border: "#a78bfa",
    selectedBg: "#8b5cf6",
  },
  {
    id: "convenience",
    label: "Convenience",
    description: "Automate chores, reminders, and daily tasks",
    emoji: "✨",
    gradient: "from-[#fef3c7] to-[#fde68a]",
    border: "#fbbf24",
    selectedBg: "#f59e0b",
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Your data stays with you, always",
    emoji: "🛡️",
    gradient: "from-[#e0f2fe] to-[#bae6fd]",
    border: "#7dd3fc",
    selectedBg: "#0ea5e9",
  },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export function Step5Priorities() {
  const state = useOnboardingStore();
  const selected = state.priorities;

  const canProceed = selected.length >= 1;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-8">
      {/* Header */}
      <motion.div variants={item}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center mb-4">
          <Sparkles size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          What matters most?
        </h2>
        <p className="text-[15px] text-[#6b7280]">
          Pick your top priorities — SAATHI will focus its intelligence here.
          <span className="text-[#9ca3af]"> (Select all that apply)</span>
        </p>
      </motion.div>

      {/* Priority grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRIORITIES.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onboardingStore.togglePriority(p.id)}
              className={`relative text-left p-5 rounded-3xl border-2 transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-transparent shadow-lg"
                  : "bg-white border-[#e5e7eb] hover:border-[#c4b5fd]"
              }`}
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, var(--from-color), var(--to-color))`,
                    }
                  : {}
              }
            >
              {/* Gradient bg when selected */}
              {isSelected && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`}
                  style={{ borderWidth: 2, borderColor: p.border }}
                />
              )}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{p.emoji}</span>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: p.selectedBg }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="font-bold text-[#111827] text-[14px] mb-0.5">{p.label}</p>
                <p className="text-[12px] text-[#6b7280] leading-snug">{p.description}</p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {selected.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[13px] text-[#8b5cf6] font-semibold"
        >
          {selected.length} priorit{selected.length === 1 ? "y" : "ies"} selected
        </motion.p>
      )}

      {/* Nav */}
      <motion.div variants={item} className="flex gap-3 pt-2">
        <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => onboardingStore.back()}>
          Back
        </Button>
        <Button
          variant="primary"
          icon={<ArrowRight size={16} strokeWidth={2.5} />}
          onClick={() => onboardingStore.next()}
          className={canProceed ? "" : "opacity-40 pointer-events-none"}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
