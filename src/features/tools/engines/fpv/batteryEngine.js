function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
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
  return { valid: true, nominalVoltage, energyWh, usableEnergyWh, maxTheoreticalCurrentA, estimateMinutes, rangeMinutes: estimateMinutes ? [estimateMinutes * 0.8, estimateMinutes * 1.2] : null, assumptions: [`${margin}% safety margin ถูกกันไว้ ไม่ใช้ความจุจนหมด`, "แรงดัน nominal ใช้ 3.7 V ต่อ cell; แรงดันจริงเปลี่ยนตามโหลดและสภาพแบตเตอรี่", estimateMinutes ? "เวลาเป็นช่วงประมาณจากกระแสเฉลี่ยที่ป้อน ไม่ใช่คำรับประกันการบินจริง" : "ยังไม่คำนวณเวลา เพราะยังไม่ได้ใส่กระแสเฉลี่ย"] };
}
