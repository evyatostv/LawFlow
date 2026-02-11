"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { documents } from "@/lib/data";

type DocumentRow = typeof documents[number];

const columns: ColumnDef<DocumentRow>[] = [
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
  { accessorKey: "name", header: "מסמך" },
  { accessorKey: "type", header: "סוג" },
  { accessorKey: "updatedAt", header: "עודכן" },
];

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">מסמכים</h2>
          <p className="text-sm text-steel/70">כספת מאובטחת עם חיפוש מלא בתוך קבצים</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">העלה מסמך</Button>
          <Button size="sm" variant="secondary">סריקה מהמצלמה</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-ink">תבניות</p>
          <p className="text-xs text-steel/70">הסכמים נפוצים עם מילוי אוטומטי מנתוני לקוח</p>
          <Button size="sm" className="mt-3">פתח תבנית</Button>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink">חיפוש תוכן</p>
          <p className="text-xs text-steel/70">מוצא מונחים בתוך PDF וקבצי תמונה</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink">ייצוא ל-PDF</p>
          <p className="text-xs text-steel/70">סיכומים משפטיים והעתקים חתומים</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold text-ink">מבנה תיקיות</p>
        <p className="text-xs text-steel/70">סידור אוטומטי לפי לקוח ותיק עם הרשאות גישה מאובטחות.</p>
      </Card>

      <DataTable data={documents} columns={columns} filterPlaceholder="חיפוש לפי שם מסמך" />
    </div>
  );
}
