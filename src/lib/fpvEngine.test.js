import test from "node:test";
import assert from "node:assert/strict";
import {
  assessMotorProp,
  calculateBattery,
  calculateThrust,
  normalizeProfile,
  recommendPid,
  recommendVtx,
} from "./fpvEngine.js";

test("battery calculation is deterministic and includes assumptions", () => {
  const input = { cellCount: 4, capacityMah: 1300, cRating: 100, safetyMargin: 20, averageCurrentA: 25 };
  const first = calculateBattery(input);
  assert.deepEqual(first, calculateBattery(input));
  assert.equal(first.nominalVoltage, 14.8);
  assert.equal(first.maxTheoreticalCurrentA, 130);
  assert.ok(first.assumptions.length >= 3);
});

test("battery rejects zero, negative, and missing values", () => {
  assert.equal(calculateBattery({ cellCount: 0, capacityMah: 1300, cRating: 100 }).valid, false);
  assert.equal(calculateBattery({ cellCount: 4, capacityMah: -1, cRating: 100 }).valid, false);
  assert.equal(calculateBattery({ cellCount: 4, capacityMah: 1300 }).valid, false);
});

test("battery clamps safety margin to a safe range", () => {
  const result = calculateBattery({ cellCount: 4, capacityMah: 1000, cRating: 50, safetyMargin: 200, averageCurrentA: 10 });
  assert.ok(Math.abs(result.usableEnergyWh - 2.96) < 1e-9);
  assert.ok(Math.abs(result.rangeMinutes[0] - 0.96) < 1e-9);
});

test("thrust target changes by flight profile", () => {
  const freestyle = calculateThrust({ auwGrams: 650, motorCount: 4, profile: "Freestyle" });
  const cinematic = calculateThrust({ auwGrams: 650, motorCount: 4, profile: "Cinematic" });
  assert.equal(freestyle.totalTargetGrams, 5200);
  assert.ok(freestyle.totalTargetGrams > cinematic.totalTargetGrams);
  assert.equal(calculateThrust({ auwGrams: 0, motorCount: 4 }).valid, false);
});

test("motor prop evaluator distinguishes a reasonable and risky setup", () => {
  const good = assessMotorProp({ cellCount: 4, motorKv: 2400, motorSize: "2207", propDiameter: 5, propPitch: 3.5, bladeCount: 3, category: "Freestyle" });
  const risky = assessMotorProp({ cellCount: 6, motorKv: 3000, motorSize: "2207", propDiameter: 7, propPitch: 6, bladeCount: 3, category: "Long Range" });
  assert.equal(good.status, "GOOD");
  assert.equal(risky.status, "NOT RECOMMENDED");
  assert.match(assessMotorProp({ cellCount: 0 }).explanation, /กรอก/);
});

test("profiles normalize and PID recommendations explain limitations", () => {
  assert.equal(normalizeProfile("longrange"), "Long Range");
  const result = recommendPid("Racing");
  assert.equal(result.profile, "Racing");
  assert.ok(result.disclaimer.includes("final tune"));
});

test("VTX helper does not claim legal certainty", () => {
  const result = recommendVtx({ desiredRange: "Long", environment: "Urban", legalPower: "unknown" });
  assert.equal(result.suggestedPower, "สูงเท่าที่กฎหมายและ hardware อนุญาต");
  assert.ok(result.notes.some((note) => note.includes("กฎหมาย")));
});
