import { analyzeBlackboxText } from "../../../lib/blackbox/analyzer.js";

self.addEventListener("message", (event) => {
  const { fileName, text } = event.data || {};
  try {
    self.postMessage(analyzeBlackboxText(fileName, text));
  } catch (error) {
    self.postMessage({ ok: false, error: "วิเคราะห์ไฟล์ไม่สำเร็จ กรุณาลองไฟล์ text/CSV อื่น" });
    void error;
  }
});
