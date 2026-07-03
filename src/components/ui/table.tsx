import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className="overflow-x-auto"><table className={cn("w-full min-w-[720px] text-left text-sm", className)}>{children}</table></div>;
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">{children}</th>;
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-zinc-100 px-4 py-3 align-middle text-zinc-700", className)}>{children}</td>;
}

