"use client";

import { motion } from "framer-motion";
import type { HouseholdGraph as HouseholdGraphData } from "@/services/dashboard.service";

const AGE_COLOR: Record<string, string> = {
  senior: "#8b5cf6",
  adult:  "#374151",
  teen:   "#0ea5e9",
  child:  "#10b981",
};

const EDGE_TYPE_COLOR: Record<string, string> = {
  health:   "#ec4899",
  routine:  "#8b5cf6",
  event:    "#f59e0b",
  device:   "#0ea5e9",
  behavior: "#6366f1",
};

export function HouseholdGraph({ graph }: { graph: HouseholdGraphData }) {
  const { members } = graph;

  const W = 380;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2 - 10;
  const ringR = 130;
  const nodeR = 26;

  const nodes = members.map((m, i) => {
    const angle = (i / members.length) * 2 * Math.PI - Math.PI / 2;
    return { ...m, x: cx + ringR * Math.cos(angle), y: cy + ringR * Math.sin(angle), angle };
  });

  // Pick 4 most interesting nodes for active spokes
  const highlighted = members
    .filter((m) => m.connections.some((c) => c.confidence && c.confidence > 0.7))
    .slice(0, 4)
    .map((m) => m.id);

  return (
    <div className="w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">

        {/* Guide ring */}
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="#f0eff8" strokeWidth="1" strokeDasharray="3 5" />

        {/* Spokes */}
        {nodes.map((node) => {
          const isHighlighted = highlighted.includes(node.id);
          return (
            <motion.line
              key={`spoke-${node.id}`}
              x1={node.x} y1={node.y} x2={cx} y2={cy}
              stroke={isHighlighted ? "#c4b5fd" : "#ececec"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              strokeDasharray={isHighlighted ? "none" : "3 4"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + nodes.indexOf(node) * 0.08 }}
            />
          );
        })}

        {/* Edge labels — top connection for each highlighted node */}
        {nodes.map((node) => {
          if (!highlighted.includes(node.id)) return null;
          const top = node.connections.find((c) => c.confidence && c.confidence > 0.7);
          if (!top) return null;
          const labelR = ringR + 48;
          const lx = cx + labelR * Math.cos(node.angle);
          const ly = cy + labelR * Math.sin(node.angle);
          const anchor = node.x > cx + 8 ? "start" : node.x < cx - 8 ? "end" : "middle";
          return (
            <motion.text
              key={`elabel-${node.id}`}
              x={lx} y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="9.5"
              fill={EDGE_TYPE_COLOR[top.type] ?? "#8b5cf6"}
              fontFamily="ui-monospace, monospace"
              fontWeight="600"
              opacity="0.85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.6 + nodes.indexOf(node) * 0.05 }}
            >
              {top.label}
            </motion.text>
          );
        })}

        {/* Member nodes */}
        {nodes.map((node, i) => {
          const color = AGE_COLOR[node.ageGroup] ?? "#6b7280";
          const hasHealth = node.connections.some((c) => c.type === "health");
          const namePush = 44;
          const nx = cx + (ringR + namePush) * Math.cos(node.angle);
          const ny = cy + (ringR + namePush) * Math.sin(node.angle);
          const anchor = node.x > cx + 8 ? "start" : node.x < cx - 8 ? "end" : "middle";

          return (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 + i * 0.08 }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {hasHealth && (
                <circle cx={node.x} cy={node.y} r={nodeR + 6} fill="none" stroke={color} strokeWidth="1" opacity="0.2" strokeDasharray="2 3" />
              )}
              <circle cx={node.x} cy={node.y} r={nodeR} fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
              <text
                x={node.x} y={node.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="14" fontWeight="700"
                fill={color}
                fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
              >
                {node.name[0]}
              </text>
              {/* Name + age outside ring */}
              <text x={nx} y={ny - 7} textAnchor={anchor} fontSize="11" fontWeight="600" fill="#374151" fontFamily="var(--font-space-grotesk), system-ui, sans-serif">
                {node.name}
              </text>
              <text x={nx} y={ny + 7} textAnchor={anchor} fontSize="9" fill="#9ca3af" fontFamily="ui-monospace, monospace">
                {node.age} · {node.role}
              </text>
            </motion.g>
          );
        })}

        {/* Center — SAATHI node */}
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r={44} fill="#111827" />
          <circle cx={cx} cy={cy} r={49} fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.35" />
          <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="ui-monospace, monospace" letterSpacing="0.12em">SAATHI</text>
          <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#a78bfa" fontFamily="ui-monospace, monospace">
            {members.reduce((a, m) => a + m.connections.length, 0)} links
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
