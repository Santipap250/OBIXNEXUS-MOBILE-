import React, { useMemo, useState } from "react";
import { recommendVtx } from "../engines/fpv/index.js";
import { Field, Panel, ResultBlock } from "../components/ToolPrimitives.jsx";

export default function VtxPanel() {
  const [range, setRange] = useState("Medium");
  const [environment, setEnvironment] = useState("Open");
  const [legalPower, setLegalPower] = useState("unknown");
  const result = useMemo(() => recommendVtx({ desiredRange: range, environment, legalPower }), [range, environment, legalPower]);
  return <Panel title="VTX Helper" description="เลือกกำลังเชิงระดับตามระยะและสภาพแวดล้อม โดยไม่อ้างสิทธิ์แทนกฎหมายท้องถิ่น"><Field label="Desired range" value={range} onChange={setRange} options={["Short", "Medium", "Long"]} /><Field label="Environment" value={environment} onChange={setEnvironment} options={["Open", "Urban", "Indoor"]} /><Field label="Legal power status" value={legalPower} onChange={setLegalPower} options={["unknown", "checked locally"]} /><ResultBlock result={result} kind="vtx" /></Panel>;
}
