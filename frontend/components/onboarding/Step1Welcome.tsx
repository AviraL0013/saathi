"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore } from "@/lib/onboarding-store";

const features = [
  { icon: Home, label: "Understands your home", color: "#8b5cf6" },
  { icon: Zap, label: "Acts before you ask", color: "#f59e0b" },
  { icon: Shield, label: "Private by design", color: "#10b981" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export function Step1Welcome() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center text-center gap-10"
    >
      {/* Logo mark */}
      <motion.div variants={item} className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Home size={36} strokeWidth={1.5} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-white flex items-center justify-center">
            <Zap size={10} className="text-white" fill="white" />
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#8b5cf6] font-bold mb-1">
            Welcome to
          </p>
          <h1 className="text-[52px] sm:text-[64px] font-bold text-[#111827] leading-none tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            SAATHI
          </h1>
          <p className="text-[16px] text-[#6b7280] mt-3 leading-relaxed max-w-[400px]">
            Your home&apos;s new intelligence. We&apos;ll take{" "}
            <span className="text-[#111827] font-semibold">5 minutes</span> to understand
            your household — then SAATHI handles the rest.
          </p>
        </div>
      </motion.div>

      {/* Feature pills */}
      <motion.div variants={item} className="flex flex-wrap justify-center gap-3">
        {features.map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-[#f0eff8] shadow-sm"
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon size={14} style={{ color }} strokeWidth={2} />
            </div>
            <span className="text-[13px] font-semibold text-[#374151]">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* What to expect */}
      <motion.div
        variants={item}
        className="w-full max-w-sm bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] rounded-3xl p-6 border border-[#ddd6fe]"
      >
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8b5cf6] font-bold mb-4">
          What we&apos;ll cover
        </p>
        <div className="space-y-2.5">
          {[
            "Your household name & city",
            "Family members & their roles",
            "Care needs (elders, children)",
            "Your smart devices",
            "Daily routines",
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-[13px] text-[#4b5563] font-medium">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item}>
        <Button
          variant="primary"
          icon={<ArrowRight size={16} strokeWidth={2.5} />}
          onClick={() => onboardingStore.next()}
        >
          Let&apos;s get started
        </Button>
        <p className="text-[11px] text-[#9ca3af] mt-3">No account needed. Everything stays on your device.</p>
      </motion.div>
    </motion.div>
  );
}
