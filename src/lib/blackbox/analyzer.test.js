import test from "node:test";
import assert from "node:assert/strict";
import { analyzeBlackboxText, detectFormat } from "./analyzer.js";

const csv = `time,gyro[0],gyro[1],gyro[2],throttle,motor[0],motor[1]\n0,10,-5,3,400,500,510\n1000,20,-10,6,700,800,810\n2000,30,-15,9,900,990,995\n3000,15,-8,4,600,700,710\n`;

test("parses supported CSV and extracts deterministic metrics", () => {
  const first = analyzeBlackboxText("flight.csv", csv);
  assert.equal(first.ok, true);
  assert.deepEqual(first, analyzeBlackboxText("flight.csv", csv));
  assert.equal(first.metrics.sampleCount, 4);
  assert.equal(first.metrics.sampleRateHz, 1000);
  assert.equal(first.metrics.durationSeconds, 0.003);
  assert.equal(first.metrics.gyro.available, true);
  assert.equal(first.metrics.throttle.available, true);
  assert.equal(first.metrics.motorOutput.available, true);
});

test("supports comments and tab-separated text export", () => {
  const text = `# blackbox export\ntime\tgyro_roll\tgyro_pitch\tgyro_yaw\n0\t1\t2\t3\n1000\t2\t3\t4`;
  const result = analyzeBlackboxText("flight.txt", text);
  assert.equal(result.ok, true);
  assert.equal(result.metrics.roll.available, true);
  assert.equal(result.metrics.throttle.available, false);
  assert.equal(result.diagnostics.some((finding) => finding.status === "NOT AVAILABLE"), true);
});

test("handles empty, malformed, and unsupported input without throwing", () => {
  assert.equal(analyzeBlackboxText("empty.csv", "").ok, false);
  assert.equal(analyzeBlackboxText("bad.csv", "hello\nworld").ok, false);
  assert.equal(analyzeBlackboxText("flight.json", csv).format.supported, false);
  assert.equal(analyzeBlackboxText("flight.bbl", "\u0000binary").ok, false);
  assert.equal(detectFormat("flight.bbl", "time,gyro[0]\n0,1").format, "text-bbl");
});

test("handles boundary values and missing channels", () => {
  const result = analyzeBlackboxText("minimal.csv", "time,throttle\n0,0\n1000000,1000");
  assert.equal(result.ok, true);
  assert.equal(result.metrics.gyro.available, false);
  assert.equal(result.metrics.throttle.range, 1000);
  assert.equal(result.metrics.durationSeconds, 1);
});
