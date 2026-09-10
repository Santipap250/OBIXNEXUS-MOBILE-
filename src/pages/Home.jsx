import React from "react";
import { Zap, Battery, Bot, Bell, ChevronRight, Radar } from "lucide-react";
import { GlassCard, StatusPill, SectionLabel, ObixMark, DroneVisual } from "../components/ui.jsx";
import { colorMap } from "../data/seed.js";
import { TOOL_REGISTRY } from "../features/tools/registry/index.js";

export default function Home({ drones, profile, go, openDrone }) {
  return (
    <div className="pb-5">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <ObixMark className="w-8 h-8" />
          <div>
            <div className="text-[13px] font-bold tracking-[.04em] text-white leading-none">OBIX <span className="text-cyan-300">NEXUS</span></div>
            <div className="text-[8px] tracking-[.22em] text-white/35 mt-1">PERSONAL FPV OS</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="การแจ้งเตือน" className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 active:scale-[.97]">
            <Bell size={14} />
          </button>
          <button type="button" aria-label="โปรไฟล์" onClick={() => go("settings")} className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/25 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[12px] font-bold text-[#04101b] active:scale-[.97]">
            {(profile.name || "N")[0].toUpperCase()}
          </button>
        </div>
      </div>

      <div className="px-5 pt-1">
        <div className="text-lg font-bold text-white tracking-[-.02em]">สวัสดี, {profile.name}</div>
        <div className="text-[12px] text-white/40 mt-1">พร้อมจัดการระบบของคุณหรือยัง?</div>
      </div>

      <div className="px-5 mt-4">
        <GlassCard className="p-4 border-cyan-400/10" glow="shadow-[0_0_28px_rgba(34,211,238,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/12 border border-cyan-400/10 flex items-center justify-center">
                <Zap size={14} className="text-cyan-300" />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-white">NEXUS STATUS</div>
                <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> LOCAL-FIRST · NO LIVE LINK
                </div>
              </div>
            </div>
            <span className="text-[8px] tracking-[.08em] text-white/30 border border-white/10 rounded-full px-2 py-1">DEMO</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: 4, l: "ENGINES" },
              { n: TOOL_REGISTRY.length, l: "TOOLS" },
              { n: drones.length, l: "DRONES" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/5 bg-white/[.045] py-2.5 text-center">
                <div className="text-lg font-bold text-white leading-none">{s.n}</div>
                <div className="text-[8px] tracking-[.14em] text-white/32 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="px-5 mt-5">
        <SectionLabel action="ดูทั้งหมด" onAction={() => go("fleet")}>Fleet ของคุณ</SectionLabel>
        {drones.length === 0 ? (
          <GlassCard className="p-5 text-center">
            <Radar size={22} className="mx-auto mb-2 text-white/25" />
            <div className="text-sm text-white/50">ยังไม่มีโดรนในระบบ</div>
            <button onClick={() => go("fleet")} className="mt-3 text-xs px-4 py-2 rounded-full bg-cyan-400 text-[#050b14] font-semibold">เพิ่มโดรนแรกของคุณ</button>
          </GlassCard>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 snap-x">
            {drones.map((d) => {
              const c = colorMap[d.color];
              return (
                <GlassCard key={d.id} aria-label={`เปิดรายละเอียด ${d.name}`} onClick={() => openDrone(d)} className="min-w-[168px] p-3 snap-start bg-white/[.035]">
                  <div className="relative">
                    <DroneVisual drone={d} className="h-20 mb-2" />
                    <div className="absolute top-2 right-2"><StatusPill status={d.status} /></div>
                  </div>
                  <div className="text-[13px] font-semibold text-white mt-1">{d.name}</div>
                  <div className="text-[10px] text-white/40 mb-1.5">{d.type}</div>
                  <div className="flex items-center gap-1 text-[11px] text-white/60">
                    <Battery size={12} className={c.text} /> {d.battery}%
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-5 mt-5">
        <GlassCard aria-label="เปิด NEXUS AI" onClick={() => go("ai")} className="p-4 bg-gradient-to-br from-cyan-400/10 via-cyan-400/5 to-blue-500/5 border-cyan-400/15" glow="shadow-[0_0_24px_rgba(34,211,238,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(34,211,238,.16)]">
              <Bot size={20} className="text-[#050b14]" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                NEXUS AI
                <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-amber-400/30 text-amber-400 bg-amber-400/10">DEMO MODE</span>
              </div>
              <div className="text-[11px] text-white/45 leading-snug mt-1">วิเคราะห์โดรนและช่วยคิดแนวทางการตั้งค่า โดยไม่ต้องเข้าสู่ระบบ</div>
            </div>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); go("ai"); }} className="mt-3 w-full py-2.5 rounded-xl bg-cyan-400 text-[#050b14] text-xs font-semibold flex items-center justify-center gap-1 active:scale-[.985]">
            เริ่มใช้งาน <ChevronRight size={13} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
