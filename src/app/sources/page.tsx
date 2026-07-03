import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getSources } from "@/lib/data";
import { shortDate } from "@/lib/utils";

export default async function SourcesPage() {
  const rows = await getSources();
  return (
    <AppShell>
      <PageTitle title="Sources" eyebrow="Registry" />
      <Card><Table><thead><tr><Th>Source name</Th><Th>Type</Th><Th>Status</Th><Th>Last sync</Th><Th>Records collected</Th><Th>Base URL</Th></tr></thead><tbody>{rows.map((source) => <tr key={source.id}><Td className="font-medium text-zinc-950">{source.name}</Td><Td>{source.source_type}</Td><Td><Badge className={source.active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}>{source.active ? "Active" : "Paused"}</Badge></Td><Td>{shortDate(source.last_sync)}</Td><Td>{source.records_collected}</Td><Td><a href={source.base_url} target="_blank" rel="noreferrer" className="underline">{source.base_url}</a></Td></tr>)}</tbody></Table></Card>
    </AppShell>
  );
}

