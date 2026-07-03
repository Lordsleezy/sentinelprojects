import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageTitle } from "@/components/layout/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { getSignals } from "@/lib/data";
import { shortDate } from "@/lib/utils";

export default async function RecentActivityPage() {
  const signals = await getSignals();
  return (
    <AppShell>
      <PageTitle title="Recent Activity" eyebrow="Latest construction signals" />
      <div className="space-y-3">
        {signals.slice(0, 25).map((signal) => (
          <Card key={signal.id}>
            <CardContent>
              <Link href={`/projects/${signal.project_id}`} className="font-semibold underline">{signal.signal_type}</Link>
              <p className="mt-1 text-sm text-zinc-600">{shortDate(signal.signal_date)} - Score {signal.importance_score} - {signal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

