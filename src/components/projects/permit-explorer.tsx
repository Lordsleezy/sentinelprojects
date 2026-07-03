"use client";

import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, Td, Th } from "@/components/ui/table";
import type { Permit } from "@/lib/types";
import { money, shortDate } from "@/lib/utils";

type SortKey = "permit_number" | "permit_type" | "permit_date" | "permit_value" | "permit_status";

export function PermitExplorer({ permits }: { permits: Permit[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("permit_date");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return permits
      .filter((permit) => [permit.permit_number, permit.permit_type, permit.permit_status].some((value) => value.toLowerCase().includes(q)))
      .sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const result = typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
        return direction === "asc" ? result : -result;
      });
  }, [direction, permits, query, sortKey]);

  function sort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey);
      setDirection("desc");
    }
  }

  const headers: Array<{ key: SortKey; label: string }> = [
    { key: "permit_number", label: "Permit Number" },
    { key: "permit_type", label: "Type" },
    { key: "permit_date", label: "Date" },
    { key: "permit_value", label: "Value" },
    { key: "permit_status", label: "Status" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-zinc-100 p-4">
        <Search className="size-4 text-zinc-400" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search permits" className="max-w-sm" />
      </div>
      <Table>
        <thead>
          <tr>
            {headers.map((header) => (
              <Th key={header.key}>
                <button className="inline-flex items-center gap-1" onClick={() => sort(header.key)}>
                  {header.label}
                  <ArrowDownUp className="size-3" />
                </button>
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((permit) => (
            <tr key={permit.id}>
              <Td className="font-medium text-zinc-950">{permit.permit_number}</Td>
              <Td>{permit.permit_type}</Td>
              <Td>{shortDate(permit.permit_date)}</Td>
              <Td>{money(permit.permit_value)}</Td>
              <Td>{permit.permit_status}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

