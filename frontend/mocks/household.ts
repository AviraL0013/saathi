// ─── Sharma Family Mock Data ─────────────────────────────────────────────────
// Derived from backend/data/sharma_family.json — kept in sync with backend types

export interface MockMember {
  id: string;
  name: string;
  age: number;
  role: "grandparent" | "parent" | "child";
  emoji: string;
  ageGroup: "senior" | "adult" | "teen" | "child";
  room: string;
  notificationChannel: "alexa_voice" | "mobile_push" | "whatsapp";
  language: "hindi" | "english";
}

export interface MockHealthCondition {
  id: string;
  memberId: string;
  condition: string;
  label: string;
  severity: "mild" | "moderate" | "high";
  emoji: string;
}

export interface MockMedication {
  id: string;
  memberId: string;
  name: string;
  schedule: string;
  critical: boolean;
  takenToday: boolean;
}

export interface MockHousehold {
  id: string;
  familyName: string;
  location: string;
  city: string;
  memberCount: number;
  deviceCount: number;
  routineCount: number;
  patternCount: number;
  daysLearning: number;
  members: MockMember[];
  healthConditions: MockHealthCondition[];
  medications: MockMedication[];
}

export const SHARMA_MEMBERS: MockMember[] = [
  {
    id: "mbr_dadaji_001",
    name: "Dadaji",
    age: 72,
    role: "grandparent",
    emoji: "👴",
    ageGroup: "senior",
    room: "Master Bedroom",
    notificationChannel: "alexa_voice",
    language: "hindi",
  },
  {
    id: "mbr_dadiji_002",
    name: "Dadiji",
    age: 68,
    role: "grandparent",
    emoji: "👵",
    ageGroup: "senior",
    room: "Master Bedroom",
    notificationChannel: "alexa_voice",
    language: "hindi",
  },
  {
    id: "mbr_papa_003",
    name: "Rajesh",
    age: 45,
    role: "parent",
    emoji: "👨",
    ageGroup: "adult",
    room: "Parents Bedroom",
    notificationChannel: "mobile_push",
    language: "hindi",
  },
  {
    id: "mbr_mama_004",
    name: "Sunita",
    age: 42,
    role: "parent",
    emoji: "👩",
    ageGroup: "adult",
    room: "Kitchen",
    notificationChannel: "whatsapp",
    language: "hindi",
  },
  {
    id: "mbr_rohan_005",
    name: "Rohan",
    age: 17,
    role: "child",
    emoji: "👦",
    ageGroup: "teen",
    room: "Kids Room",
    notificationChannel: "mobile_push",
    language: "hindi",
  },
  {
    id: "mbr_ananya_006",
    name: "Ananya",
    age: 12,
    role: "child",
    emoji: "👧",
    ageGroup: "child",
    room: "Kids Room",
    notificationChannel: "alexa_voice",
    language: "hindi",
  },
];

export const SHARMA_HEALTH: MockHealthCondition[] = [
  {
    id: "cond_hypertension",
    memberId: "mbr_dadaji_001",
    condition: "hypertension",
    label: "Hypertension",
    severity: "moderate",
    emoji: "🩺",
  },
  {
    id: "cond_diabetes_t2",
    memberId: "mbr_dadaji_001",
    condition: "type_2_diabetes",
    label: "Type 2 Diabetes",
    severity: "mild",
    emoji: "💉",
  },
  {
    id: "cond_arthritis",
    memberId: "mbr_dadaji_001",
    condition: "knee_arthritis",
    label: "Knee Arthritis",
    severity: "moderate",
    emoji: "🦴",
  },
];

export const SHARMA_MEDICATIONS: MockMedication[] = [
  {
    id: "med_amlodipine",
    memberId: "mbr_dadaji_001",
    name: "Amlodipine 5mg",
    schedule: "08:00",
    critical: true,
    takenToday: true,
  },
  {
    id: "med_metformin",
    memberId: "mbr_dadaji_001",
    name: "Metformin 500mg",
    schedule: "08:30",
    critical: true,
    takenToday: true,
  },
  {
    id: "med_evening_bp",
    memberId: "mbr_dadaji_001",
    name: "Telmisartan 40mg",
    schedule: "20:30",
    critical: true,
    takenToday: false, // evening — not yet taken
  },
  {
    id: "med_calcium",
    memberId: "mbr_dadiji_002",
    name: "Calcium + Vitamin D",
    schedule: "13:00",
    critical: false,
    takenToday: true,
  },
];

export const SHARMA_HOUSEHOLD: MockHousehold = {
  id: "hh_xk92p_sharma",
  familyName: "Sharma",
  location: "Jaipur, Rajasthan",
  city: "Jaipur",
  memberCount: 6,
  deviceCount: 6,
  routineCount: 14,
  patternCount: 12,
  daysLearning: 52,
  members: SHARMA_MEMBERS,
  healthConditions: SHARMA_HEALTH,
  medications: SHARMA_MEDICATIONS,
};
