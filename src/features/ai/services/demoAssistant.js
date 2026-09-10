// AI service boundary (Task 10).
//
// There is no real backend in this phase — this module still returns the
// same canned demonstration response as before. The point is that
// AIAssistant.jsx now calls one async function instead of owning a
// setTimeout + a hardcoded response object inline, so swapping this for
// a real API call later doesn't touch the UI component at all: any
// future implementation just needs to keep this same
// `respond(message, context) -> Promise<AssistantReply>` shape.

const SIMULATED_LATENCY_MS = 1200;

const DEMO_PID_SUGGESTION = { p: 48, i: 58, d: 32 };
const DEMO_NOTES = [
  "เหมาะกับ 4S / 6S",
  "เสถียรสำหรับ Freestyle",
  "แนะนำตรวจสอบ motor noise",
  "ปรับ filter ตาม Blackbox",
];

/**
 * @typedef {object} AssistantReply
 * @property {string} text
 * @property {{p:number,i:number,d:number}} [pid]
 * @property {string[]} [notes]
 */

/**
 * @param {string} message - the user's message (unused by the demo, kept
 *   in the signature so a real backend can use it without an API change).
 * @param {object} [context] - optional context, e.g. { droneId }.
 * @returns {Promise<AssistantReply>}
 */
export function respond(message, context = {}) {
  void message;
  void context;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "คำแนะนำจาก NEXUS AI (โหมดทดลอง) จากข้อมูลตัวอย่างและโหมด Freestyle แนะนำค่า PID เบื้องต้นดังนี้",
        pid: DEMO_PID_SUGGESTION,
        notes: DEMO_NOTES,
      });
    }, SIMULATED_LATENCY_MS);
  });
}

export const WELCOME_MESSAGE =
  "สวัสดีครับ ผมคือ NEXUS AI (โหมดทดลองในเครื่อง ไม่เชื่อมต่อบัญชีหรือ AI ภายนอก) พร้อมช่วยวิเคราะห์และแนะนำการตั้งค่าโดรนของคุณ ลองถามอะไรก็ได้เลยครับ";

export const SUGGESTIONS = [
  "ช่วยวิเคราะห์ PID ของ Apex 5",
  "แนะนำ Filter สำหรับ Freestyle",
  "อธิบาย RPM Filter คืออะไร",
];
