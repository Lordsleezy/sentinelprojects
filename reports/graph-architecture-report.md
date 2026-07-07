# Graph Architecture Report

Generated: 2026-07-07T07:24:56.262Z

## Decision

Default graph target: Neo4j.

Neo4j was selected as the default because it has mature self-managed and cloud deployment paths, the largest ecosystem around Cypher, durable JavaScript driver support, graph visualization tooling, and a clear path to future Graph Data Science usage.

Memgraph remains a viable later adapter because it supports Bolt/Cypher compatibility and can be attractive for real-time or in-memory workloads. The graph service is isolated so a Memgraph adapter can be added without replacing the application data model.

## Current Local Graph

- Nodes: 937
- Relationships: 1978
- Insights generated: 12

## Supported Nodes

Developer, Company, Contact, Project, Permit, Property, Parcel, City, County, Trade, Bid, Document, Agency.

## Supported Relationships

OWNS, LOCATED_IN, REFERENCES, REQUIRES, EMPLOYS, INVOLVED_IN, DESIGNED, WORKS_FOR, ASSOCIATED_WITH, DISCOVERED_FROM.

## Deployment Plan

1. Keep PostgreSQL/Supabase as source-of-record.
2. Build graph projections from normalized project/contact/evidence data.
3. Write graph projection to Neo4j through the graph-service adapter.
4. Use Cypher queries for relationship discovery, contact propagation candidates, repeat developer detection, and future AI analyst retrieval.
