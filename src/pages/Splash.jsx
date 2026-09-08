import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ObixMark } from "../components/ui.jsx";

export default function Splash({ onDone }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 120);
    const t2 = setTimeout(() => setStage(2), 520);
    const t3 = setTimeout(() => onDone(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <main className="relative h-full w-full overflow-hidden bg-[#030811]">
      <img src="/images/hero-fpv.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,17,.35)_0%,rgba(3,8,17,.5)_38%,rgba(3,8,17,.96)_100%)]" />
      <div className="absolute inset-x-6 top-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ObixMark />
          <div>
            <div className="text-[13px] font-bold tracking-wide text-white">OBIX <span className="text-cyan-300">NEXUS</span></div>
            <div className="text-[8px] tracking-[0.22em] text-white/45">PERSONAL FPV OS</div>
          </div>
        </div>
        <div className="text-[9px] rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-300">FREE</div>
      </div>

      <section className="absolute inset-x-6 bottom-28">
        <div className={`mb-4 transition-all duration-700 ${stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <div className="mb-2 text-[10px] font-semibold tracking-[0.22em] text-cyan-300">THE ULTIMATE FPV PLATFORM</div>
          <h1 className="max-w-[330px] text-[32px] font-black leading-[0.95] tracking-[-0.04em] text-white">
            ONE SYSTEM.<br />ALL YOUR DRONES.<br /><span className="text-cyan-300">TOTAL CONTROL.</span>
          </h1>
          <p className="mt-3 max-w-[330px] text-[12px] leading-relaxed text-white/60">
            ศูนย์กลางสำหรับ Fleet, Config, Analysis, Tuning, Digital Twin และ NEXUS AI — เปิดแล้วใช้งานได้ทันทีโดยไม่ต้องสมัครสมาชิก
          </p>
        </div>
        <div className={`flex gap-2 transition-all duration-700 delay-150 ${stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <button onClick={onDone} className="flex-1 rounded-xl bg-cyan-300 px-4 py-3 text-[12px] font-bold text-[#04101b] shadow-[0_0_26px_rgba(34,211,238,.25)]">
            เริ่มใช้งาน <ArrowRight size={14} className="ml-1 inline" />
          </button>
          <button onClick={onDone} className="rounded-xl border border-white/20 bg-white/[.05] px-4 py-3 text-[12px] font-semibold text-white/80 backdrop-blur-xl">ดูเครื่องมือ</button>
        </div>
      </section>

      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center text-white/30">
        <div className="mb-1 text-[9px] tracking-[0.25em]">SCROLL TO EXPLORE</div>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </main>
  );
}
