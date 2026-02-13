"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-time-picker";
import { Modal } from "@/components/Modal";
import { createTask } from "@/app/app/(protected)/tasks/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type Task = {
  id: string;
  title: string;
  dueDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  repeat?: string | null;
};

type Client = { id: string; name: string };

type CaseItem = { id: string; caseNumber: string };

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
  { accessorKey: "title", header: "משימה" },
  {
    accessorKey: "dueDate",
    header: "תאריך יעד",
    cell: ({ row }: any) => new Date(row.original.dueDate).toISOString().slice(0, 10),
  },
  {
    accessorKey: "priority",
    header: "דחיפות",
    cell: ({ row }: any) => <Badge>{row.original.priority}</Badge>,
  },
  {
    accessorKey: "repeat",
    header: "חזרה",
    cell: ({ row }: any) => row.original.repeat ?? "-",
  },
];

export default function TasksClient({
  tasks,
  clients,
  cases,
}: {
  tasks: Task[];
  clients: Client[];
  cases: CaseItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    title: "",
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "MEDIUM",
    repeat: "",
    clientId: "",
    caseId: "",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("dueDate", form.dueDate);
    formData.append("priority", form.priority);
    if (form.repeat) formData.append("repeat", form.repeat);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    const res = await createTask(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בשמירת משימה");
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
          <h2 className="text-2xl font-semibold text-ink">משימות ותזכורות</h2>
          <p className="text-sm text-steel/70">יצירה בשתי שניות, חזרות והתראות שולחן עבודה</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>צור משימה</Button>
      </div>

      <div className="rounded-2xl border border-steel/10 bg-white/80 p-4 text-sm">
        <p className="font-semibold text-ink">התראות שולחן עבודה</p>
        <p className="text-steel/70">הפעלת התראות כדי לקבל תזכורות בזמן אמת עבור דיונים ומשימות.</p>
      </div>

      <DataTable data={tasks} columns={columns} filterPlaceholder="חיפוש לפי כותרת, דחיפות" />

      <Modal open={open} onClose={() => setOpen(false)} title="משימה חדשה">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <DatePicker label="תאריך יעד" value={form.dueDate} onChange={(value) => setForm({ ...form, dueDate: value })} />
          <Combobox
            label="דחיפות"
            items={[
              { value: "LOW", label: "נמוכה" },
              { value: "MEDIUM", label: "בינונית" },
              { value: "HIGH", label: "גבוהה" },
              { value: "URGENT", label: "דחופה" },
            ]}
            value={form.priority}
            onChange={(value) => setForm({ ...form, priority: value })}
          />
          <Input label="חזרה" value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value })} />
          <Combobox
            label="לקוח"
            placeholder="חיפוש לקוח"
            items={[{ value: "", label: "לא משויך" }, ...clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))]}
            value={form.clientId}
            onChange={(value) => setForm({ ...form, clientId: value })}
          />
          <Combobox
            label="תיק"
            placeholder="חיפוש תיק"
            items={[{ value: "", label: "לא משויך" }, ...cases.map((caseItem) => ({
              value: caseItem.id,
              label: caseItem.caseNumber,
            }))]}
            value={form.caseId}
            onChange={(value) => setForm({ ...form, caseId: value })}
          />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="צור משימה" onClick={() => setOpen(true)} />
    </div>
  );
}
