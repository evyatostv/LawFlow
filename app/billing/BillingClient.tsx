"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createInvoice } from "@/app/billing/actions";
import { downloadCsv } from "@/lib/csv";

type Invoice = {
  id: string;
  number: string;
  total: number;
  status: "PAID" | "UNPAID" | "PARTIAL";
  allocationNumber?: string | null;
  dueDate: Date;
};

type Client = { id: string; name: string };

type Settings = {
  invoicePrefix: string;
  enableAllocationNumber: boolean;
  allocationThreshold: number;
};

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
  { accessorKey: "number", header: "חשבונית" },
  {
    accessorKey: "dueDate",
    header: "תאריך יעד",
    cell: ({ row }: any) => new Date(row.original.dueDate).toISOString().slice(0, 10),
  },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }: any) => <Badge>{row.original.status}</Badge>,
  },
  {
    accessorKey: "allocationNumber",
    header: "מס' הקצאה",
    cell: ({ row }: any) => row.original.allocationNumber ?? "-",
  },
  {
    accessorKey: "total",
    header: "סכום",
    cell: ({ row }: any) => `₪${row.original.total.toLocaleString("he-IL")}`,
  },
];

export default function BillingClient({
  invoices,
  clients,
  settings,
}: {
  invoices: Invoice[];
  clients: Client[];
  settings: Settings;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    number: settings.invoicePrefix || `INV-${new Date().getFullYear()}-`,
    clientId: clients[0]?.id ?? "",
    total: "",
    status: "UNPAID",
    dueDate: new Date().toISOString().slice(0, 10),
    allocationNumber: "",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const totalValue = Number(form.total) || 0;
    const shouldRequireAllocation = settings.enableAllocationNumber && totalValue >= settings.allocationThreshold;
    const formData = new FormData();
    formData.append("number", form.number + Math.floor(Math.random() * 1000).toString().padStart(3, "0"));
    formData.append("clientId", form.clientId);
    formData.append("total", form.total);
    formData.append("status", form.status);
    formData.append("dueDate", form.dueDate);
    if (shouldRequireAllocation && form.allocationNumber) formData.append("allocationNumber", form.allocationNumber);
    await createInvoice(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">תשלומים וחיובים</h2>
          <p className="text-sm text-steel/70">מעקב אחר תשלומים, הפקת חשבוניות וקבלות</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setOpen(true)} disabled={clients.length === 0}>
            חשבונית חדשה
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              downloadCsv("invoices.csv", invoices.map((inv) => ({
                number: inv.number,
                status: inv.status,
                total: inv.total,
                dueDate: new Date(inv.dueDate).toISOString().slice(0, 10),
                allocationNumber: inv.allocationNumber ?? "",
              })))
            }
          >
            ייצוא CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          <Button
            size="sm"
            variant="secondary"
            disabled={invoices.length === 0}
            onClick={() => window.open(`/invoices/${invoices[0].id}/print`, "_blank")}
          >
            תצוגת PDF
          </Button>
          <Button size="sm" variant="ghost" disabled>
            הפק קבלה
          </Button>
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

      <Modal open={open} onClose={() => setOpen(false)} title="חשבונית חדשה">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="מספר בסיס" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
          <Input label="סכום" type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
          <Input label="תאריך יעד" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          {settings.enableAllocationNumber ? (
            <Input label="מס' הקצאה" value={form.allocationNumber} onChange={(e) => setForm({ ...form, allocationNumber: e.target.value })} />
          ) : null}
          <label className="text-xs uppercase text-steel/70">
            סטטוס
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="PAID">משולם</option>
              <option value="UNPAID">לא משולם</option>
              <option value="PARTIAL">חלקי</option>
            </select>
          </label>
          <label className="text-xs uppercase text-steel/70">
            לקוח
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              {clients.length === 0 ? <option value="">אין לקוחות</option> : null}
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
