import { TOOL_DEFINITIONS } from "./definitions.js";

export const TOOL_CATEGORIES = Object.freeze(["All", "Config", "Analysis", "Tuning", "Data"]);
export const TOOL_REGISTRY = TOOL_DEFINITIONS;

export function getToolDefinition(toolId) {
  return TOOL_REGISTRY.find((tool) => tool.id === toolId);
}

export function filterTools({ category = "All", query = "" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  return TOOL_REGISTRY.filter((tool) => (
    (category === "All" || tool.category === category)
    && tool.label.toLowerCase().includes(normalizedQuery)
  ));
}
