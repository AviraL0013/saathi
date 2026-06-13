// ─── Device States Mock ───────────────────────────────────────────────────────

export type DeviceStatus = "on" | "off" | "alert" | "standby" | "protected";

export interface MockDevice {
  id: string;
  name: string;
  type: "water_motor" | "geyser" | "pressure_cooker" | "tv" | "fridge" | "ac";
  room: string;
  emoji: string;
  status: DeviceStatus;
  primaryUser: string; // member id
  primaryUserName: string;
  lastActivity: string; // human-readable
  detail?: string; // contextual detail
  saathiNote?: string; // what SAATHI did / is monitoring
  alertLevel?: "info" | "warning" | "critical";
}

export const SHARMA_DEVICES: MockDevice[] = [
  {
    id: "dev_water_motor_001",
    name: "Rooftop Water Motor",
    type: "water_motor",
    room: "Terrace",
    emoji: "💧",
    status: "protected",
    primaryUser: "mbr_papa_003",
    primaryUserName: "Rajesh",
    lastActivity: "8:32 AM — turned on",
    detail: "Tank: 96% full",
    saathiNote: "Auto-stopped at 96% — overflow prevented",
    alertLevel: "info",
  },
  {
    id: "dev_geyser_001",
    name: "Bathroom Geyser",
    type: "geyser",
    room: "Bathroom",
    emoji: "🔥",
    status: "off",
    primaryUser: "mbr_dadaji_001",
    primaryUserName: "Dadaji",
    lastActivity: "7:05 AM — used by Dadiji",
    detail: "Last run: 18 minutes",
    saathiNote: "Auto-off after 30 min — active guard",
  },
  {
    id: "dev_pressure_cooker_001",
    name: "Kitchen Pressure Cooker",
    type: "pressure_cooker",
    room: "Kitchen",
    emoji: "♨️",
    status: "alert",
    primaryUser: "mbr_mama_004",
    primaryUserName: "Sunita",
    lastActivity: "11:05 AM — lunch prep",
    detail: "5 whistles reached",
    saathiNote: "Alert sent: Gas band kar dijiye",
    alertLevel: "warning",
  },
  {
    id: "dev_tv_001",
    name: "Living Room TV",
    type: "tv",
    room: "Living Room",
    emoji: "📺",
    status: "standby",
    primaryUser: "mbr_rohan_005",
    primaryUserName: "Rohan",
    lastActivity: "9:15 PM — volume auto-reduced",
    detail: "Volume: 20% (board exam mode)",
    saathiNote: "Quiet hours active — Rohan's exams in 6 days",
    alertLevel: "info",
  },
  {
    id: "dev_fridge_001",
    name: "Kitchen Fridge",
    type: "fridge",
    room: "Kitchen",
    emoji: "🧊",
    status: "on",
    primaryUser: "mbr_mama_004",
    primaryUserName: "Sunita",
    lastActivity: "2:30 PM — door alert",
    detail: "Temp: 4°C — normal",
    saathiNote: "Door-open alert sent: 3 min 30 sec open",
    alertLevel: "info",
  },
  {
    id: "dev_ac_001",
    name: "Kids Room AC",
    type: "ac",
    room: "Kids Room",
    emoji: "❄️",
    status: "on",
    primaryUser: "mbr_rohan_005",
    primaryUserName: "Rohan",
    lastActivity: "6:02 PM — study time",
    detail: "Set: 24°C · 3h 12m running",
    saathiNote: "Pre-cooled for study session at 5:50 PM",
  },
];

export type { MockDevice as Device };
