"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin, Clock } from "lucide-react";
import type { DashboardData } from "@/services/dashboard.service";

function useGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function useTime(city: string) {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
}

export function DashboardHeader({ data }: { data: DashboardData }) {
  const greeting = useGreeting();
  const time = useTime(data.household.city);
  const { intelligenceStats, household } = data;

  return (
    <header className="sticky top-0 z-30 bg-[#faf7f3]/96 backdrop-blur-md border-b border-[#e5e7eb]">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between gap-6">

        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="shrink-0 text-[#9ca3af] hover:text-[#374151] transition-colors">
            <ArrowLeft size={15} strokeWidth={2} />
          </Link>
          <div className="w-px h-4 bg-[#e5e7eb] shrink-0" />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap leading-tight">
              <span className="text-[15px] font-semibold text-[#111827]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {greeting}, {household.familyName} Family.
              </span>
              <span className="text-[13px] text-[#6b7280] hidden sm:inline">
                SAATHI observed {intelligenceStats.actionsToday} household events today.
                {intelligenceStats.patternsDetected > 0 && (
                  <> {intelligenceStats.patternsDetected} patterns currently being learned.</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* City */}
          <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#9ca3af]">
            <MapPin size={11} />
            <span>{household.city}</span>
          </div>
          {/* Members */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-white text-[11px] text-[#6b7280] font-mono">
            {household.memberCount} members
          </div>
          {/* Time */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e5e7eb] bg-white text-[11px] text-[#6b7280] font-mono">
            <Clock size={10} />
            {time}
          </div>
          {/* Learning badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ede9fe] bg-[#f5f3ff]">
            <Sparkles size={10} className="text-[#8b5cf6]" />
            <span className="font-mono text-[11px] text-[#8b5cf6] font-semibold">{household.daysLearning}d learning</span>
          </div>
          {/* Source */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-[#e5e7eb] bg-white">
            <span className={`w-1.5 h-1.5 rounded-full ${data.source === "backend" ? "bg-[#10b981]" : "bg-[#f59e0b]"} animate-pulse`} />
            <span className="font-mono text-[10px] text-[#9ca3af]">{data.source === "backend" ? "Live" : "Demo"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
