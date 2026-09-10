import React, { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { GlassCard, StatusPill, ScreenHeader, DroneVisual } from "../components/ui.jsx";
import { createDroneInFleet, deleteDrone } from "../features/fleet/services/fleetService.js";

export default function Fleet({ drones, setDrones, openDrone }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const filtered = drones.filter((d) => {
    if (filter === "active" && d.status !== "ONLINE") return false;
    if (filter === "inactive" && d.status === "ONLINE") return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function addDrone() {
    if (!newName.trim()) return;
    const colors = ["cyan", "violet", "amber", "green"];
    setDrones(createDroneInFleet(drones, {
      name: newName.trim(),
      color: colors[drones.length % colors.length],
      lastFlight: "ยังไม่เคยบิน",
    }));
    setNewName("");
    setShowAdd(false);
  }

  return (
    <div className="pb-4">
      <ScreenHeader title="Fleet" right={<button onClick={() => setShowAdd(true)} className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400"><Plus size={16} /></button>} />
      <div className="px-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
          <Search size={14} className="text-white/30" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาโดรน..." className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>
        <div className="flex gap-2 mb-4">
          {[["all", "ทั้งหมด"], ["active", "Active"], ["inactive", "Inactive"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`text-xs px-3 py-1.5 rounded-full border ${filter === k ? "bg-cyan-400 text-[#050b14] border-cyan-400 font-semibold" : "border-white/10 text-white/50"}`}>{l}</button>
          ))}
        </div>

        {showAdd && (
          <GlassCard className="p-3 mb-4">
            <div className="text-xs text-white/60 mb-2">เพิ่มโดรนใหม่ (บันทึกบนอุปกรณ์นี้)</div>
            <div className="flex gap-2">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ชื่อโดรน" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-white/25" />
              <button onClick={addDrone} className="px-3 rounded-lg bg-cyan-400 text-[#050b14] text-xs font-semibold">เพิ่ม</button>
              <button onClick={() => setShowAdd(false)} className="px-3 rounded-lg border border-white/10 text-white/50 text-xs">ยกเลิก</button>
            </div>
          </GlassCard>
        )}

        {filtered.length === 0 && (
          <div className="text-center text-white/30 text-sm py-16">ไม่พบโดรนที่ค้นหา</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((d) => {
            return (
              <GlassCard key={d.id} aria-label={`เปิดรายละเอียด ${d.name}`} onClick={() => openDrone(d)} className="p-3">
                <DroneVisual drone={d} className="h-28 mb-2" />
                <div className="text-[12px] font-semibold text-white truncate">{d.name}</div>
                <div className="text-[10px] text-white/40 mb-1.5 truncate">{d.type}</div>
                <div className="flex items-center justify-between">
                  <StatusPill status={d.status} />
                  <button
                    type="button"
                    aria-label={`ลบ ${d.name}`}
                    onClick={(e) => { e.stopPropagation(); setDrones(deleteDrone(drones, d.id)); }}
                    className="text-white/20 active:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
