import React, { useState } from "react";
import { User as UserIcon, ShieldCheck } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";

export default function Profile({ profile, setProfile, onBack }) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [saved, setSaved] = useState(false);

  function save() {
    setProfile({ name: name.trim() || "นักบิน", role: role.trim() || "FPV Pilot" });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="pb-4">
      <ScreenHeader title="Local Pilot Profile" onBack={onBack} />
      <div className="px-5">
        <GlassCard className="p-4 flex items-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg font-bold text-[#050b14]">
            {(profile.name || "N")[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{profile.name}</div>
            <div className="text-[11px] text-white/40">{profile.role}</div>
            <span className="text-[9px] px-2 py-0.5 rounded-full border border-cyan-400/30 text-cyan-400 bg-cyan-400/10 mt-1 inline-block">Local Profile</span>
          </div>
        </GlassCard>

        <label className="text-xs text-white/50 mb-1 block">ชื่อนักบิน</label>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3 mb-4 focus-within:border-cyan-400/50">
          <UserIcon size={16} className="text-white/30" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อของคุณ" className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>

        <label className="text-xs text-white/50 mb-1 block">บทบาท / สไตล์การบิน</label>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3 mb-5 focus-within:border-cyan-400/50">
          <ShieldCheck size={16} className="text-white/30" />
          <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="เช่น FPV Pilot, Freestyle" className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>

        <button onClick={save} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] font-semibold text-sm active:scale-[0.98] transition-transform">
          {saved ? "บันทึกแล้ว" : "บันทึกโปรไฟล์"}
        </button>

        <p className="text-[11px] text-white/30 leading-relaxed mt-5">
          โปรไฟล์นักบินนี้เก็บไว้บนอุปกรณ์นี้เท่านั้น ไม่ใช่บัญชีออนไลน์และไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ใดๆ
        </p>
      </div>
    </div>
  );
}
