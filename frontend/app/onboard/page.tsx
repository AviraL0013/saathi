"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useOnboardingStore, onboardingStore } from "@/lib/onboarding-store";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { Step1Welcome } from "@/components/onboarding/Step1Welcome";
import { Step2Household } from "@/components/onboarding/Step2Household";
import { Step3FamilyMembers } from "@/components/onboarding/Step3FamilyMembers";
import { Step4CareFor } from "@/components/onboarding/Step4CareFor";
import { Step5Priorities } from "@/components/onboarding/Step5Priorities";
import { Step6Devices } from "@/components/onboarding/Step6Devices";
import { Step7HouseholdDNA } from "@/components/onboarding/Step7HouseholdDNA";
import { Step8Routines } from "@/components/onboarding/Step8Routines";
import { Step9Reveal } from "@/components/onboarding/Step9Reveal";

const STEPS = [
  Step1Welcome,
  Step2Household,
  Step3FamilyMembers,
  Step4CareFor,
  Step5Priorities,
  Step6Devices,
  Step7HouseholdDNA,
  Step8Routines,
  Step9Reveal,
];

const pageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function OnboardPage() {
  const state = useOnboardingStore();
  const step = state.currentStep;
  const StepComponent = STEPS[step] ?? Step1Welcome;

  // Direction tracking: positive = going forward, negative = going back
  // We approximate by comparing with previous step — for simplicity we always animate forward
  const direction = 1;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#faf7f3" }}
    >
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(139,92,246,0.05) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(139,92,246,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">S</span>
          </div>
          <span
            className="font-bold text-[15px] text-[#111827] tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            SAATHI
          </span>
        </div>

        {step > 0 && step < 8 && (
          <button
            onClick={() => onboardingStore.reset()}
            className="text-[12px] text-[#9ca3af] hover:text-[#6b7280] transition-colors font-medium"
          >
            Start over
          </button>
        )}
      </header>

      {/* Progress — hide on welcome (step 0) and reveal (step 8) */}
      {step > 0 && step < 8 && (
        <div className="relative z-10 px-6 sm:px-8 pb-4">
          <OnboardingProgress
            current={step}
            onNavigate={(s) => {
              if (s < step) onboardingStore.goTo(s);
            }}
          />
        </div>
      )}

      {/* Step content */}
      <main className="relative z-10 flex-1 flex flex-col items-center">
        <div className="w-full max-w-xl px-6 sm:px-8 py-6 pb-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
