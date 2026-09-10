function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function assessMotorProp({ cellCount, motorKv, motorSize, propDiameter, propPitch, bladeCount, category }) {
  const cells = finite(cellCount); const kv = finite(motorKv); const diameter = finite(propDiameter); const pitch = finite(propPitch); const blades = finite(bladeCount, 2); const size = String(motorSize || "").trim(); const className = String(category || "").toLowerCase(); const issues = []; const notes = [];
  if (cells <= 0 || kv <= 0 || diameter <= 0 || pitch <= 0 || blades <= 0) return { status: "CAUTION", issues: ["ข้อมูลไม่ครบหรือมีค่าไม่ถูกต้อง"], explanation: "กรอก cell, KV, ขนาดใบพัด, pitch และจำนวนใบให้มากกว่า 0 ก่อนใช้งาน" };
  if (cells >= 6 && kv > 2200) issues.push("KV สูงสำหรับแบตเตอรี่ 6S ขึ้นไป; ตรวจสอบ thrust test และอุณหภูมิก่อนบิน");
  if (cells === 4 && kv > 3200) issues.push("KV สูงสำหรับ 4S; มีความเสี่ยงกระแสและความร้อนสูง");
  if (diameter >= 7 && kv > 2200) issues.push("ใบ 7 นิ้วกับ KV สูงอาจใช้กระแสสูงเกินไป");
  if (diameter <= 3 && kv < 2500) issues.push("KV ต่ำสำหรับคลาส micro อาจตอบสนองไม่พอ");
  if (pitch > diameter * 1.25) issues.push("pitch สูงเมื่อเทียบกับเส้นผ่านศูนย์กลาง; ตรวจสอบโหลดมอเตอร์");
  if (blades >= 3) notes.push("ใบหลายแฉกเพิ่มโหลดและเสียง; ควรเผื่อกระแสและตรวจอุณหภูมิ");
  if (className.includes("cinematic") && pitch > 4) notes.push("Cinematic มักได้ประโยชน์จาก pitch ต่ำกว่าเพื่อความนุ่มและประสิทธิภาพ");
  if (className.includes("racing") && pitch < 3) notes.push("Racing อาจต้องการ pitch สูงกว่านี้เพื่อแรงเร่ง แต่ต้องอ้างอิง motor/prop test จริง");
  if (size) notes.push(`ขนาดมอเตอร์ ${size} ต้องตรวจสอบกับ torque, prop และ thrust table ของผู้ผลิต`);
  const status = issues.length >= 2 ? "NOT RECOMMENDED" : issues.length === 1 ? "CAUTION" : "GOOD";
  return { status, issues, notes, explanation: status === "GOOD" ? "ชุดข้อมูลนี้ไม่ชนกับ heuristic เบื้องต้น แต่ยังไม่ใช่ผลทดสอบแรงขับจริง" : "พบเงื่อนไขที่ควรตรวจสอบก่อนจ่ายไฟหรือบินจริง" };
}
