import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { shortDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectTable({ rows }: { rows: Project[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Project Name</Th>
          <Th>City</Th>
          <Th>County</Th>
          <Th>Type</Th>
          <Th>Status</Th>
          <Th>Updated</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((project) => (
          <tr key={project.id} className="hover:bg-zinc-50">
            <Td className="font-medium text-zinc-950"><Link href={`/projects/${project.id}`}>{project.name}</Link></Td>
            <Td>{project.city}</Td>
            <Td>{project.county}</Td>
            <Td>{project.project_type}</Td>
            <Td><Badge>{project.status}</Badge></Td>
            <Td>{shortDate(project.updated_at)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

