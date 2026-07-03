import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPrimaryContact, getProjectSize, scoreOpportunity } from "@/lib/intelligence";
import type { ProjectDetail } from "@/lib/types";
import { money, shortDate } from "@/lib/utils";

export function ProjectResultCard({ project }: { project: ProjectDetail }) {
  const primaryContact = getPrimaryContact(project);
  const topSignals = project.signals.slice(0, 3);
  const opportunity = scoreOpportunity(project);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link href={`/projects/${project.id}`} className="text-xl font-semibold text-zinc-950 hover:underline">
            {project.name}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className="border-zinc-950 bg-zinc-950 text-white">Opportunity Score {opportunity.score}</Badge>
            <Badge>{project.status}</Badge>
            <Badge>{project.project_type}</Badge>
            <Badge>{getProjectSize(project)}</Badge>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Fact label="Estimated Value" value={money(project.estimated_value)} />
            <Fact label="Location" value={`${project.city}, ${project.county}`} />
            <Fact label="Primary Contact" value={primaryContact?.name ?? "No contact information available"} />
            <Fact label="Estimated Timeline" value={opportunity.timeline} />
            <Fact label="Source" value={project.source_name} />
            <Fact label="Last Updated" value={shortDate(project.updated_at)} />
            <Fact label="Signals" value={topSignals.map((signal) => signal.signal_type).join(", ") || "No signals"} />
          </dl>
          <div className="mt-4 rounded-md border border-zinc-100 bg-zinc-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Why this may be work</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-700">
              {opportunity.reasons.slice(0, 3).map((reason) => <li key={reason}>+ {reason}</li>)}
            </ul>
          </div>
        </div>
        <Link href={`/projects/${project.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white">
          Open Project
          <ExternalLink className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-800">{value}</dd>
    </div>
  );
}
