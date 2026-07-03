import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageTitle title="Settings" eyebrow="System preferences" />
      <Card><CardContent><p className="text-sm text-zinc-600">Settings foundation for future saved search alerts, source preferences, and workspace defaults.</p></CardContent></Card>
    </AppShell>
  );
}

