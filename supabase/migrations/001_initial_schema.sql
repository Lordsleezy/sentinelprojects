create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  project_type text not null check (project_type in ('Residential', 'Commercial', 'Industrial', 'Government', 'Mixed Use', 'Infrastructure')),
  status text not null check (status in ('Planning', 'Proposed', 'Approved', 'Permitted', 'Under Construction', 'Completed')),
  city text not null,
  county text not null,
  state text not null default 'CA',
  address text not null,
  latitude double precision,
  longitude double precision,
  estimated_units integer,
  estimated_value numeric,
  source_url text,
  source_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(city, '') || ' ' || coalesce(county, '') || ' ' || coalesce(project_type, '') || ' ' || coalesce(status, '')), 'C')
  ) stored
);

create table if not exists permits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  permit_number text not null unique,
  permit_type text not null,
  permit_status text not null,
  permit_date date,
  permit_value numeric,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_type text not null,
  website text,
  phone text,
  email text,
  city text,
  state text,
  notes text
);

create table if not exists project_companies (
  project_id uuid not null references projects(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  role text not null check (role in ('developer', 'builder', 'contractor', 'architect', 'engineer')),
  primary key (project_id, company_id, role)
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  document_type text not null,
  source_url text,
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  signal_type text not null check (signal_type in ('Land Purchase', 'Rezoning', 'Planning Application', 'Subdivision Filing', 'Environmental Review', 'Permit', 'Groundbreaking', 'Construction Start', 'Utility Expansion', 'Infrastructure Project')),
  signal_date date not null,
  description text not null,
  source text not null,
  importance_score integer not null default 50
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null,
  base_url text not null,
  active boolean not null default true,
  last_sync timestamptz,
  records_collected integer not null default 0
);

create index if not exists projects_search_idx on projects using gin(search_vector);
create index if not exists projects_county_idx on projects(county);
create index if not exists projects_city_idx on projects(city);
create index if not exists projects_type_idx on projects(project_type);
create index if not exists projects_status_idx on projects(status);
create index if not exists permits_project_idx on permits(project_id);
create index if not exists permits_type_idx on permits(permit_type);
create index if not exists permits_status_idx on permits(permit_status);
create index if not exists companies_name_idx on companies(name);
create index if not exists signals_project_idx on signals(project_id);
create index if not exists signals_type_idx on signals(signal_type);
create index if not exists signals_importance_idx on signals(importance_score desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
before update on projects
for each row execute function set_updated_at();
