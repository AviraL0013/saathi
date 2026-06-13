"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// ─── Checkmark steps ─────────────────────────────────────────────────────────

const STEPS = [
  { label: "6 family members mapped", delay: 400 },
  { label: "14 routines detected", delay: 900 },
  { label: "12 patterns connected", delay: 1400 },
  { label: "Household memory initialized", delay: 1900 },
];

const REDIRECT_DELAY_MS = 3400;

// ─── Animated checkmark ───────────────────────────────────────────────────────

function Checkmark() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0"
    >
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoLoadingPage() {
  const router = useRouter();
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Reveal each checkmark step
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((step, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleSteps((prev) => [...prev, i]);
        }, step.delay)
      );
    });

    // Show "done" state briefly before redirect
    timers.push(
      setTimeout(() => {
        setPhase("done");
      }, REDIRECT_DELAY_MS - 400)
    );

    // Redirect
    timers.push(
      setTimeout(() => {
        router.push("/demo/sharma");
      }, REDIRECT_DELAY_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#faf7f3" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(139,92,246,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm">
        {/* Logo / spinner */}
        <div className="relative">
          {/* Pulse rings */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-[28px] border border-[#8b5cf6]"
              animate={{ scale: [1, 1.4 + i * 0.2], opacity: [0.4, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Logo box */}
          <motion.div
            className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-2xl shadow-violet-300/50"
            animate={phase === "done" ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {phase === "loading" ? (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
                >
                  <Sparkles size={32} className="text-white" strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <svg width="32" height="26" viewBox="0 0 32 26" fill="none">
                    <path
                      d="M2 13L11 22L30 2"
                      stroke="white"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <motion.p
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#8b5cf6] font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Demo mode
          </motion.p>
          <motion.h1
            className="text-[28px] sm:text-[32px] font-bold text-[#111827] leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            SAATHI is understanding
            <br />
            <span className="text-[#8b5cf6] italic" style={{ fontFamily: "var(--font-newsreader)" }}>
              the Sharma Family
            </span>
          </motion.h1>
        </div>

        {/* Checklist */}
        <div className="w-full flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const visible = visibleSteps.includes(i);
            return (
              <AnimatePresence key={step.label}>
                {visible && (
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 bg-white rounded-2xl border border-[#e5e7eb] px-4 py-3 shadow-sm"
                  >
                    <Checkmark />
                    <span className="text-[14px] font-semibold text-[#111827]">
                      {step.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          {/* Pending dots for steps not yet revealed */}
          {STEPS.map((step, i) => {
            const visible = visibleSteps.includes(i);
            return (
              !visible && (
                <motion.div
                  key={`pending-${step.label}`}
                  className="flex items-center gap-3 bg-white/40 rounded-2xl border border-[#f0eff8] px-4 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#e5e7eb] shrink-0" />
                  <span className="text-[14px] font-medium text-[#d1d5db]">
                    {step.label}
                  </span>
                </motion.div>
              )
            );
          })}
        </div>

        {/* Footer status */}
        <motion.p
          className="text-[12px] text-[#9ca3af] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {phase === "done" ? (
            <span className="text-[#10b981] font-semibold">Ready — opening dashboard…</span>
          ) : (
            "Loading Jaipur household · no backend required"
          )}
        </motion.p>
      </div>
    </div>
  );
}
