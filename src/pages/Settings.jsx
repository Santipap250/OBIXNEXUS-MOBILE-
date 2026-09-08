import React, { useState } from "react";
import { Bell, SlidersHorizontal, Palette, Globe, Radar, Database, ChevronRight } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";

export default function Settings({ profile, lang, setLang, onEditProfile, onResetData }) {
  const [confirming, setConfirming] = useState(false);

  const items = [
    { icon: Bell, l: "การแจ้งเตือน" },
    { icon: SlidersHorizontal, l: "การตั้งค่าทั่วไป" },
    { icon: Palette, l: "ธีม (Dark เท่านั้นในขณะนี้)" },
  ];

  return (
    <div className="pb-4">
      <ScreenHeader title="การตั้งค่า" />
      <div className="px-5">
        <div className="text-[11px] text-white/35 mb-3 flex items-center gap-1">Local Pilot — ไม่ใช่บัญชีออนไลน์</div>
        <GlassCard onClick={onEditProfile} className="p-4 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-[#050b14]">
            {(profile.name || "N")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{profile.name}</div>
            <div className="text-[11px] text-white/40 truncate">{profile.role} · Local Profile</div>
          </div>
          <ChevronRight size={15} className="text-white/25" />
        </GlassCard>

        <div className="space-y-2 mb-4">
          {items.map((it) => (
            <GlassCard key={it.l} className="p-3.5 flex items-center gap-3">
              <it.icon size={16} className="text-white/50" />
              <span className="text-sm text-white/80 flex-1">{it.l}</span>
              <ChevronRight size={15} className="text-white/25" />
            </GlassCard>
          ))}
          <GlassCard className="p-3.5 flex items-center gap-3">
            <Globe size={16} className="text-white/50" />
            <span className="text-sm text-white/80 flex-1">ภาษา</span>
            <div className="flex bg-white/5 rounded-full p-0.5">
              <button onClick={() => setLang("th")} className={`text-[11px] px-2.5 py-1 rounded-full ${lang === "th" ? "bg-cyan-400 text-[#050b14] font-semibold" : "text-white/40"}`}>ไทย</button>
              <button onClick={() => setLang("en")} className={`text-[11px] px-2.5 py-1 rounded-full ${lang === "en" ? "bg-cyan-400 text-[#050b14] font-semibold" : "text-white/40"}`}>EN</button>
            </div>
          </GlassCard>
          <GlassCard className="p-3.5 flex items-center gap-3">
            <Radar size={16} className="text-white/50" />
            <span className="text-sm text-white/80 flex-1">เกี่ยวกับ OBIX NEXUS</span>
            <span className="text-[11px] text-white/30">v1.0.0 · Phase 2</span>
          </GlassCard>
        </div>

        <div className="text-[15px] font-semibold text-white/90 mb-2">ข้อมูล</div>
        <GlassCard className="p-4 mb-3">
          <div className="flex items-start gap-2.5">
            <Database size={16} className="text-white/40 mt-0.5 shrink-0" />
            <p className="text-[11px] text-white/40 leading-relaxed">
              โปรไฟล์และข้อมูลโดรนของคุณถูกเก็บไว้บนอุปกรณ์นี้เท่านั้น (localStorage) ไม่มีบัญชีออนไลน์หรือระบบคลาวด์ในเวอร์ชันนี้
            </p>
          </div>
        </GlassCard>

        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="w-full py-3 rounded-xl border border-red-400/20 bg-red-400/5 text-red-400 text-sm font-medium">
            รีเซ็ตข้อมูลในเครื่อง
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-[12px] text-white/50 text-center">ลบโปรไฟล์ โดรน และค่ากำหนดทั้งหมดบนอุปกรณ์นี้?</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setConfirming(false)} className="py-2.5 rounded-xl border border-white/10 text-white/60 text-sm">ยกเลิก</button>
              <button onClick={() => { onResetData(); setConfirming(false); }} className="py-2.5 rounded-xl bg-red-400/15 border border-red-400/30 text-red-400 text-sm font-semibold">ยืนยันรีเซ็ต</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
