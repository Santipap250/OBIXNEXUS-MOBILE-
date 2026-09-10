export function recommendVtx({ desiredRange = "Medium", environment = "Open", legalPower = "unknown" }) {
  const range = ["Short", "Medium", "Long"].includes(desiredRange) ? desiredRange : "Medium";
  const env = ["Open", "Urban", "Indoor"].includes(environment) ? environment : "Open";
  const power = { Short: "ต่ำ", Medium: "กลาง", Long: "สูงเท่าที่กฎหมายและ hardware อนุญาต" }[range];
  const thermal = range === "Long" ? "ตรวจอุณหภูมิ VTX และ airflow เป็นพิเศษ" : "ยังควรตรวจอุณหภูมิเมื่อจอดนิ่ง";
  return { range, environment: env, suggestedPower: power, explanation: `${range} range ในสภาพแวดล้อม ${env}: เลือกกำลังเท่าที่จำเป็นเพื่อรักษาความร้อนและแบตเตอรี่`, notes: [`กำลังส่งเป็นคำแนะนำเชิงระดับ ไม่ใช่ค่ากฎหมายเฉพาะประเทศ (สถานะ legal setting: ${legalPower})`, env === "Urban" ? "ในพื้นที่เมืองให้ระวังสิ่งกีดขวางและ interference; power สูงไม่ได้รับประกัน range" : "ระยะจริงขึ้นกับเสาอากาศ การวางอุปกรณ์ สัญญาณรบกวน และภูมิประเทศ", thermal] };
}
