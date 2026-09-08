import {
  Shield, Cpu, Activity, Layers, Gauge, Radar, Battery, Wifi,
} from "lucide-react";

export const defaultDrones = [
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

export const seedTools = [
  { id: "configdoctor", name: "ConfigDoctor", desc: "วิเคราะห์และตรวจสอบการตั้งค่าของโดรน", cat: "Config", status: "READY", icon: Shield, color: "cyan" },
  { id: "obixcore", name: "OBIXCORE", desc: "ปรับแต่งและจูนพารามิเตอร์แบบละเอียด", cat: "Tuning", status: "READY", icon: Cpu, color: "violet" },
  { id: "configfpv", name: "ConfigFPV", desc: "คลังข้อมูลการตั้งค่าจากชุมชนและโปรไฟล์ด้านล่าง", cat: "Config", status: "PREVIEW", icon: Activity, color: "cyan" },
  { id: "configlab", name: "ConfigLab", desc: "เครื่องมือทดลองและพัฒนาการตั้งค่าแบบล่าสุด", cat: "Data", status: "COMING SOON", icon: Layers, color: "amber" },
  { id: "pidadvisor", name: "PID Advisor", desc: "แนะนำค่า PID ที่เหมาะกับสไตล์การบิน", cat: "Tuning", status: "READY", icon: Gauge, color: "violet" },
  { id: "blackbox", name: "Blackbox Analyzer", desc: "วิเคราะห์ไฟล์ Blackbox หลังการบิน", cat: "Analysis", status: "READY", icon: Radar, color: "cyan" },
  { id: "battery", name: "Battery Analyzer", desc: "ติดตามสุขภาพแบตเตอรี่ตามรอบการบิน", cat: "Data", status: "BETA", icon: Battery, color: "green" },
  { id: "vtx", name: "VTX Tools", desc: "จัดการช่องสัญญาณและกำลังส่ง", cat: "Config", status: "COMING SOON", icon: Wifi, color: "amber" },
];

export const seedPosts = [
  { id: 1, user: "SanTiFPV", tag: "Top Creator", title: "Preset สำหรับ Apex 5 (4S) - Freestyle", desc: "ลองใช้กันดูครับ ปรับ filter ใหม่หมด บินนิ่งขึ้นเยอะ", likes: 128, comments: 24, views: 1200 },
  { id: 2, user: "NatFPV", tag: null, title: "Blackbox log หลัง tune Ghost Cine", desc: "แชร์ log ให้ดูการตอบสนองหลังปรับ D-term", likes: 54, comments: 9, views: 410 },
  { id: 3, user: "PawFreestyle", tag: "Verified", title: "Build guide: Toothpick 3S ตัวเบา", desc: "สเปกที่ใช้และเหตุผลการเลือกอุปกรณ์แต่ละชิ้น", likes: 201, comments: 41, views: 3400 },
];

export const defaultProfile = {
  name: "SanTiFPV",
  role: "FPV Pilot",
};

export const colorMap = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/40", glow: "shadow-[0_0_20px_rgba(34,211,238,0.35)]", grad: "from-cyan-400 to-blue-500", soft: "bg-cyan-400/10" },
  violet: { text: "text-violet-400", bg: "bg-violet-400", border: "border-violet-400/40", glow: "shadow-[0_0_20px_rgba(167,139,250,0.35)]", grad: "from-violet-400 to-purple-500", soft: "bg-violet-400/10" },
  amber: { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/40", glow: "shadow-[0_0_20px_rgba(251,191,36,0.35)]", grad: "from-amber-400 to-orange-500", soft: "bg-amber-400/10" },
  green: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/40", glow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]", grad: "from-emerald-400 to-teal-500", soft: "bg-emerald-400/10" },
};

export const statusColor = {
  ONLINE: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  OFFLINE: "text-slate-400 bg-slate-400/10 border-slate-400/30",
  WARNING: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  MAINTENANCE: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export const toolStatusColor = {
  CONNECTED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  READY: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  PREVIEW: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  BETA: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  "COMING SOON": "text-slate-400 bg-slate-400/10 border-slate-400/30",
};
