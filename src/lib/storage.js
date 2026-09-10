// Small reusable storage abstraction. Every persisted read/write in the
// app goes through this file instead of calling localStorage directly,
// so swapping to IndexedDB or a future backend later means editing one
// place, not every component.

const PREFIX = "obixnexus:";

function safeParse(raw, fallback) {
  try {
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const storage = {
  get(key, fallback = null) {
    if (typeof window === "undefined") return fallback;
    try {
      return safeParse(window.localStorage.getItem(PREFIX + key), fallback);
    } catch {
      // private browsing / storage disabled / quota exceeded — fail soft
      return fallback;
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // fail soft — app still works in-memory for the session
    }
  },
  remove(key) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* noop */
    }
  },
};

// Central registry of every key the app persists, so "reset local data"
// and any future migration code has one list to walk instead of
// duplicating key strings across files.
export const STORAGE_KEYS = {
  drones: "drones",
  droneSchemaVersion: "drones-schema-version",
  profile: "pilot-profile",
  lang: "lang",
  favoriteTools: "favorite-tools",
  recentActivity: "recent-activity",
};

export function resetAllLocalData() {
  Object.values(STORAGE_KEYS).forEach((k) => storage.remove(k));
}
