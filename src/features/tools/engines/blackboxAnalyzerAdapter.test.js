import assert from "node:assert/strict";
import test from "node:test";
import {
  __pendingBlackboxRequestCountForTests,
  __resetBlackboxWorkerForTests,
  analyzeBlackbox,
} from "./blackboxAnalyzerAdapter.js";

const csvA = "time,gyro_roll,throttle\n0,1,100\n1000,2,200";
const csvB = "time,gyro_roll,throttle\n0,10,700\n1000,20,800";

function flushAsyncWork() {
  return new Promise((resolve) => setImmediate(resolve));
}

class ControlledWorker {
  static instances = [];

  constructor() {
    ControlledWorker.instances.push(this);
    this.listeners = { message: [], error: [] };
    this.messages = [];
  }

  addEventListener(type, listener) {
    this.listeners[type].push(listener);
  }

  postMessage(message) {
    this.messages.push(message);
  }

  respond(message) {
    for (const listener of this.listeners.message) listener({ data: message });
  }

  fail() {
    for (const listener of this.listeners.error) listener(new Error("worker failed"));
  }

  terminate() {}
}

test.afterEach(() => {
  __resetBlackboxWorkerForTests();
  delete globalThis.Worker;
  ControlledWorker.instances = [];
});

test("falls back when Worker construction throws synchronously", async () => {
  globalThis.Worker = class ThrowingWorker {
    constructor() {
      throw new Error("Worker unavailable");
    }
  };

  const result = await analyzeBlackbox("fallback.csv", csvA);

  assert.equal(result.ok, true);
  assert.equal(result.metrics.sampleCount, 2);
  assert.equal(__pendingBlackboxRequestCountForTests(), 0);
});

test("correlates concurrent Worker responses by requestId", async () => {
  globalThis.Worker = ControlledWorker;

  const requestA = analyzeBlackbox("a.csv", csvA);
  const requestB = analyzeBlackbox("b.csv", csvB);
  await flushAsyncWork();

  const instance = ControlledWorker.instances[0];
  assert.equal(instance.messages.length, 2);
  const [messageA, messageB] = instance.messages;
  assert.notEqual(messageA.requestId, messageB.requestId);

  let aSettled = false;
  let bSettled = false;
  const resultA = requestA.then((result) => { aSettled = true; return result; });
  const resultB = requestB.then((result) => { bSettled = true; return result; });

  instance.respond({ requestId: messageB.requestId, ok: true, source: "B" });
  await flushAsyncWork();
  assert.equal(bSettled, true);
  assert.equal(aSettled, false);

  instance.respond({ requestId: messageA.requestId, ok: true, source: "A" });
  assert.deepEqual(await resultA, { ok: true, source: "A" });
  assert.deepEqual(await resultB, { ok: true, source: "B" });
  assert.equal(__pendingBlackboxRequestCountForTests(), 0);
});

test("recovers pending requests when Worker errors", async () => {
  globalThis.Worker = ControlledWorker;
  const resultPromise = analyzeBlackbox("error.csv", csvA);
  await flushAsyncWork();
  ControlledWorker.instances[0].fail();

  const result = await resultPromise;
  assert.equal(result.ok, true);
  assert.equal(result.metrics.sampleCount, 2);
  assert.equal(__pendingBlackboxRequestCountForTests(), 0);
});
