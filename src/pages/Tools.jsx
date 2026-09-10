import React, { useMemo, useState } from "react";
import { Search, Star, Calculator, AlertTriangle, CheckCircle2 } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";
import { seedTools, colorMap, toolStatusColor } from "../data/seed.js";
import {
  FLIGHT_PROFILES,
  assessMotorProp,
  calculateBattery,
  calculateThrust,
  fpvDefaults,
  recommendPid,
  recommendVtx,
} from "../lib/fpvEngine.js";
import { analyzeBlackboxText } from "../lib/blackbox/analyzer.js";

const profileOptions = Object.keys(FLIGHT_PROFILES);

export default function Tools({ favorites, toggleFavorite }) {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [openTool, setOpenTool] = useState(null);
  const cats = ["All", "Config", "Analysis", "Tuning", "Data"];
  const list = seedTools.filter((t) => (cat === "All" || t.cat === cat) && t.name.toLowerCase().includes(query.toLowerCase()));

  if (openTool) return <ToolDetail tool={openTool} onBack={() => setOpenTool(null)} favorites={favorites} toggleFavorite={toggleFavorite} />;

  return (
    <div className="pb-4">
      <ScreenHeader title="เครื่องมือ ทั้งหมด" />
      <div className="px-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-3">
          <Search size={14} className="text-white/30" />
          <input aria-label="ค้นหาเครื่องมือ" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาเครื่องมือ..." className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/25" />
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
          {cats.map((c) => <button type="button" key={c} onClick={() => setCat(c)} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${cat === c ? "bg-cyan-400 text-[#050b14] border-cyan-400 font-semibold" : "border-white/10 text-white/50"}`}>{c}</button>)}
        </div>
        <div className="space-y-2.5">
          {list.map((t) => {
            const c = colorMap[t.color];
            const Icon = t.icon;
            const fav = favorites.includes(t.id);
            return (
              <GlassCard key={t.id} aria-label={`เปิดเครื่องมือ ${t.name}`} onClick={() => setOpenTool(t)} className="p-3.5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${c.soft} flex items-center justify-center shrink-0`}><Icon size={18} className={c.text} /></div>
                <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-white">{t.name}</div><div className="text-[11px] text-white/40 truncate">{t.desc}</div></div>
                <button type="button" aria-label={`${fav ? "ยกเลิกดาว" : "เพิ่มดาวให้"} ${t.name}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }} className="shrink-0 text-white/25"><Star size={15} fill={fav ? "#fbbf24" : "none"} className={fav ? "text-amber-400" : ""} /></button>
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

function Field({ label, value, onChange, type = "number", options }) {
  return <label className="block text-[11px] text-white/50">{label}
    {options ? <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0b1928] px-2.5 py-2 text-sm text-white outline-none">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={type} min={type === "number" ? "0" : undefined} value={value} onChange={(e) => onChange(type === "number" ? e.target.value : e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-400/50" />}
  </label>;
}

function ResultBlock({ result, kind = "good" }) {
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

function MetricGrid({ items }) { return <div className="grid grid-cols-2 gap-2">{items.map(([label, value]) => <div key={label} className="rounded-lg bg-white/5 p-2"><div className="text-[10px] text-white/35">{label}</div><div className="text-sm font-semibold text-cyan-300 mt-0.5">{value}</div></div>)}</div>; }

function ToolDetail({ tool, onBack, favorites, toggleFavorite }) {
  const c = colorMap[tool.color];
  const Icon = tool.icon;
  const fav = favorites.includes(tool.id);
  return <div className="pb-4">
    <ScreenHeader title={tool.name} onBack={onBack} right={<button type="button" aria-label={`${fav ? "ยกเลิกดาว" : "เพิ่มดาว"} ${tool.name}`} onClick={() => toggleFavorite(tool.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Star size={15} fill={fav ? "#fbbf24" : "none"} className={fav ? "text-amber-400" : "text-white/40"} /></button>} />
    <div className="px-5"><GlassCard className="p-4 mb-4"><div className="flex items-center gap-3 mb-2"><div className={`w-11 h-11 rounded-xl ${c.soft} flex items-center justify-center`}><Icon size={20} className={c.text} /></div><div><div className="text-sm font-semibold text-white">{tool.name}</div><span className={`text-[9px] px-2 py-0.5 rounded-full border ${toolStatusColor[tool.status] || ""}`}>{tool.status}</span></div></div><p className="text-[12px] text-white/50 leading-relaxed">{tool.desc}</p></GlassCard><ToolPanel toolId={tool.id} /></div>
  </div>;
}

function ToolPanel({ toolId }) {
  if (toolId === "battery") return <BatteryPanel />;
  if (toolId === "pidadvisor") return <PidPanel />;
  if (toolId === "vtx") return <VtxPanel />;
  if (toolId === "blackbox") return <BlackboxPanel />;
  if (toolId === "motorprop") return <MotorPanel />;
  if (toolId === "thrustplanner") return <ThrustPanel />;
  return <PlaceholderPanel />;
}

function PlaceholderPanel() {
  return <div className="text-center py-16 text-white/30 text-sm"><Calculator size={28} className="mx-auto mb-3 opacity-40" /><div className="font-semibold text-white/55">เครื่องมือนี้ยังอยู่ในสถานะพรีวิว</div><div className="mt-2 leading-relaxed">ยังไม่มี calculation engine เฉพาะสำหรับเครื่องมือนี้ จึงไม่แสดงผลจาก calculator อื่นแทน</div></div>;
}

function BatteryPanel() {
  const [form, setForm] = useState(fpvDefaults.battery); const [result, setResult] = useState(null); const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Battery Calculator" description="คำนวณแรงดัน พลังงาน และช่วงเวลาโดยประมาณจากข้อมูลแบตเตอรี่"><div className="grid grid-cols-2 gap-2.5"><Field label="Cells (S)" value={form.cellCount} onChange={update("cellCount")} /><Field label="Capacity (mAh)" value={form.capacityMah} onChange={update("capacityMah")} /><Field label="C rating" value={form.cRating} onChange={update("cRating")} /><Field label="Safety margin (%)" value={form.safetyMargin} onChange={update("safetyMargin")} /><Field label="Average current (A)" value={form.averageCurrentA} onChange={update("averageCurrentA")} /></div><CalculateButton onClick={() => setResult(calculateBattery(form))} /> <ResultBlock result={result} kind="battery" /></Panel>;
}

function MotorPanel() {
  const [form, setForm] = useState(fpvDefaults.motorProp); const [result, setResult] = useState(null); const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Motor / Prop Compatibility" description="heuristic ตรวจความเข้ากันได้เบื้องต้น ไม่แทน thrust table"><div className="grid grid-cols-2 gap-2.5"><Field label="Battery cells" value={form.cellCount} onChange={update("cellCount")} /><Field label="Motor KV" value={form.motorKv} onChange={update("motorKv")} /><Field label="Motor size" value={form.motorSize} type="text" onChange={update("motorSize")} /><Field label="Prop diameter (in)" value={form.propDiameter} onChange={update("propDiameter")} /><Field label="Prop pitch (in)" value={form.propPitch} onChange={update("propPitch")} /><Field label="Blade count" value={form.bladeCount} onChange={update("bladeCount")} /></div><Field label="Drone class" value={form.category} onChange={update("category")} type="text" /><CalculateButton onClick={() => setResult(assessMotorProp(form))} /><ResultBlock result={result} kind="motor" /></Panel>;
}

function ThrustPanel() {
  const [form, setForm] = useState(fpvDefaults.thrust); const [result, setResult] = useState(null); const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Weight / Thrust Estimate" description="ตั้งเป้าแรงขับรวมและแรงขับต่อมอเตอร์ตาม flight profile"><div className="grid grid-cols-2 gap-2.5"><Field label="AUW (g)" value={form.auwGrams} onChange={update("auwGrams")} /><Field label="Motor count" value={form.motorCount} onChange={update("motorCount")} /></div><Field label="Flight profile" value={form.profile} onChange={update("profile")} options={profileOptions} /><CalculateButton onClick={() => setResult(calculateThrust(form))} /><ResultBlock result={result} kind="thrust" /></Panel>;
}

function PidPanel() {
  const [profile, setProfile] = useState("Freestyle"); const starting = useMemo(() => recommendPid(profile), [profile]);
  const [values, setValues] = useState({ p: starting.p, i: starting.i, d: starting.d });
  const changeProfile = (next) => { setProfile(next); const nextStarting = recommendPid(next); setValues({ p: nextStarting.p, i: nextStarting.i, d: nextStarting.d }); };
  const result = { ...starting, ...values };
  return <Panel title="PID / Rates Starting Point" description="ค่า conservative สำหรับเริ่มต้นและแก้ไขต่อได้ตาม build จริง"><Field label="Flight profile" value={profile} onChange={changeProfile} options={profileOptions} /><div className="grid grid-cols-3 gap-2.5 mt-3"><Field label="P" value={values.p} onChange={(value) => setValues({ ...values, p: value })} /><Field label="I" value={values.i} onChange={(value) => setValues({ ...values, i: value })} /><Field label="D" value={values.d} onChange={(value) => setValues({ ...values, d: value })} /></div><ResultBlock result={result} kind="pid" /></Panel>;
}

function VtxPanel() {
  const [range, setRange] = useState("Medium"); const [environment, setEnvironment] = useState("Open"); const [legalPower, setLegalPower] = useState("unknown"); const result = useMemo(() => recommendVtx({ desiredRange: range, environment, legalPower }), [range, environment, legalPower]);
  return <Panel title="VTX Helper" description="เลือกกำลังเชิงระดับตามระยะและสภาพแวดล้อม โดยไม่อ้างสิทธิ์แทนกฎหมายท้องถิ่น"><Field label="Desired range" value={range} onChange={setRange} options={["Short", "Medium", "Long"]} /><Field label="Environment" value={environment} onChange={setEnvironment} options={["Open", "Urban", "Indoor"]} /><Field label="Legal power status" value={legalPower} onChange={setLegalPower} options={["unknown", "checked locally"]} /><ResultBlock result={result} kind="vtx" /></Panel>;
}

function BlackboxPanel() {
  const [fileInfo, setFileInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [parsing, setParsing] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setParsing(true);
    setResult(null);
    setFileInfo({ name: file.name, size: file.size, status: "กำลังอ่านไฟล์ภายในเครื่อง..." });
    try {
      const text = await file.slice(0, 5 * 1024 * 1024).text();
      const analysis = analyzeBlackboxText(file.name, text);
      setResult(analysis);
      setFileInfo({ name: file.name, size: file.size, status: analysis.ok ? "วิเคราะห์สำเร็จ" : "วิเคราะห์ไม่สำเร็จ" });
    } catch (error) {
      setResult({ ok: false, error: "อ่านไฟล์ไม่สำเร็จ กรุณาลองไฟล์ text/CSV อื่น" });
      setFileInfo({ name: file.name, size: file.size, status: "เกิดข้อผิดพลาด" });
    } finally {
      setParsing(false);
    }
  }

  return <Panel title="Local Blackbox Analyzer (BETA)" description="MVP นี้วิเคราะห์ได้เฉพาะ CSV และ text-based logs ภายในเครื่องเท่านั้น ไฟล์จะไม่ถูกอัปโหลด และยังไม่รองรับ Betaflight binary Blackbox .bbl"><div className="mb-3 rounded-lg border border-amber-400/25 bg-amber-400/10 p-2.5 text-[11px] leading-relaxed text-amber-200">รองรับ: CSV / text export<br />ยังไม่รองรับ: Betaflight binary Blackbox .bbl</div><label className="block rounded-xl border border-dashed border-cyan-400/35 bg-cyan-400/5 p-4 text-center cursor-pointer"><input type="file" accept=".csv,.bbl,.txt,text/csv,text/plain" onChange={handleFile} className="sr-only" /><div className="text-sm font-semibold text-cyan-300">เลือกไฟล์ CSV หรือ text log</div><div className="text-[11px] text-white/40 mt-1">ไฟล์ binary .bbl จะถูกปฏิเสธอย่างชัดเจน</div></label>{fileInfo && <div className="mt-3 rounded-xl bg-white/5 p-3 text-xs"><div className="font-semibold text-white truncate">{fileInfo.name}</div><div className="text-white/45 mt-1">{formatBytes(fileInfo.size)} · {fileInfo.status}</div></div>}{parsing && <div className="mt-3 text-xs text-cyan-300">กำลัง parse ข้อมูล...</div>}{result && (result.ok ? <BlackboxReport result={result} /> : <div className="mt-3 rounded-xl border border-red-400/25 bg-red-400/10 p-3 text-xs text-red-200">{result.error}</div>)}</Panel>;
}

function BlackboxReport({ result }) {
  const { metrics } = result;
  const health = result.diagnostics.some((finding) => finding.status === "INDICATOR") ? "🟡 ตรวจสอบเพิ่มเติม" : "🟢 ไม่พบ indicator รุนแรง";
  return <div className="mt-4 space-y-3"><div className="rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[10px] text-white/40">BLACKBOX HEALTH</div><div className="text-sm font-semibold text-white mt-1">{health}</div><div className="text-[11px] text-white/45 mt-1">{result.format.format} · {metrics.sampleCount.toLocaleString()} samples{metrics.durationSeconds ? ` · ${metrics.durationSeconds.toFixed(2)} s` : ""}{metrics.sampleRateHz ? ` · ${metrics.sampleRateHz.toFixed(0)} Hz` : ""}</div></div><MetricGrid items={[["Gyro", metricSummary(metrics.gyro)], ["Throttle", metricSummary(metrics.throttle)], ["Motor output", metricSummary(metrics.motorOutput)], ["Roll / Pitch / Yaw", `${metrics.roll.available ? "พร้อม" : "N/A"} / ${metrics.pitch.available ? "พร้อม" : "N/A"} / ${metrics.yaw.available ? "พร้อม" : "N/A"}`]]} /><MiniSeries title="Gyro activity" metric={metrics.gyro} /><MiniSeries title="Throttle activity" metric={metrics.throttle} /><MiniSeries title="Motor output activity" metric={metrics.motorOutput} /><div><div className="text-xs font-semibold text-white/75 mb-2">Key findings</div>{result.diagnostics.map((finding, index) => <div key={`${finding.status}-${index}`} className="mb-2 rounded-lg border border-white/10 bg-white/5 p-2.5"><div className={`text-[11px] font-semibold ${finding.status === "INDICATOR" ? "text-amber-300" : finding.status === "NOT AVAILABLE" ? "text-white/40" : "text-emerald-300"}`}>{finding.status}</div><div className="text-xs text-white/75 mt-1">WHY: {finding.why}</div><div className="text-[11px] text-white/45 mt-1">DATA USED: {finding.dataUsed}</div><div className="text-[11px] text-cyan-300/80 mt-1">WHAT TO CHECK NEXT: {finding.next}</div></div>)}</div><div><div className="text-xs font-semibold text-white/75 mb-1">Limitations</div>{result.assumptions.map((assumption) => <p key={assumption} className="text-[11px] text-white/45 leading-relaxed">• {assumption}</p>)}</div></div>;
}

function metricSummary(metric) { return metric?.available ? `RMS ${metric.rms.toFixed(1)} · range ${metric.range.toFixed(1)}` : "Not available in this log"; }
function formatBytes(bytes) { return bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }
function MiniSeries({ title, metric }) { if (!metric?.available) return <div className="rounded-lg bg-white/5 p-2.5 text-[11px] text-white/35">{title}: Not available in this log</div>; const values = metric.series; const min = Math.min(...values); const max = Math.max(...values); const span = max - min || 1; const points = values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${100 - ((value - min) / span) * 86 - 7}`).join(" "); return <div className="rounded-lg bg-white/5 p-2.5"><div className="text-[11px] text-white/50 mb-1">{title}</div><svg viewBox="0 0 100 100" className="h-16 w-full" preserveAspectRatio="none" role="img" aria-label={`${title} chart`}><polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg></div>; }

function Panel({ title, description, children }) { return <GlassCard className="p-4"><div className="text-sm font-semibold text-white">{title}</div><p className="text-[11px] text-white/45 leading-relaxed mt-1 mb-4">{description}</p>{children}</GlassCard>; }
function CalculateButton({ onClick }) { return <button type="button" onClick={onClick} className="w-full mt-4 mb-4 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-[#050b14] text-sm font-semibold">คำนวณ</button>; }
