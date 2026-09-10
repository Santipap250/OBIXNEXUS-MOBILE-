import React, { useState } from "react";
import { Battery, Zap, Gauge, Thermometer, Activity, Clock, Radar, Layers, ChevronRight, CheckCircle2 } from "lucide-react";
import { GlassCard, StatusPill, ScreenHeader, MiniChart, Timeline, DroneVisual } from "../components/ui.jsx";
import { colorMap } from "../data/seed.js";
import { toLegacyTimelineEvents } from "../features/fleet/model/historyEvent.js";
import { DATA_SOURCE } from "../features/fleet/model/drone.js";

const CONFIG_FIELDS = [
  ["pid", "PID"],
  ["filters", "Filters"],
  ["rates", "Rates"],
  ["rpmFilter", "RPM Filter"],
  ["motorOutput", "Motor Output"],
  ["firmware", "Firmware"],
];

const CONFIG_STATE_LABEL = {
  NOT_CONFIGURED: "Not configured",
  DEMO: "Demo data",
  CONFIGURED: "Configured",
};

export default function DroneDetail({ drone, onBack, goTwin }) {
  const [tab, setTab] = useState("overview");
  const c = colorMap[drone.color];
  const isDemo = drone.dataSource === DATA_SOURCE.SEEDED_DEMO;
  return (
    <div className="pb-4">
      <ScreenHeader title={drone.name} onBack={onBack} />
      <div className="px-5">
        <div className="relative mb-3">
          <DroneVisual drone={drone} className="h-44" />
          <div className="absolute top-3 right-3"><StatusPill status={drone.status} /></div>
          <div className="absolute bottom-3 left-3 text-[#050b14]">
            <div className="text-sm font-bold">{drone.type}</div>
            <div className="text-[10px] opacity-70">{drone.cell}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
          {[["overview", "ภาพรวม"], ["config", "การตั้งค่า"], ["blackbox", "Blackbox"], ["history", "ประวัติ"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${tab === k ? "bg-white text-[#050b14] border-white font-semibold" : "border-white/10 text-white/50"}`}>{l}</button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[
                { icon: Battery, l: "แบตเตอรี่", v: `${drone.battery}%` },
                { icon: Zap, l: "Voltage", v: `${drone.voltage} V` },
                { icon: Gauge, l: "Current", v: `${drone.current} A` },
                { icon: Thermometer, l: "อุณหภูมิ", v: `${drone.temp}°C` },
                { icon: Activity, l: "RPM", v: drone.rpm.toLocaleString() },
                { icon: Clock, l: "เวลาบินรวม", v: drone.flightTime },
              ].map((s) => (
                <GlassCard key={s.l} className="p-3">
                  <s.icon size={14} className={c.text} />
                  <div className="text-base font-bold text-white mt-1.5">{s.v}</div>
                  <div className="text-[10px] text-white/40">{s.l}</div>
                </GlassCard>
              ))}
            </div>

            <div className="text-[15px] font-semibold text-white/90 mb-3">กราฟการบิน (ล่าสุด)</div>
            <GlassCard className="p-4 mb-4">
              <MiniChart color={drone.color} />
              {/* Never imply live hardware connectivity — this chart is always
                  drawn from local/sample data, not a real telemetry stream. */}
              <div className="text-[10px] text-white/30 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                {isDemo ? "SAMPLE DATA" : "OFFLINE — local data"}
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-2.5">
              {["Analyze", "Tune", "Config", "Blackbox"].map((a) => (
                <button type="button" key={a} onClick={() => setTab(a === "Blackbox" ? "blackbox" : a === "Config" || a === "Tune" ? "config" : "overview")} className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 active:scale-[0.97] transition-transform">{a}</button>
              ))}
            </div>
            <button onClick={() => goTwin(drone)} className={`w-full mt-2.5 py-3 rounded-xl bg-gradient-to-r ${c.grad} text-[#050b14] text-sm font-semibold flex items-center justify-center gap-1.5`}>
              <Layers size={15} /> เปิด Digital Twin
            </button>
          </>
        )}

        {tab === "config" && (
          <div className="space-y-2.5">
            {CONFIG_FIELDS.map(([key, label]) => {
              const field = drone.config?.[key];
              const state = field?.state || "NOT_CONFIGURED";
              return (
                <GlassCard key={key} className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/80">{label}</div>
                    <div className={`text-[10px] mt-0.5 ${state === "CONFIGURED" ? "text-emerald-400" : state === "DEMO" ? "text-amber-400" : "text-white/30"}`}>
                      {field?.value != null ? String(field.value) : CONFIG_STATE_LABEL[state]}
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-white/25" />
                </GlassCard>
              );
            })}
          </div>
        )}

        {tab === "blackbox" && (
          drone.blackbox?.lastAnalysis ? (
            <GlassCard className="p-3.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 size={14} /> {drone.blackbox.lastAnalysis.ok ? "วิเคราะห์สำเร็จล่าสุด" : "การวิเคราะห์ล่าสุดล้มเหลว"}
              </div>
              {drone.blackbox.lastLogFileName && (
                <div className="text-[12px] text-white/70 mt-2 truncate">{drone.blackbox.lastLogFileName}</div>
              )}
              {drone.blackbox.lastAnalysis.ok && (
                <div className="text-[11px] text-white/45 mt-1">
                  {drone.blackbox.lastAnalysis.health === "NEEDS_REVIEW" ? "🟡 ควรตรวจสอบเพิ่มเติม" : "🟢 ไม่พบ indicator รุนแรง"}
                  {drone.blackbox.lastAnalysis.sampleCount != null && ` · ${drone.blackbox.lastAnalysis.sampleCount.toLocaleString()} samples`}
                </div>
              )}
              <div className="text-[10px] text-white/30 mt-2">
                {drone.blackbox.lastAnalyzedAt ? new Date(drone.blackbox.lastAnalyzedAt).toLocaleString() : ""}
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-16 text-white/30 text-sm">
              <Radar size={30} className="mx-auto mb-3 opacity-40" />
              ยังไม่มีข้อมูล Blackbox ล่าสุด<br />วิเคราะห์ไฟล์ล็อกในเครื่องมือ Blackbox แล้วเชื่อมกับโดรนนี้
            </div>
          )
        )}

        {tab === "history" && <Timeline events={toLegacyTimelineEvents(drone.history)} />}
      </div>
    </div>
  );
}
