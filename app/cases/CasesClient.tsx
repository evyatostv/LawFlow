"use client";

import * as React from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createCase } from "@/app/cases/actions";

type CaseItem = {
  id: string;
  clientId: string;
  caseNumber: string;
  court: string;
  opposingParty: string;
  status: "OPEN" | "PENDING" | "CLOSED";
};

type Client = { id: string; name: string };

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
    accessorKey: "caseNumber",
    header: "מספר תיק",
    cell: ({ row }: any) => (
      <Link className="font-semibold text-ink hover:underline" href={"/cases/" + row.original.id}>
        {row.original.caseNumber}
      </Link>
    ),
  },
  { accessorKey: "court", header: "בית משפט" },
  { accessorKey: "opposingParty", header: "צד נגדי" },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }: any) => <Badge>{row.original.status}</Badge>,
  },
];

export default function CasesClient({ cases, clients }: { cases: CaseItem[]; clients: Client[] }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    clientId: clients[0]?.id ?? "",
    caseNumber: "",
    court: "",
    opposingParty: "",
    status: "OPEN",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("clientId", form.clientId);
    formData.append("caseNumber", form.caseNumber);
    formData.append("court", form.court);
    formData.append("opposingParty", form.opposingParty);
    formData.append("status", form.status);
    await createCase(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">תיקים</h2>
          <p className="text-sm text-steel/70">סקירה של כל התיקים הפעילים</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} disabled={clients.length === 0}>
          פתח תיק
        </Button>
      </div>

      <DataTable data={cases} columns={columns} filterPlaceholder="חיפוש לפי מספר תיק, בית משפט" />

      <Modal open={open} onClose={() => setOpen(false)} title="תיק חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="מספר תיק" value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} />
          <Input label="בית משפט" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} />
          <Input label="צד נגדי" value={form.opposingParty} onChange={(e) => setForm({ ...form, opposingParty: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            סטטוס
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="OPEN">פתוח</option>
              <option value="PENDING">ממתין</option>
              <option value="CLOSED">סגור</option>
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
