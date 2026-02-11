"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { invoices, Invoice } from "@/lib/data";

const columns: ColumnDef<Invoice>[] = [
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
  { accessorKey: "number", header: "חשבונית" },
  { accessorKey: "dueDate", header: "תאריך יעד" },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    accessorKey: "allocationNumber",
    header: "מס' הקצאה",
    cell: ({ row }) => row.original.allocationNumber ?? "-",
  },
  {
    accessorKey: "total",
    header: "סכום",
    cell: ({ row }) => `₪${row.original.total.toLocaleString("he-IL")}`,
  },
];

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">תשלומים וחיובים</h2>
          <p className="text-sm text-steel/70">מעקב אחר תשלומים, הפקת חשבוניות וקבלות</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">חשבונית חדשה</Button>
          <Button size="sm" variant="secondary">ייצוא CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-steel/70">סה"כ גבייה החודש</p>
          <p className="text-2xl font-semibold text-ink">₪32,400</p>
        </Card>
        <Card>
          <p className="text-xs text-steel/70">פתוח לגבייה</p>
          <p className="text-2xl font-semibold text-ink">₪18,900</p>
        </Card>
        <Card>
          <p className="text-xs text-steel/70">מע"מ לחודש</p>
          <p className="text-2xl font-semibold text-ink">₪5,508</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold text-ink">הפקת חשבוניות ישראליות</p>
        <p className="text-xs text-steel/70">
          תומך במספור אוטומטי, מע"מ, פרטי לקוח, ושדה הקצאה לחשבוניות B2B מעל הסף.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary">תצוגת PDF</Button>
          <Button size="sm" variant="ghost">הפק קבלה</Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink">שיטות תשלום מועדפות</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-steel/80">
          <Badge>העברה בנקאית</Badge>
          <Badge>כרטיס אשראי</Badge>
          <Badge>צ'ק</Badge>
          <Badge>מזומן</Badge>
        </div>
        <p className="mt-3 text-xs text-steel/70">מעקב סטטוס: משולם, לא משולם, חלקי.</p>
      </Card>

      <DataTable data={invoices} columns={columns} filterPlaceholder="חיפוש לפי מספר חשבונית" />
    </div>
  );
}
