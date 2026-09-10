import assert from "node:assert/strict";
import test from "node:test";
import { loadDrones, STORAGE_SCHEMA_VERSION, __internal } from "./droneStorage.js";
import { DATA_SOURCE } from "../model/drone.js";

test("STORAGE_SCHEMA_VERSION is bumped for the Phase 4 domain model", () => {
  assert.equal(STORAGE_SCHEMA_VERSION, 2);
});

test("migrateDronesV1toV2 normalizes every legacy drone and drops unusable entries", () => {
  const v1 = [
    { id: "apex5", name: "Apex 5", battery: 78, history: [{ t: "2025-01-01", label: "Build", detail: "d1" }] },
    null,
    { id: "d123", name: "User Added", battery: 100, history: [] },
  ];
  const migrated = __internal.migrateDronesV1toV2(v1);
  assert.equal(migrated.length, 2);
  assert.equal(migrated[0].config.pid.state, "NOT_CONFIGURED");
  assert.equal(migrated[0].history[0].type, "BUILD");
  // A drone id following the old addDrone() pattern is treated as user
  // data, not seeded demo data.
  assert.equal(migrated[1].dataSource, DATA_SOURCE.USER);
});

test("migrateDronesV1toV2 is fail-soft against a non-array input", () => {
  assert.deepEqual(__internal.migrateDronesV1toV2(null), []);
  assert.deepEqual(__internal.migrateDronesV1toV2("not an array"), []);
});

test("loadDrones falls back to the seed fleet when nothing is persisted (node/no-window env)", () => {
  // In this test environment there is no `window`, so the underlying
  // storage.get always resolves to its fallback — this exercises the same
  // "nothing persisted yet" path a first-run browser would hit.
  const seed = [{ id: "apex5", name: "Apex 5", battery: 78, history: [] }];
  const drones = loadDrones(seed);
  assert.equal(drones.length, 1);
  assert.equal(drones[0].id, "apex5");
  assert.equal(drones[0].dataSource, DATA_SOURCE.SEEDED_DEMO);
});

test("loadDrones never throws on a garbage seed", () => {
  assert.doesNotThrow(() => loadDrones([null, undefined, 42, {}]));
  assert.deepEqual(loadDrones([null, undefined, 42, {}]), []);
});
