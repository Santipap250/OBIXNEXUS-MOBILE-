import { analyzeBlackboxText } from "../../../lib/blackbox/analyzer.js";

self.addEventListener("message", (event) => {
  const { requestId, fileName, text } = event.data || {};
  try {
    self.postMessage({ requestId, ...analyzeBlackboxText(fileName, text) });
  } catch (error) {
    self.postMessage({ requestId, ok: false, error: "วิเคราะห์ไฟล์ไม่สำเร็จ กรุณาลองไฟล์ text/CSV อื่น" });
    void error;
  }
});
