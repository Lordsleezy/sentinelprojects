import fs from "node:fs";
import path from "node:path";
import { buildIntelligenceGraph, discoverGraphInsights } from "../src/lib/graph/builder.ts";
import { getCollectedProjectDetails } from "../src/lib/collected-data.ts";

const vault = path.join(process.cwd(), "obsidian-vault");
const projects = getCollectedProjectDetails();
const graph = buildIntelligenceGraph(projects);
const insights = discoverGraphInsights(graph);

for (const dir of ["Projects", "Companies", "Contacts", "Cities", "Counties", "Trades", "Developers", "Permits", "Documents", "Agencies", "Insights"]) {
  fs.mkdirSync(path.join(vault, dir), { recursive: true });
}

for (const node of graph.nodes) {
  const folder = folderFor(node.type);
  fs.writeFileSync(path.join(vault, folder, `${safeFile(node.label)}.md`), noteForNode(node, graph));
}

fs.writeFileSync(path.join(vault, "Insights", "Graph Discovery.md"), [
  "# Graph Discovery",
  "",
  ...insights.map((insight) => `## ${insight.title}\n\n${insight.description}\n\n${insight.entity_label ? `Entity: [[${insight.entity_label}]]` : ""}\n`),
].join("\n"));

fs.writeFileSync(path.join(vault, "README.md"), `# Sentinel Prospects Intelligence Vault

Generated: ${new Date().toISOString()}

This Obsidian vault is internal only. It exists for human graph exploration and intelligence analysis.

- Nodes: ${graph.nodes.length}
- Relationships: ${graph.relationships.length}

Start with [[Graph Discovery]].
`);

console.log(`Exported Obsidian vault with ${graph.nodes.length} notes.`);

function folderFor(type) {
  if (type === "Project") return "Projects";
  if (type === "Company") return "Companies";
  if (type === "Developer") return "Developers";
  if (type === "Contact") return "Contacts";
  if (type === "City") return "Cities";
  if (type === "County") return "Counties";
  if (type === "Trade") return "Trades";
  if (type === "Permit") return "Permits";
  if (type === "Agency") return "Agencies";
  return "Documents";
}

function noteForNode(node, graph) {
  const outgoing = graph.relationships.filter((rel) => rel.from === node.id);
  const incoming = graph.relationships.filter((rel) => rel.to === node.id);
  const lines = [
    "---",
    `type: ${node.type}`,
    `id: ${node.id}`,
    "---",
    "",
    `# ${node.label}`,
    "",
    "## Properties",
    "",
    ...Object.entries(node.properties).map(([key, value]) => `- ${key}: ${value ?? ""}`),
    "",
    "## Outgoing Relationships",
    "",
    ...outgoing.map((rel) => `- ${rel.type} -> [[${labelFor(rel.to, graph)}]]`),
    "",
    "## Incoming Relationships",
    "",
    ...incoming.map((rel) => `- [[${labelFor(rel.from, graph)}]] -> ${rel.type}`),
  ];
  return `${lines.join("\n")}\n`;
}

function labelFor(id, graph) {
  return graph.nodes.find((node) => node.id === id)?.label ?? id;
}

function safeFile(value) {
  return value
    .replace(/[\x00-\x1f<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120)
    || "Untitled";
}
