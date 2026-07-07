# Sentinel Prospects Branding Audit

## Files changed

- `NETLIFY_DEPLOYMENT.md`
- `README.md`
- `reports/intelligence-summary.md`
- `reports/test-urls-and-searches.md`
- `scripts/generate-contractor-reports.mjs`
- `scripts/generate-intelligence-report.mjs`
- `src/app/dashboard/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/saved-projects/page.tsx`
- `src/app/search/page.tsx`
- `src/components/layout/app-shell.tsx`

## Remaining Sentinel Projects references

- `collectors/README.md` still says `Sentinel Projects Collector Framework`.

This was intentionally left untouched because the branding pass explicitly said not to modify collectors.

## Intentional project-domain references left untouched

- Routes such as `/projects` and `/projects/[id]`
- TypeScript names such as `Project`, `ProjectType`, `ProjectStatus`, `getProjects`, and `ProjectTable`
- Database and Supabase schema/table references using `projects`
- Collector normalization and collected project records
- Project detail pages and project record terminology where the word describes the underlying construction record/entity

## Navigation changes

- Global app brand changed from `Sentinel Projects` to `Sentinel Prospects`.
- Header/search shell now presents the app as Sentinel Prospects.
- Saved project page title changed to `Saved Opportunities`.
- Workspace title changed to `Prospects Workspace`.

## Homepage changes

- Popular search copy now uses opportunity language where it was previously brand-like project search language.
- `Projects starting within 90 days` changed to `Opportunities starting within 90 days`.
- Sacramento fencing card changed from project wording to opportunity wording.

## SEO changes

- Root metadata title changed to `Sentinel Prospects`.
- Root metadata description updated for construction opportunity intelligence.
- OpenGraph metadata added with `https://prospects.sentinelprime.org`.
- Netlify deployment target and Cloudflare DNS instructions updated to `prospects.sentinelprime.org`.
