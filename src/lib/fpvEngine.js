export {
  FLIGHT_PROFILES,
  PID_STARTING_POINTS,
  fpvDefaults,
  normalizeProfile,
  calculateBattery,
  assessMotorProp,
  calculateThrust,
  recommendVtx,
  recommendPid,
} from "../features/tools/engines/fpv/index.js";

export function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
