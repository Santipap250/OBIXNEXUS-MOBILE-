import React from "react";
import { Zap, Battery, Bot, ChevronRight, Radar } from "lucide-react";
import { GlassCard, StatusPill, SectionLabel, TopBar, DroneVisual } from "../components/ui.jsx";
import { seedTools, colorMap } from "../data/seed.js";

export default function Home({ drones, profile, go, openDrone }) {
  return (
    <div className="pb-4">
      <TopBar onMenu={() => go("settings")} />
      <div className="px-5 pt-2">
        <div className="text-lg font-bold text-white">สวัสดี, {profile.name}</div>
        <div className="text-sm text-white/40 mt-0.5">พร้อมจัดการโดรนของคุณหรือยัง?</div>
      </div>

      <div className="px-5 mt-4">
        <GlassCard className="p-4" glow="shadow-[0_0_25px_rgba(34,211,238,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/15 flex items-center justify-center">
                <Zap size={14} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">NEXUS STATUS</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> SYSTEM ONLINE
                </div>
              </div>
            </div>
            <span className="text-[9px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">DEMO</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { n: 4, l: "ENGINES" },
              { n: seedTools.length, l: "TOOLS" },
              { n: drones.length, l: "DRONES" },
            ].map((s) => (
              <div key={s.l} className="bg-white/5 rounded-xl py-3 text-center">
                <div className="text-lg font-bold text-white">{s.n}</div>
                <div className="text-[9px] tracking-wider text-white/35 mt-0.5">{s.l}</div>
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
                <GlassCard key={d.id} aria-label={`เปิดรายละเอียด ${d.name}`} onClick={() => openDrone(d)} className="min-w-[168px] p-3 snap-start">
                  <DroneVisual drone={d} className="h-20 mb-2" />
                    <div className="absolute top-[5.25rem] right-1.5">
                      <StatusPill status={d.status} />
                    </div>
                  <div className="text-[13px] font-semibold text-white">{d.name}</div>
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
        <GlassCard aria-label="เปิด NEXUS AI" onClick={() => go("ai")} className="p-4 bg-gradient-to-br from-cyan-400/10 to-blue-500/5" glow="shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
              <Bot size={20} className="text-[#050b14]" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                NEXUS AI
                <span className="text-[8px] px-1.5 py-0.5 rounded-full border border-amber-400/30 text-amber-400 bg-amber-400/10">DEMO MODE</span>
              </div>
              <div className="text-[11px] text-white/45 leading-snug mt-0.5">ผู้ช่วยอัจฉริยะสำหรับการวิเคราะห์โดรนของคุณ ไม่ต้องเข้าสู่ระบบ</div>
            </div>
          </div>
          <button type="button" onClick={() => go("ai")} className="mt-3 w-full py-2 rounded-lg bg-cyan-400 text-[#050b14] text-xs font-semibold flex items-center justify-center gap-1">
            เริ่มใช้งาน <ChevronRight size={13} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
