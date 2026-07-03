import type { NormalizedProjectRecord, RawSourceRecord } from "./types";

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) return Number(value.replace(/[$,]/g, ""));
  return null;
}

export function normalizePlanningRecord(record: RawSourceRecord): NormalizedProjectRecord {
  const payload = record.payload;
  return {
    project: {
      external_id: asText(payload.external_id),
      name: asText(payload.name, "Unnamed project"),
      description: asText(payload.description, "No description provided by source."),
      project_type: asText(payload.project_type, "Commercial") as NormalizedProjectRecord["project"]["project_type"],
      status: asText(payload.status, "Planning") as NormalizedProjectRecord["project"]["status"],
      city: asText(payload.city),
      county: asText(payload.county),
      state: asText(payload.state, "CA"),
      address: asText(payload.address),
      latitude: asNumber(payload.latitude) ?? 0,
      longitude: asNumber(payload.longitude) ?? 0,
      estimated_units: asNumber(payload.estimated_units),
      estimated_value: asNumber(payload.estimated_value),
      source_url: record.sourceUrl,
      source_name: record.sourceName,
    },
    permits: [],
    companies: [],
    documents: [],
  };
}

