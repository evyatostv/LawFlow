"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { useAppData } from "@/components/AppDataProvider";

type CommunicationRow = { timestamp: string; type: string; summary: string; attachments?: string[] };

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
  { accessorKey: "timestamp", header: "זמן" },
  {
    accessorKey: "type",
    header: "ערוץ",
    cell: ({ row }: any) => <Badge>{row.original.type}</Badge>,
  },
  { accessorKey: "summary", header: "סיכום" },
  {
    accessorKey: "attachments",
    header: "קבצים",
    cell: ({ row }: any) => (row.original.attachments || []).length,
  },
];

export default function CommunicationsPage() {
  const { communications, addCommunication } = useAppData();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    type: "WHATSAPP",
    summary: "",
    timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addCommunication({
      type: form.type as "CALL" | "EMAIL" | "WHATSAPP" | "MEETING",
      summary: form.summary,
      timestamp: form.timestamp,
      attachments: [],
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">יומן תקשורת</h2>
          <p className="text-sm text-steel/70">תיעוד שיחות, אימיילים ו-WhatsApp</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>רישום תקשורת</Button>
      </div>

      <DataTable data={communications as CommunicationRow[]} columns={columns} filterPlaceholder="חיפוש לפי סיכום" />

      <Modal open={open} onClose={() => setOpen(false)} title="רישום תקשורת">
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="text-xs uppercase text-steel/70">
            ערוץ
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="CALL">שיחה</option>
              <option value="EMAIL">אימייל</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="MEETING">פגישה</option>
            </select>
          </label>
          <Input label="סיכום" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <Input label="זמן" value={form.timestamp} onChange={(e) => setForm({ ...form, timestamp: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">שמור</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
