"use client";

import type { HouseholdSnapshot as HouseholdSnapshotData } from "@/services/dashboard.service";

export function HouseholdSnapshot({ snapshot }: { snapshot: HouseholdSnapshotData }) {
  const lines = [
    { label: "Present", value: `${snapshot.membersHome} members home · ${snapshot.membersAway} away` },
    { label: "Next",    value: snapshot.nextEvent },
    { label: "Water",   value: snapshot.waterTankStatus },
    { label: "Health",  value: snapshot.nextMedicationTime },
    { label: "Mood",    value: snapshot.currentMoodEstimate },
  ];

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Household now</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {lines.map(({ label, value }) => (
          <div key={label} className="px-5 py-3 flex items-start gap-4">
            <span className="font-mono text-[10px] text-[#9ca3af] w-12 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
            <span className="text-[13px] text-[#374151] leading-snug">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
