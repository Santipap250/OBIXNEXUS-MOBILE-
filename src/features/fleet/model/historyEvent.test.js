import assert from "node:assert/strict";
import test from "node:test";
import { createHistoryEvent, normalizeHistoryEvent, toLegacyTimelineEvent, HISTORY_EVENT_TYPE } from "./historyEvent.js";

test("createHistoryEvent produces a well-formed event", () => {
  const event = createHistoryEvent({ type: "CONFIG", label: "Config", detail: "ปรับ PID" });
  assert.ok(event.id);
  assert.ok(event.timestamp);
  assert.equal(event.type, "CONFIG");
  assert.equal(event.detail, "ปรับ PID");
});

test("createHistoryEvent falls back to NOTE for an unknown type", () => {
  const event = createHistoryEvent({ type: "NOT_A_REAL_TYPE", label: "?" });
  assert.equal(event.type, HISTORY_EVENT_TYPE.NOTE);
});

test("normalizeHistoryEvent migrates the legacy { t, label, detail, dot } shape", () => {
  const legacy = { t: "2025-06-12 20:45", label: "Blackbox", detail: "Flight Log #003", dot: "violet" };
  const event = normalizeHistoryEvent(legacy);
  assert.equal(event.type, "BLACKBOX");
  assert.equal(event.timestamp, "2025-06-12 20:45");
  assert.equal(event.detail, "Flight Log #003");
});

test("normalizeHistoryEvent returns null for unusable input", () => {
  assert.equal(normalizeHistoryEvent(null), null);
  assert.equal(normalizeHistoryEvent({}), null);
  assert.equal(normalizeHistoryEvent(5), null);
});

test("toLegacyTimelineEvent round-trips back to the shape Timeline renders", () => {
  const event = createHistoryEvent({ type: "RESULT", label: "Result", detail: "ประสิทธิภาพดีขึ้น" });
  const legacy = toLegacyTimelineEvent(event);
  assert.equal(legacy.t, event.timestamp);
  assert.equal(legacy.label, "Result");
  assert.equal(legacy.dot, "green");
});
