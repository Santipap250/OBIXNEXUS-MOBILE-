import { FLIGHT_PROFILES, normalizeProfile } from "./profiles.js";

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function calculateThrust({ auwGrams, motorCount = 4, profile = "Freestyle" }) {
  const auw = finite(auwGrams); const motors = finite(motorCount); const selected = normalizeProfile(profile); const ratio = FLIGHT_PROFILES[selected].thrustToWeight;
  if (auw <= 0 || motors <= 0) return { valid: false, reason: "AUW และจำนวนมอเตอร์ต้องมากกว่า 0" };
  const totalTargetGrams = auw * ratio;
  return { valid: true, auwGrams: auw, targetRatio: ratio, totalTargetGrams, perMotorTargetGrams: totalTargetGrams / motors, profile: selected, explanation: FLIGHT_PROFILES[selected].description, assumptions: [`ใช้ target thrust-to-weight ratio ${ratio}:1 สำหรับโปรไฟล์ ${selected}`, "เป็นเป้าหมายประมาณเพื่อ sizing ไม่ใช่ thrust ที่มอเตอร์ชุดนี้ทำได้จริง", "ควรเทียบกับ thrust table ของ motor + prop + cell ที่ตรงรุ่น"] };
}
