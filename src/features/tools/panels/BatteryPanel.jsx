import React, { useState } from "react";
import { calculateBattery, fpvDefaults } from "../engines/fpv/index.js";
import { CalculateButton, Field, Panel, ResultBlock } from "../components/ToolPrimitives.jsx";

export default function BatteryPanel() {
  const [form, setForm] = useState(fpvDefaults.battery);
  const [result, setResult] = useState(null);
  const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Battery Calculator" description="คำนวณแรงดัน พลังงาน และช่วงเวลาโดยประมาณจากข้อมูลแบตเตอรี่"><div className="grid grid-cols-2 gap-2.5"><Field label="Cells (S)" value={form.cellCount} onChange={update("cellCount")} /><Field label="Capacity (mAh)" value={form.capacityMah} onChange={update("capacityMah")} /><Field label="C rating" value={form.cRating} onChange={update("cRating")} /><Field label="Safety margin (%)" value={form.safetyMargin} onChange={update("safetyMargin")} /><Field label="Average current (A)" value={form.averageCurrentA} onChange={update("averageCurrentA")} /></div><CalculateButton onClick={() => setResult(calculateBattery(form))} /> <ResultBlock result={result} kind="battery" /></Panel>;
}
