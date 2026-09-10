import assert from "node:assert/strict";
import test from "node:test";
import {
  createDroneInFleet,
  updateDrone,
  deleteDrone,
  getDroneById,
  appendDroneHistory,
  updateTelemetry,
  attachBlackboxResult,
} from "./fleetService.js";
import { createDrone } from "../model/drone.js";

function fleetWithOneDrone() {
  return [createDrone({ id: "d1", name: "Test Drone" })];
}

test("createDroneInFleet appends a new drone without touching existing ones", () => {
  const drones = fleetWithOneDrone();
  const next = createDroneInFleet(drones, { name: "New Drone" });
  assert.equal(next.length, 2);
  assert.equal(next[0], drones[0]);
  assert.equal(next[1].name, "New Drone");
});

test("getDroneById finds by id and returns null when missing", () => {
  const drones = fleetWithOneDrone();
  assert.equal(getDroneById(drones, "d1").name, "Test Drone");
  assert.equal(getDroneById(drones, "missing"), null);
});

test("updateDrone patches only the matching drone and re-normalizes", () => {
  const drones = fleetWithOneDrone();
  const next = updateDrone(drones, "d1", { battery: 55 });
  assert.equal(next[0].battery, 55);
  assert.notEqual(next[0].updatedAt, null);
});

test("updateDrone is a no-op for an unknown id", () => {
  const drones = fleetWithOneDrone();
  const next = updateDrone(drones, "missing", { battery: 1 });
  assert.deepEqual(next, drones);
});

test("deleteDrone removes only the targeted drone", () => {
  const drones = [createDrone({ id: "d1", name: "A" }), createDrone({ id: "d2", name: "B" })];
  const next = deleteDrone(drones, "d1");
  assert.equal(next.length, 1);
  assert.equal(next[0].id, "d2");
});

test("appendDroneHistory prepends a new event", () => {
  const drones = fleetWithOneDrone();
  const next = appendDroneHistory(drones, "d1", { type: "CONFIG", label: "Config", detail: "ปรับ PID" });
  assert.equal(next[0].history.length, 1);
  assert.equal(next[0].history[0].type, "CONFIG");
});

test("updateTelemetry only touches telemetry fields", () => {
  const drones = fleetWithOneDrone();
  const next = updateTelemetry(drones, "d1", { battery: 42, voltage: 15, current: 3, temp: 30, rpm: 9000, status: "ONLINE" });
  assert.equal(next[0].battery, 42);
  assert.equal(next[0].status, "ONLINE");
  assert.equal(next[0].name, "Test Drone");
});

test("attachBlackboxResult stores only a summary, never raw samples, and logs a history event", () => {
  const drones = fleetWithOneDrone();
  const rawResult = {
    ok: true,
    format: { format: "csv" },
    metrics: { sampleCount: 4000, durationSeconds: 12.5, gyro: { available: true, series: [1, 2, 3] } },
    diagnostics: [{ status: "INDICATOR", why: "x", dataUsed: "y", next: "z" }],
  };
  const next = attachBlackboxResult(drones, "d1", rawResult, { fileName: "log1.csv" });
  const drone = getDroneById(next, "d1");

  assert.equal(drone.blackbox.lastLogFileName, "log1.csv");
  assert.equal(drone.blackbox.lastAnalysis.ok, true);
  assert.equal(drone.blackbox.lastAnalysis.health, "NEEDS_REVIEW");
  assert.equal(drone.blackbox.lastAnalysis.sampleCount, 4000);
  // No raw series/sample data should ever be persisted onto the drone.
  assert.equal(drone.blackbox.lastAnalysis.gyro, undefined);
  assert.equal(drone.blackbox.lastAnalysis.series, undefined);

  assert.equal(drone.history.length, 1);
  assert.equal(drone.history[0].type, "BLACKBOX");
});

test("attachBlackboxResult records a failed analysis honestly", () => {
  const drones = fleetWithOneDrone();
  const next = attachBlackboxResult(drones, "d1", { ok: false, error: "อ่านไฟล์ไม่สำเร็จ" }, { fileName: "bad.csv" });
  const drone = getDroneById(next, "d1");
  assert.equal(drone.blackbox.lastAnalysis.ok, false);
  assert.match(drone.history[0].detail, /failed/);
});

test("attachBlackboxResult is a no-op for an unknown drone", () => {
  const drones = fleetWithOneDrone();
  const next = attachBlackboxResult(drones, "missing", { ok: true, metrics: {}, diagnostics: [] });
  assert.deepEqual(next, drones);
});
