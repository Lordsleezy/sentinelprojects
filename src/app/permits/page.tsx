import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";
import { getFilterOptions, getPermits } from "@/lib/data";
import { money, shortDate } from "@/lib/utils";

export default async function PermitsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [rows, filters] = await Promise.all([getPermits(params), getFilterOptions()]);
  return (
    <AppShell>
      <PageTitle title="Permits" eyebrow={`${rows.length} records`} />
      <Card className="mb-5 p-4">
        <form className="grid gap-3 md:grid-cols-6">
          <Input name="q" placeholder="Search permits" defaultValue={params.q} className="md:col-span-2" />
          <Select name="permit_type" defaultValue={params.permit_type ?? ""}><option value="">Permit Type</option>{filters.permitTypes.map((v) => <option key={v}>{v}</option>)}</Select>
          <Select name="county" defaultValue={params.county ?? ""}><option value="">County</option>{filters.counties.map((v) => <option key={v}>{v}</option>)}</Select>
          <Input name="date" type="date" defaultValue={params.date} />
          <Select name="status" defaultValue={params.status ?? ""}><option value="">Status</option>{filters.permitStatuses.map((v) => <option key={v}>{v}</option>)}</Select>
          <Button className="md:col-start-6">Apply</Button>
        </form>
      </Card>
      <Card><Table><thead><tr><Th>Permit</Th><Th>Project</Th><Th>Type</Th><Th>Status</Th><Th>County</Th><Th>Value</Th><Th>Date</Th></tr></thead><tbody>{rows.map((permit) => <tr key={permit.id}><Td className="font-medium text-zinc-950">{permit.permit_number}</Td><Td><Link href={`/projects/${permit.project_id}`}>{permit.projects.name}</Link></Td><Td>{permit.permit_type}</Td><Td>{permit.permit_status}</Td><Td>{permit.projects.county}</Td><Td>{money(permit.permit_value)}</Td><Td>{shortDate(permit.permit_date)}</Td></tr>)}</tbody></Table></Card>
    </AppShell>
  );
}

