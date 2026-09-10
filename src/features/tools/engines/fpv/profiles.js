export const FLIGHT_PROFILES = {
  Freestyle: { thrustToWeight: 8, description: "ตอบสนองไวและมีแรงสำรองสำหรับ punch-out" },
  Cinematic: { thrustToWeight: 4, description: "เน้นความนุ่มนวลและประสิทธิภาพมากกว่าความดุดัน" },
  Racing: { thrustToWeight: 10, description: "เน้นอัตราเร่งและการตอบสนองสูงสุด" },
  "Long Range": { thrustToWeight: 3.5, description: "เน้นประสิทธิภาพและลดการใช้พลังงาน" },
};

export const PID_STARTING_POINTS = {
  Freestyle: { p: 45, i: 55, d: 30, rates: "กลาง-สูง", why: "สมดุลระหว่างการล็อกมุมและการตอบสนองสำหรับท่าทั่วไป" },
  Cinematic: { p: 38, i: 48, d: 24, rates: "ต่ำ-กลาง", why: "ลดความไวเพื่อให้ภาพและการเคลื่อนไหวนุ่มขึ้น" },
  Racing: { p: 52, i: 60, d: 34, rates: "สูง", why: "เพิ่มการตอบสนองสำหรับการเปลี่ยนทิศทางเร็ว" },
  "Long Range": { p: 35, i: 50, d: 22, rates: "ต่ำ", why: "เน้นความเสถียรและประสิทธิภาพในเที่ยวบินยาว" },
};

const PROFILE_ALIASES = { freestyle: "Freestyle", cinematic: "Cinematic", racing: "Racing", "long range": "Long Range", longrange: "Long Range" };

export function normalizeProfile(profile) {
  return PROFILE_ALIASES[String(profile || "").trim().toLowerCase()] || "Freestyle";
}

export const fpvDefaults = {
  battery: { cellCount: 4, capacityMah: 1300, cRating: 100, safetyMargin: 20, averageCurrentA: 25 },
  motorProp: { cellCount: 4, motorKv: 2400, motorSize: "2207", propDiameter: 5, propPitch: 3.5, bladeCount: 3, category: "Freestyle" },
  thrust: { auwGrams: 650, motorCount: 4, profile: "Freestyle" },
};
