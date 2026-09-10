// The Drone domain model.
//
// One drone = one persistent source of truth. Fleet, Home, Drone Detail,
// Digital Twin, and Tools/Blackbox all read this same shape. Plain
// JavaScript objects on purpose — no classes, no ORM, per the Phase 4
// brief ("do not over-engineer this").
//
// Shape (grouped here for documentation; the object itself is flat at the
// top level so existing UI that reads drone.battery / drone.status /
// drone.color etc. keeps working unchanged):
//
//   Identity        id, name, type, cell, color, image
//   Telemetry       status, battery, voltage, current, temp, rpm
//   Metadata        firmware, frame, motor, prop
//   Operational     flightTime, lastFlight, history[]
//   Config/tuning   config: { pid, filters, rates, rpmFilter, motorOutput, firmware }
//   Blackbox link   blackbox: { lastAnalysis, lastAnalyzedAt, lastLogFileName }
//   Provenance      dataSource, createdAt, updatedAt

import { normalizeHistoryEvent } from "./historyEvent.js";

export const DRONE_STATUS = Object.freeze({
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  WARNING: "WARNING",
  MAINTENANCE: "MAINTENANCE",
});

// Whether a config field actually reflects something the user configured,
// a value that only exists because it was seeded as a demo, or nothing at
// all. Task 4/9: never display fake live data as real — this is the flag
// the UI checks before it does.
export const CONFIG_FIELD_STATE = Object.freeze({
  NOT_CONFIGURED: "NOT_CONFIGURED",
  DEMO: "DEMO",
  CONFIGURED: "CONFIGURED",
});

// Task 9: distinguish seeded demo drones from ones the user actually
// created/edited, so Home/Fleet never implies real hardware connectivity
// for data that was only ever a sample.
export const DATA_SOURCE = Object.freeze({
  SEEDED_DEMO: "SEEDED_DEMO",
  USER: "USER",
});

const KNOWN_SEED_IDS = new Set(["apex5", "ghostcine", "toothpick"]);

function makeConfigField(value = null, state = CONFIG_FIELD_STATE.NOT_CONFIGURED) {
  return { value, state };
}

export function createDefaultConfig(legacyFirmware = null) {
  return {
    pid: makeConfigField(),
    filters: makeConfigField(),
    rates: makeConfigField(),
    rpmFilter: makeConfigField(),
    motorOutput: makeConfigField(),
    firmware: legacyFirmware
      ? makeConfigField(legacyFirmware, CONFIG_FIELD_STATE.DEMO)
      : makeConfigField(),
  };
}

export function createEmptyBlackboxState() {
  return {
    // Summary/metadata only — never raw samples or CSV text (Task 6/13).
    lastAnalysis: null,
    lastAnalyzedAt: null,
    lastLogFileName: null,
  };
}

let idCounter = 0;
export function generateDroneId() {
  idCounter += 1;
  return `d${Date.now().toString(36)}${idCounter.toString(36)}`;
}

function numberOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function slugify(name) {
  const slug = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
  return slug || null;
}

function normalizeConfigField(raw) {
  if (raw && typeof raw === "object" && "value" in raw) {
    const state = Object.values(CONFIG_FIELD_STATE).includes(raw.state)
      ? raw.state
      : raw.value != null
        ? CONFIG_FIELD_STATE.DEMO
        : CONFIG_FIELD_STATE.NOT_CONFIGURED;
    return { value: raw.value ?? null, state };
  }
  if (raw != null) return { value: raw, state: CONFIG_FIELD_STATE.DEMO };
  return makeConfigField();
}

function normalizeConfig(raw, legacyFirmware) {
  const fallback = createDefaultConfig(legacyFirmware);
  if (!raw || typeof raw !== "object") return fallback;
  return {
    pid: normalizeConfigField(raw.pid),
    filters: normalizeConfigField(raw.filters),
    rates: normalizeConfigField(raw.rates),
    rpmFilter: normalizeConfigField(raw.rpmFilter),
    motorOutput: normalizeConfigField(raw.motorOutput),
    firmware: raw.firmware != null ? normalizeConfigField(raw.firmware) : fallback.firmware,
  };
}

function normalizeBlackbox(raw) {
  if (!raw || typeof raw !== "object") return createEmptyBlackboxState();
  return {
    lastAnalysis: raw.lastAnalysis && typeof raw.lastAnalysis === "object" ? raw.lastAnalysis : null,
    lastAnalyzedAt: raw.lastAnalyzedAt || null,
    lastLogFileName: raw.lastLogFileName || null,
  };
}

/**
 * Fail-soft normalization. Accepts anything — a well-formed drone, a
 * pre-Phase-4 flat drone, or a corrupt/partial object — and returns a
 * complete, well-typed drone object, or null if it's unusable (no name
 * or id to key off of). Never throws: a single malformed drone must not
 * crash Fleet/Home/Digital Twin (Task 14).
 *
 * @param {object} raw
 * @param {object} [opts]
 * @param {string} [opts.defaultDataSource] - dataSource to assume when the
 *   input predates Phase 4 and has none recorded.
 */
export function normalizeDrone(raw, opts = {}) {
  if (!raw || typeof raw !== "object") return null;

  const id = (typeof raw.id === "string" && raw.id.trim()) || slugify(raw.name || "");
  if (!id) return null;

  const history = Array.isArray(raw.history)
    ? raw.history.map(normalizeHistoryEvent).filter(Boolean)
    : [];

  const defaultDataSource = opts.defaultDataSource
    || (KNOWN_SEED_IDS.has(id) ? DATA_SOURCE.SEEDED_DEMO : DATA_SOURCE.USER);

  return {
    id,
    name: (typeof raw.name === "string" && raw.name.trim()) || "Untitled Drone",
    type: raw.type || "FPV Freestyle",
    cell: raw.cell || "4S",
    color: raw.color || "cyan",
    image: raw.image || null,

    status: Object.values(DRONE_STATUS).includes(raw.status) ? raw.status : DRONE_STATUS.OFFLINE,
    battery: numberOr(raw.battery, 0),
    voltage: numberOr(raw.voltage, 0),
    current: numberOr(raw.current, 0),
    temp: numberOr(raw.temp, 0),
    rpm: numberOr(raw.rpm, 0),

    flightTime: raw.flightTime || "0h 00m",
    lastFlight: raw.lastFlight || null,

    firmware: raw.firmware || raw.config?.firmware?.value || null,
    frame: raw.frame || raw.type || null,
    motor: raw.motor || null,
    prop: raw.prop || null,

    config: normalizeConfig(raw.config, raw.firmware),
    blackbox: normalizeBlackbox(raw.blackbox),

    history,

    dataSource: Object.values(DATA_SOURCE).includes(raw.dataSource) ? raw.dataSource : defaultDataSource,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}

/**
 * Create a brand-new, user-created drone from partial input (e.g. the
 * "add drone" form). Always dataSource: USER.
 */
export function createDrone(input = {}) {
  const now = new Date().toISOString();
  return normalizeDrone(
    {
      id: input.id || generateDroneId(),
      status: DRONE_STATUS.OFFLINE,
      battery: 100,
      voltage: 0,
      current: 0,
      temp: 24,
      rpm: 0,
      flightTime: "0h 00m",
      lastFlight: null,
      history: [],
      ...input,
      dataSource: DATA_SOURCE.USER,
      createdAt: input.createdAt || now,
      updatedAt: now,
    },
    { defaultDataSource: DATA_SOURCE.USER },
  );
}
