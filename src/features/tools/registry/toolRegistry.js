import { seedTools } from "../../../data/seed.js";

/**
 * The single source of truth for tool discovery and presentation metadata.
 * Runtime behavior remains owned by the engines/panels; this registry only
 * describes what is available and how it should be surfaced.
 */
export const TOOL_REGISTRY = Object.freeze(seedTools.map((tool) => Object.freeze({ ...tool })));

export const TOOL_CATEGORIES = Object.freeze(["All", "Config", "Analysis", "Tuning", "Data"]);

export function getToolDefinition(toolId) {
  return TOOL_REGISTRY.find((tool) => tool.id === toolId);
}
