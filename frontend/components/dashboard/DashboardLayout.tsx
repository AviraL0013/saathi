"use client";

/**
 * DashboardLayout — Phase 9
 *
 * Column layout:
 *   LEFT   — Graph · Life Events · Family Presence
 *   CENTER — Memory · Snapshot · Learned Today · Intelligence Timeline · Recent Events
 *   RIGHT  — Reasoning Feed · Pattern Promotions · Learning Progress · Household Health · Conflicts
 */

import { motion } from "framer-motion";
import type { DashboardData } from "@/services/dashboard.service";
import type { OnboardingState } from "@/lib/onboarding-store";

import { DashboardHeader }              from "./DashboardHeader";
import { HouseholdGraph }               from "./HouseholdGraph";
import { HouseholdMemory }              from "./HouseholdMemory";
import { LearnedToday }                 from "./LearnedToday";
import { HouseholdSnapshot }            from "./HouseholdSnapshot";
import { SaathiObservations }           from "./SaathiObservations";
import { RecommendedActions }           from "./RecommendedActions";
import { RecentEvents }                 from "./RecentEvents";
import { ReasoningFeed }                from "./ReasoningFeed";
import { LearningProgress }             from "./LearningProgress";
import { FamilyPresence }               from "./FamilyPresence";
import { DeviceOverview }               from "./DeviceOverview";
import { HouseholdHealth }              from "./HouseholdHealth";
import { OnboardingCard }               from "./OnboardingCard";
import { HouseholdIntelligenceTimeline } from "./HouseholdIntelligenceTimeline";
import { PatternPromotions }            from "./PatternPromotions";
import { LifeEvents }                   from "./LifeEvents";
import { ConflictResolution }           from "./ConflictResolution";
import { SaathiEfficiency }             from "./SaathiEfficiency";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export function DashboardLayout({
  data,
  onboardingState,
  wsConnected = false,
}: {
  data: DashboardData;
  onboardingState: OnboardingState | null;
  wsConnected?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#faf7f3]">
      <DashboardHeader data={data} wsConnected={wsConnected} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-16">

        <OnboardingCard state={onboardingState} />
        {onboardingState && !onboardingState.completed && <div className="h-4" />}

        {/* 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] xl:grid-cols-[340px_1fr_320px] gap-4">

          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Interactive knowledge graph */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Household knowledge graph</p>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">Tap any node to explore connections</p>
                </div>
                <HouseholdGraph graph={data.graph} fullGraph={data.fullGraph} />
              </div>
            </motion.div>

            {/* Life events + health */}
            {data.fullGraph && (
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                <LifeEvents fullGraph={data.fullGraph} />
              </motion.div>
            )}

            {/* Family presence */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <FamilyPresence presence={data.presence} />
            </motion.div>

            {/* Device overview */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
              <DeviceOverview devices={data.devices} />
            </motion.div>
          </div>

          {/* ── CENTER ────────────────────────────────────────────────────── */}
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

            {/* Intelligence timeline — new Phase 9 */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
              <HouseholdIntelligenceTimeline
                learnedItems={data.learnedToday}
                events={data.events}
                reasoning={data.reasoning}
              />
            </motion.div>

            {/* Rich recent events */}
            <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
              <RecentEvents events={data.events} />
            </motion.div>
          </div>

          {/* ── RIGHT ─────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Structured reasoning feed */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <ReasoningFeed entries={data.reasoning} />
            </motion.div>

            {/* Pattern promotion stories */}
            {(data.rawPatterns?.length ?? 0) > 0 && (
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
                <PatternPromotions patterns={data.rawPatterns ?? []} />
              </motion.div>
            )}

            {/* Learning progress */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <LearningProgress progress={data.learning} />
            </motion.div>

            {/* Household health */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
              <HouseholdHealth health={data.health} />
            </motion.div>

            {/* SAATHI efficiency — Phase 10 */}
            {data.efficiencyMetrics && (
              <motion.div custom={4.5} variants={fadeUp} initial="hidden" animate="show">
                <SaathiEfficiency metrics={data.efficiencyMetrics} />
              </motion.div>
            )}

            {/* Conflict resolution */}
            {data.fullGraph && (
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                <ConflictResolution fullGraph={data.fullGraph} />
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
