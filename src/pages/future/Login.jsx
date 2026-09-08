// PHASE 3 (OPTIONAL, NOT ACTIVE) — cloud accounts.
//
// This file intentionally isolated outside src/pages/ and is not imported
// by App.jsx or any route. Phase 2 removed authentication from the core
// app: OBIX NEXUS MOBILE is free, public, and requires no login. If a
// future phase adds optional cloud accounts, this is a starting point —
// wire it behind a route like "/account/login" and make it opt-in only,
// never a gate in front of core features.

import React, { useState } from "react";
import { Radar, Mail, Lock } from "lucide-react";

export default function Login({ onEnter }) {
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
        <h1 className="text-xl font-bold text-white mb-1">เข้าสู่ระบบ (ไม่บังคับ)</h1>
        <p className="text-sm text-white/40 mb-6">ฟีเจอร์นี้เป็นทางเลือกในอนาคต ไม่จำเป็นสำหรับการใช้งาน OBIX NEXUS</p>

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

        <button
          onClick={() => {
            if (!email.trim() || !pw.trim()) { setErr("กรอกอีเมลและรหัสผ่าน"); return; }
            onEnter?.(email.split("@")[0]);
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] font-semibold text-sm mt-4"
        >
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
}
