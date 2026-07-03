import type { Company, Document, Permit, Project } from "../src/lib/types";

export type RawSourceRecord = {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  capturedAt: string;
  payload: Record<string, unknown>;
};

export type NormalizedProjectRecord = {
  project: Omit<Project, "id" | "created_at" | "updated_at"> & {
    external_id?: string;
  };
  permits?: Array<Omit<Permit, "id" | "project_id" | "created_at">>;
  companies?: Array<Omit<Company, "id"> & { role?: string }>;
  documents?: Array<Omit<Document, "id" | "project_id" | "created_at">>;
};

export type CollectorRunResult = {
  sourceName: string;
  rawRecords: RawSourceRecord[];
  normalizedRecords: NormalizedProjectRecord[];
};

