import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <AppShell>
      <PageTitle title="Admin" eyebrow="Operations" />
      <Card><CardContent><Link href="/admin/import" className="font-medium underline">Import construction records</Link></CardContent></Card>
    </AppShell>
  );
}
