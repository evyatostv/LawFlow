"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createInvoice } from "@/app/billing/actions";
import { createReceipt } from "@/app/receipts/actions";
import { downloadCsv } from "@/lib/csv";

type Invoice = {
  id: string;
  number: string;
  total: number;
  status: "PAID" | "UNPAID" | "PARTIAL";
  allocationNumber?: string | null;
  dueDate: Date;
  receipts: { id: string; amount: number }[];
  client: { name: string };
  lines: { description: string }[];
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
    accessorKey: "client",
    header: "לקוח",
    cell: ({ row }: any) => row.original.client?.name ?? "-",
  },
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
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    clientId: clients[0]?.id ?? "",
    total: "",
    status: "UNPAID",
    dueDate: new Date().toISOString().slice(0, 10),
    allocationNumber: "",
    description: "שירותים משפטיים",
  });
  const [receiptForm, setReceiptForm] = React.useState({
    amount: "",
    method: "העברה בנקאית",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const totalValue = Number(form.total) || 0;
    const shouldRequireAllocation = settings.enableAllocationNumber && totalValue >= settings.allocationThreshold;
    const formData = new FormData();
    formData.append("clientId", form.clientId);
    formData.append("total", form.total);
    formData.append("status", form.status);
    formData.append("dueDate", form.dueDate);
    formData.append("description", form.description);
    if (shouldRequireAllocation && form.allocationNumber) formData.append("allocationNumber", form.allocationNumber);
    await createInvoice(formData);
    setLoading(false);
    setOpen(false);
  };

  const onReceiptSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedInvoice) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("invoiceId", selectedInvoice.id);
    formData.append("amount", receiptForm.amount);
    formData.append("method", receiptForm.method);
    const res = await createReceipt(formData);
    setLoading(false);
    setReceiptOpen(false);
    if (res.receiptId) {
      window.open(`/receipts/${res.receiptId}/print`, "_blank");
    }
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

      <div className="rounded-2xl border border-steel/10 bg-white/80 p-4">
        <div className="mb-2 text-sm font-semibold text-ink">הפקת קבלות</div>
        <div className="grid gap-2">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold">{invoice.number}</p>
                <p className="text-xs text-steel/70">{invoice.client?.name ?? ""}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setReceiptOpen(true);
                }}
              >
                הוצא קבלה
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DataTable data={invoices} columns={columns} filterPlaceholder="חיפוש לפי מספר חשבונית" />

      <Modal open={open} onClose={() => setOpen(false)} title="חשבונית חדשה">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="תיאור שירות" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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

      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} title="הפקת קבלה">
        <form className="space-y-3" onSubmit={onReceiptSubmit}>
          <Input
            label="סכום"
            type="number"
            value={receiptForm.amount}
            onChange={(e) => setReceiptForm({ ...receiptForm, amount: e.target.value })}
          />
          <Input
            label="שיטת תשלום"
            value={receiptForm.method}
            onChange={(e) => setReceiptForm({ ...receiptForm, method: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !selectedInvoice}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setReceiptOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
