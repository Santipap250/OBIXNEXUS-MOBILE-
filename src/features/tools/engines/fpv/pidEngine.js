import { PID_STARTING_POINTS, normalizeProfile } from "./profiles.js";

export function recommendPid(profile = "Freestyle") {
  const selected = normalizeProfile(profile);
  return { profile: selected, ...PID_STARTING_POINTS[selected], explanation: PID_STARTING_POINTS[selected].why, disclaimer: "ค่าเหล่านี้เป็น conservative starting point เท่านั้น; final tune ต้องอ้างอิง noise, filters, motors, props, frame และลักษณะการบินจริง" };
}
