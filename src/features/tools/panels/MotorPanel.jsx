import React, { useState } from "react";
import { assessMotorProp, fpvDefaults } from "../engines/fpv/index.js";
import { CalculateButton, Field, Panel, ResultBlock } from "../components/ToolPrimitives.jsx";

export default function MotorPanel() {
  const [form, setForm] = useState(fpvDefaults.motorProp);
  const [result, setResult] = useState(null);
  const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Motor / Prop Compatibility" description="heuristic ตรวจความเข้ากันได้เบื้องต้น ไม่แทน thrust table"><div className="grid grid-cols-2 gap-2.5"><Field label="Battery cells" value={form.cellCount} onChange={update("cellCount")} /><Field label="Motor KV" value={form.motorKv} onChange={update("motorKv")} /><Field label="Motor size" value={form.motorSize} type="text" onChange={update("motorSize")} /><Field label="Prop diameter (in)" value={form.propDiameter} onChange={update("propDiameter")} /><Field label="Prop pitch (in)" value={form.propPitch} onChange={update("propPitch")} /><Field label="Blade count" value={form.bladeCount} onChange={update("bladeCount")} /></div><Field label="Drone class" value={form.category} onChange={update("category")} type="text" /><CalculateButton onClick={() => setResult(assessMotorProp(form))} /><ResultBlock result={result} kind="motor" /></Panel>;
}
