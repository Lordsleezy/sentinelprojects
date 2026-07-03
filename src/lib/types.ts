export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Government",
  "Mixed Use",
  "Infrastructure",
] as const;

export const STATUS_TYPES = [
  "Planning",
  "Proposed",
  "Approved",
  "Permitted",
  "Under Construction",
  "Completed",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type ProjectStatus = (typeof STATUS_TYPES)[number];
export type CompanyRole = "developer" | "builder" | "contractor" | "architect" | "engineer";
export type SignalType =
  | "Land Purchase"
  | "Rezoning"
  | "Planning Application"
  | "Subdivision Filing"
  | "Environmental Review"
  | "Permit"
  | "Groundbreaking"
  | "Construction Start"
  | "Utility Expansion"
  | "Infrastructure Project";

export type Project = {
  id: string;
  name: string;
  description: string;
  project_type: ProjectType;
  status: ProjectStatus;
  city: string;
  county: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  estimated_units: number | null;
  estimated_value: number | null;
  source_url: string;
  source_name: string;
  created_at: string;
  updated_at: string;
};

export type Permit = {
  id: string;
  project_id: string;
  permit_number: string;
  permit_type: string;
  permit_status: string;
  permit_date: string;
  permit_value: number | null;
  source_url: string;
  created_at: string;
};

export type Company = {
  id: string;
  name: string;
  company_type: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  city: string;
  state: string;
  notes: string | null;
};

export type ProjectCompany = {
  project_id: string;
  company_id: string;
  role: CompanyRole;
};

export type Document = {
  id: string;
  project_id: string;
  title: string;
  document_type: string;
  source_url: string;
  summary: string | null;
  created_at: string;
};

export type Source = {
  id: string;
  name: string;
  source_type: string;
  base_url: string;
  active: boolean;
  last_sync: string | null;
  records_collected: number;
};

export type Signal = {
  id: string;
  project_id: string;
  signal_type: SignalType;
  signal_date: string;
  description: string;
  source: string;
  importance_score: number;
};

export type ProjectDetail = Project & {
  permits: Permit[];
  documents: Document[];
  companies: Array<Company & { role: CompanyRole }>;
  signals: Signal[];
};
