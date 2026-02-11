"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { useAppData } from "@/components/AppDataProvider";

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
  { accessorKey: "dueDate", header: "תאריך יעד" },
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

export default function TasksPage() {
  const { tasks, clients, cases, addTask } = useAppData();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "MEDIUM",
    repeat: "",
    clientId: "",
    caseId: "",
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTask({
      title: form.title,
      dueDate: form.dueDate,
      priority: form.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      repeat: form.repeat || undefined,
      clientId: form.clientId || undefined,
      caseId: form.caseId || undefined,
    });
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
          <Input label="תאריך יעד" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            דחיפות
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="LOW">נמוכה</option>
              <option value="MEDIUM">בינונית</option>
              <option value="HIGH">גבוהה</option>
              <option value="URGENT">דחופה</option>
            </select>
          </label>
          <Input label="חזרה" value={form.repeat} onChange={(e) => setForm({ ...form, repeat: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            לקוח
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
            >
              <option value="">לא משויך</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </label>
          <label className="text-xs uppercase text-steel/70">
            תיק
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.caseId}
              onChange={(e) => setForm({ ...form, caseId: e.target.value })}
            >
              <option value="">לא משויך</option>
              {cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>{caseItem.caseNumber}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button type="submit">שמור</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
