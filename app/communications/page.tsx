"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { communications } from "@/lib/data";

type CommunicationRow = typeof communications[number];

const columns: ColumnDef<CommunicationRow>[] = [
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
  { accessorKey: "timestamp", header: "זמן" },
  {
    accessorKey: "type",
    header: "ערוץ",
    cell: ({ row }) => <Badge>{row.original.type}</Badge>,
  },
  { accessorKey: "summary", header: "סיכום" },
  {
    accessorKey: "attachments",
    header: "קבצים",
    cell: ({ row }) => row.original.attachments.length,
  },
];

export default function CommunicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">יומן תקשורת</h2>
          <p className="text-sm text-steel/70">תיעוד שיחות, אימיילים ו-WhatsApp</p>
        </div>
        <Button size="sm">רישום תקשורת</Button>
      </div>

      <DataTable data={communications} columns={columns} filterPlaceholder="חיפוש לפי סיכום" />
    </div>
  );
}
