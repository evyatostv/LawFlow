"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/Modal";
import { createCommunication } from "@/app/app/(protected)/communications/actions";
import { formatDateTime } from "@/lib/format";
import { MobileActionBar } from "@/components/MobileActionBar";

type CommunicationRow = {
  id: string;
  timestamp: Date;
  type: string;
  summary: string;
  attachments: string[];
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
  {
    accessorKey: "timestamp",
    header: "זמן",
    cell: ({ row }: any) => formatDateTime(row.original.timestamp),
  },
  {
    accessorKey: "type",
    header: "ערוץ",
    cell: ({ row }: any) => <Badge>{row.original.type}</Badge>,
  },
  { accessorKey: "summary", header: "סיכום" },
  {
    accessorKey: "attachments",
    header: "קבצים",
    cell: ({ row }: any) => row.original.attachments.length,
  },
];

export default function CommunicationsClient({ communications }: { communications: CommunicationRow[] }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    type: "WHATSAPP",
    summary: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("summary", form.summary);
    formData.append("timestamp", form.timestamp);
    const res = await createCommunication(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בשמירת תקשורת");
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
          <h2 className="text-2xl font-semibold text-ink">יומן תקשורת</h2>
          <p className="text-sm text-steel/70">תיעוד שיחות, אימיילים ו-WhatsApp</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>רישום תקשורת</Button>
      </div>

      <DataTable data={communications} columns={columns} filterPlaceholder="חיפוש לפי סיכום" />

      <Modal open={open} onClose={() => setOpen(false)} title="רישום תקשורת">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Combobox
            label="ערוץ"
            items={[
              { value: "CALL", label: "שיחה" },
              { value: "EMAIL", label: "אימייל" },
              { value: "WHATSAPP", label: "WhatsApp" },
              { value: "MEETING", label: "פגישה" },
            ]}
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
          />
          <Input label="סיכום" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <DateTimePicker label="זמן" value={form.timestamp} onChange={(value) => setForm({ ...form, timestamp: value })} />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="רישום תקשורת" onClick={() => setOpen(true)} />
    </div>
  );
}
