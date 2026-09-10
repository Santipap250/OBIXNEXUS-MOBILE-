import assert from "node:assert/strict";
import test from "node:test";
import {
  createDrone,
  normalizeDrone,
  createDefaultConfig,
  DRONE_STATUS,
  CONFIG_FIELD_STATE,
  DATA_SOURCE,
} from "./drone.js";

test("createDrone fills in sane defaults and marks the drone as user data", () => {
  const drone = createDrone({ name: "Test Rig" });
  assert.equal(drone.name, "Test Rig");
  assert.equal(drone.status, DRONE_STATUS.OFFLINE);
  assert.equal(drone.battery, 100);
  assert.equal(drone.dataSource, DATA_SOURCE.USER);
  assert.deepEqual(drone.history, []);
  assert.equal(drone.config.pid.state, CONFIG_FIELD_STATE.NOT_CONFIGURED);
  assert.ok(drone.id);
});

test("createDrone never silently displays fake configured data", () => {
  const drone = createDrone({ name: "Fresh Build" });
  for (const field of Object.values(drone.config)) {
    assert.notEqual(field.state, CONFIG_FIELD_STATE.CONFIGURED);
  }
});

test("normalizeDrone migrates a pre-Phase-4 flat drone shape", () => {
  const legacy = {
    id: "apex5",
    name: "Apex 5",
    type: "FPV Freestyle",
    cell: "4S",
    status: "ONLINE",
    battery: 78,
    voltage: 15.2,
    current: 12.4,
    temp: 42,
    rpm: 12340,
    flightTime: "18h 42m",
    firmware: "Betaflight 4.5.1",
    lastFlight: "2 ชม.ที่แล้ว",
    color: "cyan",
    history: [
      { t: "2025-06-14 14:32", label: "Build", detail: "Build #12", dot: "cyan" },
    ],
  };

  const drone = normalizeDrone(legacy);
  assert.equal(drone.id, "apex5");
  assert.equal(drone.battery, 78);
  // Legacy `firmware` string becomes a config field tagged as demo data,
  // never silently presented as a real configured value.
  assert.equal(drone.config.firmware.value, "Betaflight 4.5.1");
  assert.equal(drone.config.firmware.state, CONFIG_FIELD_STATE.DEMO);
  assert.equal(drone.config.pid.state, CONFIG_FIELD_STATE.NOT_CONFIGURED);
  assert.equal(drone.blackbox.lastAnalysis, null);
  assert.equal(drone.history.length, 1);
  assert.equal(drone.history[0].type, "BUILD");
  // Known seed drones are tagged as seeded demo data, not real user data.
  assert.equal(drone.dataSource, DATA_SOURCE.SEEDED_DEMO);
});

test("normalizeDrone is fail-soft against corrupt/partial input", () => {
  assert.equal(normalizeDrone(null), null);
  assert.equal(normalizeDrone(undefined), null);
  assert.equal(normalizeDrone("not an object"), null);
  assert.equal(normalizeDrone({}), null); // no id, no name to key off of

  const partial = normalizeDrone({ name: "Recovered Drone", battery: "not-a-number", history: "not-an-array" });
  assert.equal(partial.name, "Recovered Drone");
  assert.equal(partial.battery, 0);
  assert.deepEqual(partial.history, []);
  assert.equal(partial.status, DRONE_STATUS.OFFLINE);
});

test("normalizeDrone discards individually-corrupt history entries without failing the whole drone", () => {
  const drone = normalizeDrone({
    name: "Mixed History",
    history: [
      { t: "2025-01-01", label: "Config", detail: "ok" },
      null,
      42,
      { id: "ev1", timestamp: "2025-01-02T00:00:00Z", type: "TUNING", label: "Tuning", detail: "d", source: "user" },
    ],
  });
  assert.equal(drone.history.length, 2);
});

test("createDefaultConfig without a legacy firmware value stays honestly unconfigured", () => {
  const config = createDefaultConfig();
  assert.equal(config.firmware.state, CONFIG_FIELD_STATE.NOT_CONFIGURED);
  assert.equal(config.firmware.value, null);
});
