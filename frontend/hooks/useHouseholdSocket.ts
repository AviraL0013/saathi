/**
 * useHouseholdSocket.ts — Phase 8
 *
 * Connects to the backend WebSocket at /ws/{household_id} and delivers
 * typed real-time events to the dashboard.
 *
 * Usage:
 *   const { lastEvent, connected } = useHouseholdSocket("hh_xk92p_sharma");
 *
 * The hook reconnects automatically on disconnect with exponential backoff.
 * It cleans up on component unmount.
 *
 * Supported event types (from WSEventType enum in backend):
 *   event_ingested       — a new event entered the pipeline
 *   rte_decision         — routing decision was made
 *   rule_engine_result   — rule engine produced actions
 *   bedrock_request      — event sent to Bedrock
 *   bedrock_response     — Bedrock replied with actions
 *   action_planned       — action planner approved/rejected
 *   action_planner_step  — planner pipeline step completed
 *   command_dispatched   — device command executed
 *   notification_sent    — notification dispatched to member
 *   circuit_breaker_state — Bedrock circuit breaker changed state
 *   metrics_update       — metrics snapshot updated
 *   pattern_update       — pattern confidence changed
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { BACKEND_BASE } from "@/services/api.config";

// WebSocket URL — converts http(s) → ws(s)
function toWsUrl(base: string, householdId: string): string {
  return base.replace(/^http/, "ws") + `/ws/${householdId}`;
}

// Max consecutive failures before giving up (avoids infinite retry spam on Lambda)
const MAX_RETRIES = 3;

// ─── Event shapes ──────────────────────────────────────────────────────────────

export type WSEventType =
  | "event_ingested"
  | "rte_decision"
  | "rule_engine_result"
  | "bedrock_request"
  | "bedrock_response"
  | "action_planned"
  | "action_planner_step"
  | "command_dispatched"
  | "notification_sent"
  | "circuit_breaker_state"
  | "metrics_update"
  | "pattern_update";

export interface WSMessage {
  type: WSEventType;
  household_id: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface SocketState {
  /** True when WebSocket is OPEN */
  connected: boolean;
  /** True when max retries exceeded — WebSocket not supported by this backend */
  disabled: boolean;
  /** Most recent message received (null until first message) */
  lastEvent: WSMessage | null;
  /** All events received in this session (last 100) */
  events: WSMessage[];
  /** Manual reconnect trigger (also resets the retry counter) */
  reconnect: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHouseholdSocket(householdId: string): SocketState {
  const [connected, setConnected]   = useState(false);
  const [disabled, setDisabled]     = useState(false);
  const [lastEvent, setLastEvent]   = useState<WSMessage | null>(null);
  const [events, setEvents]         = useState<WSMessage[]>([]);
  const wsRef      = useRef<WebSocket | null>(null);
  const backoff    = useRef(1000);       // ms, doubles on each failure
  const retries    = useRef(0);          // consecutive failure counter
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (retries.current >= MAX_RETRIES) {
      // Give up — backend doesn't support WebSockets (e.g. Lambda)
      setDisabled(true);
      return;
    }

    // Close any existing connection
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close();
    }

    const url = toWsUrl(BACKEND_BASE, householdId);
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      // WebSocket not available (SSR or unsupported env) — silently skip
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setConnected(true);
      setDisabled(false);
      backoff.current = 1000; // reset on success
      retries.current = 0;    // reset failure counter on success
    };

    ws.onmessage = (ev) => {
      if (!mountedRef.current) return;
      try {
        const msg = JSON.parse(ev.data as string) as WSMessage;
        setLastEvent(msg);
        setEvents((prev) => [msg, ...prev].slice(0, 100));
      } catch {
        // malformed JSON — ignore
      }
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setConnected(false);
      retries.current += 1;

      if (retries.current >= MAX_RETRIES) {
        // Stop retrying — WebSocket not available on this backend
        setDisabled(true);
        return;
      }

      // Reconnect with backoff
      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          backoff.current = Math.min(backoff.current * 2, 30_000);
          connect();
        }
      }, backoff.current);
    };

    ws.onerror = () => {
      // onerror is always followed by onclose — let onclose handle reconnect
      ws.close();
    };
  }, [householdId]);

  useEffect(() => {
    mountedRef.current = true;
    // Only run in browser
    if (typeof window !== "undefined") {
      connect();
    }

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    backoff.current = 1000;
    retries.current = 0;   // reset retry counter on manual reconnect
    setDisabled(false);
    connect();
  }, [connect]);

  return { connected, disabled, lastEvent, events, reconnect };
}
