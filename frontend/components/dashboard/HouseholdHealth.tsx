"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import type { HealthSummary } from "@/services/dashboard.service";

function ScoreRow({ label, score }: { label: string; score: number }) {
  const color = score >= 90 ? "#10b981" : score >= 70 ? "#8b5cf6" : "#f59e0b";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#6b7280] flex-1 min-w-0">{label}</span>
      <div className="w-20 h-[3px] bg-[#f3f4f6] rounded-full overflow-hidden shrink-0">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[11px] text-[#9ca3af] w-8 text-right shrink-0">{score}%</span>
    </div>
  );
}

export function HouseholdHealth({ health }: { health: HealthSummary }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Household health</p>
      </div>

      {/* Scores */}
      <div className="px-5 py-4 border-b border-[#f3f4f6] flex flex-col gap-3">
        <ScoreRow label="Medication adherence" score={health.medicationAdherence} />
        <ScoreRow label="Routine consistency"  score={health.routineConsistency} />
        <ScoreRow label="Elder care score"     score={health.elderCareScore} />
        {health.missedReminders > 0 && (
          <div className="flex items-center gap-2 mt-0.5">
            <AlertCircle size={12} className="text-[#f59e0b] shrink-0" />
            <span className="text-[12px] text-[#6b7280]">{health.missedReminders} reminder missed today</span>
          </div>
        )}
      </div>

      {/* Medications */}
      <div className="px-5 py-3">
        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#9ca3af] mb-2.5">Medications today</p>
        <div className="flex flex-col gap-2">
          {health.medications.map((med) => (
            <div key={med.id} className="flex items-center gap-2.5">
              {med.takenToday
                ? <CheckCircle2 size={13} className="text-[#10b981] shrink-0" />
                : <AlertCircle size={13} className="text-[#f59e0b] shrink-0" />
              }
              <span className="text-[12px] text-[#374151] flex-1 truncate">{med.name}</span>
              <span className="font-mono text-[10px] text-[#9ca3af] shrink-0">{med.schedule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      {health.conditions.length > 0 && (
        <div className="px-5 pb-4 pt-1 border-t border-[#f3f4f6]">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#9ca3af] mb-2">Health conditions monitored</p>
          {health.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.managed ? "bg-[#10b981]" : "bg-[#f59e0b]"}`} />
              <span className="text-[12px] text-[#6b7280]">{c.member} — {c.condition}</span>
              <span className="font-mono text-[10px] text-[#9ca3af] ml-auto shrink-0">{c.managed ? "Managed" : "Monitor"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
