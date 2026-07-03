import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { ImportWorkspace } from "./workspace";

export default function AdminImportPage() {
  return (
    <AppShell>
      <PageTitle title="Admin Import" eyebrow="CSV, JSON, Excel" />
      <ImportWorkspace />
    </AppShell>
  );
}

