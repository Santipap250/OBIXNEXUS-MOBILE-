import React, { useState, useEffect } from "react";
import { Radar } from "lucide-react";

export default function Splash({ onDone }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 700);
    const t3 = setTimeout(() => onDone(), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
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
          <div className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-[1400ms] ease-out ${stage >= 1 ? "w-full" : "w-0"}`} />
        </div>
        <div className="text-[10px] text-white/30 tracking-widest">กำลังโหลด...</div>
      </div>
    </div>
  );
}
