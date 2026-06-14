"use client";

/**
 * ConflictResolution — Phase 9
 *
 * Shows CONFLICTS_WITH edges from the household graph.
 * Explains which rule won and why.
 * Data source: /graph/{household_id}/full
 */

import { motion } from "framer-motion";
import type { BackendFullGraphResponse, BackendGraphNode, BackendGraphEdge } from "@/services/dashboard.service";

// ─── Priority hierarchy ───────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<string, { label: string; rank: number; color: string }> = {
  safety:           { label: "Safety",           rank: 1, color: "#ef4444" },
  health:           { label: "Health",           rank: 2, color: "#f97316" },
  custom:           { label: "Custom rule",      rank: 3, color: "#8b5cf6" },
  promoted_pattern: { label: "Promoted pattern", rank: 4, color: "#0ea5e9" },
  fleet:            { label: "Fleet default",    rank: 5, color: "#9ca3af" },
  education:        { label: "Education",        rank: 2, color: "#f59e0b" },
};

function inferPriority(fromNode: BackendGraphNode, reason?: string) {
  const r = reason?.toLowerCase() ?? "";
  if (r.includes("safety") || r.includes("overflow") || r.includes("whistle")) return "safety";
  if (r.includes("health") || r.includes("medication") || r.includes("bp") || r.includes("arthritis")) return "health";
  if (r.includes("exam") || r.includes("study") || r.includes("board") || r.includes("education") || r.includes("quiet")) return "education";
  if (fromNode.node_type === "health_condition") return "health";
  if (fromNode.node_type === "routine") return "custom";
  return "fleet";
}

// ─── Conflict card ────────────────────────────────────────────────────────────

interface ConflictData {
  from: BackendGraphNode;
  to: BackendGraphNode;
  edge: BackendGraphEdge;
  winnerPriority: string;
  loserPriority: string;
}

function ConflictCard({ conflict }: { conflict: ConflictData }) {
  const winner = PRIORITY_LABEL[conflict.winnerPriority] ?? PRIORITY_LABEL.fleet;
  const loser  = PRIORITY_LABEL[conflict.loserPriority]  ?? PRIORITY_LABEL.fleet;

  const fromLabel = conflict.from.description?.slice(0, 40) ?? conflict.from.name ?? conflict.from.id.replace(/_/g, " ");
  const toLabel   = conflict.to.name ?? conflict.to.description?.slice(0, 40) ?? conflict.to.id.replace(/_/g, " ");

  return (
    <div className="border border-[#fca5a5] bg-[#fff5f5] rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-semibold text-[#ef4444] bg-[#fee2e2] px-1.5 py-0.5 rounded">Conflict detected</span>
      </div>

      {/* Two sides */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#374151] capitalize leading-tight">{fromLabel}</p>
          <span
            className="text-[10px] font-mono px-1 py-0.5 rounded"
            style={{ color: loser.color, backgroundColor: loser.color + "18" }}
          >
            {loser.label}
          </span>
        </div>
        <span className="text-[12px] text-[#9ca3af] font-mono shrink-0">vs</span>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[12px] font-semibold text-[#374151] capitalize leading-tight">{toLabel}</p>
          <div className="flex justify-end">
            <span
              className="text-[10px] font-mono px-1 py-0.5 rounded"
              style={{ color: winner.color, backgroundColor: winner.color + "18" }}
            >
              {winner.label}
            </span>
          </div>
        </div>
      </div>

      {/* Winner */}
      <div className="border-t border-[#fca5a5] pt-2 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#9ca3af] shrink-0">Winner</span>
          <span className="text-[12px] font-semibold capitalize" style={{ color: winner.color }}>{toLabel}</span>
        </div>
        {conflict.edge.reason && (
          <p className="text-[12px] text-[#6b7280] mt-1 italic">{conflict.edge.reason}</p>
        )}
        <p className="text-[11px] text-[#9ca3af] mt-1">
          {winner.label} (rank {winner.rank}) outranks {loser.label} (rank {loser.rank})
        </p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConflictResolutionProps {
  fullGraph?: BackendFullGraphResponse | null;
}

export function ConflictResolution({ fullGraph }: ConflictResolutionProps) {
  if (!fullGraph || fullGraph.nodes.length === 0) return null;

  const { nodes, edges } = fullGraph;

  // Find CONFLICTS_WITH edges
  const conflictEdges = edges.filter((e) => e.type === "CONFLICTS_WITH");
  if (conflictEdges.length === 0) return null;

  const conflicts: ConflictData[] = conflictEdges
    .map((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to   = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return null;
      const loserPriority  = inferPriority(from, edge.reason);
      const winnerPriority = inferPriority(to, edge.reason);
      return { from, to, edge, winnerPriority, loserPriority };
    })
    .filter(Boolean) as ConflictData[];

  if (conflicts.length === 0) return null;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Conflict resolution</p>
        <p className="text-[12px] text-[#6b7280] mt-0.5">How SAATHI resolves competing household rules</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {conflicts.map((c, i) => (
          <motion.div key={`${c.from.id}_${c.to.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <ConflictCard conflict={c} />
          </motion.div>
        ))}

        {/* Priority legend */}
        <div className="mt-1 pt-3 border-t border-[#f3f4f6]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-2">Priority order</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRIORITY_LABEL)
              .sort((a, b) => a[1].rank - b[1].rank)
              .map(([, v]) => (
                <div key={v.label} className="flex items-center gap-1">
                  <span className="text-[10px] font-mono" style={{ color: v.color }}>{v.rank}. {v.label}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
