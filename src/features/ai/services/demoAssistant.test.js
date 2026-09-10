import assert from "node:assert/strict";
import test from "node:test";
import { respond, WELCOME_MESSAGE, SUGGESTIONS } from "./demoAssistant.js";

test("respond resolves with the demo assistant reply shape", async () => {
  const reply = await respond("ช่วยวิเคราะห์ PID ของ Apex 5");
  assert.equal(typeof reply.text, "string");
  assert.ok(reply.text.length > 0);
  assert.equal(typeof reply.pid.p, "number");
  assert.ok(Array.isArray(reply.notes));
});

test("respond does not require any context to resolve", async () => {
  const reply = await respond("hello");
  assert.ok(reply.text);
});

test("WELCOME_MESSAGE and SUGGESTIONS are non-empty for the UI to render immediately", () => {
  assert.ok(WELCOME_MESSAGE.length > 0);
  assert.ok(SUGGESTIONS.length > 0);
});
