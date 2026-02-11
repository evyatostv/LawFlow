"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cases, Case } from "@/lib/data";

const columns: ColumnDef<Case>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "caseNumber",
    header: "מספר תיק",
    cell: ({ row }) => (
      <Link className="font-semibold text-ink hover:underline" href={`/cases/${row.original.id}`}>
        {row.original.caseNumber}
      </Link>
    ),
  },
  {
    accessorKey: "court",
    header: "בית משפט",
  },
  {
    accessorKey: "opposingParty",
    header: "צד נגדי",
  },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
];

export default function CasesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">תיקים</h2>
          <p className="text-sm text-steel/70">סקירה של כל התיקים הפעילים</p>
        </div>
        <Button size="sm">פתח תיק</Button>
      </div>

      <DataTable data={cases} columns={columns} filterPlaceholder="חיפוש לפי מספר תיק, בית משפט" />
    </div>
  );
}
