import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { ProjectMap } from "@/components/map/project-map";
import { getProjects } from "@/lib/data";

export default async function MapPage() {
  const rows = await getProjects();
  return (
    <AppShell>
      <PageTitle title="Map" eyebrow={`${rows.length} mapped projects`} />
      <ProjectMap projects={rows} />
    </AppShell>
  );
}

