import type { IntelligenceGraph } from "./types";

export function developersWithMoreThan(graph: IntelligenceGraph, count: number) {
  return entityProjectCounts(graph, ["Developer", "Company"]).filter((item) => item.projects >= count);
}

export function developersActiveInCounty(graph: IntelligenceGraph, county: string) {
  const countyNode = graph.nodes.find((node) => node.type === "County" && node.label.toLowerCase() === county.toLowerCase());
  if (!countyNode) return [];
  const countyProjects = new Set(graph.relationships.filter((rel) => rel.to === countyNode.id && rel.type === "LOCATED_IN").map((rel) => rel.from));
  return graph.relationships
    .filter((rel) => countyProjects.has(rel.to) && ["INVOLVED_IN", "OWNS"].includes(rel.type))
    .map((rel) => graph.nodes.find((node) => node.id === rel.from))
    .filter(Boolean);
}

export function projectsConnectedToVerifiedContacts(graph: IntelligenceGraph) {
  const verifiedCompanies = new Set(graph.relationships
    .filter((rel) => rel.type === "INVOLVED_IN" && Number(rel.properties.contact_confidence ?? 0) >= 0.65)
    .map((rel) => rel.to));
  return graph.nodes.filter((node) => verifiedCompanies.has(node.id));
}

export function mostCommonTrades(graph: IntelligenceGraph) {
  const counts = new Map<string, number>();
  for (const rel of graph.relationships.filter((item) => item.type === "REQUIRES")) {
    counts.set(rel.to, (counts.get(rel.to) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ trade: graph.nodes.find((node) => node.id === id)?.label ?? id, count }))
    .sort((a, b) => b.count - a.count);
}

function entityProjectCounts(graph: IntelligenceGraph, types: string[]) {
  return graph.nodes
    .filter((node) => types.includes(node.type))
    .map((node) => ({
      id: node.id,
      label: node.label,
      projects: graph.relationships.filter((rel) => rel.from === node.id && ["INVOLVED_IN", "OWNS", "DESIGNED"].includes(rel.type)).length,
    }))
    .sort((a, b) => b.projects - a.projects);
}

