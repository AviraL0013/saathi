"use client";

import { motion } from "framer-motion";
import type { DashboardData } from "@/services/dashboard.service";
import type { OnboardingState } from "@/lib/onboarding-store";

import { DashboardHeader } from "./DashboardHeader";
import { HouseholdGraph } from "./HouseholdGraph";
import { HouseholdMemory } from "./HouseholdMemory";
import { LearnedToday } from "./LearnedToday";
import { HouseholdSnapshot } from "./HouseholdSnapshot";
import { SaathiObservations } from "./SaathiObservations";
import { RecommendedActions } from "./RecommendedActions";
import { RecentEvents } from "./RecentEvents";
import { ReasoningFeed } from "./ReasoningFeed";
import { LearningProgress } from "./LearningProgress";
import { FamilyPresence } from "./FamilyPresence";
import { DeviceOverview } from "./DeviceOverview";
import { HouseholdHealth } from "./HouseholdHealth";
import { OnboardingCard } from "./OnboardingCard";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
};

export function DashboardLayout({
  data,
  onboardingState,
}: {
  data: DashboardData;
  onboardingState: OnboardingState | null;
}) {
  return (
    <div className="min-h-screen bg-[#faf7f3]">
      <DashboardHeader data={data} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-16">

        {/* Onboarding card — full width, only if not complete */}
        <OnboardingCard state={onboardingState} />
        {onboardingState && !onboardingState.completed && <div className="h-4" />}

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[340px_1fr_320px] gap-4">

          {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Household Graph — hero visual */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Household knowledge graph</p>
                </div>
                <div className="p-2">
                  <HouseholdGraph graph={data.graph} />
                </div>
                {/* Legend */}
                <div className="px-5 pb-4 flex items-center gap-4 flex-wrap">
                  {[
                    { color: "#8b5cf6", label: "Elder" },
                    { color: "#374151", label: "Adult" },
                    { color: "#0ea5e9", label: "Teen" },
                    { color: "#10b981", label: "Child" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[11px] text-[#9ca3af]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
              <FamilyPresence presence={data.presence} />
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <DeviceOverview devices={data.devices} />
            </motion.div>
          </div>

          {/* ── CENTER COLUMN ────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 min-w-0">

            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <HouseholdMemory memory={data.memory} familyName={data.household.familyName} />
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
              <HouseholdSnapshot snapshot={data.snapshot} />
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <LearnedToday items={data.learnedToday} />
            </motion.div>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
              <SaathiObservations observations={data.observations} />
            </motion.div>

            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
              <RecommendedActions actions={data.actions} />
            </motion.div>

            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
              <RecentEvents events={data.events} />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <ReasoningFeed entries={data.reasoning} />
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
              <LearningProgress progress={data.learning} />
            </motion.div>

            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <HouseholdHealth health={data.health} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
