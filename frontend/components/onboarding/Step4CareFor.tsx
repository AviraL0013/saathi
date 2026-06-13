"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore, useOnboardingStore } from "@/lib/onboarding-store";

const CARE_OPTIONS = [
  { id: "medicine_reminders", label: "Medicine reminders", emoji: "💊" },
  { id: "mobility_support", label: "Mobility support alerts", emoji: "🦯" },
  { id: "diet_monitoring", label: "Diet monitoring", emoji: "🥗" },
  { id: "sleep_tracking", label: "Sleep pattern tracking", emoji: "😴" },
  { id: "check_ins", label: "Wellness check-ins", emoji: "✅" },
  { id: "emergency_alerts", label: "Emergency alerts", emoji: "🚨" },
  { id: "screen_time", label: "Screen time limits", emoji: "📱" },
  { id: "homework_reminders", label: "Homework reminders", emoji: "📚" },
  { id: "outdoor_safety", label: "Outdoor safety", emoji: "🚸" },
];

// which care options make sense per age group
const AGE_CARE_MAP: Record<string, string[]> = {
  baby: ["sleep_tracking", "check_ins", "emergency_alerts"],
  child: ["screen_time", "homework_reminders", "outdoor_safety", "sleep_tracking"],
  teen: ["screen_time", "sleep_tracking", "outdoor_safety"],
  adult: [],
  senior: ["medicine_reminders", "mobility_support", "diet_monitoring", "sleep_tracking", "check_ins", "emergency_alerts"],
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Step4CareFor() {
  const state = useOnboardingStore();

  // Only show members who might need care (non-adult)
  const careMembers = state.members.filter(
    (m) => m.ageGroup !== "adult" || m.role === "grandparent" || m.role === "parent"
  );

  // If no one needs care, skip this step automatically by showing skip option
  const hasCareMembers = careMembers.length > 0;

  function getCareNeedsFor(memberId: string): string[] {
    return state.careNeeds.find((c) => c.memberId === memberId)?.needs ?? [];
  }

  function toggleNeed(memberId: string, needId: string) {
    const current = getCareNeedsFor(memberId);
    const updated = current.includes(needId)
      ? current.filter((n) => n !== needId)
      : [...current, needId];
    onboardingStore.updateCareNeed(memberId, updated);
  }

  function getSuggestedOptions(ageGroup: string) {
    const suggested = AGE_CARE_MAP[ageGroup] ?? [];
    return CARE_OPTIONS.filter((o) => suggested.includes(o.id));
  }

  function getAllOptions(ageGroup: string) {
    const suggested = AGE_CARE_MAP[ageGroup] ?? [];
    return CARE_OPTIONS.filter((o) => !suggested.includes(o.id));
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-8">
      {/* Header */}
      <motion.div variants={item}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#be185d] flex items-center justify-center mb-4">
          <Heart size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Who needs extra care?
        </h2>
        <p className="text-[15px] text-[#6b7280]">
          SAATHI pays special attention to family members who need support.
        </p>
      </motion.div>

      {!hasCareMembers ? (
        <motion.div variants={item} className="bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] p-5 text-center">
          <p className="text-[15px] font-semibold text-[#166534] mb-1">All adults — no special care needed</p>
          <p className="text-[13px] text-[#15803d]">SAATHI will focus on comfort & convenience for everyone.</p>
        </motion.div>
      ) : (
        <motion.div variants={item} className="flex flex-col gap-6">
          {careMembers.map((member) => {
            const suggested = getSuggestedOptions(member.ageGroup);
            const rest = getAllOptions(member.ageGroup);
            const selected = getCareNeedsFor(member.id);

            return (
              <div key={member.id} className="bg-white rounded-2xl border border-[#f0eff8] p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#fdf4ff] flex items-center justify-center text-xl">
                    {member.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] text-[14px]">{member.name}</p>
                    <p className="text-[12px] text-[#9ca3af] capitalize">{member.role} · {member.ageGroup}</p>
                  </div>
                </div>

                {suggested.length > 0 && (
                  <div className="mb-3">
                    <p className="font-mono text-[9px] tracking-widest uppercase text-[#8b5cf6] mb-2">Suggested</p>
                    <div className="flex flex-wrap gap-2">
                      {suggested.map((opt) => {
                        const on = selected.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => toggleNeed(member.id, opt.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${
                              on
                                ? "bg-[#ec4899] text-white border-[#ec4899]"
                                : "bg-[#fdf4ff] text-[#9333ea] border-[#f0abfc] hover:border-[#ec4899]"
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {rest.length > 0 && (
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-[#9ca3af] mb-2">Other options</p>
                    <div className="flex flex-wrap gap-2">
                      {rest.map((opt) => {
                        const on = selected.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => toggleNeed(member.id, opt.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${
                              on
                                ? "bg-[#374151] text-white border-[#374151]"
                                : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#374151]"
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
