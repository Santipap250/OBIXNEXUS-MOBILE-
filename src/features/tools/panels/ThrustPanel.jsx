import React, { useState } from "react";
import { calculateThrust, FLIGHT_PROFILES, fpvDefaults } from "../engines/fpv/index.js";
import { CalculateButton, Field, Panel, ResultBlock } from "../components/ToolPrimitives.jsx";

export default function ThrustPanel() {
  const [form, setForm] = useState(fpvDefaults.thrust);
  const [result, setResult] = useState(null);
  const update = (key) => (value) => setForm({ ...form, [key]: value });
  return <Panel title="Weight / Thrust Estimate" description="ตั้งเป้าแรงขับรวมและแรงขับต่อมอเตอร์ตาม flight profile"><div className="grid grid-cols-2 gap-2.5"><Field label="AUW (g)" value={form.auwGrams} onChange={update("auwGrams")} /><Field label="Motor count" value={form.motorCount} onChange={update("motorCount")} /></div><Field label="Flight profile" value={form.profile} onChange={update("profile")} options={Object.keys(FLIGHT_PROFILES)} /><CalculateButton onClick={() => setResult(calculateThrust(form))} /><ResultBlock result={result} kind="thrust" /></Panel>;
}
