import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";

const searches = ["Roseville subdivisions", "Apartments approved", "Fence opportunities", "Warehouse developments"];

export default function SavedSearchesPage() {
  return (
    <AppShell>
      <PageTitle title="Saved Searches" eyebrow="Search workspace" />
      <div className="grid gap-3">
        {searches.map((search) => (
          <Card key={search}><CardContent><Link href={`/search?q=${encodeURIComponent(search)}`} className="font-medium underline">{search}</Link></CardContent></Card>
        ))}
      </div>
    </AppShell>
  );
}

