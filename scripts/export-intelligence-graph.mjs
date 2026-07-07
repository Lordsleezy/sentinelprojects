import fs from "node:fs";
import path from "node:path";
import { buildIntelligenceGraph, discoverGraphInsights } from "../src/lib/graph/builder.ts";
import { getCollectedProjectDetails } from "../src/lib/collected-data.ts";

const outDir = path.join(process.cwd(), "graph-service");
fs.mkdirSync(outDir, { recursive: true });

const projects = getCollectedProjectDetails();
const graph = buildIntelligenceGraph(projects);
const insights = discoverGraphInsights(graph);

fs.writeFileSync(path.join(outDir, "intelligence-graph.json"), `${JSON.stringify(graph, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "graph-insights.json"), `${JSON.stringify(insights, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, "README.md"), graphReadme(graph, insights));
fs.writeFileSync(path.join("reports", "graph-architecture-report.md"), architectureReport(graph, insights));

console.log(`Exported ${graph.nodes.length} nodes and ${graph.relationships.length} relationships.`);

function graphReadme(graph, insights) {
  return `# Sentinel Prospects Graph Service

This directory contains the local graph export used before Neo4j is connected.

- Nodes: ${graph.nodes.length}
- Relationships: ${graph.relationships.length}
- Insights: ${insights.length}

Use \`npm run graph:sync\` after setting:

- \`NEO4J_URI\`
- \`NEO4J_USERNAME\`
- \`NEO4J_PASSWORD\`
`;
}

function architectureReport(graph, insights) {
  return `# Graph Architecture Report

Generated: ${new Date().toISOString()}

## Decision

Default graph target: Neo4j.

Neo4j was selected as the default because it has mature self-managed and cloud deployment paths, the largest ecosystem around Cypher, durable JavaScript driver support, graph visualization tooling, and a clear path to future Graph Data Science usage.

Memgraph remains a viable later adapter because it supports Bolt/Cypher compatibility and can be attractive for real-time or in-memory workloads. The graph service is isolated so a Memgraph adapter can be added without replacing the application data model.

## Current Local Graph

- Nodes: ${graph.nodes.length}
- Relationships: ${graph.relationships.length}
- Insights generated: ${insights.length}

## Supported Nodes

Developer, Company, Contact, Project, Permit, Property, Parcel, City, County, Trade, Bid, Document, Agency.

## Supported Relationships

OWNS, LOCATED_IN, REFERENCES, REQUIRES, EMPLOYS, INVOLVED_IN, DESIGNED, WORKS_FOR, ASSOCIATED_WITH, DISCOVERED_FROM.

## Deployment Plan

1. Keep PostgreSQL/Supabase as source-of-record.
2. Build graph projections from normalized project/contact/evidence data.
3. Write graph projection to Neo4j through the graph-service adapter.
4. Use Cypher queries for relationship discovery, contact propagation candidates, repeat developer detection, and future AI analyst retrieval.
`;
}

