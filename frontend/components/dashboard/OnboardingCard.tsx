"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { OnboardingState } from "@/lib/onboarding-store";

export function OnboardingCard({ state }: { state: OnboardingState | null }) {
  // Hide if onboarding is completed or not yet loaded
  if (!state || state.completed) return null;

  const TOTAL = 9;
  const done = state.currentStep;
  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div className="bg-[#f5f3ff] border border-[#ddd6fe] rounded-2xl px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#8b5cf6] font-semibold mb-1">Setup in progress</p>
          <p className="text-[14px] font-semibold text-[#111827] mb-0.5">Complete your household setup</p>
          <p className="text-[12px] text-[#6b7280]">Step {done} of {TOTAL} · {pct}% complete</p>
          <div className="mt-2 h-[3px] bg-[#ddd6fe] rounded-full overflow-hidden">
            <div className="h-full bg-[#8b5cf6] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Link
          href="/onboard"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6] text-white text-[12px] font-semibold rounded-xl shrink-0 hover:bg-[#7c3aed] transition-colors"
        >
          Continue
          <ArrowRight size={12} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
