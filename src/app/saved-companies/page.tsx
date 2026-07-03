import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getCompanies } from "@/lib/data";

export default async function SavedCompaniesPage() {
  const companies = await getCompanies();
  return (
    <AppShell>
      <PageTitle title="Saved Companies" eyebrow="Tracked organizations" />
      <Card>
        <Table>
          <thead><tr><Th>Name</Th><Th>Type</Th><Th>City</Th><Th>Phone</Th></tr></thead>
          <tbody>{companies.slice(0, 12).map((company) => <tr key={company.id}><Td className="font-medium text-zinc-950">{company.name}</Td><Td>{company.company_type}</Td><Td>{company.city}</Td><Td>{company.phone ?? "No contact information available"}</Td></tr>)}</tbody>
        </Table>
      </Card>
    </AppShell>
  );
}

