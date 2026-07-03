import { ExternalLink, Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectMap } from "@/components/map/project-map";
import { PermitExplorer } from "@/components/projects/permit-explorer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getProject } from "@/lib/data";
import { contactRoleLabels, getPrimaryContact, getProjectSize, scoreOpportunity, statusStages } from "@/lib/intelligence";
import { cn, money, shortDate } from "@/lib/utils";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const size = getProjectSize(project);
  const primaryContact = getPrimaryContact(project);
  const developer = project.companies.find((company) => company.role === "developer");
  const builder = project.companies.find((company) => company.role === "builder");
  const opportunity = scoreOpportunity(project);
  const currentStageIndex = statusStages.indexOf(project.status);

  return (
    <AppShell>
      <header className="mb-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm lg:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge>{project.project_type}</Badge>
              <Badge>{project.city}</Badge>
              <Badge>{project.county}</Badge>
            </div>
            <h1 className="max-w-5xl text-2xl font-semibold tracking-tight text-zinc-950 lg:text-4xl">{project.name}</h1>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-7">
              <HeaderFact label="Opportunity Score" value={String(opportunity.score)} strong />
              <HeaderFact label="Project Stage" value={project.status} />
              <HeaderFact label="Timeline" value={opportunity.timeline} />
              <HeaderFact label="Size / Value" value={`${size} / ${money(project.estimated_value)}`} />
              <HeaderFact label="Location" value={`${project.city}, ${project.county}`} />
              <HeaderFact label="Primary Contact" value={primaryContact?.name ?? "No contact information available"} />
              <HeaderFact label="Developer / Builder" value={`${developer?.name ?? "No developer"} / ${builder?.name ?? "No builder"}`} />
            </div>
          </div>
          <div className="min-w-56 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Current Stage</p>
            <p className="mt-1 text-lg font-semibold text-zinc-950">{project.status}</p>
            <p className="mt-1 text-sm text-zinc-500">Updated {shortDate(project.updated_at)}</p>
          </div>
        </div>
      </header>

      <div className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">Opportunity Analysis</h2>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-[14rem_1fr]">
              <div className="rounded-lg border border-zinc-950 bg-zinc-950 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-300">Opportunity Score</p>
                <p className="mt-2 text-5xl font-semibold">{opportunity.score}</p>
                <p className="mt-2 text-sm text-zinc-300">Estimated timeline: {opportunity.timeline}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Reasoning</p>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                    {opportunity.reasons.map((reason) => <li key={reason}>+ {reason}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Estimated Contractor Categories</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {opportunity.contractorCategories.map((category) => <Badge key={category}>{category}</Badge>)}
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Evidence</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {opportunity.evidence.slice(0, 4).map((item) => (
                      <Link key={item.label} href={item.href} className="text-sm font-medium underline">{item.label}</Link>
                    ))}
                  </div>
                  {opportunity.risks.length ? (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Caveats</p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-600">{opportunity.risks.map((risk) => <li key={risk}>- {risk}</li>)}</ul>
                    </>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-950">
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="size-5 text-zinc-700" />
                  <h2 className="text-lg font-semibold">Contacts</h2>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-zinc-950">Primary Contact: </span>
                  <span className="text-zinc-700">{primaryContact?.name ?? "No contact information available"}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {contactRoleLabels.map(({ role, label }) => {
                const contacts = project.companies.filter((company) => company.role === role);
                return (
                  <div key={role} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
                    {contacts.length ? contacts.map((company) => (
                      <div key={`${company.id}-${role}`} className="mt-3">
                        <p className="text-base font-semibold text-zinc-950">{company.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">{company.company_type} - {label}</p>
                        <div className="mt-3 space-y-2 text-sm">
                          <ContactLine icon={<Phone className="size-4" />} value={company.phone} />
                          <ContactLine icon={<Mail className="size-4" />} value={company.email} />
                          {company.website ? (
                            <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-700 underline">
                              <ExternalLink className="size-4" />
                              Website
                            </a>
                          ) : <ContactLine icon={<ExternalLink className="size-4" />} value={null} />}
                        </div>
                      </div>
                    )) : (
                      <p className="mt-3 text-sm text-zinc-500">No contact information available</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 id="signals" className="text-base font-semibold">Signals</h2>
          <p className="mt-1 text-sm text-zinc-500">Opportunity indicators detected before, during, and after permits.</p>
        </CardHeader>
        <Table>
          <thead>
            <tr><Th>Signal</Th><Th>Date</Th><Th>Importance</Th><Th>Description</Th><Th>Source</Th></tr>
          </thead>
          <tbody>
            {project.signals.map((signal) => (
              <tr key={signal.id}>
                <Td className="font-medium text-zinc-950">{signal.signal_type}</Td>
                <Td>{shortDate(signal.signal_date)}</Td>
                <Td>{signal.importance_score}</Td>
                <Td>{signal.description}</Td>
                <Td>{signal.source}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold">Permits</h2>
          <p className="mt-1 text-sm text-zinc-500">Supporting records, searchable and sortable.</p>
        </CardHeader>
        <PermitExplorer permits={project.permits} />
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold">Documents</h2>
        </CardHeader>
        <Table>
          <thead>
            <tr><Th>Title</Th><Th>Type</Th><Th>Date</Th><Th>Source</Th></tr>
          </thead>
          <tbody>
            {project.documents.map((doc) => (
              <tr key={doc.id}>
                <Td className="font-medium text-zinc-950">{doc.title}</Td>
                <Td>{doc.document_type}</Td>
                <Td>{shortDate(doc.created_at)}</Td>
                <Td><Link href={doc.source_url} className="underline">Open source</Link></Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold">Timeline</h2>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {statusStages.map((stage, index) => {
              const complete = index < currentStageIndex;
              const current = index === currentStageIndex;
              return (
                <li key={stage} className="flex items-center gap-3">
                  <span className={cn("size-3 rounded-full border", complete || current ? "border-zinc-950 bg-zinc-950" : "border-zinc-300 bg-white")} />
                  <span className={cn("text-sm", current ? "font-semibold text-zinc-950" : complete ? "text-zinc-700" : "text-zinc-400")}>{stage}</span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-base font-semibold">Source Records</h2>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-zinc-600">
          <p>{project.address}</p>
          <p>{project.source_name}</p>
          <a href={project.source_url} className="inline-flex items-center gap-2 font-medium text-zinc-950 underline" target="_blank" rel="noreferrer">
            Open source record
            <ExternalLink className="size-4" />
          </a>
        </CardContent>
      </Card>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-semibold">Map</h2>
        <ProjectMap projects={[project]} />
      </section>
    </AppShell>
  );
}

function HeaderFact({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-3", strong && "border-zinc-950 bg-zinc-950 text-white")}>
      <p className={cn("text-[11px] font-semibold uppercase tracking-wide text-zinc-500", strong && "text-zinc-300")}>{label}</p>
      <p className="mt-1 truncate font-semibold" title={value}>{value}</p>
    </div>
  );
}

function ContactLine({ icon, value }: { icon: React.ReactNode; value: string | null }) {
  if (!value) return <p className="flex items-center gap-2 text-zinc-500">{icon}No contact information available</p>;
  return <p className="flex items-center gap-2 text-zinc-700">{icon}{value}</p>;
}
