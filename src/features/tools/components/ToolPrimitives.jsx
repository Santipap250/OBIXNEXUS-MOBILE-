import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../../../components/ui.jsx";

export function Field({ label, value, onChange, type = "number", options }) {
  return <label className="block text-[11px] text-white/50">{label}
    {options ? <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1928] px-2.5 py-2 text-sm text-white outline-none">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-400/50" />}
  </label>;
}

export function MetricGrid({ items }) {
  return <div className="grid grid-cols-2 gap-2">{items.map(([label, value]) => <div key={label} className="rounded-lg bg-white/5 p-2"><div className="text-[10px] text-white/35">{label}</div><div className="text-sm font-semibold text-cyan-300 mt-0.5">{value}</div></div>)}</div>;
}

export function ResultBlock({ result, kind = "good" }) {
  if (!result) return null;
  if (result.valid === false) return <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-300"><AlertTriangle size={15} className="mb-1" />{result.reason}</div>;
  const statusClass = result.status === "GOOD" ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" : result.status === "CAUTION" ? "text-amber-300 border-amber-400/30 bg-amber-400/10" : "text-red-300 border-red-400/30 bg-red-400/10";
  return <div className="space-y-3">
    {result.status && <div className={`rounded-xl border p-3 text-sm font-semibold ${statusClass}`}>{result.status === "GOOD" ? <CheckCircle2 size={16} className="inline mr-1" /> : <AlertTriangle size={16} className="inline mr-1" />}{result.status}</div>}
    <GlassCard className="p-3.5"><div className="text-xs text-white/40 mb-2">ผลลัพธ์โดยประมาณ</div>
      {kind === "battery" && <MetricGrid items={[["Nominal voltage", `${result.nominalVoltage.toFixed(1)} V`], ["Energy", `${result.energyWh.toFixed(2)} Wh`], ["Usable energy", `${result.usableEnergyWh.toFixed(2)} Wh`], ["Max theoretical current", `${result.maxTheoreticalCurrentA.toFixed(1)} A`], ["Flight-time range", result.rangeMinutes ? `${result.rangeMinutes[0].toFixed(0)}–${result.rangeMinutes[1].toFixed(0)} min` : "ใส่กระแสเฉลี่ย"]]} />}
      {kind === "thrust" && <MetricGrid items={[["AUW", `${result.auwGrams.toFixed(0)} g`], ["Target ratio", `${result.targetRatio}:1`], ["Total target thrust", `${result.totalTargetGrams.toFixed(0)} g`], ["Per-motor target", `${result.perMotorTargetGrams.toFixed(0)} g`]]} />}
      {kind === "pid" && <MetricGrid items={[["Profile", result.profile], ["P", result.p], ["I", result.i], ["D", result.d], ["Rates", result.rates]]} />}
      {kind === "vtx" && <MetricGrid items={[["Range", result.range], ["Environment", result.environment], ["Suggested power", result.suggestedPower]]} />}
      {kind === "motor" && <><div className="text-sm text-white/80">{result.explanation}</div>{result.issues?.map((item) => <div key={item} className="mt-2 text-xs text-red-300">• {item}</div>)}{result.notes?.map((item) => <div key={item} className="mt-2 text-xs text-white/50">• {item}</div>)}</>}
    </GlassCard>
    {result.explanation && kind !== "motor" && <div><div className="text-xs font-semibold text-white/70 mb-1">ทำไมผลลัพธ์นี้</div><p className="text-xs text-white/50 leading-relaxed">{result.explanation}</p></div>}
    {result.disclaimer && <p className="text-[11px] text-amber-300/80 leading-relaxed">หมายเหตุ: {result.disclaimer}</p>}
    {result.assumptions && <div><div className="text-xs font-semibold text-white/70 mb-1">สมมติฐาน</div>{result.assumptions.map((item) => <p key={item} className="text-[11px] text-white/45 leading-relaxed">• {item}</p>)}</div>}
    {result.notes && kind === "vtx" && <div><div className="text-xs font-semibold text-white/70 mb-1">ข้อควรระวัง</div>{result.notes.map((item) => <p key={item} className="text-[11px] text-white/45 leading-relaxed">• {item}</p>)}</div>}
  </div>;
}

export function Panel({ title, description, children }) { return <GlassCard className="p-4"><div className="text-sm font-semibold text-white">{title}</div><p className="text-[11px] text-white/45 leading-relaxed mt-1 mb-4">{description}</p>{children}</GlassCard>; }
export function CalculateButton({ onClick }) { return <button type="button" onClick={onClick} className="w-full mt-4 mb-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] text-sm font-semibold">คำนวณ</button>; }
