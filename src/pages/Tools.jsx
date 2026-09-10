import React, { lazy, Suspense, useState } from "react";
import { Search, Star, Calculator } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";
import { colorMap, toolStatusColor } from "../data/seed.js";
import { TOOL_CATEGORIES, filterTools, getToolDefinition } from "../features/tools/registry/index.js";
import { TOOL_ICONS } from "../features/tools/components/toolIcons.js";
import ToolLoadingFallback from "../features/tools/components/ToolLoadingFallback.jsx";

const PANEL_COMPONENTS = {
  battery: lazy(() => import("../features/tools/panels/BatteryPanel.jsx")),
  blackbox: lazy(() => import("../features/tools/panels/BlackboxPanel.jsx")),
  motor: lazy(() => import("../features/tools/panels/MotorPanel.jsx")),
  pid: lazy(() => import("../features/tools/panels/PidPanel.jsx")),
  thrust: lazy(() => import("../features/tools/panels/ThrustPanel.jsx")),
  vtx: lazy(() => import("../features/tools/panels/VtxPanel.jsx")),
};

export default function Tools({ favorites, toggleFavorite }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openTool, setOpenTool] = useState(null);
  const list = filterTools({ category, query });

  if (openTool) return <ToolDetail tool={openTool} onBack={() => setOpenTool(null)} favorites={favorites} toggleFavorite={toggleFavorite} />;

  return <ToolList tools={list} category={category} query={query} setCategory={setCategory} setQuery={setQuery} onOpen={setOpenTool} favorites={favorites} toggleFavorite={toggleFavorite} />;
}

function ToolList({ tools, category, query, setCategory, setQuery, onOpen, favorites, toggleFavorite }) {
  return <div className="pb-4">
    <ScreenHeader title="เครื่องมือ ทั้งหมด" />
    <div className="px-5">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
        <Search size={14} className="text-white/30" />
        <input aria-label="ค้นหาเครื่องมือ" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาเครื่องมือ..." className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
        {TOOL_CATEGORIES.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${category === item ? "bg-cyan-400 text-[#050b14] border-cyan-400 font-semibold" : "border-white/10 text-white/50"}`}>{item}</button>)}
      </div>
      <div className="space-y-2.5">
        {tools.map((tool) => <ToolListItem key={tool.id} tool={tool} onOpen={onOpen} favorites={favorites} toggleFavorite={toggleFavorite} />)}
        {tools.length === 0 && <div className="text-center text-white/30 text-sm py-16">ไม่พบเครื่องมือ</div>}
      </div>
    </div>
  </div>;
}

function ToolListItem({ tool, onOpen, favorites, toggleFavorite }) {
  const colors = colorMap[tool.color];
  const Icon = TOOL_ICONS[tool.icon];
  const favorite = favorites.includes(tool.id);
  return <GlassCard aria-label={`เปิดเครื่องมือ ${tool.label}`} onClick={() => onOpen(tool)} className="p-3.5 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl ${colors.soft} flex items-center justify-center shrink-0`}><Icon size={18} className={colors.text} /></div>
    <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-white">{tool.label}</div><div className="text-[11px] text-white/40 truncate">{tool.description}</div></div>
    <button type="button" aria-label={`${favorite ? "ยกเลิกดาว" : "เพิ่มดาวให้"} ${tool.label}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(tool.id); }} className="shrink-0 text-white/25"><Star size={15} fill={favorite ? "#fbbf24" : "none"} className={favorite ? "text-amber-400" : ""} /></button>
    <span className={`text-[9px] px-2 py-1 rounded-full border shrink-0 ${toolStatusColor[tool.status]}`}>{tool.status}</span>
  </GlassCard>;
}

function ToolDetail({ tool, onBack, favorites, toggleFavorite }) {
  const colors = colorMap[tool.color];
  const Icon = TOOL_ICONS[tool.icon];
  const favorite = favorites.includes(tool.id);
  return <div className="pb-4">
    <ScreenHeader title={tool.label} onBack={onBack} right={<button type="button" aria-label={`${favorite ? "ยกเลิกดาว" : "เพิ่มดาว"} ${tool.label}`} onClick={() => toggleFavorite(tool.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Star size={15} fill={favorite ? "#fbbf24" : "none"} className={favorite ? "text-amber-400" : "text-white/40"} /></button>} />
    <div className="px-5"><GlassCard className="p-4 mb-4"><div className="flex items-center gap-3 mb-2"><div className={`w-11 h-11 rounded-xl ${colors.soft} flex items-center justify-center`}><Icon size={20} className={colors.text} /></div><div><div className="text-sm font-semibold text-white">{tool.label}</div><span className={`text-[9px] px-2 py-0.5 rounded-full border ${toolStatusColor[tool.status] || ""}`}>{tool.status}</span></div></div><p className="text-[12px] text-white/50 leading-relaxed">{tool.description}</p></GlassCard><ToolPanel panel={getToolDefinition(tool.id)?.panel} /></div>
  </div>;
}

function ToolPanel({ panel }) {
  const PanelComponent = PANEL_COMPONENTS[panel];
  if (!PanelComponent) return <PlaceholderPanel />;
  return <Suspense fallback={<ToolLoadingFallback label="กำลังโหลดเครื่องมือ..." />}><PanelComponent /></Suspense>;
}

function PlaceholderPanel() {
  return <div className="text-center py-16 text-white/30 text-sm"><Calculator size={28} className="mx-auto mb-3 opacity-40" /><div className="font-semibold text-white/55">เครื่องมือนี้ยังอยู่ในสถานะพรีวิว</div><div className="mt-2 leading-relaxed">ยังไม่มี calculation engine เฉพาะสำหรับเครื่องมือนี้ จึงไม่แสดงผลจาก calculator อื่นแทน</div></div>;
}
