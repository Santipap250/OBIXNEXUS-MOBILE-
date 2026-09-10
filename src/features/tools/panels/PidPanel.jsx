import React, { useMemo, useState } from "react";
import { recommendPid, FLIGHT_PROFILES } from "../engines/fpv/index.js";
import { Field, Panel, ResultBlock } from "../components/ToolPrimitives.jsx";

export default function PidPanel() {
  const [profile, setProfile] = useState("Freestyle");
  const starting = useMemo(() => recommendPid(profile), [profile]);
  const [values, setValues] = useState({ p: starting.p, i: starting.i, d: starting.d });
  const changeProfile = (next) => { setProfile(next); const nextStarting = recommendPid(next); setValues({ p: nextStarting.p, i: nextStarting.i, d: nextStarting.d }); };
  const result = { ...starting, ...values };
  return <Panel title="PID / Rates Starting Point" description="ค่า conservative สำหรับเริ่มต้นและแก้ไขต่อได้ตาม build จริง"><Field label="Flight profile" value={profile} onChange={changeProfile} options={Object.keys(FLIGHT_PROFILES)} /><div className="grid grid-cols-3 gap-2.5 mt-3"><Field label="P" value={values.p} onChange={(value) => setValues({ ...values, p: value })} /><Field label="I" value={values.i} onChange={(value) => setValues({ ...values, i: value })} /><Field label="D" value={values.d} onChange={(value) => setValues({ ...values, d: value })} /></div><ResultBlock result={result} kind="pid" /></Panel>;
}
