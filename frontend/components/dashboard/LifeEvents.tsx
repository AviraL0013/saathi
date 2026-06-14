"use client";

/**
 * LifeEvents — Phase 9
 *
 * Surfaces life event and health condition nodes from the household graph.
 * Data source: /graph/{hh}/full (BackendFullGraphResponse)
 *
 * Two card types:
 *   Life event  — ongoing events like board exams
 *   Health      — chronic conditions and their medications + routines
 */

import { motion } from "framer-motion";
import type { BackendFullGraphResponse, BackendGraphNode, BackendGraphEdge } from "@/services/dashboard.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nodeById(nodes: BackendGraphNode[], id: string) {
  return nodes.find((n) => n.id === id);
}

function edgesFrom(edges: BackendGraphEdge[], fromId: string, type?: string) {
  return edges.filter(
    (e) => e.from === fromId && (type ? e.type === type : true)
  );
}

function edgesTo(edges: BackendGraphEdge[], toId: string, type?: string) {
  return edges.filter(
    (e) => e.to === toId && (type ? e.type === type : true)
  );
}

// ─── Life Event Card ──────────────────────────────────────────────────────────

function LifeEventCard({
  node,
  nodes,
  edges,
}: {
  node: BackendGraphNode;
  nodes: BackendGraphNode[];
  edges: BackendGraphEdge[];
}) {
  // Affected members via DIRECTLY_AFFECTS edges
  const affectedEdges = edgesFrom(edges, node.id, "DIRECTLY_AFFECTS");
  const affectedMembers = affectedEdges.map((e) => {
    const m = nodeById(nodes, e.to);
    return { name: m?.name ?? e.to, impact: e.impact ?? "medium" };
  });

  const label = node.description ?? node.name ?? node.id.replace(/_/g, " ");

  // Derive active constraints from CONFLICTS_WITH edges that reference members
  // affected by this life event (e.g. rtn_rohan_study CONFLICTS_WITH dev_tv_001)
  const affectedMemberIds = new Set(affectedEdges.map((e) => e.to));

  // Find routines belonging to affected members
  const affectedRoutineIds = new Set<string>();
  for (const e of edges) {
    if (e.type === "FOLLOWS" && affectedMemberIds.has(e.from)) {
      affectedRoutineIds.add(e.to);
    }
  }

  // CONFLICTS_WITH edges from those routines
  const conflictEdges = edges.filter(
    (e) => e.type === "CONFLICTS_WITH" && affectedRoutineIds.has(e.from)
  );

  const constraints: Array<{ text: string; icon: string }> = conflictEdges.map((e) => {
    const fromNode = nodeById(nodes, e.from);
    const toNode   = nodeById(nodes, e.to);
    const fromLabel = fromNode?.description?.slice(0, 35) ?? e.from.replace(/_/g, " ");
    const toLabel   = toNode?.name ?? e.to.replace(/_/g, " ");
    const reason    = e.reason ? ` — ${e.reason}` : "";
    const icon =
      toNode?.device_type === "television" ? "📺" :
      toNode?.device_type === "ac"         ? "❄️" :
      e.reason?.toLowerCase().includes("quiet") ? "🔇" : "⚡";
    return { text: `${fromLabel} conflicts with ${toLabel}${reason}`, icon };
  });

  return (
    <div className="border border-[#fde68a] bg-[#fffbeb] rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-mono font-semibold text-[#b45309] bg-[#fef9c3] px-1.5 py-0.5 rounded">Life Event</span>
        <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wide">Active</span>
      </div>

      <p className="text-[14px] font-semibold text-[#111827] mb-2 capitalize">{label}</p>

      {/* Affected members */}
      {affectedMembers.length > 0 && (
        <div className="mb-2">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-1">Affects</p>
          <div className="flex flex-wrap gap-1.5">
            {affectedMembers.map(({ name, impact }) => (
              <span
                key={name}
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: impact === "high" ? "#fef9c3" : "#f3f4f6",
                  color: impact === "high" ? "#b45309" : "#374151",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Graph-derived constraints */}
      {constraints.length > 0 && (
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-1">Active conflicts from graph</p>
          <div className="flex flex-col gap-1">
            {constraints.map(({ text, icon }, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[11px] shrink-0">{icon}</span>
                <span className="text-[12px] text-[#374151]">{text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback if no conflict edges found */}
      {constraints.length === 0 && affectedMembers.length > 0 && (
        <p className="text-[12px] text-[#9ca3af]">Household adjustments active for affected members.</p>
      )}
    </div>
  );
}

// ─── Health Condition Card ────────────────────────────────────────────────────

function HealthCard({
  condNode,
  memberNode,
  nodes,
  edges,
}: {
  condNode: BackendGraphNode;
  memberNode: BackendGraphNode | undefined;
  nodes: BackendGraphNode[];
  edges: BackendGraphEdge[];
}) {
  const condName = condNode.condition ?? condNode.name ?? condNode.id.replace(/_/g, " ");
  const memberName = memberNode?.name ?? "Unknown";

  // Medications for this member
  const medEdges = memberNode ? edgesFrom(edges, memberNode.id, "TAKES") : [];
  const medications = medEdges
    .map((e) => nodeById(nodes, e.to))
    .filter(Boolean)
    .map((m) => ({ name: m!.name ?? m!.id, schedule: m!.schedule, critical: m!.critical }));

  // Routines for this member
  const routineEdges = memberNode ? edgesFrom(edges, memberNode.id, "FOLLOWS") : [];
  const routines = routineEdges
    .map((e) => nodeById(nodes, e.to))
    .filter(Boolean)
    .slice(0, 3)
    .map((r) => r!.description ?? r!.id.replace(/_/g, " "));

  const severityColor =
    condNode.severity === "high" ? "#ef4444" :
    condNode.severity === "moderate" ? "#f97316" : "#8b5cf6";

  const severityBg =
    condNode.severity === "high" ? "#fef2f2" :
    condNode.severity === "moderate" ? "#fff7ed" : "#f5f3ff";

  return (
    <div
      className="border rounded-xl p-3.5"
      style={{ borderColor: severityColor + "40", backgroundColor: severityBg }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded capitalize"
          style={{ color: severityColor, backgroundColor: severityColor + "20" }}
        >
          {condNode.severity ?? "moderate"}
        </span>
        <span className="text-[10px] text-[#9ca3af]">{memberName}</span>
      </div>

      <p className="text-[14px] font-semibold text-[#111827] mb-2 capitalize">{condName}</p>

      {/* Medications */}
      {medications.length > 0 && (
        <div className="mb-2">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-1">Medication</p>
          {medications.map((med, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <span className="text-[11px]">{med.critical ? "💊" : "🔵"}</span>
              <span className="text-[12px] text-[#374151] flex-1">{med.name}</span>
              {med.schedule && (
                <span className="font-mono text-[10px] text-[#9ca3af]">{med.schedule}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Routines */}
      {routines.length > 0 && (
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-1">Monitored routines</p>
          <div className="flex flex-col gap-1">
            {routines.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-[#10b981]">✓</span>
                <span className="text-[12px] text-[#374151] capitalize">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LifeEventsProps {
  fullGraph?: BackendFullGraphResponse | null;
}

export function LifeEvents({ fullGraph }: LifeEventsProps) {
  if (!fullGraph || fullGraph.nodes.length === 0) {
    return null; // Don't render if no graph data
  }

  const { nodes, edges } = fullGraph;

  // Life events
  const lifeEventNodes = nodes.filter((n) => n.node_type === "life_event");

  // Health conditions — group by member
  const healthNodes = nodes.filter((n) => n.node_type === "health_condition");
  const processedMembers = new Set<string>();

  interface HealthGroup {
    condNode: BackendGraphNode;
    memberNode: BackendGraphNode | undefined;
  }
  const healthGroups: HealthGroup[] = [];

  for (const cond of healthNodes) {
    const memberEdge = edgesTo(edges, cond.id, "HAS_CONDITION")[0];
    if (!memberEdge) continue;
    const memberId = memberEdge.from;
    if (processedMembers.has(memberId)) continue; // one card per member
    processedMembers.add(memberId);
    const member = nodeById(nodes, memberId);
    healthGroups.push({ condNode: cond, memberNode: member });
  }

  if (lifeEventNodes.length === 0 && healthGroups.length === 0) return null;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Life events & health</p>
        <p className="text-[12px] text-[#6b7280] mt-0.5">What SAATHI is monitoring right now</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {lifeEventNodes.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <LifeEventCard node={n} nodes={nodes} edges={edges} />
          </motion.div>
        ))}
        {healthGroups.map(({ condNode, memberNode }, i) => (
          <motion.div key={condNode.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (lifeEventNodes.length + i) * 0.08 }}>
            <HealthCard condNode={condNode} memberNode={memberNode} nodes={nodes} edges={edges} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
