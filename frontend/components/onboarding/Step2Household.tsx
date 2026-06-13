"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore, useOnboardingStore } from "@/lib/onboarding-store";

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata",
  "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Other",
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Step2Household() {
  const state = useOnboardingStore();
  const [name, setName] = useState(state.householdName);
  const [city, setCity] = useState(state.householdCity);
  const [customCity, setCustomCity] = useState("");

  const finalCity = city === "Other" ? customCity : city;
  const canProceed = name.trim().length >= 2 && finalCity.trim().length >= 2;

  function handleNext() {
    if (!canProceed) return;
    onboardingStore.setHousehold(name.trim(), finalCity.trim());
    onboardingStore.next();
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-8">
      {/* Header */}
      <motion.div variants={item}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center mb-4">
          <Home size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Your household
        </h2>
        <p className="text-[15px] text-[#6b7280]">
          Give your home a name — SAATHI will use it every day.
        </p>
      </motion.div>

      {/* Household name input */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <label className="font-mono text-[11px] tracking-widest uppercase text-[#9ca3af] font-bold">
          Household name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. The Sharma Home"
          maxLength={40}
          className="w-full px-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white text-[15px] text-[#111827] placeholder:text-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] transition-all"
        />
        <p className="text-[12px] text-[#9ca3af]">This appears in your daily SAATHI updates</p>
      </motion.div>

      {/* City */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <label className="font-mono text-[11px] tracking-widest uppercase text-[#9ca3af] font-bold flex items-center gap-2">
          <MapPin size={12} />
          City
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-3 py-2.5 rounded-2xl text-[13px] font-semibold border transition-all duration-200 ${
                city === c
                  ? "bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md shadow-violet-200"
                  : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {city === "Other" && (
          <input
            type="text"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="Type your city…"
            className="w-full px-4 py-3 rounded-2xl border border-[#e5e7eb] bg-white text-[15px] text-[#111827] placeholder:text-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] transition-all mt-1"
          />
        )}
      </motion.div>

      {/* Nav */}
      <motion.div variants={item} className="flex gap-3 pt-2">
        <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => onboardingStore.back()}>
          Back
        </Button>
        <Button
          variant="primary"
          icon={<ArrowRight size={16} strokeWidth={2.5} />}
          onClick={handleNext}
          className={canProceed ? "" : "opacity-40 pointer-events-none"}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
