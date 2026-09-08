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

const PROFILE_ALIASES = {
  freestyle: "Freestyle",
  cinematic: "Cinematic",
  racing: "Racing",
  "long range": "Long Range",
  longrange: "Long Range",
};

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeProfile(profile) {
  return PROFILE_ALIASES[String(profile || "").trim().toLowerCase()] || "Freestyle";
}

export function calculateBattery({ cellCount, capacityMah, cRating, safetyMargin = 20, averageCurrentA = 0 }) {
  const cells = finite(cellCount);
  const capacity = finite(capacityMah);
  const c = finite(cRating);
  const margin = Math.min(80, Math.max(0, finite(safetyMargin, 20)));
  const current = finite(averageCurrentA);
  const valid = cells > 0 && capacity > 0 && c > 0;
  if (!valid) return { valid: false, reason: "cell count, capacity และ C rating ต้องมากกว่า 0" };

  const capacityAh = capacity / 1000;
  const nominalVoltage = cells * 3.7;
  const energyWh = nominalVoltage * capacityAh;
  const usableEnergyWh = energyWh * (1 - margin / 100);
  const maxTheoreticalCurrentA = capacityAh * c;
  const estimateMinutes = current > 0 ? (capacityAh * (1 - margin / 100) / current) * 60 : null;

  return {
    valid: true,
    nominalVoltage,
    energyWh,
    usableEnergyWh,
    maxTheoreticalCurrentA,
    estimateMinutes,
    rangeMinutes: estimateMinutes ? [estimateMinutes * 0.8, estimateMinutes * 1.2] : null,
    assumptions: [
      `${margin}% safety margin ถูกกันไว้ ไม่ใช้ความจุจนหมด`,
      "แรงดัน nominal ใช้ 3.7 V ต่อ cell; แรงดันจริงเปลี่ยนตามโหลดและสภาพแบตเตอรี่",
      estimateMinutes ? "เวลาเป็นช่วงประมาณจากกระแสเฉลี่ยที่ป้อน ไม่ใช่คำรับประกันการบินจริง" : "ยังไม่คำนวณเวลา เพราะยังไม่ได้ใส่กระแสเฉลี่ย",
    ],
  };
}

export function assessMotorProp({ cellCount, motorKv, motorSize, propDiameter, propPitch, bladeCount, category }) {
  const cells = finite(cellCount);
  const kv = finite(motorKv);
  const diameter = finite(propDiameter);
  const pitch = finite(propPitch);
  const blades = finite(bladeCount, 2);
  const size = String(motorSize || "").trim();
  const className = String(category || "").toLowerCase();
  const issues = [];
  const notes = [];

  if (cells <= 0 || kv <= 0 || diameter <= 0 || pitch <= 0 || blades <= 0) {
    return { status: "CAUTION", issues: ["ข้อมูลไม่ครบหรือมีค่าไม่ถูกต้อง"], explanation: "กรอก cell, KV, ขนาดใบพัด, pitch และจำนวนใบให้มากกว่า 0 ก่อนใช้งาน" };
  }
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
  return {
    status,
    issues,
    notes,
    explanation: status === "GOOD" ? "ชุดข้อมูลนี้ไม่ชนกับ heuristic เบื้องต้น แต่ยังไม่ใช่ผลทดสอบแรงขับจริง" : "พบเงื่อนไขที่ควรตรวจสอบก่อนจ่ายไฟหรือบินจริง",
  };
}

export function calculateThrust({ auwGrams, motorCount = 4, profile = "Freestyle" }) {
  const auw = finite(auwGrams);
  const motors = finite(motorCount);
  const selected = normalizeProfile(profile);
  const ratio = FLIGHT_PROFILES[selected].thrustToWeight;
  if (auw <= 0 || motors <= 0) return { valid: false, reason: "AUW และจำนวนมอเตอร์ต้องมากกว่า 0" };
  const totalTargetGrams = auw * ratio;
  return {
    valid: true,
    auwGrams: auw,
    targetRatio: ratio,
    totalTargetGrams,
    perMotorTargetGrams: totalTargetGrams / motors,
    profile: selected,
    explanation: FLIGHT_PROFILES[selected].description,
    assumptions: [
      `ใช้ target thrust-to-weight ratio ${ratio}:1 สำหรับโปรไฟล์ ${selected}`,
      "เป็นเป้าหมายประมาณเพื่อ sizing ไม่ใช่ thrust ที่มอเตอร์ชุดนี้ทำได้จริง",
      "ควรเทียบกับ thrust table ของ motor + prop + cell ที่ตรงรุ่น",
    ],
  };
}

export function recommendVtx({ desiredRange = "Medium", environment = "Open", legalPower = "unknown" }) {
  const range = ["Short", "Medium", "Long"].includes(desiredRange) ? desiredRange : "Medium";
  const env = ["Open", "Urban", "Indoor"].includes(environment) ? environment : "Open";
  const power = { Short: "ต่ำ", Medium: "กลาง", Long: "สูงเท่าที่กฎหมายและ hardware อนุญาต" }[range];
  const thermal = range === "Long" ? "ตรวจอุณหภูมิ VTX และ airflow เป็นพิเศษ" : "ยังควรตรวจอุณหภูมิเมื่อจอดนิ่ง";
  return {
    range,
    environment: env,
    suggestedPower: power,
    explanation: `${range} range ในสภาพแวดล้อม ${env}: เลือกกำลังเท่าที่จำเป็นเพื่อรักษาความร้อนและแบตเตอรี่`,
    notes: [
      `กำลังส่งเป็นคำแนะนำเชิงระดับ ไม่ใช่ค่ากฎหมายเฉพาะประเทศ (สถานะ legal setting: ${legalPower})`,
      env === "Urban" ? "ในพื้นที่เมืองให้ระวังสิ่งกีดขวางและ interference; power สูงไม่ได้รับประกัน range" : "ระยะจริงขึ้นกับเสาอากาศ การวางอุปกรณ์ สัญญาณรบกวน และภูมิประเทศ",
      thermal,
    ],
  };
}

export function recommendPid(profile = "Freestyle") {
  const selected = normalizeProfile(profile);
  return { profile: selected, ...PID_STARTING_POINTS[selected], explanation: PID_STARTING_POINTS[selected].why, disclaimer: "ค่าเหล่านี้เป็น conservative starting point เท่านั้น; final tune ต้องอ้างอิง noise, filters, motors, props, frame และลักษณะการบินจริง" };
}

export const fpvDefaults = {
  battery: { cellCount: 4, capacityMah: 1300, cRating: 100, safetyMargin: 20, averageCurrentA: 25 },
  motorProp: { cellCount: 4, motorKv: 2400, motorSize: "2207", propDiameter: 5, propPitch: 3.5, bladeCount: 3, category: "Freestyle" },
  thrust: { auwGrams: 650, motorCount: 4, profile: "Freestyle" },
};

export { finite };
