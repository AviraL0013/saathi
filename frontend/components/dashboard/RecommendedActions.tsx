"use client";

import type { RecommendedAction } from "@/services/dashboard.service";

const priorityStyle: Record<string, { dot: string; label: string }> = {
  high:   { dot: "#ef4444", label: "High" },
  medium: { dot: "#f59e0b", label: "Medium" },
  low:    { dot: "#9ca3af", label: "Low" },
};

export function RecommendedActions({ actions }: { actions: RecommendedAction[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Recommended actions</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {actions.map((action) => {
          const p = priorityStyle[action.priority];
          return (
            <div key={action.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-[7px] w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.dot }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#111827] mb-0.5">{action.title}</p>
                  <p className="text-[12px] text-[#6b7280] leading-relaxed mb-1.5">{action.reason}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: p.dot }}>{p.label} priority</span>
                    {action.affectedMember && (
                      <><span className="text-[#e5e7eb] text-[10px]">·</span><span className="font-mono text-[10px] text-[#9ca3af]">{action.affectedMember}</span></>
                    )}
                    {action.dueBy && (
                      <><span className="text-[#e5e7eb] text-[10px]">·</span><span className="font-mono text-[10px] text-[#8b5cf6]">{action.dueBy}</span></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
