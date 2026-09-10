import React from "react";

export default function ToolLoadingFallback({ label = "กำลังโหลดโมดูล..." }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center px-5" role="status" aria-live="polite">
      <div className="w-full rounded-2xl border border-cyan-400/15 bg-white/5 p-5 text-center shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl">
        <div className="mx-auto mb-3 h-7 w-7 animate-pulse rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
        <div className="text-xs text-cyan-200/80">{label}</div>
      </div>
    </div>
  );
}
