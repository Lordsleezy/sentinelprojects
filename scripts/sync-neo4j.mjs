import fs from "node:fs";
import path from "node:path";
import { Neo4jGraphService, getNeo4jConfigFromEnv } from "../src/lib/graph/neo4j-service.ts";

const graphPath = path.join(process.cwd(), "graph-service", "intelligence-graph.json");
if (!fs.existsSync(graphPath)) {
  throw new Error("Missing graph-service/intelligence-graph.json. Run npm run graph:export first.");
}

const config = getNeo4jConfigFromEnv();
if (!config) {
  throw new Error("Set NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD before syncing.");
}

const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
const service = new Neo4jGraphService(config);
await service.upsertGraph(graph);
await service.close();
console.log(`Synced ${graph.nodes.length} nodes and ${graph.relationships.length} relationships to Neo4j.`);

