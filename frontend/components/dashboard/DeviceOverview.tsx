"use client";

import type { MockDevice } from "@/mocks/devices";

const statusStyle: Record<string, { dot: string; label: string }> = {
  on:        { dot: "#10b981", label: "Active" },
  off:       { dot: "#d1d5db", label: "Off" },
  alert:     { dot: "#f59e0b", label: "Alert" },
  standby:   { dot: "#9ca3af", label: "Standby" },
  protected: { dot: "#8b5cf6", label: "Protected" },
};

export function DeviceOverview({ devices }: { devices: MockDevice[] }) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Device monitoring</p>
      </div>
      <div className="divide-y divide-[#f9f9f9]">
        {devices.map((device) => {
          const s = statusStyle[device.status] ?? statusStyle.off;
          return (
            <div key={device.id} className="px-5 py-3 flex items-start gap-3">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold text-[#111827]">{device.name}</span>
                  <span className="font-mono text-[10px] text-[#9ca3af]">{device.room}</span>
                </div>
                <p className="text-[12px] text-[#6b7280] mt-0.5">{device.lastActivity}</p>
                {device.saathiNote && (
                  <p className="text-[11px] text-[#8b5cf6] mt-0.5 font-medium">{device.saathiNote}</p>
                )}
              </div>
              <span className="font-mono text-[10px] shrink-0 mt-0.5" style={{ color: s.dot }}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
