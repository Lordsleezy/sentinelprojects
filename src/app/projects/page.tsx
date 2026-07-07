import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { ProjectTable } from "@/components/projects/project-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getFilterOptions, getProjects } from "@/lib/data";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [rows, filters] = await Promise.all([getProjects(params), getFilterOptions()]);
  return (
    <AppShell>
      <PageTitle title="Project Records" eyebrow={`${rows.length} opportunities`} />
      <Card className="mb-5 p-4">
        <form className="grid gap-3 md:grid-cols-6">
          <Input name="q" placeholder="Search project records" defaultValue={params.q} className="md:col-span-2" />
          <Select name="city" defaultValue={params.city ?? ""}><option value="">City</option>{filters.cities.map((v) => <option key={v}>{v}</option>)}</Select>
          <Select name="county" defaultValue={params.county ?? ""}><option value="">County</option>{filters.counties.map((v) => <option key={v}>{v}</option>)}</Select>
          <Select name="project_type" defaultValue={params.project_type ?? ""}><option value="">Type</option>{filters.projectTypes.map((v) => <option key={v}>{v}</option>)}</Select>
          <Select name="status" defaultValue={params.status ?? ""}><option value="">Status</option>{filters.statuses.map((v) => <option key={v}>{v}</option>)}</Select>
          <Button className="md:col-start-6">Apply</Button>
        </form>
      </Card>
      <Card><ProjectTable rows={rows} /></Card>
    </AppShell>
  );
}
