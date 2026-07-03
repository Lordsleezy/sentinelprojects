"use client";

import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, Td, Th } from "@/components/ui/table";

type Row = Record<string, unknown>;
type ImportResult = { inserted: number; updated: number; errors: string[]; mode: string } | null;

const schemaFields = [
  "name",
  "description",
  "project_type",
  "status",
  "city",
  "county",
  "state",
  "address",
  "latitude",
  "longitude",
  "estimated_units",
  "estimated_value",
  "source_url",
  "source_name",
] as const;

const requiredFields = ["name", "project_type", "status", "city", "county", "state", "address"] as const;

export function ImportWorkspace() {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ImportResult>(null);
  const [error, setError] = useState("");

  const mappedRows = useMemo(() => rows.map((row) => {
    const mapped: Row = {};
    Object.entries(mapping).forEach(([schemaField, sourceField]) => {
      if (sourceField) mapped[schemaField] = row[sourceField];
    });
    return mapped;
  }), [mapping, rows]);

  const validationErrors = useMemo(() => {
    return mappedRows.slice(0, 100).flatMap((row, index) =>
      requiredFields
        .filter((field) => !String(row[field] ?? "").trim())
        .map((field) => `Row ${index + 1}: missing ${field}`),
    );
  }, [mappedRows]);

  async function handleFile(file: File) {
    setError("");
    setResult(null);
    const extension = file.name.split(".").pop()?.toLowerCase();
    try {
      let parsed: Row[] = [];
      if (extension === "json") {
        const text = await file.text();
        const json = JSON.parse(text);
        parsed = Array.isArray(json) ? json : json.records ?? [];
      } else if (extension === "csv") {
        const text = await file.text();
        const workbook = XLSX.read(text, { type: "string" });
        parsed = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      } else if (extension === "xlsx" || extension === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        parsed = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      } else {
        throw new Error("Upload a CSV, JSON, XLS, or XLSX file.");
      }

      const nextColumns = Object.keys(parsed[0] ?? {});
      setRows(parsed);
      setColumns(nextColumns);
      setMapping(Object.fromEntries(schemaFields.map((field) => [field, nextColumns.find((column) => normalize(column) === normalize(field)) ?? ""])));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to parse file.");
    }
  }

  async function importRows() {
    setError("");
    setResult(null);
    const response = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: mappedRows }),
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Import failed.");
      return;
    }
    setResult(payload);
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Upload source file</h2>
            <p className="mt-1 text-sm text-zinc-500">Preview records, validate required fields, map columns, then import projects.</p>
          </div>
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white">
            <Upload className="size-4" />
            Choose file
            <input type="file" accept=".csv,.json,.xls,.xlsx" className="sr-only" onChange={(event) => event.target.files?.[0] && handleFile(event.target.files[0])} />
          </label>
        </CardContent>
      </Card>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {result ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Imported {result.inserted} records in {result.mode} mode. {result.updated} updated.</div> : null}

      {rows.length ? (
        <>
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Field Mapping</h2>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {schemaFields.map((field) => (
                <label key={field} className="grid gap-1 text-sm">
                  <span className="font-medium">{field}{requiredFields.includes(field as typeof requiredFields[number]) ? " *" : ""}</span>
                  <Select value={mapping[field] ?? ""} onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}>
                    <option value="">Not mapped</option>
                    {columns.map((column) => <option key={column}>{column}</option>)}
                  </Select>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Validation</h2>
                  <p className="mt-1 text-sm text-zinc-500">{rows.length.toLocaleString()} records detected. Showing first 100 validation checks.</p>
                </div>
                <Button onClick={importRows} disabled={validationErrors.length > 0}>Import</Button>
              </div>
            </CardHeader>
            <CardContent>
              {validationErrors.length ? (
                <ul className="space-y-1 text-sm text-red-700">{validationErrors.slice(0, 12).map((item) => <li key={item}>{item}</li>)}</ul>
              ) : (
                <p className="text-sm text-emerald-700">Validation passed.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h2 className="font-semibold">Preview</h2></CardHeader>
            <Table>
              <thead><tr>{schemaFields.slice(0, 8).map((field) => <Th key={field}>{field}</Th>)}</tr></thead>
              <tbody>
                {mappedRows.slice(0, 10).map((row, index) => (
                  <tr key={index}>{schemaFields.slice(0, 8).map((field) => <Td key={field}>{String(row[field] ?? "")}</Td>)}</tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

