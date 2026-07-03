import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const allowedTypes = new Set(["Residential", "Commercial", "Industrial", "Government", "Mixed Use", "Infrastructure"]);
const allowedStatuses = new Set(["Planning", "Proposed", "Approved", "Permitted", "Under Construction", "Completed"]);

export async function POST(request: Request) {
  const { rows } = await request.json();
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: "Rows must be an array." }, { status: 400 });
  }

  const normalized = rows.map((row) => ({
    name: text(row.name),
    description: text(row.description) || "Imported project record.",
    project_type: text(row.project_type),
    status: text(row.status),
    city: text(row.city),
    county: text(row.county),
    state: text(row.state) || "CA",
    address: text(row.address),
    latitude: number(row.latitude),
    longitude: number(row.longitude),
    estimated_units: number(row.estimated_units),
    estimated_value: number(row.estimated_value),
    source_url: text(row.source_url),
    source_name: text(row.source_name) || "Bulk Import",
  }));

  const errors = normalized.flatMap((row, index) => {
    const rowErrors: string[] = [];
    if (!row.name) rowErrors.push(`Row ${index + 1}: missing name`);
    if (!allowedTypes.has(row.project_type)) rowErrors.push(`Row ${index + 1}: invalid project_type`);
    if (!allowedStatuses.has(row.status)) rowErrors.push(`Row ${index + 1}: invalid status`);
    if (!row.city) rowErrors.push(`Row ${index + 1}: missing city`);
    if (!row.county) rowErrors.push(`Row ${index + 1}: missing county`);
    if (!row.address) rowErrors.push(`Row ${index + 1}: missing address`);
    return rowErrors;
  });

  if (errors.length) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
  }

  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ inserted: normalized.length, updated: 0, errors: [], mode: "preview-no-supabase" });
  }

  const { error } = await db.from("projects").insert(normalized);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inserted: normalized.length, updated: 0, errors: [], mode: "supabase" });
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function number(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

