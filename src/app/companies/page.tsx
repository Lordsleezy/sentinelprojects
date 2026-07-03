import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import { getCompanies } from "@/lib/data";

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const rows = await getCompanies(params.q ?? "");
  return (
    <AppShell>
      <PageTitle title="Companies" eyebrow={`${rows.length} organizations`} />
      <Card className="mb-5 p-4"><form className="flex gap-3"><Input name="q" placeholder="Search companies" defaultValue={params.q} /><Button>Search</Button></form></Card>
      <Card><Table><thead><tr><Th>Name</Th><Th>Type</Th><Th>City</Th><Th>Phone</Th><Th>Email</Th><Th>Notes</Th></tr></thead><tbody>{rows.map((company) => <tr key={company.id}><Td className="font-medium text-zinc-950">{company.name}</Td><Td>{company.company_type}</Td><Td>{company.city}, {company.state}</Td><Td>{company.phone ?? "N/A"}</Td><Td>{company.email ?? "N/A"}</Td><Td>{company.notes}</Td></tr>)}</tbody></Table></Card>
    </AppShell>
  );
}

