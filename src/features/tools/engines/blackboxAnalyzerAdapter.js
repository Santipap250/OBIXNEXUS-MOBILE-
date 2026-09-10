import { analyzeBlackboxText } from "../../../lib/blackbox/analyzer.js";

let worker = null;
let workerPromise = null;
let workerUnavailable = false;
let requestId = 0;
const pending = new Map();

function settleWithFallback(request) {
  try {
    request.resolve(analyzeBlackboxText(request.fileName, request.text));
  } catch (error) {
    request.reject(error);
  }
}

function handleWorkerMessage(event) {
  const { requestId: responseId, ...result } = event.data || {};
  const request = pending.get(responseId);
  if (!request) return;
  pending.delete(responseId);
  request.resolve(result);
}

function handleWorkerFailure() {
  workerUnavailable = true;
  worker = null;
  workerPromise = null;
  for (const request of pending.values()) settleWithFallback(request);
  pending.clear();
}

function createWorker() {
  if (workerUnavailable || typeof Worker === "undefined") return Promise.resolve(null);
  if (!workerPromise) {
    // Promise.resolve(new Worker(...)) does not protect synchronous construction.
    workerPromise = Promise.resolve()
      .then(() => new Worker(new URL("./blackboxAnalyzer.worker.js", import.meta.url), { type: "module" }))
      .then((instance) => {
        worker = instance;
        worker.addEventListener("message", handleWorkerMessage);
        worker.addEventListener("error", handleWorkerFailure);
        return instance;
      })
      .catch(() => {
        workerUnavailable = true;
        workerPromise = null;
        return null;
      });
  }
  return workerPromise;
}

/**
 * UI-facing adapter. A single shared Worker is correlated by requestId so
 * concurrent analysis requests cannot resolve one another's promises.
 */
export async function analyzeBlackbox(fileName, text) {
  const instance = await createWorker();
  if (!instance) return analyzeBlackboxText(fileName, text);

  const id = ++requestId;
  return new Promise((resolve, reject) => {
    const request = { fileName, text, resolve, reject };
    pending.set(id, request);
    try {
      instance.postMessage({ requestId: id, fileName, text });
    } catch (error) {
      pending.delete(id);
      settleWithFallback(request);
      void error;
    }
  });
}

// Test-only reset hook; it is intentionally not part of the UI-facing API.
export function __resetBlackboxWorkerForTests() {
  worker?.terminate?.();
  worker = null;
  workerPromise = null;
  workerUnavailable = false;
  requestId = 0;
  pending.clear();
}

export function __pendingBlackboxRequestCountForTests() {
  return pending.size;
}
