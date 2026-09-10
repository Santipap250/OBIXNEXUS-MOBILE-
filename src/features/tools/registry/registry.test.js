import assert from "node:assert/strict";
import test from "node:test";
import { TOOL_CATEGORIES, TOOL_REGISTRY, filterTools } from "./index.js";

test("tool registry has unique IDs and complete metadata", () => {
  const ids = TOOL_REGISTRY.map((tool) => tool.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 10);
  for (const tool of TOOL_REGISTRY) {
    for (const field of ["id", "label", "description", "category", "status", "icon", "color", "panel"]) {
      assert.equal(typeof tool[field], "string", `${tool.id} is missing ${field}`);
    }
    assert.ok(TOOL_CATEGORIES.includes(tool.category));
  }
});

test("registry preserves product statuses and panel capabilities", () => {
  const statuses = Object.fromEntries(TOOL_REGISTRY.map((tool) => [tool.id, tool.status]));
  assert.deepEqual(statuses, {
    configdoctor: "PREVIEW",
    obixcore: "COMING SOON",
    configfpv: "PREVIEW",
    configlab: "COMING SOON",
    pidadvisor: "READY",
    blackbox: "BETA",
    battery: "BETA",
    vtx: "BETA",
    motorprop: "READY",
    thrustplanner: "READY",
  });
  assert.equal(filterTools({ category: "Analysis" }).length, 2);
  assert.equal(filterTools({ query: "blackbox" })[0].id, "blackbox");
});
