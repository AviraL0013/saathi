"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { onboardingStore, useOnboardingStore, HouseholdMember } from "@/lib/onboarding-store";

const ROLES: { value: HouseholdMember["role"]; label: string; emoji: string }[] = [
  { value: "owner", label: "Owner / Me", emoji: "🧑" },
  { value: "partner", label: "Partner / Spouse", emoji: "🧑" },
  { value: "child", label: "Child", emoji: "👦" },
  { value: "parent", label: "Parent", emoji: "🧓" },
  { value: "grandparent", label: "Grandparent", emoji: "👴" },
  { value: "other", label: "Other", emoji: "🙂" },
];

const AGE_GROUPS: { value: HouseholdMember["ageGroup"]; label: string }[] = [
  { value: "baby", label: "Baby (0–3)" },
  { value: "child", label: "Child (4–12)" },
  { value: "teen", label: "Teen (13–17)" },
  { value: "adult", label: "Adult (18–59)" },
  { value: "senior", label: "Senior (60+)" },
];

const ROLE_EMOJIS: Record<HouseholdMember["role"], string> = {
  owner: "🧑",
  partner: "🧑‍🤝‍🧑",
  child: "👦",
  parent: "🧓",
  grandparent: "👴",
  other: "🙂",
};

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function AddMemberForm({ onAdd }: { onAdd: (m: HouseholdMember) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<HouseholdMember["role"]>("adult" as never);
  const [ageGroup, setAgeGroup] = useState<HouseholdMember["ageGroup"]>("adult");
  const [open, setOpen] = useState(false);

  // pick a good default role
  const selectedRole = ROLES.find(r => r.value === role) ?? ROLES[0];

  function submit() {
    if (!name.trim()) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      role: selectedRole.value,
      ageGroup,
      emoji: ROLE_EMOJIS[selectedRole.value],
    });
    setName("");
    setRole("owner" as never);
    setAgeGroup("adult");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 border-dashed border-[#ddd6fe] text-[#8b5cf6] font-semibold text-[14px] hover:bg-[#f5f3ff] transition-all"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add a family member
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-[#f9f8ff] rounded-2xl border border-[#ddd6fe] p-5 flex flex-col gap-4"
    >
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Name (e.g. Priya, Dadaji)"
        maxLength={30}
        className="w-full px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-[15px] text-[#111827] placeholder:text-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] transition-all"
      />

      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-[#9ca3af] mb-2">Role</p>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${
                role === r.value
                  ? "bg-[#8b5cf6] text-white border-[#8b5cf6]"
                  : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#8b5cf6]"
              }`}
            >
              <span>{r.emoji}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] tracking-widest uppercase text-[#9ca3af] mb-2">Age group</p>
        <div className="flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => (
            <button
              key={a.value}
              onClick={() => setAgeGroup(a.value)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${
                ageGroup === a.value
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#374151]"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          variant="primary"
          icon={<Plus size={14} />}
          onClick={submit}
          className={name.trim() ? "" : "opacity-40 pointer-events-none"}
        >
          Add
        </Button>
      </div>
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Step3FamilyMembers() {
  const state = useOnboardingStore();

  function handleAdd(m: HouseholdMember) {
    onboardingStore.addMember(m);
  }

  function handleRemove(id: string) {
    onboardingStore.removeMember(id);
  }

  const canProceed = state.members.length >= 1;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-8">
      {/* Header */}
      <motion.div variants={item}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center mb-4">
          <Users size={22} strokeWidth={1.8} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#111827] leading-tight mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Who lives here?
        </h2>
        <p className="text-[15px] text-[#6b7280]">
          SAATHI learns everyone&apos;s patterns to serve the whole family.
        </p>
      </motion.div>

      {/* Member list */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <AnimatePresence>
          {state.members.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 bg-white rounded-2xl border border-[#e5e7eb] px-4 py-3 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] flex items-center justify-center text-xl">
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#111827] text-[14px]">{m.name}</p>
                <p className="text-[12px] text-[#9ca3af] capitalize">
                  {m.role.replace("_", " ")} · {m.ageGroup.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={() => handleRemove(m.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#d1d5db] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <AddMemberForm onAdd={handleAdd} />
      </motion.div>

      {state.members.length === 0 && (
        <motion.p variants={item} className="text-[13px] text-[#9ca3af] text-center">
          Add at least one family member to continue.
        </motion.p>
      )}

      {/* Nav */}
      <motion.div variants={item} className="flex gap-3 pt-2">
        <Button variant="secondary" icon={<ArrowLeft size={15} />} onClick={() => onboardingStore.back()}>
          Back
        </Button>
        <Button
          variant="primary"
          icon={<ArrowRight size={16} strokeWidth={2.5} />}
          onClick={() => onboardingStore.next()}
          className={canProceed ? "" : "opacity-40 pointer-events-none"}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}
