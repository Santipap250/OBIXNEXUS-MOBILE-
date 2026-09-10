// Versioned persistence for the drone fleet, built on top of the existing
// src/lib/storage.js abstraction (same `obixnexus:` namespace, same
// localStorage-backed fail-soft get/set — we are not introducing
// IndexedDB or a new storage backend).
//
// Pre-Phase-4 installs have drones in localStorage with no version tag at
// all (a flat array of the old drone shape). We treat that as schema
// version 1 and migrate forward. Prefer small, explicit, additive
// migrations over a generic migration framework, per the Phase 4 brief.

import { storage, STORAGE_KEYS } from "../../../lib/storage.js";
import { normalizeDrone, DATA_SOURCE } from "../model/drone.js";

export const STORAGE_SCHEMA_VERSION = 2;

// v1 -> v2: introduce config/blackbox/history-event domain shape.
// normalizeDrone already knows how to read the old flat shape, so the
// migration is just "run every drone through it."
function migrateDronesV1toV2(rawDrones) {
  if (!Array.isArray(rawDrones)) return [];
  return rawDrones
    .map((raw) => normalizeDrone(raw, { defaultDataSource: undefined }))
    .filter(Boolean);
}

// Keyed by the version being migrated *from*.
const MIGRATIONS = {
  1: migrateDronesV1toV2,
};

function normalizeAll(drones) {
  return Array.isArray(drones) ? drones.map((d) => normalizeDrone(d)).filter(Boolean) : [];
}

/**
 * Load the persisted drone fleet, migrating it to the current schema if
 * needed. Falls back to `fallbackSeed` (normalized) if nothing is
 * persisted yet, or if the persisted data is unreadable/corrupt — this
 * must never throw and never crash the app (Task 14).
 */
export function loadDrones(fallbackSeed = []) {
  const rawDrones = storage.get(STORAGE_KEYS.drones, null);

  if (rawDrones == null) {
    return normalizeAll(fallbackSeed).map((d) => ({ ...d, dataSource: d.dataSource || DATA_SOURCE.SEEDED_DEMO }));
  }

  try {
    const storedVersion = storage.get(STORAGE_KEYS.droneSchemaVersion, 1) || 1;
    let drones = rawDrones;
    for (let v = storedVersion; v < STORAGE_SCHEMA_VERSION; v += 1) {
      const migrate = MIGRATIONS[v];
      if (migrate) drones = migrate(drones);
    }
    const normalized = normalizeAll(drones);
    // Only fall back to seed data if there was truly nothing usable —
    // an intentionally-emptied fleet (user deleted every drone) must stay
    // empty, not silently reseed.
    if (normalized.length === 0 && (!Array.isArray(rawDrones) || rawDrones.length === 0)) {
      return normalizeAll(fallbackSeed);
    }
    return normalized;
  } catch {
    // Corrupt/unreadable persisted data — fail soft, don't crash the app.
    return normalizeAll(fallbackSeed);
  }
}

/**
 * Persist the current fleet at the current schema version. Always
 * normalizes on the way out so a bad in-memory mutation can't corrupt
 * storage.
 */
export function saveDrones(drones) {
  const safe = normalizeAll(drones);
  storage.set(STORAGE_KEYS.drones, safe);
  storage.set(STORAGE_KEYS.droneSchemaVersion, STORAGE_SCHEMA_VERSION);
}

// Exported for tests — not part of the app-facing API.
export const __internal = { migrateDronesV1toV2 };
