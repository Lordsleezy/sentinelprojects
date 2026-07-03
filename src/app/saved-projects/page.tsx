import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card } from "@/components/ui/card";
import { ProjectTable } from "@/components/projects/project-table";
import { getProjects } from "@/lib/data";

export default async function SavedProjectsPage() {
  const projects = await getProjects();
  return (
    <AppShell>
      <PageTitle title="Saved Projects" eyebrow="Tracked opportunities" />
      <Card><ProjectTable rows={projects.slice(0, 12)} /></Card>
    </AppShell>
  );
}

