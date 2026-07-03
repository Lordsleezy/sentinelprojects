import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

const suggestedSearches = [
  "Fence Jobs Sacramento",
  "Roseville Subdivisions",
  "Commercial Projects",
  "New Housing Developments",
  "Concrete Opportunities",
];

export default function Home() {
  return (
    <AppShell wide>
      <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-base font-semibold text-zinc-950">Sentinel Projects</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">What construction opportunity are you looking for?</h1>
        <form action="/search" className="mt-8 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
          <input
            name="q"
            autoFocus
            placeholder="fence jobs sacramento, subdivisions in roseville, concrete opportunities..."
            className="h-14 flex-1 rounded-lg border border-zinc-300 bg-white px-5 text-lg shadow-sm outline-none focus:border-zinc-500"
          />
          <Button className="h-14 px-6 text-base">Search</Button>
        </form>
        <div className="mt-10 w-full text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Suggested Searches</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedSearches.map((search) => (
              <Link key={search} href={`/search?q=${encodeURIComponent(search)}`} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-400 hover:text-zinc-950">
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
