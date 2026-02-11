"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tasks, Task } from "@/lib/data";

const columns: ColumnDef<Task>[] = [
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
  { accessorKey: "title", header: "משימה" },
  { accessorKey: "dueDate", header: "תאריך יעד" },
  {
    accessorKey: "priority",
    header: "דחיפות",
    cell: ({ row }) => <Badge>{row.original.priority}</Badge>,
  },
  {
    accessorKey: "repeat",
    header: "חזרה",
    cell: ({ row }) => row.original.repeat ?? "-",
  },
];

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">משימות ותזכורות</h2>
          <p className="text-sm text-steel/70">יצירה בשתי שניות, חזרות והתראות שולחן עבודה</p>
        </div>
        <Button size="sm">צור משימה</Button>
      </div>

      <div className="rounded-2xl border border-steel/10 bg-white/80 p-4 text-sm">
        <p className="font-semibold text-ink">התראות שולחן עבודה</p>
        <p className="text-steel/70">הפעלת התראות כדי לקבל תזכורות בזמן אמת עבור דיונים ומשימות.</p>
      </div>

      <DataTable data={tasks} columns={columns} filterPlaceholder="חיפוש לפי כותרת, דחיפות" />
    </div>
  );
}
