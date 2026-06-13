"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Dna } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore, useOnboardingStore } from "@/lib/onboarding-store";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Derived household "personality" traits from the collected data
function deriveTraits(state: ReturnType<typeof useOnboardingStore>) {
  const traits: { label: string; value: string; color: string }[] = [];

  // Size
  const size = state.members.length;
  if (size === 1) traits.push({ label: "Household type", value: "Solo living", color: "#8b5cf6" });
  else if (size === 2) traits.push({ label: "Household type", value: "Couple / duo", color: "#8b5cf6" });
  else if (size <= 4) traits.push({ label: "Household type", value: "Nuclear family", color: "#8b5cf6" });
  else traits.push({ label: "Household type", value: "Joint family", color: "#8b5cf6" });

  // Generations
  const hasKids = state.members.some((m) => m.ageGroup === "child" || m.ageGroup === "baby" || m.ageGroup === "teen");
  const hasSeniors = state.members.some((m) => m.ageGroup === "senior" || m.role === "grandparent");
  if (hasKids && hasSeniors) traits.push({ label: "Generations", value: "3-gen home", color: "#f59e0b" });
  else if (hasKids) traits.push({ label: "Generations", value: "Family with kids", color: "#10b981" });
  else if (hasSeniors) traits.push({ label: "Generations", value: "Elders present", color: "#ef4444" });
  else traits.push({ label: "Generations", value: "Adults only", color: "#0ea5e9" });

  // Devices
  const devCount = state.devices.length;
  if (devCount === 0) traits.push({ label: "Smart home level", value: "Getting started", color: "#9ca3af" });
  else if (devCount < 5) traits.push({ label: "Smart home level", value: "Semi-smart", color: "#0ea5e9" });
  else if (devCount < 10) traits.push({ label: "Smart home level", value: "Well connected", color: "#8b5cf6" });
  else traits.push({ label: "Smart home level", value: "Fully wired", color: "#10b981" });

  // Top priority
  const topPriority = state.priorities[0];
  if (topPriority) {
    const labels: Record<string, string> = {
      energy_saving: "Eco-conscious",
      security: "Safety-first",
      family_health: "Health-focused",
      comfort: "Comfort-driven",
      convenience: "Efficiency-driven",
      privacy: "Privacy-first",
    };
    traits.push({ label: "Personality", value: labels[topPriority] ?? "Balanced", color: "#ec4899" });
  }

  return traits;
}

export function Step7HouseholdDNA() {
  const state = useOnboardingStore();
  const traits = deriveTraits(state);

  // Summary stats
  const careCount = state.careNeeds.reduce((s, c) => s + c.needs.length, 0);
  const priorityCount = state.priorities.length;
  const deviceCount = state.devices.length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-8">
      {/* Header */}
      <motion.div variants={item}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mb-4">
          <Dna size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Your household DNA
        </h2>
        <p className="text-[15px] text-[#6b7280]">
          Here&apos;s how SAATHI sees the{" "}
          <span className="text-[#111827] font-semibold">
            {state.householdName || "your"} home
          </span>
          .
        </p>
      </motion.div>

      {/* Personality traits */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {traits.map((trait) => (
          <div
            key={trait.label}
            className="bg-white rounded-2xl border border-[#f0eff8] p-4 shadow-sm"
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: trait.color }}>
              {trait.label}
            </p>
            <p className="font-bold text-[#111827] text-[15px]">{trait.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { label: "Members", value: state.members.length, emoji: "👥" },
          { label: "Devices", value: deviceCount, emoji: "🔌" },
          { label: "Care items", value: careCount, emoji: "❤️" },
        ].map(({ label, value, emoji }) => (
          <div
            key={label}
            className="bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] rounded-2xl border border-[#ddd6fe] p-4 text-center"
          >
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-[28px] font-bold text-[#8b5cf6] leading-none">{value}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-[#9ca3af] mt-1">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Members list */}
      {state.members.length > 0 && (
        <motion.div variants={item}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#9ca3af] mb-3">Household members</p>
          <div className="flex flex-wrap gap-2">
            {state.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-[#e5e7eb] text-[13px] font-semibold text-[#374151]"
              >
                <span>{m.emoji}</span>
                {m.name}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Priority tags */}
      {priorityCount > 0 && (
        <motion.div variants={item}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-[#9ca3af] mb-3">Your priorities</p>
          <div className="flex flex-wrap gap-2">
            {state.priorities.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl text-[12px] font-semibold text-[#6d28d9] capitalize"
              >
                {p.replace("_", " ")}
              </span>
            ))}
          </div>
        </motion.div>
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
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
