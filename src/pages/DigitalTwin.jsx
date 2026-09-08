import React, { useState } from "react";
import { Cpu } from "lucide-react";
import { GlassCard, ScreenHeader, Timeline, DroneVisual } from "../components/ui.jsx";
import { colorMap } from "../data/seed.js";

export default function DigitalTwin({ drone, onBack }) {
  const [tab, setTab] = useState("timeline");
  const c = colorMap[drone.color];
  const parts = [
    { n: "Flight Controller", s: "ปกติ" }, { n: "ESC", s: "ปกติ" }, { n: "มอเตอร์ x4", s: "ปกติ" },
    { n: "VTX", s: "ปกติ" }, { n: "กล้อง", s: "ปกติ" }, { n: "ใบพัด", s: "ควรตรวจสอบ" },
    { n: "แบตเตอรี่", s: "ปกติ" }, { n: "เซนเซอร์", s: "ปกติ" },
  ];
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

        {tab === "timeline" && <Timeline events={drone.history} />}

        {tab === "config" && (
          <div className="grid grid-cols-2 gap-2.5">
            {parts.map((p) => (
              <GlassCard key={p.n} className="p-3">
                <div className="text-[12px] font-medium text-white">{p.n}</div>
                <div className={`text-[10px] mt-1 ${p.s === "ปกติ" ? "text-emerald-400" : "text-amber-400"}`}>{p.s}</div>
              </GlassCard>
            ))}
          </div>
        )}

        {(tab === "blackbox" || tab === "analysis") && (
          <div className="text-center py-16 text-white/30 text-sm">
            <Cpu size={28} className="mx-auto mb-3 opacity-40" />
            {tab === "blackbox" ? "ยังไม่มีไฟล์ Blackbox สำหรับโดรนนี้" : "ต้องมีข้อมูลการบินเพิ่มเติมก่อนวิเคราะห์"}
          </div>
        )}
      </div>
    </div>
  );
}
