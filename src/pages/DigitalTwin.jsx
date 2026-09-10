import React, { useMemo, useState } from "react";
import { Cpu, Radar } from "lucide-react";
import { GlassCard, ScreenHeader, Timeline, DroneVisual } from "../components/ui.jsx";
import { toLegacyTimelineEvents, HISTORY_EVENT_TYPE } from "../features/fleet/model/historyEvent.js";

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

export default function DigitalTwin({ drone, onBack }) {
  const [tab, setTab] = useState("timeline");

  // Analysis tab: aggregate info already on the drone model — no new
  // analytics invented here (Task 5).
  const analysis = useMemo(() => {
    const configuredCount = Object.values(drone.config || {}).filter((f) => f?.state === "CONFIGURED").length;
    const totalFields = Object.keys(drone.config || {}).length || 1;
    const blackboxEventCount = (drone.history || []).filter((e) => e.type === HISTORY_EVENT_TYPE.BLACKBOX).length;
    return {
      configuredCount,
      totalFields,
      historyCount: (drone.history || []).length,
      blackboxEventCount,
      hasBlackbox: Boolean(drone.blackbox?.lastAnalysis),
    };
  }, [drone]);

  return (
    <div className="pb-4">
      <ScreenHeader title="Digital Twin" onBack={onBack} />
      <div className="px-5">
        <DroneVisual drone={drone} className="h-48 mb-1" />
        <div className="text-center mb-4">
          <div className="text-sm font-bold text-white">{drone.name}</div>
          <div className="text-[11px] text-white/40">{drone.type} · {drone.cell}</div>
        </div>

        <div className="flex gap-2 mb-4">
          {[["timeline", "Timeline"], ["config", "Config"], ["blackbox", "Blackbox"], ["analysis", "วิเคราะห์"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 text-xs py-1.5 rounded-full border ${tab === k ? "bg-white text-[#050b14] border-white font-semibold" : "border-white/10 text-white/50"}`}>{l}</button>
          ))}
        </div>

        {tab === "timeline" && <Timeline events={toLegacyTimelineEvents(drone.history)} />}

        {tab === "config" && (
          <div className="grid grid-cols-2 gap-2.5">
            {CONFIG_FIELDS.map(([key, label]) => {
              const field = drone.config?.[key];
              const state = field?.state || "NOT_CONFIGURED";
              return (
                <GlassCard key={key} className="p-3">
                  <div className="text-[12px] font-medium text-white">{label}</div>
                  <div className={`text-[10px] mt-1 ${state === "CONFIGURED" ? "text-emerald-400" : state === "DEMO" ? "text-amber-400" : "text-white/35"}`}>
                    {field?.value != null ? String(field.value) : CONFIG_STATE_LABEL[state]}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {tab === "blackbox" && (
          drone.blackbox?.lastAnalysis ? (
            <GlassCard className="p-3.5">
              <div className="text-xs font-semibold text-white/80">{drone.blackbox.lastLogFileName || "Blackbox log"}</div>
              <div className="text-[11px] text-white/45 mt-1">
                {drone.blackbox.lastAnalysis.ok
                  ? (drone.blackbox.lastAnalysis.health === "NEEDS_REVIEW" ? "🟡 ควรตรวจสอบเพิ่มเติม" : "🟢 ไม่พบ indicator รุนแรง")
                  : "การวิเคราะห์ล้มเหลว"}
              </div>
              <div className="text-[10px] text-white/30 mt-2">
                {drone.blackbox.lastAnalyzedAt ? new Date(drone.blackbox.lastAnalyzedAt).toLocaleString() : ""}
              </div>
            </GlassCard>
          ) : (
            <div className="text-center py-16 text-white/30 text-sm">
              <Cpu size={28} className="mx-auto mb-3 opacity-40" />
              ยังไม่มีไฟล์ Blackbox สำหรับโดรนนี้
            </div>
          )
        )}

        {tab === "analysis" && (
          analysis.historyCount === 0 && !analysis.hasBlackbox ? (
            <div className="text-center py-16 text-white/30 text-sm">
              <Radar size={28} className="mx-auto mb-3 opacity-40" />
              ต้องมีข้อมูลการบินเพิ่มเติมก่อนวิเคราะห์
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <GlassCard className="p-3">
                <div className="text-lg font-bold text-white">{analysis.configuredCount}/{analysis.totalFields}</div>
                <div className="text-[10px] text-white/40 mt-1">Config fields set</div>
              </GlassCard>
              <GlassCard className="p-3">
                <div className="text-lg font-bold text-white">{analysis.historyCount}</div>
                <div className="text-[10px] text-white/40 mt-1">History events</div>
              </GlassCard>
              <GlassCard className="p-3">
                <div className="text-lg font-bold text-white">{analysis.blackboxEventCount}</div>
                <div className="text-[10px] text-white/40 mt-1">Blackbox analyses logged</div>
              </GlassCard>
              <GlassCard className="p-3">
                <div className={`text-lg font-bold ${analysis.hasBlackbox ? "text-emerald-400" : "text-white/40"}`}>{analysis.hasBlackbox ? "Yes" : "None yet"}</div>
                <div className="text-[10px] text-white/40 mt-1">Latest Blackbox on file</div>
              </GlassCard>
            </div>
          )
        )}
      </div>
    </div>
  );
}
