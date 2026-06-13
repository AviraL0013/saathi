"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dashboardService, type DashboardData } from "@/services/dashboard.service";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { onboardingStore, type OnboardingState } from "@/lib/onboarding-store";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);

  useEffect(() => {
    // Load dashboard data (backend-first, mock fallback)
    dashboardService.load().then(setData);

    // Load onboarding state from localStorage
    const state = onboardingStore.getState();
    setOnboarding(state);
    return onboardingStore.subscribe((s) => setOnboarding(s));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f3] gap-5">
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Pulsing SAATHI mark */}
          <div className="relative">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl border border-[#8b5cf6]"
                animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
            <div className="w-14 h-14 rounded-2xl bg-[#111827] flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold text-white tracking-widest">S</span>
            </div>
          </div>
          <p className="text-[13px] text-[#9ca3af] font-mono tracking-wide">Loading household…</p>
        </motion.div>
      </div>
    );
  }

  return <DashboardLayout data={data} onboardingState={onboarding} />;
}
