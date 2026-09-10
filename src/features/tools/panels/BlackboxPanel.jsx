import React, { useState } from "react";
import { Link2, Check } from "lucide-react";
import { analyzeBlackbox } from "../engines/blackboxAnalyzerAdapter.js";
import { MetricGrid, Panel } from "../components/ToolPrimitives.jsx";

export default function BlackboxPanel({ drones = [], onAttachBlackbox }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [attachedTo, setAttachedTo] = useState(null);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setResult(null);
    setAttachedTo(null);
    setFileInfo({ name: file.name, size: file.size, status: "กำลังอ่านไฟล์ภายในเครื่อง..." });
    try {
      const text = await file.slice(0, 5 * 1024 * 1024).text();
      const analysis = await analyzeBlackbox(file.name, text);
      setResult(analysis);
      setFileInfo({ name: file.name, size: file.size, status: analysis.ok ? "วิเคราะห์สำเร็จ" : "วิเคราะห์ไม่สำเร็จ" });
    } catch (error) {
      setResult({ ok: false, error: "อ่านไฟล์ไม่สำเร็จ กรุณาลองไฟล์ text/CSV อื่น" });
      setFileInfo({ name: file.name, size: file.size, status: "เกิดข้อผิดพลาด" });
      void error;
    } finally {
      setParsing(false);
    }
  }

  function attachTo(droneId) {
    if (!onAttachBlackbox || !result) return;
    onAttachBlackbox(droneId, result, { fileName: fileInfo?.name });
    setAttachedTo(droneId);
  }

  return <Panel title="Local Blackbox Analyzer (BETA)" description="MVP นี้วิเคราะห์ได้เฉพาะ CSV และ text-based logs ภายในเครื่องเท่านั้น ไฟล์จะไม่ถูกอัปโหลด และยังไม่รองรับ Betaflight binary Blackbox .bbl"><div className="mb-3 rounded-lg border border-amber-400/25 bg-amber-400/10 p-2.5 text-[11px] leading-relaxed text-amber-200">รองรับ: CSV / text export<br />ยังไม่รองรับ: Betaflight binary Blackbox .bbl</div><label className="block rounded-xl border border-dashed border-cyan-400/35 bg-cyan-400/5 p-4 text-center cursor-pointer"><input type="file" accept=".csv,.bbl,.txt,text/csv,text/plain" onChange={handleFile} className="sr-only" /><div className="text-sm font-semibold text-cyan-300">เลือกไฟล์ CSV หรือ text log</div><div className="text-[11px] text-white/40 mt-1">ไฟล์ binary .bbl จะถูกปฏิเสธอย่างชัดเจน</div></label>{fileInfo && <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs"><div className="font-semibold text-white truncate">{fileInfo.name}</div><div className="text-white/45 mt-1">{formatBytes(fileInfo.size)} · {fileInfo.status}</div></div>}{parsing && <div className="mt-3 text-xs text-cyan-300">กำลัง parse ข้อมูล...</div>}{result && (result.ok ? <BlackboxReport result={result} /> : <div className="mt-3 rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-xs text-red-200">{result.error}</div>)}{result && onAttachBlackbox && drones.length > 0 && <AttachToDrone drones={drones} attachedTo={attachedTo} onAttach={attachTo} />}</Panel>;
}

function AttachToDrone({ drones, attachedTo, onAttach }) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-white/75 mb-2 flex items-center gap-1.5"><Link2 size={13} /> เชื่อมผลวิเคราะห์นี้กับโดรน</div>
      <div className="flex flex-wrap gap-2">
        {drones.map((d) => {
          const attached = attachedTo === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onAttach(d.id)}
              className={`text-[11px] px-3 py-1.5 rounded-full border flex items-center gap-1 ${attached ? "bg-emerald-400 text-[#050b14] border-emerald-400 font-semibold" : "border-white/10 text-white/60"}`}
            >
              {attached && <Check size={11} />} {d.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BlackboxReport({ result }) {
  const { metrics } = result;
  const health = result.diagnostics.some((finding) => finding.status === "INDICATOR") ? "🟡 ตรวจสอบเพิ่มเติม" : "🟢 ไม่พบ indicator รุนแรง";
  return <div className="mt-4 space-y-3"><div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] text-white/40">BLACKBOX HEALTH</div><div className="text-sm font-semibold text-white mt-1">{health}</div><div className="text-[11px] text-white/45 mt-1">{result.format.format} · {metrics.sampleCount.toLocaleString()} samples{metrics.durationSeconds ? ` · ${metrics.durationSeconds.toFixed(2)} s` : ""}{metrics.sampleRateHz ? ` · ${metrics.sampleRateHz.toFixed(0)} Hz` : ""}</div></div><MetricGrid items={[["Gyro", metricSummary(metrics.gyro)], ["Throttle", metricSummary(metrics.throttle)], ["Motor output", metricSummary(metrics.motorOutput)], ["Roll / Pitch / Yaw", `${metrics.roll.available ? "พร้อม" : "N/A"} / ${metrics.pitch.available ? "พร้อม" : "N/A"} / ${metrics.yaw.available ? "พร้อม" : "N/A"}`]]} /><MiniSeries title="Gyro activity" metric={metrics.gyro} /><MiniSeries title="Throttle activity" metric={metrics.throttle} /><MiniSeries title="Motor output activity" metric={metrics.motorOutput} /><div><div className="text-xs font-semibold text-white/75 mb-2">Key findings</div>{result.diagnostics.map((finding, index) => <div key={`${finding.status}-${index}`} className="mb-2 rounded-lg border border-white/10 bg-white/5 p-2.5"><div className={`text-[11px] font-semibold ${finding.status === "INDICATOR" ? "text-amber-300" : finding.status === "NOT AVAILABLE" ? "text-white/40" : "text-emerald-300"}`}>{finding.status}</div><div className="text-xs text-white/75 mt-1">WHY: {finding.why}</div><div className="text-[11px] text-white/45 mt-1">DATA USED: {finding.dataUsed}</div><div className="text-[11px] text-cyan-300/80 mt-1">WHAT TO CHECK NEXT: {finding.next}</div></div>)}</div><div><div className="text-xs font-semibold text-white/75 mb-1">Limitations</div>{result.assumptions.map((assumption) => <p key={assumption} className="text-[11px] text-white/45 leading-relaxed">• {assumption}</p>)}</div></div>;
}

function metricSummary(metric) { return metric?.available ? `RMS ${metric.rms.toFixed(1)} · range ${metric.range.toFixed(1)}` : "Not available in this log"; }
function formatBytes(bytes) { return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }
function MiniSeries({ title, metric }) { if (!metric?.available) return <div className="rounded-lg bg-white/5 p-2.5 text-[11px] text-white/35">{title}: Not available in this log</div>; const values = metric.series; const min = Math.min(...values); const max = Math.max(...values); const span = max - min || 1; const points = values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${100 - ((value - min) / span) * 86 - 7}`).join(" "); return <div className="rounded-lg bg-white/5 p-2.5"><div className="text-[11px] text-white/50 mb-1">{title}</div><svg viewBox="0 0 100 100" className="h-16 w-full" preserveAspectRatio="none" role="img" aria-label={`${title} chart`}><polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg></div>; }
