import { getContractorCategories } from "../intelligence";
import { generateOpportunities } from "../opportunities";
import { resolveCanonicalProject } from "../project-resolution";
import type { ContactIntelligence, ProjectDetail } from "../types";
import { resolveEntityName } from "./entity-resolution";
import type { GraphInsight, GraphNode, GraphNodeType, GraphRelationship, GraphRelationshipType, IntelligenceGraph } from "./types";

type MutableGraph = {
  nodes: Map<string, GraphNode>;
  relationships: Map<string, GraphRelationship>;
  companyNames: string[];
};

export function buildIntelligenceGraph(projects: ProjectDetail[]): IntelligenceGraph {
  const graph: MutableGraph = { nodes: new Map(), relationships: new Map(), companyNames: [] };

  for (const project of projects) {
    const resolved = resolveCanonicalProject(project);
    const projectNode = nodeId("Project", project.id);
    upsertNode(graph, "Project", project.id, project.name, {
      status: project.status,
      project_type: project.project_type,
      city: project.city,
      county: project.county,
      score: resolved.score,
      fast_money_score: resolved.fast_money_score,
      contractor_visible: resolved.eligibility.contractor_visible,
      resolution_confidence: resolved.resolution_confidence,
    });

    upsertNode(graph, "City", project.city, project.city, {});
    upsertNode(graph, "County", project.county, project.county, {});
    relate(graph, projectNode, nodeId("City", project.city), "LOCATED_IN", {});
    relate(graph, projectNode, nodeId("County", project.county), "LOCATED_IN", {});

    if (project.address) {
      upsertNode(graph, "Property", project.address, project.address, { address: project.address, latitude: project.latitude, longitude: project.longitude });
      relate(graph, projectNode, nodeId("Property", project.address), "LOCATED_IN", {});
    }

    for (const company of project.companies) {
      const resolution = resolveEntityName(company.name, graph.companyNames);
      graph.companyNames.push(resolution.canonicalName);
      const companyType = company.role === "developer" ? "Developer" : "Company";
      upsertNode(graph, companyType, resolution.canonicalName, resolution.canonicalName, {
        company_type: company.company_type,
        city: company.city,
        state: company.state,
        website: company.website,
        phone: company.phone,
        email: company.email,
        resolution_confidence: resolution.confidence,
        resolution_source: resolution.source,
      });
      relate(graph, nodeId(companyType, resolution.canonicalName), projectNode, company.role === "architect" ? "DESIGNED" : "INVOLVED_IN", { role: company.role });
      if (company.role === "developer") relate(graph, nodeId(companyType, resolution.canonicalName), projectNode, "OWNS", { confidence: resolution.confidence });
    }

    for (const contact of resolved.contacts) {
      addContact(graph, contact, projectNode);
    }

    for (const permit of project.permits) {
      upsertNode(graph, "Permit", permit.id, permit.permit_number, {
        permit_type: permit.permit_type,
        permit_status: permit.permit_status,
        permit_date: permit.permit_date,
        permit_value: permit.permit_value,
      });
      relate(graph, projectNode, nodeId("Permit", permit.id), "REFERENCES", {});
    }

    for (const document of project.documents) {
      upsertNode(graph, "Document", document.id, document.title, {
        document_type: document.document_type,
        source_url: document.source_url,
        created_at: document.created_at,
      });
      relate(graph, projectNode, nodeId("Document", document.id), "REFERENCES", {});
    }

    for (const signal of project.signals) {
      upsertNode(graph, "Document", signal.id, signal.signal_type, {
        signal_type: signal.signal_type,
        signal_date: signal.signal_date,
        source: signal.source,
        importance_score: signal.importance_score,
      });
      relate(graph, projectNode, nodeId("Document", signal.id), "REFERENCES", { signal_type: signal.signal_type });
      if (signal.parcel_number) {
        upsertNode(graph, "Parcel", signal.parcel_number, signal.parcel_number, { jurisdiction: signal.jurisdiction ?? null });
        relate(graph, projectNode, nodeId("Parcel", signal.parcel_number), "REFERENCES", {});
      }
      if (signal.source) {
        upsertNode(graph, "Agency", signal.source, signal.source, {});
        relate(graph, nodeId("Agency", signal.source), projectNode, "DISCOVERED_FROM", { signal_type: signal.signal_type });
      }
    }

    for (const trade of new Set([...getContractorCategories(project), ...generateOpportunities(project).map((opportunity) => opportunity.trade)])) {
      upsertNode(graph, "Trade", trade, trade, {});
      relate(graph, projectNode, nodeId("Trade", trade), "REQUIRES", {});
    }
  }

  return {
    generated_at: new Date().toISOString(),
    nodes: [...graph.nodes.values()],
    relationships: [...graph.relationships.values()],
  };
}

export function discoverGraphInsights(graph: IntelligenceGraph): GraphInsight[] {
  const insights: GraphInsight[] = [];
  const projectRelationships = graph.relationships.filter((rel) => rel.to.startsWith("Project:") && ["INVOLVED_IN", "OWNS", "DESIGNED"].includes(rel.type));
  const byEntity = groupBy(projectRelationships, (rel) => rel.from);
  for (const [entityId, relationships] of byEntity.entries()) {
    const entity = graph.nodes.find((node) => node.id === entityId);
    if (!entity || relationships.length < 3) continue;
    insights.push({
      title: "Repeat developer or company",
      description: `${entity.label} appears on ${relationships.length} projects.`,
      entity_id: entity.id,
      entity_label: entity.label,
      score: Math.min(100, 50 + relationships.length * 8),
    });
  }

  const tradeRelationships = graph.relationships.filter((rel) => rel.type === "REQUIRES");
  const byTrade = groupBy(tradeRelationships, (rel) => rel.to);
  for (const [tradeId, relationships] of byTrade.entries()) {
    const trade = graph.nodes.find((node) => node.id === tradeId);
    if (!trade || relationships.length < 5) continue;
    insights.push({
      title: "Common trade pattern",
      description: `${trade.label} appears across ${relationships.length} projects.`,
      entity_id: trade.id,
      entity_label: trade.label,
      score: Math.min(100, 45 + relationships.length * 3),
    });
  }

  return insights.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

function addContact(graph: MutableGraph, contact: ContactIntelligence, projectNode: string) {
  const companyResolution = resolveEntityName(contact.company, graph.companyNames);
  graph.companyNames.push(companyResolution.canonicalName);
  upsertNode(graph, "Company", companyResolution.canonicalName, companyResolution.canonicalName, {
    website: contact.website,
    phone: contact.phone,
    email: contact.email,
    resolution_confidence: companyResolution.confidence,
  });
  if (contact.name) {
    upsertNode(graph, "Contact", contact.name, contact.name, {
      role: contact.role,
      confidence: contact.confidence,
      source: contact.source,
    });
    relate(graph, nodeId("Contact", contact.name), nodeId("Company", companyResolution.canonicalName), "WORKS_FOR", { confidence: contact.confidence });
    relate(graph, nodeId("Company", companyResolution.canonicalName), nodeId("Contact", contact.name), "EMPLOYS", { confidence: contact.confidence });
  }
  relate(graph, nodeId("Company", companyResolution.canonicalName), projectNode, "INVOLVED_IN", { role: contact.role, contact_confidence: contact.confidence });
}

function upsertNode(graph: MutableGraph, type: GraphNodeType, rawId: string, label: string, properties: GraphNode["properties"]) {
  const id = nodeId(type, rawId);
  graph.nodes.set(id, {
    id,
    type,
    label,
    properties: { ...(graph.nodes.get(id)?.properties ?? {}), ...properties },
  });
}

function relate(graph: MutableGraph, from: string, to: string, type: GraphRelationshipType, properties: GraphRelationship["properties"]) {
  const id = `${from}-${type}-${to}`;
  graph.relationships.set(id, { id, from, to, type, properties: { ...(graph.relationships.get(id)?.properties ?? {}), ...properties } });
}

function nodeId(type: GraphNodeType, rawId: string) {
  return `${type}:${slug(rawId)}`;
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function groupBy<T>(items: T[], fn: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(fn(item), [...(groups.get(fn(item)) ?? []), item]);
  return groups;
}
