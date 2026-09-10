// Domain event format for a drone's activity/history feed.
//
// The UI (Timeline component in components/ui.jsx) was built against a
// small ad-hoc shape: { t, label, detail, dot }. Phase 4 introduces a
// stable domain event shape without breaking that component — we keep
// `toLegacyTimelineEvent` as the one adapter point instead of touching
// Timeline's rendering.

export const HISTORY_EVENT_TYPE = Object.freeze({
  BUILD: "BUILD",
  CONFIG: "CONFIG",
  BLACKBOX: "BLACKBOX",
  TUNING: "TUNING",
  MAINTENANCE: "MAINTENANCE",
  RESULT: "RESULT",
  NOTE: "NOTE",
});

// Visual dot color per event type, matching the palette Timeline already
// understands (see components/ui.jsx).
const DOT_BY_TYPE = {
  BUILD: "cyan",
  CONFIG: "amber",
  BLACKBOX: "violet",
  TUNING: "amber",
  MAINTENANCE: "amber",
  RESULT: "green",
  NOTE: "cyan",
};

// Phase <4 history entries used their `label` as a de facto type. This maps
// those known labels back onto the new `type` enum during migration.
const TYPE_BY_LEGACY_LABEL = {
  Build: "BUILD",
  Config: "CONFIG",
  Blackbox: "BLACKBOX",
  Tuning: "TUNING",
  Maintenance: "MAINTENANCE",
  Result: "RESULT",
};

let counter = 0;
function generateEventId() {
  counter += 1;
  return `ev${Date.now().toString(36)}${counter.toString(36)}`;
}

/**
 * Create a new, well-formed history event.
 */
export function createHistoryEvent({ type, label, detail, source = "user", timestamp } = {}) {
  const resolvedType = HISTORY_EVENT_TYPE[type] ? type : HISTORY_EVENT_TYPE.NOTE;
  return {
    id: generateEventId(),
    timestamp: timestamp || new Date().toISOString(),
    type: resolvedType,
    label: label || resolvedType,
    detail: detail || "",
    source,
  };
}

/**
 * Fail-soft normalization. Accepts either the new domain shape or the
 * legacy `{ t, label, detail, dot }` shape (from pre-Phase-4 seed/local
 * data) and returns a well-formed domain event, or null if the entry is
 * unusable (never throws — a single corrupt entry must not crash Fleet,
 * Home, or Digital Twin).
 */
export function normalizeHistoryEvent(raw) {
  if (!raw || typeof raw !== "object") return null;

  // Already a domain event (has the new required fields).
  if (raw.id && raw.timestamp && raw.type) {
    return {
      id: String(raw.id),
      timestamp: raw.timestamp,
      type: HISTORY_EVENT_TYPE[raw.type] ? raw.type : HISTORY_EVENT_TYPE.NOTE,
      label: raw.label || raw.type,
      detail: raw.detail || "",
      source: raw.source || "unknown",
    };
  }

  // Legacy shape.
  if (raw.t || raw.label || raw.detail) {
    const type = TYPE_BY_LEGACY_LABEL[raw.label] || HISTORY_EVENT_TYPE.NOTE;
    return {
      id: generateEventId(),
      timestamp: raw.t || new Date().toISOString(),
      type,
      label: raw.label || type,
      detail: raw.detail || "",
      source: "legacy",
    };
  }

  return null;
}

/**
 * Adapter back to the shape the existing Timeline component renders.
 * This is the only place that needs to know about `t`/`dot`.
 */
export function toLegacyTimelineEvent(event) {
  return {
    t: event.timestamp,
    label: event.label,
    detail: event.detail,
    dot: DOT_BY_TYPE[event.type] || "cyan",
  };
}

export function toLegacyTimelineEvents(events) {
  return Array.isArray(events) ? events.map(toLegacyTimelineEvent) : [];
}
