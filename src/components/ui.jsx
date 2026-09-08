import React from "react";
import { ChevronRight, ArrowLeft, Bell, Menu, Radar, Home, Wrench, Bot, Users } from "lucide-react";
import { statusColor, colorMap } from "../data/seed.js";

export function GlassCard({ children, className = "", onClick, glow, "aria-label": ariaLabel }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(event);
        }
      } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${glow || ""} ${onClick ? "active:scale-[0.98] transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full border ${statusColor[status] || statusColor.OFFLINE} flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "ONLINE" ? "bg-emerald-400 animate-pulse" : status === "MAINTENANCE" ? "bg-orange-400" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

export function SectionLabel({ children, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] font-semibold text-white/90">{children}</h2>
      {action && (
        <button onClick={onAction} className="text-xs text-cyan-400 flex items-center gap-0.5">
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

export function ObixMark({ className = "w-7 h-7" }) {
  return (
    <div className={`${className} relative rounded-lg bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.28)]`} aria-hidden="true">
      <span className="absolute w-3.5 h-3.5 border-[2px] border-[#04101b] rotate-45 rounded-[3px]" />
      <span className="absolute w-1 h-3.5 bg-[#04101b] rounded-full rotate-45" />
    </div>
  );
}

export function DroneVisual({ drone, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#06131f] ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,.22),transparent_55%)]" />
      <img src={drone.image || "/images/apex-5.svg"} alt={`${drone.name} FPV drone`} className="relative h-full w-full object-cover object-center" loading="lazy" decoding="async" />
    </div>
  );
}

export function TopBar({ title = "OBIX NEXUS", onMenu, onBell, sub }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <div className="flex items-center gap-2">
        <ObixMark />
        <div>
          <div className="text-[13px] font-bold tracking-wide text-white leading-none">{title}</div>
          {sub && <div className="text-[9px] tracking-[0.2em] text-white/30 mt-0.5">{sub}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onBell && (
          <button type="button" aria-label="การแจ้งเตือน" onClick={onBell} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <Bell size={15} />
          </button>
        )}
        {onMenu && <button type="button" aria-label="เปิดการตั้งค่า" onClick={onMenu} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
          <Menu size={15} />
        </button>}
      </div>
    </div>
  );
}

export function ScreenHeader({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
            <ArrowLeft size={15} />
          </button>
        )}
        <h1 className="text-base font-bold text-white">{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function MiniChart({ color }) {
  const pts = [30, 45, 38, 60, 52, 70, 65, 80, 72, 90];
  const c = colorMap[color];
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * 100},${100 - p}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
      <polyline points={path} fill="none" className={c.text} stroke="currentColor" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Timeline({ events }) {
  const dot = { cyan: "bg-cyan-400", amber: "bg-amber-400", violet: "bg-violet-400", green: "bg-emerald-400" };
  if (!events || events.length === 0) return <div className="text-center py-14 text-white/30 text-sm">ยังไม่มีประวัติ</div>;
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />
      <div className="space-y-4">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ${dot[e.dot] || "bg-cyan-400"}`} />
            <div className="text-[10px] text-white/30">{e.t}</div>
            <div className="text-sm font-semibold text-white">{e.label}</div>
            <div className="text-[12px] text-white/45">{e.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BottomNav({ screen, go }) {
  const items = [
    { k: "home", icon: Home, l: "หน้าแรก" },
    { k: "tools", icon: Wrench, l: "เครื่องมือ" },
    { k: "fleet", icon: Radar, l: "Fleet" },
    { k: "ai", icon: Bot, l: "AI" },
    { k: "community", icon: Users, l: "ชุมชน" },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#0a1220]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 pt-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 8px) + 8px)" }}>
      {items.map((it) => {
        const active = screen === it.k;
        return (
            <button type="button" aria-label={`ไปยัง${it.l}`} key={it.k} onClick={() => go(it.k)} className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 rounded-lg">
            {active && <span className="absolute -top-2 w-8 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
            <it.icon size={19} className={active ? "text-cyan-400" : "text-white/35"} />
            <span className={`text-[9px] ${active ? "text-cyan-400 font-medium" : "text-white/35"}`}>{it.l}</span>
          </button>
        );
      })}
    </div>
  );
}
