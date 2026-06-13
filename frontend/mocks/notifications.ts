// ─── Notifications Mock ───────────────────────────────────────────────────────

export type NotificationChannel = "alexa_voice" | "mobile_push" | "whatsapp";
export type NotificationStatus = "sent" | "acknowledged" | "pending" | "escalated";
export type NotificationPriority = "critical" | "high" | "normal" | "low";

export interface MockNotification {
  id: string;
  timestamp: string;
  targetMemberId: string;
  targetMemberName: string;
  targetMemberEmoji: string;
  channel: NotificationChannel;
  channelEmoji: string;
  message: string;
  messageHindi?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  triggeredBy: string; // rule id or "BEDROCK" or "PATTERN"
  triggeredByLabel: string;
  acknowledged?: boolean;
  acknowledgedAt?: string;
}

const channelEmoji: Record<NotificationChannel, string> = {
  alexa_voice: "🔊",
  mobile_push: "📱",
  whatsapp: "💬",
};

export const SHARMA_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif_001",
    timestamp: "9:05 AM",
    targetMemberId: "mbr_papa_003",
    targetMemberName: "Rajesh",
    targetMemberEmoji: "👨",
    channel: "mobile_push",
    channelEmoji: channelEmoji.mobile_push,
    message: "Water tank is full (96%). Motor has been turned off automatically.",
    messageHindi: "पानी की टंकी भर गई है। मोटर बंद कर दी गई है।",
    priority: "normal",
    status: "acknowledged",
    triggeredBy: "rl_water_motor_tank_full",
    triggeredByLabel: "Tank Full Safety Rule",
    acknowledged: true,
    acknowledgedAt: "9:07 AM",
  },
  {
    id: "notif_002",
    timestamp: "11:25 AM",
    targetMemberId: "mbr_mama_004",
    targetMemberName: "Sunita",
    targetMemberEmoji: "👩",
    channel: "alexa_voice",
    channelEmoji: channelEmoji.alexa_voice,
    message: "Pressure cooker has 5 whistles. Please turn off the gas.",
    messageHindi: "कुकर में 5 सीटी हो गई हैं। गैस बंद कर दीजिए।",
    priority: "high",
    status: "acknowledged",
    triggeredBy: "rl_pressure_cooker_whistle_limit",
    triggeredByLabel: "Whistle Limit Safety Rule",
    acknowledged: true,
    acknowledgedAt: "11:26 AM",
  },
  {
    id: "notif_003",
    timestamp: "2:30 PM",
    targetMemberId: "mbr_mama_004",
    targetMemberName: "Sunita",
    targetMemberEmoji: "👩",
    channel: "alexa_voice",
    channelEmoji: channelEmoji.alexa_voice,
    message: "Fridge door has been open for 3 minutes. Please close it.",
    messageHindi: "फ्रिज का दरवाज़ा 3 मिनट से खुला है। बंद कर दीजिए।",
    priority: "normal",
    status: "acknowledged",
    triggeredBy: "rl_fridge_door_open",
    triggeredByLabel: "Fridge Door Alert",
    acknowledged: true,
    acknowledgedAt: "2:31 PM",
  },
  {
    id: "notif_004",
    timestamp: "8:00 AM",
    targetMemberId: "mbr_dadaji_001",
    targetMemberName: "Dadaji",
    targetMemberEmoji: "👴",
    channel: "alexa_voice",
    channelEmoji: channelEmoji.alexa_voice,
    message: "Good morning, Dadaji. Time for your morning medicines: Amlodipine and Metformin.",
    messageHindi: "सुप्रभात दादाजी। सुबह की दवाई का समय हो गया है — अम्लोडिपिन और मेटफॉर्मिन लीजिए।",
    priority: "high",
    status: "acknowledged",
    triggeredBy: "rl_dadaji_morning_meds",
    triggeredByLabel: "Morning Medicine Reminder",
    acknowledged: true,
    acknowledgedAt: "8:04 AM",
  },
  {
    id: "notif_005",
    timestamp: "8:30 PM",
    targetMemberId: "mbr_dadaji_001",
    targetMemberName: "Dadaji",
    targetMemberEmoji: "👴",
    channel: "alexa_voice",
    channelEmoji: channelEmoji.alexa_voice,
    message: "Dadaji, time for your evening BP medicine: Telmisartan.",
    messageHindi: "दादाजी, शाम की BP की दवाई लीजिए — टेल्मिसार्टन।",
    priority: "high",
    status: "pending",
    triggeredBy: "rl_dadaji_medicine_evening_promoted",
    triggeredByLabel: "Evening BP Medicine (Promoted Pattern)",
    acknowledged: false,
  },
  {
    id: "notif_006",
    timestamp: "9:15 PM",
    targetMemberId: "mbr_rohan_005",
    targetMemberName: "Rohan",
    targetMemberEmoji: "👦",
    channel: "mobile_push",
    channelEmoji: channelEmoji.mobile_push,
    message: "TV volume reduced to 20% — quiet hours active for your board exams. 6 days to go! 💪",
    priority: "normal",
    status: "sent",
    triggeredBy: "rl_quiet_hours_rohan_boards",
    triggeredByLabel: "Board Exam Quiet Hours",
    acknowledged: false,
  },
  {
    id: "notif_007",
    timestamp: "7:45 PM",
    targetMemberId: "mbr_mama_004",
    targetMemberName: "Sunita",
    targetMemberEmoji: "👩",
    channel: "whatsapp",
    channelEmoji: channelEmoji.whatsapp,
    message: "Extended family (3 guests) arrived. Living room cooled, seating arrangement suggested. Family members notified.",
    priority: "normal",
    status: "sent",
    triggeredBy: "BEDROCK",
    triggeredByLabel: "Bedrock Reasoning",
    acknowledged: false,
  },
];

// Stats
export const NOTIFICATION_STATS = {
  sentToday: 7,
  acknowledged: 4,
  pending: 3,
  critical: 0,
  byChannel: {
    alexa_voice: 4,
    mobile_push: 2,
    whatsapp: 1,
  },
};
