"use client";

/**
 * SaathiEfficiency — Phase 10
 *
 * Shows SAATHI's architecture efficiency story using real /metrics fields:
 *   token_savings_percentage   — % reduction from v1 to v2
 *   estimated_daily_cost_usd   — real daily Bedrock cost
 *   v1_estimated_tokens_per_call — baseline (3800 tokens)
 *   v2_actual_tokens_per_call   — actual average
 *   avg_rule_engine_latency_ms  — rule engine speed
 *   avg_bedrock_latency_ms      — AI reasoning speed
 *   functionality_during_outage — offline resilience %
 *
 * All values come from /metrics. Zero hardcoded numbers.
 * If metrics are unavailable, the component renders nothing.
 */

import { motion } from "framer-motion";

// ─── Shape — subset of DashboardMetrics from /metrics ─────────────────────────

export interface EfficiencyMetrics {
  token_savings_percentage: number;
  estimated_daily_cost_usd: number;
  v1_estimated_tokens_per_call: number;
  v2_actual_tokens_per_call: number;
  avg_rule_engine_latency_ms: number;
  avg_bedrock_latency_ms: number;
  functionality_during_outage: number;
  total_events_processed: number;
  rule_engine_percentage: number;
}

// ─── Bar ──────────────────────────────────────────────────────────────────────

function MetricBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex-1 h-[3px] bg-[#f3f4f6] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SaathiEfficiencyProps {
  metrics: EfficiencyMetrics | null;
}

export function SaathiEfficiency({ metrics }: SaathiEfficiencyProps) {
  // Don't render if no metrics available yet
  if (!metrics || metrics.total_events_processed === 0) return null;

  const savingsPct = Math.round(metrics.token_savings_percentage);
  const costStr = metrics.estimated_daily_cost_usd === 0
    ? "$0.00/day"
    : `$${metrics.estimated_daily_cost_usd.toFixed(4)}/day`;

  const v1 = metrics.v1_estimated_tokens_per_call;
  const v2 = Math.round(metrics.v2_actual_tokens_per_call);

  const reLatency = Math.round(metrics.avg_rule_engine_latency_ms);
  const bkLatency = Math.round(metrics.avg_bedrock_latency_ms);
  const rePct = Math.round(metrics.rule_engine_percentage);
  const offlinePct = Math.round(metrics.functionality_during_outage);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#9ca3af] font-semibold">Architecture efficiency</p>
        <p className="text-[12px] text-[#6b7280] mt-0.5">How SAATHI uses AI responsibly</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">

        {/* Token reduction hero */}
        {savingsPct > 0 && (
          <div className="bg-[#f5f3ff] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-[#7c3aed] font-semibold uppercase tracking-wide">Token reduction</span>
              <span className="text-[20px] font-bold text-[#7c3aed]">{savingsPct}%</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <p className="font-mono text-[9px] text-[#9ca3af] mb-1">v1 baseline</p>
                <div className="flex items-center gap-2">
                  <MetricBar value={v1} max={v1} color="#e5e7eb" />
                  <span className="font-mono text-[10px] text-[#9ca3af] w-10 text-right shrink-0">{v1}</span>
                </div>
              </div>
              <span className="text-[#9ca3af] font-mono text-[11px]">→</span>
              <div className="flex-1">
                <p className="font-mono text-[9px] text-[#9ca3af] mb-1">v2 actual</p>
                <div className="flex items-center gap-2">
                  <MetricBar value={v2 || 1} max={v1} color="#8b5cf6" />
                  <span className="font-mono text-[10px] text-[#7c3aed] w-10 text-right shrink-0 font-semibold">{v2 || "–"}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-[#6b7280]">
              {v2 > 0 ? `${v1} tokens → ${v2} tokens per AI call` : `Baseline: ${v1} tokens · awaiting AI calls`}
            </p>
          </div>
        )}

        {/* Cost */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-0.5">Estimated daily cost</p>
            <p className="text-[15px] font-bold text-[#111827]">{costStr}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-0.5">Events processed</p>
            <p className="text-[15px] font-bold text-[#111827]">{metrics.total_events_processed}</p>
          </div>
        </div>

        {/* Route split */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-1.5">Routing split</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-[#374151] w-24 shrink-0">Rule engine</span>
            <MetricBar value={rePct} max={100} color="#8b5cf6" />
            <span className="font-mono text-[10px] text-[#9ca3af] w-8 text-right shrink-0">{rePct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#374151] w-24 shrink-0">Bedrock AI</span>
            <MetricBar value={100 - rePct} max={100} color="#0284c7" />
            <span className="font-mono text-[10px] text-[#9ca3af] w-8 text-right shrink-0">{100 - rePct}%</span>
          </div>
        </div>

        {/* Latencies */}
        {(reLatency > 0 || bkLatency > 0) && (
          <div className="flex items-center gap-4 border-t border-[#f3f4f6] pt-3">
            {reLatency > 0 && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-0.5">Rule engine</p>
                <p className="text-[13px] font-semibold text-[#374151]">{reLatency}ms</p>
              </div>
            )}
            {bkLatency > 0 && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-0.5">Bedrock AI</p>
                <p className="text-[13px] font-semibold text-[#0284c7]">{bkLatency}ms</p>
              </div>
            )}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#9ca3af] mb-0.5">Offline resilience</p>
              <p className="text-[13px] font-semibold text-[#10b981]">{offlinePct}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
