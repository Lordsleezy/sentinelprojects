import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getCollectedProjectDetails } from "@/lib/collected-data";
import { buildIntelligenceGraph, discoverGraphInsights } from "@/lib/graph/builder";
import { developersWithMoreThan, mostCommonTrades } from "@/lib/graph/queries";
import { getContractorVisibleProjects } from "@/lib/project-resolution";

export default function IntelligenceDashboardPage() {
  const projects = getCollectedProjectDetails();
  const graph = buildIntelligenceGraph(projects);
  const insights = discoverGraphInsights(graph);
  const visible = getContractorVisibleProjects(projects);
  const contacts = graph.nodes.filter((node) => node.type === "Contact");
  const companies = graph.nodes.filter((node) => node.type === "Company" || node.type === "Developer");
  const counties = graph.nodes.filter((node) => node.type === "County");
  const repeatDevelopers = developersWithMoreThan(graph, 3);
  const trades = mostCommonTrades(graph).slice(0, 10);

  return (
    <AppShell>
      <PageTitle title="Intelligence Graph" eyebrow="Internal relationship system" />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Projects" value={projects.length} />
        <Metric label="Companies / Developers" value={companies.length} />
        <Metric label="Contacts" value={contacts.length} />
        <Metric label="Relationships" value={graph.relationships.length} />
        <Metric label="Contact Coverage" value={`${Math.round((visible.length / Math.max(projects.length, 1)) * 100)}%`} />
        <Metric label="Graph Nodes" value={graph.nodes.length} />
        <Metric label="Counties" value={counties.length} />
        <Metric label="Insights" value={insights.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><h2 className="font-semibold">Most Connected Developers / Companies</h2></CardHeader>
          <Table>
            <thead><tr><Th>Entity</Th><Th>Projects</Th></tr></thead>
            <tbody>{repeatDevelopers.slice(0, 12).map((item) => <tr key={item.id}><Td className="font-medium text-zinc-950">{item.label}</Td><Td>{item.projects}</Td></tr>)}</tbody>
          </Table>
        </Card>
        <Card>
          <CardHeader><h2 className="font-semibold">Most Common Trades</h2></CardHeader>
          <Table>
            <thead><tr><Th>Trade</Th><Th>Projects</Th></tr></thead>
            <tbody>{trades.map((item) => <tr key={item.trade}><Td className="font-medium text-zinc-950">{item.trade}</Td><Td>{item.count}</Td></tr>)}</tbody>
          </Table>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><h2 className="font-semibold">Graph Discovery</h2></CardHeader>
        <CardContent className="grid gap-3">
          {insights.slice(0, 12).map((insight) => (
            <div key={`${insight.title}-${insight.entity_id}`} className="rounded-md border border-zinc-100 p-3">
              <p className="font-semibold text-zinc-950">{insight.title}</p>
              <p className="mt-1 text-sm text-zinc-600">{insight.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-950">{value}</p>
      </CardContent>
    </Card>
  );
}

