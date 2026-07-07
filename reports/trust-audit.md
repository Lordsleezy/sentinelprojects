# Platform Trust Audit

Generated: 2026-07-07T07:10:39.962Z

## Trust Standard

A contractor should only see an opportunity when there is a real project, real evidence, real location, real contact path, and an explainable score.

## Findings

- No-contact/no-opportunity rule implemented in contractor-facing resolution layer.
- Duplicate trade cards should collapse into canonical project cards with all trades aggregated.
- Placeholder-looking records detected: 0
- Missing actionable contacts: 150

## Pages Reviewed

- Home: should stay search-first and avoid dashboard metrics.
- Search: should show only contractor-visible canonical projects.
- Project detail: should show eligibility status, opportunity score, fast money score, contacts, evidence, and map last.
- Dashboard: should remain supporting/internal.

## Looks Generated/Fake/Low Confidence

- Synthetic seed data with example.com/example.gov/555-style fields must remain internal or be clearly labeled.
- Any score without visible contributors should be considered untrusted.
- Any project with no contact route should not appear in contractor-facing opportunity results.

## Would A Contractor Call This Lead?

- Not reliably yet for all records. Contact enrichment is the highest-priority blocker.
