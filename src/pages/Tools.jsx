import React, { useState } from "react";
import { Search, Check, Star } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";
import { seedTools, colorMap, toolStatusColor } from "../data/seed.js";

export default function Tools({ favorites, toggleFavorite }) {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [openTool, setOpenTool] = useState(null);
  const cats = ["All", "Config", "Analysis", "Tuning", "Data"];
  const list = seedTools.filter((t) => (cat === "All" || t.cat === cat) && t.name.toLowerCase().includes(query.toLowerCase()));

  if (openTool) return <ToolDetail tool={openTool} onBack={() => setOpenTool(null)} favorites={favorites} toggleFavorite={toggleFavorite} />;

  return (
    <div className="pb-4">
      <ScreenHeader title="เครื่องมือ ทั้งหมด" />
      <div className="px-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
          <Search size={14} className="text-white/30" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาเครื่องมือ..." className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${cat === c ? "bg-cyan-400 text-[#050b14] border-cyan-400 font-semibold" : "border-white/10 text-white/50"}`}>{c}</button>
          ))}
        </div>
        <div className="space-y-2.5">
          {list.map((t) => {
            const c = colorMap[t.color];
            const Icon = t.icon;
            const fav = favorites.includes(t.id);
            return (
              <GlassCard key={t.id} onClick={() => setOpenTool(t)} className="p-3.5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${c.soft} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={c.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-white/40 truncate">{t.desc}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }} className="shrink-0 text-white/25">
                  <Star size={15} fill={fav ? "#fbbf24" : "none"} className={fav ? "text-amber-400" : ""} />
                </button>
                <span className={`text-[9px] px-2 py-1 rounded-full border shrink-0 ${toolStatusColor[t.status]}`}>{t.status}</span>
              </GlassCard>
            );
          })}
          {list.length === 0 && <div className="text-center text-white/30 text-sm py-16">ไม่พบเครื่องมือ</div>}
        </div>
      </div>
    </div>
  );
}

function ToolDetail({ tool, onBack, favorites, toggleFavorite }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(null);
  const c = colorMap[tool.color];
  const Icon = tool.icon;
  const fav = favorites.includes(tool.id);
  return (
    <div className="pb-4">
      <ScreenHeader
        title={tool.name}
        onBack={onBack}
        right={
          <button onClick={() => toggleFavorite(tool.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Star size={15} fill={fav ? "#fbbf24" : "none"} className={fav ? "text-amber-400" : "text-white/40"} />
          </button>
        }
      />
      <div className="px-5">
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-11 h-11 rounded-xl ${c.soft} flex items-center justify-center`}>
              <Icon size={20} className={c.text} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{tool.name}</div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${toolStatusColor[tool.status] || ""}`}>{tool.status}</span>
            </div>
          </div>
          <p className="text-[12px] text-white/50 leading-relaxed">{tool.desc}</p>
        </GlassCard>

        {tool.id === "configdoctor" ? (
          <>
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <button className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70">วาง CLI</button>
              <button className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70">อัปโหลดไฟล์ CLI</button>
            </div>
            <button
              onClick={() => { setRunning(true); setScore(null); setTimeout(() => { setRunning(false); setScore(92); }, 1100); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] text-sm font-semibold mb-4"
            >
              {running ? "กำลังวิเคราะห์..." : "วิเคราะห์การตั้งค่า (Demo)"}
            </button>
            {score !== null && (
              <>
                <GlassCard className="p-4 mb-3 text-center">
                  <div className="text-[11px] text-white/40 mb-1">Configuration Health</div>
                  <div className="text-3xl font-bold text-emerald-400">{score}<span className="text-base text-white/30"> / 100</span></div>
                </GlassCard>
                <div className="grid grid-cols-2 gap-2">
                  {["PID", "Filters", "Rates", "RPM Filter", "DShot", "Motor", "Battery", "VTX", "Receiver", "Safety"].map((k) => (
                    <div key={k} className="flex items-center gap-1.5 text-[11px] text-white/60 bg-white/5 rounded-lg px-2.5 py-2">
                      <Check size={12} className="text-emerald-400 shrink-0" /> {k}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-white/30 text-sm">
            <Icon size={28} className="mx-auto mb-3 opacity-40" />
            {tool.status === "COMING SOON" ? "เครื่องมือนี้กำลังจะเปิดให้ใช้งานเร็วๆ นี้" : "โหมดทดลอง — ฟีเจอร์เต็มรูปแบบกำลังพัฒนา ไม่ต้องเข้าสู่ระบบ"}
          </div>
        )}
      </div>
    </div>
  );
}
