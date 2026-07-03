import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { ProjectResultCard } from "@/components/search/project-result-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProject } from "@/lib/data";
import { scoreOpportunity } from "@/lib/intelligence";
import { globalSearch } from "@/lib/search";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = params.q ?? "";
  const results = await globalSearch(q);
  const projectDetails = (await Promise.all(results.projects.map((project) => getProject(project.id)))).filter(Boolean);
  const ranked = projectDetails
    .map((project) => ({ project: project!, opportunity: scoreOpportunity(project!) }))
    .sort((a, b) => b.opportunity.score - a.opportunity.score);

  return (
    <AppShell>
      <PageTitle title={q ? `Search: ${q}` : "Search"} eyebrow="Construction intelligence" />
      <Card className="mb-5 p-4">
        <form className="flex flex-col gap-3 sm:flex-row">
          <Input name="q" placeholder="roseville subdivisions, commercial hvac, projects by builder..." defaultValue={q} className="h-12 text-base" />
          <Button className="h-12 px-6">Search</Button>
        </form>
      </Card>
      {q ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <section className="space-y-4">
            {ranked.length ? ranked.map(({ project }) => <ProjectResultCard key={project.id} project={project} />) : (
              <Card><CardContent><p className="text-sm text-zinc-500">No project opportunities found.</p></CardContent></Card>
            )}
          </section>
          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <h2 className="font-semibold">Sentinel Analysis</h2>
                <p className="mt-1 text-sm text-zinc-500">Found {ranked.length} likely opportunities.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {ranked.slice(0, 4).map(({ project, opportunity }, index) => (
                  <div key={project.id} className="rounded-md border border-zinc-100 p-3">
                    <Link href={`/projects/${project.id}`} className="font-semibold underline">{index + 1}. {project.name}</Link>
                    <p className="mt-1 text-sm font-medium">Opportunity Score: {opportunity.score}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Why</p>
                    <ul className="mt-1 space-y-1 text-sm text-zinc-600">
                      {opportunity.reasons.slice(0, 4).map((reason) => <li key={reason}>+ {reason}</li>)}
                    </ul>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {opportunity.evidence.slice(0, 2).map((item) => (
                        <Link key={item.label} href={item.href} className="text-xs font-medium underline">Evidence: {item.label}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="font-semibold">Signal Evidence</h2></CardHeader>
              <CardContent className="space-y-3">
                {results.signals.slice(0, 8).map((signal) => (
                  <Link key={signal.id} href={`/projects/${signal.project_id}`} className="block rounded-md border border-zinc-100 p-3 hover:bg-zinc-50">
                    <p className="text-sm font-semibold">{signal.signal_type}</p>
                    <p className="mt-1 text-xs text-zinc-500">Score {signal.importance_score} - {signal.source}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><h2 className="font-semibold">Search Includes</h2></CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600">
                <p>Cities, counties, addresses</p>
                <p>Developers, builders, companies</p>
                <p>Project types and statuses</p>
                <p>Permit types and signal types</p>
                <p>Natural language opportunity phrases</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      ) : (
        <Card><CardContent><p className="text-sm text-zinc-500">Search for projects, signals, companies, permits, places, or opportunity phrases.</p></CardContent></Card>
      )}
    </AppShell>
  );
}
