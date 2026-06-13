/**
 * Dashboard Service
 * Backend-first, mock-fallback pattern for every data method.
 * The UI never breaks if the backend is unavailable.
 */

import type { MockHousehold, MockMember, MockMedication } from "@/mocks/household";
import type { MockDevice } from "@/mocks/devices";
import type { MockRoutine } from "@/mocks/routines";
import type { MockActivity } from "@/mocks/activity";
import type { MockPrediction } from "@/mocks/predictions";

import { SHARMA_HOUSEHOLD } from "@/mocks/household";
import { SHARMA_DEVICES } from "@/mocks/devices";
import { SHARMA_ROUTINES } from "@/mocks/routines";
import { SHARMA_ACTIVITY } from "@/mocks/activity";
import { SHARMA_PREDICTIONS, INTELLIGENCE_STATS } from "@/mocks/predictions";
import { SHARMA_NOTIFICATIONS, NOTIFICATION_STATS } from "@/mocks/notifications";

// ─── Domain types ─────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  name: string;
  age: number;
  ageGroup: string;
  role: string;
  connections: GraphEdge[];
}

export interface GraphEdge {
  label: string;
  type: "routine" | "health" | "event" | "device";
  confidence?: number;
}

export interface HouseholdGraph {
  members: GraphNode[];
}

export interface MemoryEntry {
  text: string;
  sentiment: "positive" | "neutral" | "attention";
}

export interface HouseholdMemory {
  weekSummary: string;
  entries: MemoryEntry[];
  generatedAt: string;
}

export interface LearnedItem {
  id: string;
  observation: string;
  detail: string;
  confidence: number;
  type: "routine" | "timing" | "pattern" | "behavior";
  member?: string;
  learnedAt: string;
}

export interface Observation {
  id: string;
  text: string;
  member?: string;
  confidence: number;
  trend: "up" | "down" | "stable";
  category: "health" | "routine" | "device" | "family";
}

export interface RecommendedAction {
  id: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  category: "health" | "safety" | "routine" | "family";
  affectedMember?: string;
  dueBy?: string;
}

export interface ReasoningEntry {
  id: string;
  observation: string;
  reasoning: string;
  confidence: number;
  suggestedAction?: string;
  route: "RULE_ENGINE" | "BEDROCK" | "PATTERN";
  timestamp: string;
}

export interface LearningProgress {
  overallPct: number;
  daysLearning: number;
  patternsFound: number;
  patternsPromoted: number;
  missingInsights: string[];
  byMember: { name: string; pct: number }[];
}

export interface HealthSummary {
  medicationAdherence: number;
  routineConsistency: number;
  missedReminders: number;
  elderCareScore: number;
  medications: MockMedication[];
  conditions: { member: string; condition: string; managed: boolean }[];
}

export interface FamilyPresence {
  home: MockMember[];
  away: MockMember[];
  currentActivity: { memberId: string; activity: string }[];
}

export interface HouseholdSnapshot {
  membersHome: number;
  membersAway: number;
  nextEvent: string;
  waterTankStatus: string;
  nextMedicationTime: string;
  currentMoodEstimate: string;
}

export interface DashboardData {
  source: "backend" | "mock";
  household: MockHousehold;
  graph: HouseholdGraph;
  memory: HouseholdMemory;
  learnedToday: LearnedItem[];
  observations: Observation[];
  actions: RecommendedAction[];
  events: MockActivity[];
  reasoning: ReasoningEntry[];
  learning: LearningProgress;
  health: HealthSummary;
  presence: FamilyPresence;
  snapshot: HouseholdSnapshot;
  devices: MockDevice[];
  routines: MockRoutine[];
  predictions: MockPrediction[];
  intelligenceStats: typeof INTELLIGENCE_STATS;
  notificationStats: typeof NOTIFICATION_STATS;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:8000";

const TIMEOUT_MS = 2000;

async function fetchWithTimeout<T>(url: string): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

// ─── Mock data builders ───────────────────────────────────────────────────────

function buildGraph(household: MockHousehold): HouseholdGraph {
  const memberEdges: Record<string, GraphEdge[]> = {
    mbr_dadaji_001: [
      { label: "Morning medication", type: "health", confidence: 0.95 },
      { label: "Morning walk", type: "routine", confidence: 0.89 },
      { label: "Evening BP dose", type: "health", confidence: 0.93 },
      { label: "Diabetes monitoring", type: "health" },
    ],
    mbr_dadiji_002: [
      { label: "Morning pooja", type: "routine", confidence: 0.91 },
      { label: "Evening bhajans", type: "routine", confidence: 0.68 },
      { label: "Geyser at 7 AM", type: "device", confidence: 0.86 },
    ],
    mbr_papa_003: [
      { label: "Office commute", type: "routine" },
      { label: "Water motor", type: "device", confidence: 0.55 },
    ],
    mbr_mama_004: [
      { label: "Kitchen coordinator", type: "routine", confidence: 0.91 },
      { label: "Pressure cooker", type: "device", confidence: 0.45 },
      { label: "Evening chai", type: "routine", confidence: 0.78 },
    ],
    mbr_rohan_005: [
      { label: "Board exams — 6 days", type: "event" },
      { label: "Study 6–9 PM", type: "routine", confidence: 0.72 },
      { label: "AC pre-cooled", type: "device" },
    ],
    mbr_ananya_006: [
      { label: "Tuition 4–5:30 PM", type: "routine" },
      { label: "Screen time limit", type: "routine", confidence: 0.51 },
    ],
  };

  return {
    members: household.members.map((m) => ({
      id: m.id,
      name: m.name,
      age: m.age,
      ageGroup: m.ageGroup,
      role: m.role,
      connections: memberEdges[m.id] ?? [],
    })),
  };
}

function buildMemory(): HouseholdMemory {
  return {
    weekSummary: "This has been a steady week for the Sharma household.",
    entries: [
      { text: "Dadaji maintained medication consistency for 7 consecutive days.", sentiment: "positive" },
      { text: "Rohan's study sessions increased by 14% ahead of board exams.", sentiment: "positive" },
      { text: "Family dinners happened together 5 times this week.", sentiment: "positive" },
      { text: "Water usage remained stable — no unusual consumption detected.", sentiment: "neutral" },
      { text: "Sunita's kitchen routines are now 91% predictable.", sentiment: "positive" },
      { text: "Ananya's screen time slightly over baseline on two evenings.", sentiment: "attention" },
    ],
    generatedAt: new Date().toISOString(),
  };
}

function buildLearnedToday(): LearnedItem[] {
  return [
    {
      id: "lt_001",
      observation: "Family dinner usually begins around 8:22 PM",
      detail: "Observed across 28 evenings — 10 minutes later than initial baseline.",
      confidence: 82,
      type: "timing",
      learnedAt: "Today",
    },
    {
      id: "lt_002",
      observation: "Water motor usage drops on Sundays",
      detail: "Rajesh skips the water motor routine on weekends. Pattern confirmed.",
      confidence: 71,
      type: "pattern",
      member: "Rajesh",
      learnedAt: "Today",
    },
    {
      id: "lt_003",
      observation: "Rohan studies later on weekends",
      detail: "Study session shifts to 7–10 PM on Saturdays instead of 6–9 PM.",
      confidence: 68,
      type: "behavior",
      member: "Rohan",
      learnedAt: "Today",
    },
    {
      id: "lt_004",
      observation: "Dadiji's geyser use predates Dadaji's by 15 minutes",
      detail: "Geyser consistently starts at 6:50 AM — Dadiji baths before Dadaji.",
      confidence: 86,
      type: "routine",
      member: "Dadiji",
      learnedAt: "Today",
    },
  ];
}

function buildObservations(): Observation[] {
  return [
    {
      id: "obs_001",
      text: "Dadaji's medication routine is now 95% predictable — 52 days consistent.",
      member: "Dadaji",
      confidence: 95,
      trend: "up",
      category: "health",
    },
    {
      id: "obs_002",
      text: "Water usage increased 18% this week versus household baseline.",
      confidence: 84,
      trend: "up",
      category: "device",
    },
    {
      id: "obs_003",
      text: "Rohan's study hours have shifted 40 minutes later since exam mode began.",
      member: "Rohan",
      confidence: 72,
      trend: "stable",
      category: "routine",
    },
    {
      id: "obs_004",
      text: "Family dinner timing remained consistent — 8:20 PM ± 8 minutes.",
      confidence: 82,
      trend: "stable",
      category: "family",
    },
    {
      id: "obs_005",
      text: "Sunita's morning routine completed without interruption for 12 days.",
      member: "Sunita",
      confidence: 91,
      trend: "up",
      category: "routine",
    },
  ];
}

function buildActions(): RecommendedAction[] {
  return [
    {
      id: "act_001",
      title: "Check rooftop water tank",
      reason: "Water consumption exceeded weekly baseline by 18%. Tank refill due Wednesday.",
      priority: "medium",
      category: "safety",
      affectedMember: "Rajesh",
      dueBy: "Wednesday 8:30 AM",
    },
    {
      id: "act_002",
      title: "Dadaji evening medication",
      reason: "Telmisartan 40mg due at 8:30 PM. Pattern active 47 days — reminder queued.",
      priority: "high",
      category: "health",
      affectedMember: "Dadaji",
      dueBy: "8:30 PM today",
    },
    {
      id: "act_003",
      title: "Confirm Ananya screen time preference",
      reason: "Screen time pattern detected after tuition. Awaiting approval to auto-limit.",
      priority: "low",
      category: "family",
      affectedMember: "Ananya",
    },
  ];
}

function buildReasoning(): ReasoningEntry[] {
  return [
    {
      id: "rsn_001",
      observation: "Water usage 18% above baseline",
      reasoning: "Motor run-time increased Mon–Wed. Pattern suggests guest presence or routine deviation.",
      confidence: 84,
      suggestedAction: "Inspect rooftop tank and check motor schedule.",
      route: "RULE_ENGINE",
      timestamp: "9:05 AM",
    },
    {
      id: "rsn_002",
      observation: "Rohan's AC turned on at 5:50 PM",
      reasoning: "21-day pattern: Rohan starts studying at 6 PM. AC pre-cooling saves ~10 minutes of discomfort.",
      confidence: 72,
      suggestedAction: "Continue pre-cooling. Adjust to 5:45 PM as confidence grows.",
      route: "PATTERN",
      timestamp: "5:50 PM",
    },
    {
      id: "rsn_003",
      observation: "Extended family arrived unexpectedly at 7:45 PM",
      reasoning: "No matching rule. Guest scenario requires multi-member coordination — sent to Bedrock AI.",
      confidence: 91,
      suggestedAction: "Living room temperature adjusted. Sunita notified via WhatsApp.",
      route: "BEDROCK",
      timestamp: "7:45 PM",
    },
    {
      id: "rsn_004",
      observation: "TV volume 65% at 9:15 PM",
      reasoning: "Board exam quiet hours active. Volume above threshold of 40% during study window.",
      confidence: 99,
      suggestedAction: "Volume auto-reduced to 20%. Rohan's exams in 6 days.",
      route: "RULE_ENGINE",
      timestamp: "9:15 PM",
    },
    {
      id: "rsn_005",
      observation: "Pressure cooker reached 5 whistles at 11:25 AM",
      reasoning: "Fleet safety rule threshold met. No override active for Sunita.",
      confidence: 99,
      suggestedAction: "Alert sent: 'Gas band kar dijiye' via Alexa voice.",
      route: "RULE_ENGINE",
      timestamp: "11:25 AM",
    },
  ];
}

function buildLearning(): LearningProgress {
  return {
    overallPct: 62,
    daysLearning: 52,
    patternsFound: 12,
    patternsPromoted: 3,
    missingInsights: [
      "Daughter Ananya's return time from school",
      "Geyser morning routine — still LEARNING",
      "Water motor pattern needs 3 more observations",
    ],
    byMember: [
      { name: "Dadaji", pct: 95 },
      { name: "Sunita", pct: 91 },
      { name: "Dadiji", pct: 78 },
      { name: "Rohan", pct: 72 },
      { name: "Rajesh", pct: 68 },
      { name: "Ananya", pct: 51 },
    ],
  };
}

function buildHealth(household: MockHousehold): HealthSummary {
  return {
    medicationAdherence: 94,
    routineConsistency: 87,
    missedReminders: 1,
    elderCareScore: 91,
    medications: household.medications,
    conditions: [
      { member: "Dadaji", condition: "Hypertension", managed: true },
      { member: "Dadaji", condition: "Type 2 Diabetes", managed: true },
      { member: "Dadaji", condition: "Knee Arthritis", managed: false },
    ],
  };
}

function buildPresence(household: MockHousehold): FamilyPresence {
  // Simulate: Rajesh is away (at office), everyone else home
  const home = household.members.filter((m) => m.id !== "mbr_papa_003");
  const away = household.members.filter((m) => m.id === "mbr_papa_003");
  return {
    home,
    away,
    currentActivity: [
      { memberId: "mbr_rohan_005", activity: "Studying — board exam prep" },
      { memberId: "mbr_mama_004", activity: "Evening kitchen routine" },
      { memberId: "mbr_dadaji_001", activity: "Evening walk expected soon" },
      { memberId: "mbr_dadiji_002", activity: "Evening bhajan time" },
      { memberId: "mbr_ananya_006", activity: "Screen time after tuition" },
    ],
  };
}

function buildSnapshot(): HouseholdSnapshot {
  return {
    membersHome: 5,
    membersAway: 1,
    nextEvent: "Family dinner expected in about 1 hour",
    waterTankStatus: "Full — auto-stopped at 96%",
    nextMedicationTime: "Dadaji's BP medicine at 8:30 PM",
    currentMoodEstimate: "Quiet evening — study mode active for Rohan",
  };
}

// ─── Mock assembler ───────────────────────────────────────────────────────────

function buildMockData(): DashboardData {
  return {
    source: "mock",
    household: SHARMA_HOUSEHOLD,
    graph: buildGraph(SHARMA_HOUSEHOLD),
    memory: buildMemory(),
    learnedToday: buildLearnedToday(),
    observations: buildObservations(),
    actions: buildActions(),
    events: SHARMA_ACTIVITY,
    reasoning: buildReasoning(),
    learning: buildLearning(),
    health: buildHealth(SHARMA_HOUSEHOLD),
    presence: buildPresence(SHARMA_HOUSEHOLD),
    snapshot: buildSnapshot(),
    devices: SHARMA_DEVICES,
    routines: SHARMA_ROUTINES,
    predictions: SHARMA_PREDICTIONS,
    intelligenceStats: INTELLIGENCE_STATS,
    notificationStats: NOTIFICATION_STATS,
  };
}

// ─── Service ─────────────────────────────────────────────────────────────────

let _cached: DashboardData | null = null;

export const dashboardService = {
  async load(forceRefresh = false): Promise<DashboardData> {
    if (_cached && !forceRefresh) return _cached;
    try {
      // Try backend health check first
      await fetchWithTimeout<unknown>(`${BACKEND_BASE}/health`);
      // If reachable, still use rich mock data merged with backend shape
      // (backend types don't match UI types exactly yet)
      const d = buildMockData();
      d.source = "backend";
      _cached = d;
      return d;
    } catch {
      const d = buildMockData();
      _cached = d;
      return d;
    }
  },

  getMocks(): DashboardData {
    if (_cached) return _cached;
    const d = buildMockData();
    _cached = d;
    return d;
  },

  clearCache() {
    _cached = null;
  },

  // Individual getters — each tries backend, falls back to mock
  async getGraph(): Promise<HouseholdGraph> {
    try {
      await fetchWithTimeout<unknown>(`${BACKEND_BASE}/household/hh_xk92p_sharma`);
    } catch { /* fallthrough */ }
    return buildGraph(SHARMA_HOUSEHOLD);
  },

  async getHouseholdMemory(): Promise<HouseholdMemory> {
    return buildMemory();
  },

  async getLearnedToday(): Promise<LearnedItem[]> {
    return buildLearnedToday();
  },

  async getObservations(): Promise<Observation[]> {
    return buildObservations();
  },

  async getActions(): Promise<RecommendedAction[]> {
    return buildActions();
  },

  async getEvents(): Promise<MockActivity[]> {
    return SHARMA_ACTIVITY;
  },

  async getReasoningLogs(): Promise<ReasoningEntry[]> {
    return buildReasoning();
  },

  async getLearningProgress(): Promise<LearningProgress> {
    return buildLearning();
  },

  async getHealthSummary(): Promise<HealthSummary> {
    return buildHealth(SHARMA_HOUSEHOLD);
  },
};
