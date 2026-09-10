import { analyzeBlackboxText } from "../../../lib/blackbox/analyzer.js";

let workerPromise;

function getWorker() {
  if (typeof Worker === "undefined") return null;
  if (!workerPromise) {
    workerPromise = Promise.resolve(new Worker(new URL("./blackboxAnalyzer.worker.js", import.meta.url), { type: "module" }));
  }
  return workerPromise;
}

/**
 * UI-facing adapter. The analyzer engine is isolated behind this boundary so
 * large logs can move to a worker without changing the Blackbox panel API.
 */
export async function analyzeBlackbox(fileName, text) {
  const worker = await getWorker();
  if (!worker) return analyzeBlackboxText(fileName, text);

  return new Promise((resolve, reject) => {
    const handleMessage = (event) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      resolve(event.data);
    };
    const handleError = (error) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      // Keep the local-first experience resilient if worker construction or
      // execution is unavailable in an older browser/webview.
      try { resolve(analyzeBlackboxText(fileName, text)); } catch (fallbackError) { reject(fallbackError); }
      void error;
    };
    worker.addEventListener("message", handleMessage, { once: true });
    worker.addEventListener("error", handleError, { once: true });
    worker.postMessage({ fileName, text });
  });
}
