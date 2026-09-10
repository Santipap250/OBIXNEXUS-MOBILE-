// Fleet domain operations. Every mutation of the drone fleet should go
// through one of these instead of a page component reaching into the
// drones array directly — pages orchestrate UI/state, these functions own
// the domain rules (Task 3).
//
// Framework-independent by design: every function here takes the current
// `drones` array and returns a new one. A React page wires this up as
// `setDrones(fleetService.updateDrone(drones, id, patch))`; nothing here
// depends on React.

import { createDrone, normalizeDrone } from "../model/drone.js";
import { createHistoryEvent } from "../model/historyEvent.js";

export function getDroneById(drones, id) {
  return drones.find((d) => d.id === id) || null;
}

/**
 * Add a new, user-created drone to the fleet.
 */
export function createDroneInFleet(drones, input) {
  const drone = createDrone(input);
  return [...drones, drone];
}

/**
 * Shallow-merge `patch` onto the drone with `id`, then re-normalize so an
 * invalid patch can't corrupt the stored shape. No-op if the drone isn't
 * found.
 */
export function updateDrone(drones, id, patch) {
  return drones.map((d) => (d.id === id
    ? normalizeDrone({ ...d, ...patch, updatedAt: new Date().toISOString() })
    : d));
}

export function deleteDrone(drones, id) {
  return drones.filter((d) => d.id !== id);
}

/**
 * Prepend a new history event to a drone's timeline.
 */
export function appendDroneHistory(drones, id, eventInput) {
  const event = createHistoryEvent(eventInput);
  return drones.map((d) => (d.id === id
    ? { ...d, history: [event, ...d.history], updatedAt: new Date().toISOString() }
    : d));
}

/**
 * Update only the live telemetry fields (battery/voltage/current/temp/
 * rpm/status) for a drone. A thin, named wrapper over updateDrone so
 * call sites read as intent ("update telemetry") rather than an
 * unqualified patch.
 */
export function updateTelemetry(drones, id, telemetryPatch) {
  const { battery, voltage, current, temp, rpm, status } = telemetryPatch;
  return updateDrone(drones, id, { battery, voltage, current, temp, rpm, status });
}

/**
 * Associate a successful (or failed) Blackbox analysis with a drone. Only
 * a summary is stored — never the raw log text/CSV/series data (Task 6,
 * Task 13: no large payloads in localStorage). Also appends a BLACKBOX
 * history event so Drone Detail / Digital Twin timelines pick it up.
 */
export function attachBlackboxResult(drones, id, analysisResult, { fileName } = {}) {
  if (!getDroneById(drones, id)) return drones;

  const summary = summarizeBlackboxResult(analysisResult);
  const now = new Date().toISOString();

  const withSummary = drones.map((d) => (d.id === id
    ? {
      ...d,
      blackbox: { lastAnalysis: summary, lastAnalyzedAt: now, lastLogFileName: fileName || null },
      updatedAt: now,
    }
    : d));

  return appendDroneHistory(withSummary, id, {
    type: "BLACKBOX",
    label: "Blackbox",
    detail: summary.ok
      ? `Analyzed ${fileName || "log"} — ${summary.health === "NEEDS_REVIEW" ? "needs review" : "normal"}`
      : `Analysis failed: ${summary.error || "unknown error"}`,
    source: "blackbox-tool",
  });
}

function summarizeBlackboxResult(result) {
  if (!result || result.ok === false) {
    return { ok: false, error: result?.error || "Analysis failed" };
  }
  const hasIndicator = Array.isArray(result.diagnostics)
    && result.diagnostics.some((finding) => finding.status === "INDICATOR");
  return {
    ok: true,
    health: hasIndicator ? "NEEDS_REVIEW" : "NORMAL",
    format: result.format?.format || null,
    sampleCount: result.metrics?.sampleCount ?? null,
    durationSeconds: result.metrics?.durationSeconds ?? null,
    findingCount: Array.isArray(result.diagnostics) ? result.diagnostics.length : 0,
  };
}
