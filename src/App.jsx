import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Home, Wrench, Radar, Bot, Users, Settings, Bell, Menu, Search,
  Plus, ChevronRight, Battery, Zap, Thermometer, Gauge, Clock,
  Wifi, Shield, Sparkles, X, Check, ArrowLeft, Heart, MessageCircle,
  Eye, Share2, Mail, Lock, ChevronDown, Trash2, Edit3, Cpu, Activity,
  Layers, Globe, LogOut, User as UserIcon, ChevronLeft
} from "lucide-react";

/* ---------- seed data ---------- */

const seedDrones = [
  {
    id: "apex5",
    name: "Apex 5",
    type: "FPV Freestyle",
    cell: "4S",
    status: "ONLINE",
    battery: 78,
    voltage: 15.2,
    current: 12.4,
    temp: 42,
    rpm: 12340,
    flightTime: "18h 42m",
    firmware: "Betaflight 4.5.1",
    lastFlight: "2 ชม.ที่แล้ว",
    color: "cyan",
    history: [
      { t: "2025-06-14 14:32", label: "Build", detail: "Build #12 - เปลี่ยน ESC", dot: "cyan" },
      { t: "2025-06-13 09:15", label: "Config", detail: "ปรับ PID และ Filter", dot: "amber" },
      { t: "2025-06-12 20:45", label: "Blackbox", detail: "Flight Log #003", dot: "violet" },
      { t: "2025-06-11 16:23", label: "Tuning", detail: "ปรับค่า DShot และ Filter", dot: "amber" },
      { t: "2025-06-10 10:12", label: "Result", detail: "ประสิทธิภาพดีขึ้น 18%", dot: "green" },
    ],
  },
  {
    id: "ghostcine",
    name: "Ghost Cine",
    type: "Cinewhoop",
    cell: "4S",
    status: "ONLINE",
    battery: 64,
    voltage: 14.8,
    current: 8.1,
    temp: 37,
    rpm: 9820,
    flightTime: "6h 05m",
    firmware: "Betaflight 4.5.0",
    lastFlight: "เมื่อวาน",
    color: "violet",
    history: [
      { t: "2025-06-09 18:00", label: "Build", detail: "ประกอบใหม่ทั้งหมด", dot: "cyan" },
      { t: "2025-06-08 11:20", label: "Config", detail: "ตั้งค่ากล้องและ VTX", dot: "amber" },
    ],
  },
  {
    id: "toothpick",
    name: "Toothpick Micro",
    type: "Micro",
    cell: "3S",
    status: "MAINTENANCE",
    battery: 52,
    voltage: 11.1,
    current: 5.4,
    temp: 33,
    rpm: 15200,
    flightTime: "3h 12m",
    firmware: "Betaflight 4.4.3",
    lastFlight: "3 วันที่แล้ว",
    color: "amber",
    history: [
      { t: "2025-06-05 09:00", label: "Maintenance", detail: "เปลี่ยนใบพัดใหม่", dot: "amber" },
    ],
  },
];

const seedTools = [
  { id: "configdoctor", name: "ConfigDoctor", desc: "วิเคราะห์และตรวจสอบการตั้งค่าของโดรน", cat: "Config", status: "CONNECTED", icon: Shield, color: "cyan" },
  { id: "obixcore", name: "OBIXCORE", desc: "ปรับแต่งและจูนพารามิเตอร์แบบละเอียด", cat: "Tuning", status: "CONNECTED", icon: Cpu, color: "violet" },
  { id: "configfpv", name: "ConfigFPV", desc: "คลังข้อมูลการตั้งค่าจากชุมชนและโปรไฟล์ด้านล่าง", cat: "Config", status: "PREVIEW", icon: Activity, color: "cyan" },
  { id: "configlab", name: "ConfigLab", desc: "เครื่องมือทดลองและพัฒนาการตั้งค่าแบบล่าสุด", cat: "Data", status: "COMING SOON", icon: Layers, color: "amber" },
  { id: "pidadvisor", name: "PID Advisor", desc: "แนะนำค่า PID ที่เหมาะกับสไตล์การบิน", cat: "Tuning", status: "READY", icon: Gauge, color: "violet" },
  { id: "blackbox", name: "Blackbox Analyzer", desc: "วิเคราะห์ไฟล์ Blackbox หลังการบิน", cat: "Analysis", status: "READY", icon: Radar, color: "cyan" },
  { id: "battery", name: "Battery Analyzer", desc: "ติดตามสุขภาพแบตเตอรี่ตามรอบการบิน", cat: "Data", status: "BETA", icon: Battery, color: "green" },
  { id: "vtx", name: "VTX Tools", desc: "จัดการช่องสัญญาณและกำลังส่ง", cat: "Config", status: "COMING SOON", icon: Wifi, color: "amber" },
];

const seedPosts = [
  { id: 1, user: "SanTiFPV", tag: "Top Creator", title: "Preset สำหรับ Apex 5 (4S) - Freestyle", desc: "ลองใช้กันดูครับ ปรับ filter ใหม่หมด บินนิ่งขึ้นเยอะ", likes: 128, comments: 24, views: 1200 },
  { id: 2, user: "NatFPV", tag: null, title: "Blackbox log หลัง tune Ghost Cine", desc: "แชร์ log ให้ดูการตอบสนองหลังปรับ D-term", likes: 54, comments: 9, views: 410 },
  { id: 3, user: "PawFreestyle", tag: "Verified", title: "Build guide: Toothpick 3S ตัวเบา", desc: "สเปกที่ใช้และเหตุผลการเลือกอุปกรณ์แต่ละชิ้น", likes: 201, comments: 41, views: 3400 },
];

const colorMap = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/40", glow: "shadow-[0_0_20px_rgba(34,211,238,0.35)]", grad: "from-cyan-400 to-blue-500", soft: "bg-cyan-400/10" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-400/40", glow: "shadow-[0_0_20px_rgba(167,139,250,0.35)]", grad: "from-violet-400 to-purple-500", soft: "bg-violet-400/10" },
  amber: { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/40", glow: "shadow-[0_0_20px_rgba(251,191,36,0.35)]", grad: "from-amber-400 to-orange-500", soft: "bg-amber-400/10" },
  green: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/40", glow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]", grad: "from-emerald-400 to-teal-500", soft: "bg-emerald-400/10" },
};

const statusColor = {
  ONLINE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  OFFLINE: "text-slate-400 bg-slate-400/10 border-slate-400/30",
  WARNING: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  MAINTENANCE: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

const toolStatusColor = {
  CONNECTED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  READY: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  PREVIEW: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  BETA: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  "COMING SOON": "text-slate-400 bg-slate-400/10 border-slate-400/30",
};

/* ---------- small UI atoms ---------- */

function GlassCard({ children, className = "", onClick, glow }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${glow || ""} ${onClick ? "active:scale-[0.98] transition-transform cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded-full border ${statusColor[status] || statusColor.OFFLINE} flex items-center gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "ONLINE" ? "bg-emerald-400 animate-pulse" : status === "MAINTENANCE" ? "bg-orange-400" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function SectionLabel({ children, action, onAction }) {
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

/* ---------- Splash ---------- */

function Splash({ onDone }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#050b14] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{
        background: "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.18), transparent 60%)"
      }} />
      <div className={`relative transition-all duration-700 ${stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center ${stage >= 1 ? "shadow-[0_0_50px_rgba(34,211,238,0.55)]" : ""}`}>
          <Radar size={38} className="text-[#050b14]" strokeWidth={2.5} />
        </div>
      </div>
      <div className={`mt-6 text-center transition-all duration-700 delay-150 ${stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div className="text-2xl font-bold tracking-[0.15em] text-white">OBIX NEXUS</div>
        <div className="text-[11px] tracking-[0.3em] text-cyan-400/80 mt-1">PERSONAL FPV OS</div>
      </div>
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="w-32 h-[3px] bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-[1800ms] ease-out ${stage >= 1 ? "w-full" : "w-0"}`} />
        </div>
        <div className="text-[10px] text-white/30 tracking-widest">กำลังโหลด...</div>
      </div>
    </div>
  );
}

/* ---------- Login ---------- */

function Login({ onEnter }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="h-full w-full flex flex-col justify-center px-6 bg-[#050b14] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 0%, rgba(34,211,238,0.2), transparent 55%)" }} />
      <div className="relative">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Radar size={18} className="text-[#050b14]" />
          </div>
          <span className="text-sm font-bold tracking-widest text-white">OBIX NEXUS</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">เข้าสู่ระบบ</h1>
        <p className="text-sm text-white/40 mb-6">เชื่อมต่อบัญชีของคุณเพื่อเข้าสู่ระบบทั้งหมด</p>

        <label className="text-xs text-white/50 mb-1 block">อีเมลของคุณ</label>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3 mb-4 focus-within:border-cyan-400/50">
          <Mail size={16} className="text-white/30" />
          <input value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="your@email.com" className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>

        <label className="text-xs text-white/50 mb-1 block">รหัสผ่าน</label>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-3 mb-1 focus-within:border-cyan-400/50">
          <Lock size={16} className="text-white/30" />
          <input value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} type="password" placeholder="••••••••" className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>
        {err && <div className="text-xs text-red-400 mt-2">{err}</div>}
        <div className="flex justify-end mt-2 mb-5">
          <button className="text-xs text-cyan-400/80">ลืมรหัสผ่าน?</button>
        </div>

        <button
          onClick={() => {
            if (!email.trim() || !pw.trim()) { setErr("กรอกอีเมลและรหัสผ่านก่อนเข้าสู่ระบบ"); return; }
            onEnter(email.split("@")[0] || "นักบิน");
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] font-semibold text-sm shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] transition-transform"
        >
          เข้าสู่ระบบ
        </button>
        <button onClick={() => onEnter("นักบิน")} className="w-full py-3.5 rounded-xl border border-white/10 text-white/70 text-sm mt-3 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          เข้าสู่ระบบด้วย Google
        </button>
        <div className="text-center text-xs text-white/30 mt-6">
          ยังไม่มีบัญชี? <span className="text-cyan-400">สมัครสมาชิก</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Header ---------- */

function TopBar({ title = "OBIX NEXUS", onMenu, onBell, sub }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <Radar size={14} className="text-[#050b14]" />
        </div>
        <div>
          <div className="text-[13px] font-bold tracking-wide text-white leading-none">{title}</div>
          {sub && <div className="text-[9px] tracking-[0.2em] text-white/30 mt-0.5">{sub}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onBell && (
          <button onClick={onBell} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <Bell size={15} />
          </button>
        )}
        <button onClick={onMenu} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
          <Menu size={15} />
        </button>
      </div>
    </div>
  );
}

function ScreenHeader({ title, onBack, right }) {
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

/* ---------- Home ---------- */

function Home_({ drones, userName, go, openDrone }) {
  return (
    <div className="pb-4">
      <TopBar onBell={() => {}} onMenu={() => go("settings")} />
      <div className="px-5 pt-2">
        <div className="text-lg font-bold text-white">สวัสดี, {userName}</div>
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
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 snap-x">
          {drones.map((d) => {
            const c = colorMap[d.color];
            return (
              <GlassCard key={d.id} onClick={() => openDrone(d)} className="min-w-[168px] p-3 snap-start">
                <div className={`h-20 rounded-xl bg-gradient-to-br ${c.grad} opacity-90 mb-2 flex items-center justify-center relative overflow-hidden`}>
                  <Radar size={30} className="text-[#050b14]/40" />
                  <div className="absolute top-1.5 right-1.5">
                    <StatusPill status={d.status} />
                  </div>
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
      </div>

      <div className="px-5 mt-5">
        <GlassCard onClick={() => go("ai")} className="p-4 bg-gradient-to-br from-cyan-400/10 to-blue-500/5" glow="shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
              <Bot size={20} className="text-[#050b14]" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white">NEXUS AI</div>
              <div className="text-[11px] text-white/45 leading-snug mt-0.5">ผู้ช่วยอัจฉริยะสำหรับการวิเคราะห์โดรนของคุณ</div>
            </div>
          </div>
          <button className="mt-3 w-full py-2 rounded-lg bg-cyan-400 text-[#050b14] text-xs font-semibold flex items-center justify-center gap-1">
            เริ่มใช้งาน <ChevronRight size={13} />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------- Fleet ---------- */

function Fleet({ drones, setDrones, openDrone }) {
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
    setDrones([
      ...drones,
      {
        id: "d" + Date.now(),
        name: newName.trim(),
        type: "FPV Freestyle",
        cell: "4S",
        status: "OFFLINE",
        battery: 100,
        voltage: 16.8,
        current: 0,
        temp: 24,
        rpm: 0,
        flightTime: "0h 00m",
        firmware: "Betaflight 4.5.1",
        lastFlight: "ยังไม่เคยบิน",
        color: colors[drones.length % colors.length],
        history: [],
      },
    ]);
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
            <div className="text-xs text-white/60 mb-2">เพิ่มโดรนใหม่</div>
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
            const c = colorMap[d.color];
            return (
              <GlassCard key={d.id} onClick={() => openDrone(d)} className="p-3">
                <div className={`h-16 rounded-lg bg-gradient-to-br ${c.grad} opacity-90 flex items-center justify-center mb-2 relative`}>
                  <Radar size={24} className="text-[#050b14]/40" />
                </div>
                <div className="text-[12px] font-semibold text-white truncate">{d.name}</div>
                <div className="text-[10px] text-white/40 mb-1.5 truncate">{d.type}</div>
                <div className="flex items-center justify-between">
                  <StatusPill status={d.status} />
                  <button
                    onClick={(e) => { e.stopPropagation(); setDrones(drones.filter((x) => x.id !== d.id)); }}
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

/* ---------- Drone detail ---------- */

function DroneDetail({ drone, onBack, goTwin }) {
  const [tab, setTab] = useState("overview");
  const c = colorMap[drone.color];
  return (
    <div className="pb-4">
      <ScreenHeader title={drone.name} onBack={onBack} />
      <div className="px-5">
        <div className={`h-36 rounded-2xl bg-gradient-to-br ${c.grad} opacity-90 flex items-center justify-center relative mb-3`}>
          <Radar size={54} className="text-[#050b14]/30" />
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

            <SectionLabel>กราฟการบิน (ล่าสุด)</SectionLabel>
            <GlassCard className="p-4 mb-4">
              <MiniChart color={drone.color} />
              <div className="text-[10px] text-white/30 mt-2 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live</div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-2.5">
              {["Analyze", "Tune", "Config", "Blackbox"].map((a) => (
                <button key={a} className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 active:scale-[0.97] transition-transform">{a}</button>
              ))}
            </div>
            <button onClick={() => goTwin(drone)} className={`w-full mt-2.5 py-3 rounded-xl bg-gradient-to-r ${c.grad} text-[#050b14] text-sm font-semibold flex items-center justify-center gap-1.5`}>
              <Layers size={15} /> เปิด Digital Twin
            </button>
          </>
        )}

        {tab === "config" && (
          <div className="space-y-2.5">
            {["PID", "Filters", "Rates", "RPM Filter", "Motor Output", "Firmware"].map((k) => (
              <GlassCard key={k} className="p-3.5 flex items-center justify-between">
                <span className="text-sm text-white/80">{k}</span>
                <ChevronRight size={15} className="text-white/25" />
              </GlassCard>
            ))}
          </div>
        )}

        {tab === "blackbox" && (
          <div className="text-center py-16 text-white/30 text-sm">
            <Radar size={30} className="mx-auto mb-3 opacity-40" />
            ยังไม่มีข้อมูล Blackbox ล่าสุด<br />บันทึกไฟล์ล็อกเพื่อเริ่มวิเคราะห์
          </div>
        )}

        {tab === "history" && (
          <Timeline events={drone.history} />
        )}
      </div>
    </div>
  );
}

function MiniChart({ color }) {
  const pts = [30, 45, 38, 60, 52, 70, 65, 80, 72, 90];
  const c = colorMap[color];
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * 100},${100 - p}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24" preserveAspectRatio="none">
      <polyline points={path} fill="none" className={c.text} stroke="currentColor" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------- Digital Twin ---------- */

function Timeline({ events }) {
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

function DigitalTwin({ drone, onBack }) {
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
        <div className={`h-44 rounded-2xl bg-gradient-to-br ${c.grad} opacity-90 flex items-center justify-center relative mb-1`}>
          <Radar size={64} className="text-[#050b14]/30" />
        </div>
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

/* ---------- Tools ---------- */

function Tools({ go }) {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [openTool, setOpenTool] = useState(null);
  const cats = ["All", "Config", "Analysis", "Tuning", "Data"];
  const list = seedTools.filter((t) => (cat === "All" || t.cat === cat) && t.name.toLowerCase().includes(query.toLowerCase()));

  if (openTool) return <ToolDetail tool={openTool} onBack={() => setOpenTool(null)} />;

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
            return (
              <GlassCard key={t.id} onClick={() => setOpenTool(t)} className="p-3.5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${c.soft} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={c.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-white/40 truncate">{t.desc}</div>
                </div>
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

function ToolDetail({ tool, onBack }) {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(null);
  const c = colorMap[tool.color];
  const Icon = tool.icon;
  return (
    <div className="pb-4">
      <ScreenHeader title={tool.name} onBack={onBack} />
      <div className="px-5">
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-11 h-11 rounded-xl ${c.soft} flex items-center justify-center`}>
              <Icon size={20} className={c.text} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{tool.name}</div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${toolStatusColor[tool.status]}`}>{tool.status}</span>
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
              {running ? "กำลังวิเคราะห์..." : "วิเคราะห์การตั้งค่า"}
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
            {tool.status === "COMING SOON" ? "เครื่องมือนี้กำลังจะเปิดให้ใช้งานเร็วๆ นี้" : "โหมดทดลอง — ฟีเจอร์เต็มรูปแบบกำลังพัฒนา"}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- AI Assistant ---------- */

function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "สวัสดีครับ ผมคือ NEXUS AI พร้อมช่วยวิเคราะห์และแนะนำการตั้งค่าโดรนของคุณ ลองถามอะไรก็ได้เลยครับ" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const suggestions = ["ช่วยวิเคราะห์ PID ของ Apex 5", "แนะนำ Filter สำหรับ Freestyle", "อธิบาย RPM Filter คืออะไร"];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: "ai", pid: { p: 48, i: 58, d: 32 }, text: "คำแนะนำจาก NEXUS AI จากข้อมูลที่บันทึกและโหมด Freestyle แนะนำค่า PID เบื้องต้นดังนี้" }]);
    }, 1200);
  }

  return (
    <div className="pb-2 h-full flex flex-col">
      <ScreenHeader title="AI Assistant" right={<span className="text-[9px] px-2 py-0.5 rounded-full border border-violet-400/30 text-violet-400 bg-violet-400/10">BETA</span>} />
      <div className="flex-1 overflow-y-auto px-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" ? (
              <div className="max-w-[85%]">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Bot size={11} className="text-[#050b14]" /></div>
                  <span className="text-[10px] text-white/30">NEXUS AI</span>
                </div>
                <GlassCard className="p-3.5">
                  <p className="text-[13px] text-white/85 leading-relaxed">{m.text}</p>
                  {m.pid && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {[["P", m.pid.p], ["I", m.pid.i], ["D", m.pid.d]].map(([k, v]) => (
                          <div key={k} className="bg-white/5 rounded-lg py-2 text-center">
                            <div className="text-[10px] text-white/35">{k}</div>
                            <div className="text-base font-bold text-cyan-400">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 space-y-1">
                        {["เหมาะกับ 4S / 6S", "เสถียรสำหรับ Freestyle", "แนะนำตรวจสอบ motor noise", "ปรับ filter ตาม Blackbox"].map((s) => (
                          <div key={s} className="flex items-center gap-1.5 text-[12px] text-white/60"><Check size={12} className="text-emerald-400" /> {s}</div>
                        ))}
                      </div>
                      <button className="w-full mt-3 py-2 rounded-lg bg-cyan-400 text-[#050b14] text-xs font-semibold">ดูรายละเอียดเพิ่มเติม</button>
                    </>
                  )}
                </GlassCard>
              </div>
            ) : (
              <div className="max-w-[85%] bg-cyan-400 text-[#050b14] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] font-medium">{m.text}</div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Bot size={11} className="text-[#050b14]" /></div>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {messages.length < 3 && (
        <div className="px-5 flex gap-2 overflow-x-auto py-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-white/50 bg-white/5">{s}</button>
          ))}
        </div>
      )}
      <div className="px-5 pt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="พิมพ์คำถามของคุณ..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
        />
        <button onClick={() => send()} className="w-11 h-11 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
          <ChevronRight size={18} className="text-[#050b14]" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Community ---------- */

function Community() {
  const [posts, setPosts] = useState(seedPosts.map((p) => ({ ...p, liked: false })));
  function toggleLike(id) {
    setPosts((ps) => ps.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  }
  return (
    <div className="pb-4">
      <ScreenHeader title="Community" right={<button className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400"><Plus size={16} /></button>} />
      <div className="px-5">
        <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
          {["ทั้งหมด", "Preset", "Build", "Blackbox", "Tuning"].map((c, i) => (
            <button key={c} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${i === 0 ? "bg-white text-[#050b14] border-white font-semibold" : "border-white/10 text-white/50"}`}>{c}</button>
          ))}
        </div>
        <div className="space-y-3">
          {posts.map((p) => (
            <GlassCard key={p.id} className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[11px] font-bold text-[#050b14]">{p.user[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-white flex items-center gap-1.5">
                    {p.user}
                    {p.tag && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400">{p.tag}</span>}
                  </div>
                </div>
              </div>
              <div className="text-[13px] font-semibold text-white mb-1">{p.title}</div>
              <p className="text-[12px] text-white/45 leading-relaxed mb-3">{p.desc}</p>
              <div className="flex items-center gap-4 text-white/40 text-[11px]">
                <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1 ${p.liked ? "text-pink-400" : ""}`}>
                  <Heart size={14} fill={p.liked ? "currentColor" : "none"} /> {p.likes}
                </button>
                <span className="flex items-center gap-1"><MessageCircle size={14} /> {p.comments}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {p.views >= 1000 ? (p.views / 1000).toFixed(1) + "k" : p.views}</span>
                <button className="ml-auto"><Share2 size={14} /></button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */

function Settings_({ userEmail, onSignOut, lang, setLang }) {
  const items = [
    { icon: UserIcon, l: "โปรไฟล์" },
    { icon: Bell, l: "การแจ้งเตือน" },
    { icon: Settings, l: "ความปลอดภัย" },
    { icon: Globe, l: "เชื่อมต่อ Google" },
  ];
  return (
    <div className="pb-4">
      <ScreenHeader title="การตั้งค่า" />
      <div className="px-5">
        <GlassCard className="p-4 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-[#050b14]">{(userEmail || "N")[0].toUpperCase()}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{userEmail || "นักบิน"}</div>
            <div className="text-[11px] text-white/40 truncate">{userEmail ? `${userEmail}@example.com` : "ยังไม่เชื่อมต่ออีเมล"}</div>
          </div>
          <Edit3 size={15} className="text-white/30" />
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
            <span className="text-[11px] text-white/30">v1.0.0</span>
          </GlassCard>
        </div>

        <button onClick={onSignOut} className="w-full py-3 rounded-xl border border-red-400/20 bg-red-400/5 text-red-400 text-sm font-medium flex items-center justify-center gap-2">
          <LogOut size={15} /> ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

/* ---------- Bottom nav ---------- */

function BottomNav({ screen, go }) {
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
          <button key={it.k} onClick={() => go(it.k)} className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px] relative">
            {active && <span className="absolute -top-2 w-8 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
            <it.icon size={19} className={active ? "text-cyan-400" : "text-white/35"} />
            <span className={`text-[9px] ${active ? "text-cyan-400 font-medium" : "text-white/35"}`}>{it.l}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Root app ---------- */

function AppShell({ drones, setDrones, userName, setUserName, lang, setLang }) {
  const navigate = useNavigate();
  const location = useLocation();
  const screen = location.pathname.split("/")[2] || "home"; // /app/<screen>
  function go(s) { navigate(`/app/${s}`); }

  return (
    <div className="h-full w-full overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: "touch" }}>
      <Routes>
        <Route path="home" element={<Home_ drones={drones} userName={userName} go={go} openDrone={(d) => navigate(`/app/fleet/${d.id}`)} />} />
        <Route path="fleet" element={<Fleet drones={drones} setDrones={setDrones} openDrone={(d) => navigate(`/app/fleet/${d.id}`)} />} />
        <Route path="fleet/:id" element={<DroneDetailRoute drones={drones} onBack={() => navigate("/app/fleet")} />} />
        <Route path="fleet/:id/digital-twin" element={<DigitalTwinRoute drones={drones} onBack={() => navigate(-1)} />} />
        <Route path="tools" element={<Tools go={go} />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="community" element={<Community />} />
        <Route
          path="settings"
          element={
            <Settings_
              userEmail={userName}
              lang={lang}
              setLang={setLang}
              onSignOut={() => navigate("/login")}
            />
          }
        />
      </Routes>
      {screen !== "fleet" || location.pathname === "/app/fleet" ? null : null}
    </div>
  );
}

function DroneDetailRoute({ drones, onBack }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const drone = drones.find((d) => d.id === id);
  if (!drone) return <div className="p-6 text-white/40 text-sm">ไม่พบโดรนนี้</div>;
  return <DroneDetail drone={drone} onBack={onBack} goTwin={(d) => navigate(`/app/fleet/${d.id}/digital-twin`)} />;
}

function DigitalTwinRoute({ drones, onBack }) {
  const { id } = useParams();
  const drone = drones.find((d) => d.id === id);
  if (!drone) return <div className="p-6 text-white/40 text-sm">ไม่พบโดรนนี้</div>;
  return <DigitalTwin drone={drone} onBack={onBack} />;
}

export default function ObixNexus() {
  const [drones, setDrones] = useState(seedDrones);
  const [userName, setUserName] = useState("นักบิน");
  const [lang, setLang] = useState("th");
  const navigate = useNavigate();
  const location = useLocation();
  const inApp = location.pathname.startsWith("/app");

  return (
    <div className="w-full flex justify-center bg-[#050b14]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="relative w-full max-w-[430px] h-[812px] max-h-[92vh] bg-[#050b14] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
        <Routes>
          <Route path="/" element={<Splash onDone={() => navigate("/login")} />} />
          <Route
            path="/login"
            element={<Login onEnter={(name) => { setUserName(name); navigate("/app/home"); }} />}
          />
          <Route
            path="/register"
            element={<Login onEnter={(name) => { setUserName(name); navigate("/app/home"); }} />}
          />
          <Route
            path="/app/*"
            element={<AppShell drones={drones} setDrones={setDrones} userName={userName} setUserName={setUserName} lang={lang} setLang={setLang} />}
          />
          <Route path="*" element={<Splash onDone={() => navigate("/login")} />} />
        </Routes>
        {inApp && <BottomNav screen={location.pathname.split("/")[2] || "home"} go={(s) => navigate(`/app/${s}`)} />}
      </div>
    </div>
  );
}
