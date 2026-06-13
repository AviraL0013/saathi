// ─── SAATHI Predictions / Intelligence Mock ───────────────────────────────────

export type PredictionType =
  | "safety"
  | "health"
  | "comfort"
  | "energy"
  | "care"
  | "routine"
  | "life_event";

export type PredictionConfidence = "high" | "medium" | "low";

export interface MockPrediction {
  id: string;
  type: PredictionType;
  title: string;
  description: string;
  confidence: PredictionConfidence;
  confidencePct: number;
  scheduledFor?: string;
  affectedMembers: string[]; // member names
  actionLabel?: string;
  emoji: string;
  color: string;
  bg: string;
}

export const SHARMA_PREDICTIONS: MockPrediction[] = [
  {
    id: "pred_001",
    type: "health",
    title: "Dadaji evening medicine",
    description: "Telmisartan 40mg due at 8:30 PM. Pattern active 47 days — auto-reminder queued.",
    confidence: "high",
    confidencePct: 93,
    scheduledFor: "8:30 PM today",
    affectedMembers: ["Dadaji"],
    actionLabel: "Reminder queued",
    emoji: "💊",
    color: "#ec4899",
    bg: "#fdf4ff",
  },
  {
    id: "pred_002",
    type: "life_event",
    title: "Rohan's boards in 6 days",
    description: "Exam mode active. TV volume capped, quiet hours enforced 9 PM–7 AM, nutritious meal suggestions enabled.",
    confidence: "high",
    confidencePct: 99,
    affectedMembers: ["Rohan", "Sunita", "Rajesh"],
    emoji: "📚",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    id: "pred_003",
    type: "routine",
    title: "Family TV time tonight",
    description: "Family gathers for TV after dinner — 28 days observed. Warm lighting and volume pre-set.",
    confidence: "high",
    confidencePct: 82,
    scheduledFor: "9:00 PM tonight",
    affectedMembers: ["Everyone"],
    actionLabel: "Ambience ready",
    emoji: "📺",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    id: "pred_004",
    type: "safety",
    title: "Water motor next fill",
    description: "Based on consumption pattern (Mon/Wed/Fri), tank will need refill on Wednesday morning.",
    confidence: "medium",
    confidencePct: 71,
    scheduledFor: "Wednesday 8:30 AM",
    affectedMembers: ["Rajesh"],
    emoji: "💧",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    id: "pred_005",
    type: "care",
    title: "Dadaji arthritis alert",
    description: "Kids room AC running. Cold air drafts can worsen knee arthritis. Monitor if Dadaji visits.",
    confidence: "medium",
    confidencePct: 68,
    affectedMembers: ["Dadaji"],
    actionLabel: "Monitoring",
    emoji: "🦴",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  {
    id: "pred_006",
    type: "energy",
    title: "Geyser schedule suggestion",
    description: "Dadiji uses geyser at 7 AM daily. Pre-heating at 6:50 AM saves 8 minutes of idle running.",
    confidence: "high",
    confidencePct: 86,
    scheduledFor: "Tomorrow 6:50 AM",
    affectedMembers: ["Dadiji"],
    actionLabel: "Auto-schedule",
    emoji: "🔥",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    id: "pred_007",
    type: "routine",
    title: "Ananya screen time limit",
    description: "Screen time pattern detected after tuition. Monitoring for Sunita's approval to auto-limit.",
    confidence: "low",
    confidencePct: 51,
    scheduledFor: "5:30 PM on Mon/Wed/Fri",
    affectedMembers: ["Ananya"],
    actionLabel: "Awaiting approval",
    emoji: "📱",
    color: "#6366f1",
    bg: "#eef2ff",
  },
];

// Overall intelligence stats
export const INTELLIGENCE_STATS = {
  patternsDetected: 12,
  patternsPromoted: 3, // became rules
  rulesActive: 9,
  actionsToday: 10,
  safetyActionsToday: 3,
  daysLearning: 52,
  routesBreakdown: {
    ruleEngine: 6,
    bedrock: 2,
    suppressed: 2,
  },
};
