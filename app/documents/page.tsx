"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { useAppData } from "@/components/AppDataProvider";

type DocumentRow = { name: string; type: string; updatedAt: string };

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
  { accessorKey: "name", header: "מסמך" },
  { accessorKey: "type", header: "סוג" },
  { accessorKey: "updatedAt", header: "עודכן" },
];

export default function DocumentsPage() {
  const { documents, clients, cases, addDocument } = useAppData();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    type: "PDF",
    clientId: "",
    caseId: "",
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addDocument({
      name: form.name,
      type: form.type,
      clientId: form.clientId || undefined,
      caseId: form.caseId || undefined,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">מסמכים</h2>
          <p className="text-sm text-steel/70">כספת מאובטחת עם חיפוש מלא בתוך קבצים</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setOpen(true)}>העלה מסמך</Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>סריקה מהמצלמה</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-ink">תבניות</p>
          <p className="text-xs text-steel/70">הסכמים נפוצים עם מילוי אוטומטי מנתוני לקוח</p>
          <Button size="sm" className="mt-3" onClick={() => alert("פתיחת תבנית (דמו)")}>פתח תבנית</Button>
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

      <DataTable data={documents as DocumentRow[]} columns={columns} filterPlaceholder="חיפוש לפי שם מסמך" />

      <Modal open={open} onClose={() => setOpen(false)} title="מסמך חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="שם מסמך" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            סוג
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="PDF">PDF</option>
              <option value="IMAGE">Image</option>
              <option value="DOCX">DOCX</option>
            </select>
          </label>
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
