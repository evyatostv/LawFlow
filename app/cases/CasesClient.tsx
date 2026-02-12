"use client";

import * as React from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/Modal";
import { createCase } from "@/app/cases/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

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
      <Link className="font-semibold text-ink" href={"/cases/" + row.original.id}>
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
  const [error, setError] = React.useState("");
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
    setError("");
    const formData = new FormData();
    formData.append("clientId", form.clientId);
    formData.append("caseNumber", form.caseNumber);
    formData.append("court", form.court);
    formData.append("opposingParty", form.opposingParty);
    formData.append("status", form.status);
    const res = await createCase(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בשמירת תיק");
      setLoading(false);
      return;
    }
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
          <Combobox
            label="סטטוס"
            items={[
              { value: "OPEN", label: "פתוח" },
              { value: "PENDING", label: "ממתין" },
              { value: "CLOSED", label: "סגור" },
            ]}
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
          />
          <Combobox
            label="לקוח"
            placeholder="חיפוש לקוח"
            items={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={form.clientId}
            onChange={(value) => setForm({ ...form, clientId: value })}
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="פתח תיק" onClick={() => setOpen(true)} disabled={clients.length === 0} />
    </div>
  );
}
