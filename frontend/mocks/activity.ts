// ─── Activity Feed Mock ───────────────────────────────────────────────────────
// Derived from backend/data/demo_script.json — represents SAATHI's action log

export type ActivityRoute = "RULE_ENGINE" | "BEDROCK" | "SUPPRESS" | "PATTERN";
export type ActivitySeverity = "info" | "warning" | "critical" | "success";

export interface MockActivity {
  id: string;
  timestamp: string; // display time
  title: string;
  description: string;
  route: ActivityRoute;
  severity: ActivitySeverity;
  deviceEmoji?: string;
  deviceName?: string;
  memberEmoji?: string;
  memberName?: string;
  ruleId?: string;
  ruleLabel?: string;
  actionTaken?: string;
  // Phase 10 — preserved from ActionLog
  targetMembers?: string[];          // who received the notification
  deviceId?: string;                 // which device was commanded
  command?: string;                  // what command was issued
  channel?: string;                  // delivery channel
  latencyMs?: number;                // dispatch latency
  actionType?: "notification" | "device_command" | "reminder";
  success?: boolean;
}

export const SHARMA_ACTIVITY: MockActivity[] = [
  {
    id: "act_001",
    timestamp: "8:32 AM",
    title: "Water motor turned on",
    description: "Rajesh started the rooftop water motor before leaving for office.",
    route: "SUPPRESS",
    severity: "info",
    deviceEmoji: "💧",
    deviceName: "Water Motor",
    memberEmoji: "👨",
    memberName: "Rajesh",
    actionTaken: "Monitoring — tank at 30%",
  },
  {
    id: "act_002",
    timestamp: "9:05 AM",
    title: "Tank full — motor auto-stopped",
    description: "Tank reached 96%. Safety rule fired and motor was shut off automatically.",
    route: "RULE_ENGINE",
    severity: "success",
    deviceEmoji: "💧",
    deviceName: "Water Motor",
    ruleId: "rl_water_motor_tank_full",
    ruleLabel: "Tank Full Safety",
    actionTaken: "Motor turned off — overflow prevented",
  },
  {
    id: "act_003",
    timestamp: "11:05 AM",
    title: "Pressure cooker started",
    description: "Sunita began lunch preparation.",
    route: "SUPPRESS",
    severity: "info",
    deviceEmoji: "♨️",
    deviceName: "Pressure Cooker",
    memberEmoji: "👩",
    memberName: "Sunita",
    actionTaken: "Monitoring — 0 whistles so far",
  },
  {
    id: "act_004",
    timestamp: "11:25 AM",
    title: "Pressure cooker — 5 whistles",
    description: "Safety limit reached. Alert sent to Sunita to turn off gas.",
    route: "RULE_ENGINE",
    severity: "warning",
    deviceEmoji: "♨️",
    deviceName: "Pressure Cooker",
    memberEmoji: "👩",
    memberName: "Sunita",
    ruleId: "rl_pressure_cooker_whistle_limit",
    ruleLabel: "Whistle Limit Safety",
    actionTaken: "Voice + mobile: Gas band kar dijiye",
  },
  {
    id: "act_005",
    timestamp: "2:30 PM",
    title: "Fridge door left open",
    description: "Door was open for 3 min 30 sec. Fleet rule fired a voice alert.",
    route: "RULE_ENGINE",
    severity: "warning",
    deviceEmoji: "🧊",
    deviceName: "Kitchen Fridge",
    memberEmoji: "👩",
    memberName: "Sunita",
    ruleId: "rl_fridge_door_open",
    ruleLabel: "Fridge Door Alert",
    actionTaken: "Alexa: Fridge ka darwaza khula hai",
  },
  {
    id: "act_006",
    timestamp: "5:50 PM",
    title: "Kids room pre-cooled for study",
    description: "Rohan's study pattern detected. AC pre-started 10 minutes early.",
    route: "PATTERN",
    severity: "success",
    deviceEmoji: "❄️",
    deviceName: "Kids Room AC",
    memberEmoji: "👦",
    memberName: "Rohan",
    actionTaken: "AC set to 24°C — study time prep",
  },
  {
    id: "act_007",
    timestamp: "7:45 PM",
    title: "Guest arrival — complex reasoning",
    description: "Extended family (3 guests) arrived. No rule covered this scenario.",
    route: "BEDROCK",
    severity: "info",
    memberEmoji: "👨‍👩‍👦",
    memberName: "Extended family",
    actionTaken: "Bedrock: Living room cooled · seating suggested · family notified",
  },
  {
    id: "act_008",
    timestamp: "8:30 PM",
    title: "Dadaji evening medicine reminder",
    description: "Promoted pattern rule fired. Hindi voice reminder sent to Dadaji.",
    route: "RULE_ENGINE",
    severity: "success",
    memberEmoji: "👴",
    memberName: "Dadaji",
    ruleId: "rl_dadaji_medicine_evening_promoted",
    ruleLabel: "Evening BP Medicine (Promoted)",
    actionTaken: "Alexa: Shaam ki BP ki dawai le lijiye",
  },
  {
    id: "act_009",
    timestamp: "9:15 PM",
    title: "TV volume auto-reduced",
    description: "Someone turned TV to 65% during Rohan's board exam quiet hours.",
    route: "RULE_ENGINE",
    severity: "warning",
    deviceEmoji: "📺",
    deviceName: "Living Room TV",
    ruleId: "rl_quiet_hours_rohan_boards",
    ruleLabel: "Board Exam Quiet Hours",
    actionTaken: "Volume reduced to 20% — exams in 6 days",
  },
  {
    id: "act_010",
    timestamp: "9:22 PM",
    title: "Board exam life event — family update",
    description: "SAATHI updated family schedule: reduce distractions, nutritious meals planned.",
    route: "BEDROCK",
    severity: "info",
    memberEmoji: "👦",
    memberName: "Rohan",
    actionTaken: "Multi-member coordination: quiet hours, meal plan, schedules adjusted",
  },
];
