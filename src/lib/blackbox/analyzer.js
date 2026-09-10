const MAX_TEXT_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 100000;

const aliases = {
  time: ["time", "timeus", "timestamp", "microseconds", "looptime"],
  gyroRoll: ["gyro[0]", "gyro_roll", "rollgyro", "gyrox", "roll"],
  gyroPitch: ["gyro[1]", "gyro_pitch", "pitchgyro", "gyroy", "pitch"],
  gyroYaw: ["gyro[2]", "gyro_yaw", "yawgyro", "gyroz", "yaw"],
  throttle: ["throttle", "rccommand[3]", "rccommand3", "rc_throttle", "rc3"],
};

function canonical(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "_");
}

function toNumber(value) {
  const number = Number(String(value ?? "").trim());
  return Number.isFinite(number) ? number : null;
}

function splitLine(line, delimiter) {
  const result = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (char === delimiter && !quoted) { result.push(value.trim()); value = ""; } else value += char;
  }
  result.push(value.trim());
  return result;
}

function findDelimiter(line) {
  const candidates = [",", "\t", ";"];
  return candidates.reduce((best, delimiter) => (line.split(delimiter).length > line.split(best).length ? delimiter : best), ",");
}

function findHeader(lines) {
  for (let index = 0; index < Math.min(lines.length, 80); index += 1) {
    const line = lines[index].trim();
    if (!line || line.startsWith("#")) continue;
    const delimiter = findDelimiter(line);
    const columns = splitLine(line, delimiter).map(canonical);
    const recognized = columns.filter((column) => Object.values(aliases).some((names) => names.includes(column))).length;
    if (columns.length >= 2 && recognized > 0) return { index, delimiter, columns };
  }
  return null;
}

function findColumn(columns, names) {
  return columns.findIndex((column) => names.includes(column));
}

function average(values) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
function rms(values) { return values.length ? Math.sqrt(average(values.map((value) => value * value))) : null; }
function range(values) { return values.length ? Math.max(...values) - Math.min(...values) : null; }
function meanAbsDelta(values) { return values.length > 1 ? average(values.slice(1).map((value, index) => Math.abs(value - values[index]))) : null; }
function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))];
}

function normalizeSeries(values, maxPoints = 80) {
  if (values.length <= maxPoints) return values;
  const step = (values.length - 1) / (maxPoints - 1);
  return Array.from({ length: maxPoints }, (_, index) => values[Math.round(index * step)]);
}

function metricFor(values) {
  if (!values.length) return { available: false, label: "Not available in this log" };
  return { available: true, count: values.length, rms: rms(values), range: range(values), meanAbsDelta: meanAbsDelta(values), p95: percentile(values.map(Math.abs), 0.95), series: normalizeSeries(values) };
}

export function detectFormat(fileName, text) {
  const extension = String(fileName || "").toLowerCase().split(".").pop();
  if (!["csv", "bbl", "txt"].includes(extension)) return { supported: false, format: "unknown", reason: "รองรับเฉพาะ .csv, .bbl และ .txt" };
  if (!String(text || "").trim()) return { supported: false, format: extension, reason: "ไฟล์ว่างเปล่า" };
  if (String(text).includes("\u0000")) return { supported: false, format: extension, reason: "ตรวจพบข้อมูลไบนารี; MVP นี้ยังไม่แกล้งอ้างว่าอ่าน Betaflight binary .bbl ได้" };
  return { supported: true, format: extension === "bbl" ? "text-bbl" : extension };
}

export function analyzeBlackboxText(fileName, text) {
  const format = detectFormat(fileName, text);
  if (!format.supported) return { ok: false, format, error: format.reason };
  const source = String(text);
  if (new TextEncoder().encode(source).length > MAX_TEXT_BYTES) return { ok: false, format, error: "ไฟล์ใหญ่เกิน 5 MB สำหรับการวิเคราะห์บนอุปกรณ์รุ่นนี้" };
  const lines = source.split(/\r?\n/);
  const header = findHeader(lines);
  if (!header) return { ok: false, format, error: "ไม่พบ header แบบ CSV/text ที่รู้จัก เช่น time, gyro หรือ throttle" };

  const indexes = {
    time: findColumn(header.columns, aliases.time),
    gyroRoll: findColumn(header.columns, aliases.gyroRoll),
    gyroPitch: findColumn(header.columns, aliases.gyroPitch),
    gyroYaw: findColumn(header.columns, aliases.gyroYaw),
    throttle: findColumn(header.columns, aliases.throttle),
  };
  const motors = header.columns.map((column, index) => (/^(motor|motor_?output|motoroutput)\[?\d+\]?$/).test(column) ? index : -1).filter((index) => index >= 0);
  const rows = [];
  for (let index = header.index + 1; index < lines.length && rows.length < MAX_ROWS; index += 1) {
    const line = lines[index].trim();
    if (!line || line.startsWith("#")) continue;
    const cells = splitLine(line, header.delimiter);
    if (cells.length < header.columns.length) continue;
    rows.push(cells);
  }
  if (!rows.length) return { ok: false, format, error: "พบ header แต่ไม่มีข้อมูลตัวอย่างที่อ่านได้" };

  const valuesFor = (columnIndex) => columnIndex >= 0 ? rows.map((row) => toNumber(row[columnIndex])).filter((value) => value !== null) : [];
  const timeValues = valuesFor(indexes.time);
  const gyroRoll = valuesFor(indexes.gyroRoll); const gyroPitch = valuesFor(indexes.gyroPitch); const gyroYaw = valuesFor(indexes.gyroYaw);
  const throttle = valuesFor(indexes.throttle); const motorValues = motors.flatMap((index) => valuesFor(index));
  const gyroCombined = gyroRoll.concat(gyroPitch, gyroYaw);
  const sampleRate = timeValues.length > 1 ? calculateSampleRate(timeValues) : null;
  const durationSeconds = timeValues.length > 1 ? calculateDuration(timeValues) : null;
  const metrics = {
    sampleCount: rows.length,
    parsedRows: rows.length,
    sampleRateHz: sampleRate,
    durationSeconds,
    gyro: metricFor(gyroCombined),
    roll: metricFor(gyroRoll),
    pitch: metricFor(gyroPitch),
    yaw: metricFor(gyroYaw),
    throttle: metricFor(throttle),
    motorOutput: metricFor(motorValues),
  };
  const diagnostics = buildDiagnostics(metrics);
  return { ok: true, format, columns: header.columns, metrics, diagnostics, truncated: rows.length >= MAX_ROWS, assumptions: ["วิเคราะห์จากแถวข้อมูลที่อ่านได้เท่านั้น", "ค่า gyro และ motor ถูกสรุปเชิงสถิติ ไม่ใช่การวินิจฉัย tuning แบบ definitive", "เกณฑ์ diagnostics เป็น indicators เบื้องต้น ควรตรวจ Blackbox และ hardware เพิ่มเติม"] };
}

function calculateSampleRate(times) {
  const deltas = times.slice(1).map((value, index) => value - times[index]).filter((value) => value > 0);
  if (!deltas.length) return null;
  const median = percentile(deltas, 0.5);
  return median > 10 ? 1000000 / median : 1000 / median;
}

function calculateDuration(times) {
  const delta = times[times.length - 1] - times[0];
  if (delta <= 0) return null;
  return delta > 1000 ? delta / 1000000 : delta / 1000;
}

function finding(status, why, dataUsed, next) { return { status, why, dataUsed, next }; }

function buildDiagnostics(metrics) {
  const findings = [];
  if (!metrics.gyro.available) findings.push(finding("NOT AVAILABLE", "ไม่พบช่อง gyro ที่รองรับ", "gyro roll/pitch/yaw", "ส่งออก log ที่มี gyro data"));
  else if ((metrics.gyro.p95 || 0) > 800) findings.push(finding("INDICATOR", "ค่า gyro activity ระดับสูงอาจสัมพันธ์กับ noise หรือการสั่น", `gyro p95 absolute ${metrics.gyro.p95.toFixed(1)}`, "ตรวจ frame, motor/prop balance, mounting และดู gyro trace เพิ่ม"));
  else findings.push(finding("NO STRONG INDICATOR", "ไม่พบค่า gyro activity สูงตามเกณฑ์เบื้องต้น", `gyro p95 absolute ${(metrics.gyro.p95 || 0).toFixed(1)}`, "ตรวจ trace รายช่วงและ flight behavior จริง"));
  if (!metrics.throttle.available) findings.push(finding("NOT AVAILABLE", "ไม่พบ throttle channel", "throttle", "ส่งออก log ที่มี throttle หรือ RC command"));
  else if ((metrics.throttle.p95 || 0) > 850) findings.push(finding("INDICATOR", "เที่ยวบินมี throttle activity สูง อาจใช้กำลังมากหรือบินแบบ aggressive", `throttle p95 ${metrics.throttle.p95.toFixed(1)}`, "ตรวจ battery sag, motor temperature และ flight profile"));
  else findings.push(finding("NO STRONG INDICATOR", "ไม่พบ throttle activity สูงตามเกณฑ์เบื้องต้น", `throttle p95 ${(metrics.throttle.p95 || 0).toFixed(1)}`, "เปรียบเทียบกับช่วงที่เกิดอาการจริง"));
  if (!metrics.motorOutput.available) findings.push(finding("NOT AVAILABLE", "ไม่พบ motor output channels", "motor output", "ส่งออก log ที่มี motor[0..] หรือ motor output"));
  else if ((metrics.motorOutput.p95 || 0) > 950) findings.push(finding("INDICATOR", "motor output เข้าใกล้ saturation ในบางช่วง", `motor output p95 ${metrics.motorOutput.p95.toFixed(1)}`, "ตรวจ headroom, battery voltage และ prop load"));
  else findings.push(finding("NO STRONG INDICATOR", "ไม่พบ motor output saturation สูงตามเกณฑ์เบื้องต้น", `motor output p95 ${(metrics.motorOutput.p95 || 0).toFixed(1)}`, "ตรวจ motor traces แยกตัวเพื่อหาความไม่สมดุล"));
  return findings;
}

export const analyzerLimits = { maxTextBytes: MAX_TEXT_BYTES, maxRows: MAX_ROWS };
