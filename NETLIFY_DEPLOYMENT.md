# Sentinel Prospects Netlify Deployment

Deployment target: `prospects.sentinelprime.org`

## Netlify Build Settings

Use these exact values when creating the Netlify site:

```text
Repository: https://github.com/Lordsleezy/sentinelprospect
Branch: main
Base directory: leave blank
Build command: npm run build
Publish directory: .next
```

Netlify supports Next.js with its OpenNext adapter. The app should deploy as a server-rendered Next.js site, not as a static export.

## Required Environment Variables

Set these in Netlify under Site configuration -> Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your Supabase anon/public key>
```

Collector-only variable, required only if running SAM.gov collection from the deployed environment:

```text
SAM_GOV_API_KEY=<your SAM.gov API key>
```

Do not commit real `.env` files. The repository intentionally commits only `.env.local.example` with placeholder values.

## Netlify Steps

1. Open Netlify.
2. Select Add new site -> Import an existing project.
3. Choose GitHub.
4. Select `Lordsleezy/sentinelprospect`.
5. Set branch to `main`.
6. Set Base directory to blank.
7. Set Build command to `npm run build`.
8. Set Publish directory to `.next`.
9. Add the required environment variables listed above.
10. Deploy the site.
11. After the first deploy succeeds, open Site configuration -> Domain management.
12. Add custom domain `prospects.sentinelprime.org`.
13. Copy the Netlify DNS target shown for the custom domain.

## Cloudflare DNS Steps

In Cloudflare for `sentinelprime.org`:

1. Open DNS -> Records.
2. Add a CNAME record:

```text
Type: CNAME
Name: prospects
Target: <your Netlify DNS target>
Proxy status: DNS only
TTL: Auto
```

3. Save the record.
4. Return to Netlify Domain management.
5. Click Verify DNS configuration.
6. Wait for Netlify to issue the SSL certificate.
7. Confirm `https://prospects.sentinelprime.org` loads the Sentinel Prospects app.

Keep the Cloudflare record DNS-only until Netlify verifies and provisions SSL. After SSL is healthy, leave DNS-only unless you intentionally want Cloudflare proxy behavior in front of Netlify.
