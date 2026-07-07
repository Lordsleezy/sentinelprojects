import neo4j, { type Driver } from "neo4j-driver";
import type { IntelligenceGraph } from "./types";

export type Neo4jConfig = {
  uri: string;
  username: string;
  password: string;
};

export class Neo4jGraphService {
  private driver: Driver;

  constructor(config: Neo4jConfig) {
    this.driver = neo4j.driver(config.uri, neo4j.auth.basic(config.username, config.password));
  }

  async close() {
    await this.driver.close();
  }

  async upsertGraph(graph: IntelligenceGraph) {
    const session = this.driver.session();
    try {
      await session.executeWrite(async (tx) => {
        for (const node of graph.nodes) {
          await tx.run(
            `MERGE (n:${node.type} {id: $id})
             SET n.label = $label, n += $properties`,
            { id: node.id, label: node.label, properties: node.properties },
          );
        }
        for (const relationship of graph.relationships) {
          await tx.run(
            `MATCH (a {id: $from}), (b {id: $to})
             MERGE (a)-[r:${relationship.type} {id: $id}]->(b)
             SET r += $properties`,
            { from: relationship.from, to: relationship.to, id: relationship.id, properties: relationship.properties },
          );
        }
      });
    } finally {
      await session.close();
    }
  }
}

export function getNeo4jConfigFromEnv(): Neo4jConfig | null {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  if (!uri || !username || !password) return null;
  return { uri, username, password };
}

