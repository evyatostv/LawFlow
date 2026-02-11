"use client";

import * as React from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clients } from "@/lib/data";

const columns = [
  {
    id: "select",
    header: ({ table }: any) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: any) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "שם לקוח",
    cell: ({ row }: any) => (
      <Link className="font-semibold text-ink hover:underline" href={"/clients/" + row.original.id}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "israeliId",
    header: 'ת"ז',
  },
  {
    accessorKey: "phone",
    header: "טלפון",
  },
  {
    accessorKey: "email",
    header: "אימייל",
  },
  {
    accessorKey: "balance",
    header: "יתרה",
    cell: ({ row }: any) => `₪${row.original.balance.toLocaleString("he-IL")}`,
  },
  {
    id: "tags",
    header: "תגיות",
    cell: ({ row }: any) => (
      <div className="flex flex-wrap gap-2">
        {row.original.tags.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    ),
  },
];

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">לקוחות</h2>
          <p className="text-sm text-steel/70">ניהול לקוחות עם פילוח מהיר</p>
        </div>
        <Button size="sm">הוסף לקוח</Button>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 text-xs">
            <Badge>כל הלקוחות</Badge>
            <Badge>יתרה פתוחה</Badge>
            <Badge>פעילות השבוע</Badge>
          </div>
          <Button variant="secondary" size="sm">ייצוא CSV</Button>
        </div>
      </Card>

      <DataTable
        data={clients}
        columns={columns}
        filterPlaceholder={'חיפוש לפי שם, טלפון, ת"ז'}
      />
    </div>
  );
}
