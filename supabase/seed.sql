create or replace function seed_uuid(prefix text, n integer)
returns uuid as $$
  select (
    substr(md5(prefix || n::text), 1, 8) || '-' ||
    substr(md5(prefix || n::text), 9, 4) || '-' ||
    substr(md5(prefix || n::text), 13, 4) || '-' ||
    substr(md5(prefix || n::text), 17, 4) || '-' ||
    substr(md5(prefix || n::text), 21, 12)
  )::uuid;
$$ language sql immutable;

insert into companies (id, name, company_type, website, phone, email, city, state, notes)
select
  seed_uuid('company', gs),
  prefixes[1 + (gs % array_length(prefixes, 1))] || ' ' || suffixes[1 + ((gs * 3) % array_length(suffixes, 1))] || ' ' || gs,
  company_types[1 + (gs % array_length(company_types, 1))],
  case when gs % 9 = 0 then null else 'https://example.com/company-' || gs end,
  case when gs % 7 = 0 then null else '(916) 555-' || lpad((1000 + gs)::text, 4, '0') end,
  case when gs % 8 = 0 then null else 'estimating' || gs || '@example.com' end,
  cities[1 + (gs % array_length(cities, 1))],
  'CA',
  'Generated construction company for scale testing.'
from generate_series(1, 500) gs,
 lateral (select array['Sierra','Capital','Riverbend','Foothill','North Valley','Golden State','Granite','Summit','Pacific','Delta'] prefixes) p,
 lateral (select array['Development','Builders','Construction','Engineering','Design Group','Partners','Works','Infrastructure','Communities','Industrial'] suffixes) s,
 lateral (select array['Developer','Builder','General Contractor','Architect','Engineer','Specialty Contractor'] company_types) ct,
 lateral (select array['Sacramento','Elk Grove','Roseville','Rocklin','Auburn','El Dorado Hills','Placerville','Grass Valley','Nevada City','Marysville','Wheatland'] cities) c
on conflict (id) do nothing;

insert into projects (id, name, description, project_type, status, city, county, state, address, latitude, longitude, estimated_units, estimated_value, source_url, source_name, created_at, updated_at)
select
  seed_uuid('project', gs),
  city || ' ' || prefixes[1 + ((gs + 4) % array_length(prefixes, 1))] || ' ' || project_noun,
  project_type || ' project with public records indicating contractor-relevant scope, site work, utility coordination, and trade opportunities.',
  project_type,
  statuses[1 + ((gs * 3 + gs / 17) % array_length(statuses, 1))],
  city,
  county,
  'CA',
  (100 + gs) || ' ' || streets[1 + (gs % array_length(streets, 1))] || ', ' || city || ', CA',
  round((base_lat + (((gs % 37) - 18) * 0.008))::numeric, 5),
  round((base_lng + (((gs % 41) - 20) * 0.009))::numeric, 5),
  case when project_type = 'Residential' then 8 + ((gs * 11) % 520) when project_type = 'Mixed Use' then 24 + ((gs * 7) % 340) else null end,
  base_value + ((gs % 70) * 1150000),
  'https://example.gov/projects/' || gs,
  replace(county, ' County', '') || ' Public Records',
  now() - ((1000 - gs) || ' hours')::interval,
  now() - ((gs % 160) || ' hours')::interval
from generate_series(1, 1000) gs
cross join lateral (
  select project_types[1 + (gs % array_length(project_types, 1))] project_type
  from (select array['Residential','Commercial','Industrial','Government','Mixed Use','Infrastructure'] project_types) t
) pt
cross join lateral (
  select
    case ((gs * 2) % 5)
      when 0 then 'Sacramento County'
      when 1 then 'Placer County'
      when 2 then 'El Dorado County'
      when 3 then 'Nevada County'
      else 'Yuba County'
    end county
) co
cross join lateral (
  select
    case county
      when 'Sacramento County' then (array['Sacramento','Elk Grove','Folsom','Citrus Heights','Rancho Cordova','West Sacramento'])[1 + (gs % 6)]
      when 'Placer County' then (array['Roseville','Rocklin','Lincoln','Auburn','Loomis'])[1 + (gs % 5)]
      when 'El Dorado County' then (array['El Dorado Hills','Placerville','Cameron Park','Shingle Springs'])[1 + (gs % 4)]
      when 'Nevada County' then (array['Grass Valley','Nevada City','Penn Valley','Truckee'])[1 + (gs % 4)]
      else (array['Marysville','Linda','Olivehurst','Wheatland'])[1 + (gs % 4)]
    end city,
    case county when 'Sacramento County' then 38.58 when 'Placer County' then 38.79 when 'El Dorado County' then 38.73 when 'Nevada County' then 39.22 else 39.14 end base_lat,
    case county when 'Sacramento County' then -121.49 when 'Placer County' then -121.25 when 'El Dorado County' then -120.80 when 'Nevada County' then -121.03 else -121.59 end base_lng
) area
cross join lateral (
  select
    case project_type
      when 'Residential' then (array['Subdivision','Estates','Village','Homes','Ridge'])[1 + (gs % 5)]
      when 'Commercial' then (array['Retail Center','Market Hall','Office Pads','Business Park','Service Plaza'])[1 + (gs % 5)]
      when 'Industrial' then (array['Logistics Yard','Cold Storage','Warehouse','Industrial Park','Fabrication Facility'])[1 + (gs % 5)]
      when 'Government' then (array['Civic Works','Public Safety Center','Maintenance Yard','Library Renovation','County Facility'])[1 + (gs % 5)]
      when 'Mixed Use' then (array['Town Center','Village','Main Street District','Transit Village','Commons'])[1 + (gs % 5)]
      else (array['Solar Field','Bridge Package','Roadway Improvements','Water Facility','Utility Corridor'])[1 + (gs % 5)]
    end project_noun,
    case project_type when 'Residential' then 3500000 when 'Commercial' then 2200000 when 'Industrial' then 7500000 when 'Government' then 4500000 when 'Mixed Use' then 16000000 else 8000000 end base_value
) pv,
 lateral (select array['Planning','Proposed','Approved','Permitted','Under Construction','Completed'] statuses) st,
 lateral (select array['Sierra','Capital','Riverbend','Foothill','North Valley','Golden State','Granite','Summit','Pacific','Delta'] prefixes) pr,
 lateral (select array['Main St','Industrial Blvd','Foothill Rd','Market Dr','Airport Rd','Civic Center Way'] streets) sr
on conflict (id) do nothing;

insert into permits (id, project_id, permit_number, permit_type, permit_status, permit_date, permit_value, source_url, created_at)
select
  seed_uuid('permit', gs),
  seed_uuid('project', 1 + ((gs - 1) % 1000)),
  upper(substr(county, 1, 3)) || '-26-' || (10000 + gs),
  permit_types[1 + ((gs * 2) % array_length(permit_types, 1))],
  permit_statuses[1 + ((gs * 5) % array_length(permit_statuses, 1))],
  current_date - ((gs % 180) || ' days')::interval,
  round((estimated_value * (0.03 + ((gs % 18)::numeric / 100)))::numeric, 0),
  'https://example.gov/permits/' || (10000 + gs),
  now() - ((gs % 180) || ' days')::interval
from generate_series(1, 5000) gs
join projects on projects.id = seed_uuid('project', 1 + ((gs - 1) % 1000)),
 lateral (select array['Grading','Building','Commercial Shell','Subdivision Improvement','Electrical','Mechanical','Solar Facility','Public Works','Warehouse Addition','Design Review'] permit_types) pt,
 lateral (select array['Submitted','In Review','Approved','Issued','Finaled','Pending'] permit_statuses) ps
on conflict (permit_number) do nothing;

insert into project_companies (project_id, company_id, role)
select
  seed_uuid('project', project_n),
  seed_uuid('company', 1 + (((project_n * 7) + (role_n * 31)) % 500)),
  roles[role_n]
from generate_series(1, 1000) project_n,
 lateral (select array['developer','builder','contractor','architect','engineer'] roles) r,
 generate_series(1, 5) role_n
on conflict do nothing;

insert into documents (id, project_id, title, document_type, source_url, summary, created_at)
select
  seed_uuid('document', gs),
  seed_uuid('project', 1 + ((gs - 1) % 1000)),
  projects.name || ' ' || case when gs % 2 = 0 then 'Site Plan Package' else 'Planning Staff Report' end,
  case when gs % 2 = 0 then 'Site Plan' else 'Staff Report' end,
  'https://example.gov/documents/' || gs || '.pdf',
  'Generated document summary for scale testing.',
  now() - ((gs % 120) || ' days')::interval
from generate_series(1, 2000) gs
join projects on projects.id = seed_uuid('project', 1 + ((gs - 1) % 1000));

insert into signals (id, project_id, signal_type, signal_date, description, source, importance_score)
select
  seed_uuid('signal', gs),
  seed_uuid('project', 1 + ((gs - 1) % 1000)),
  signal_types[1 + ((gs * 3) % array_length(signal_types, 1))],
  current_date - ((gs % 220) || ' days')::interval,
  signal_types[1 + ((gs * 3) % array_length(signal_types, 1))] || ' detected for ' || projects.name || '. This may indicate upcoming contractor opportunity.',
  projects.source_name,
  least(100, 45 + (gs % 35))
from generate_series(1, 3500) gs
join projects on projects.id = seed_uuid('project', 1 + ((gs - 1) % 1000)),
 lateral (select array['Land Purchase','Rezoning','Planning Application','Subdivision Filing','Environmental Review','Permit','Groundbreaking','Construction Start','Utility Expansion','Infrastructure Project'] signal_types) st;

insert into sources (name, source_type, base_url, active, last_sync, records_collected) values
('Sacramento Public Records', 'Planning Portal', 'https://example.gov/sacramento-county', true, now() - interval '1 hour', 1180),
('Placer Public Records', 'Permit Portal', 'https://example.gov/placer-county', true, now() - interval '2 hours', 1040),
('El Dorado Public Records', 'Planning Agendas', 'https://example.gov/el-dorado-county', true, now() - interval '3 hours', 930),
('Nevada Public Records', 'Open Data', 'https://example.gov/nevada-county', true, now() - interval '4 hours', 760),
('Yuba Public Records', 'Capital Projects', 'https://example.gov/yuba-county', false, now() - interval '8 days', 520)
on conflict (name) do update set
source_type = excluded.source_type,
base_url = excluded.base_url,
active = excluded.active,
last_sync = excluded.last_sync,
records_collected = excluded.records_collected;
