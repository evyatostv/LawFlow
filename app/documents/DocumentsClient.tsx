"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createDocument } from "@/app/documents/actions";

type DocumentRow = { id: string; name: string; type: string; updatedAt: Date; url?: string | null };

type Client = { id: string; name: string };

type CaseItem = { id: string; caseNumber: string };

type Template = { id: string; name: string; body: string };

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
  {
    accessorKey: "url",
    header: "קובץ",
    cell: ({ row }: any) =>
      row.original.url ? (
        <a className="text-ink underline" href={row.original.url} target="_blank">
          פתיחה
        </a>
      ) : (
        "-"
      ),
  },
  {
    accessorKey: "updatedAt",
    header: "עודכן",
    cell: ({ row }: any) => new Date(row.original.updatedAt).toISOString().slice(0, 10),
  },
];

export default function DocumentsClient({
  documents,
  clients,
  cases,
  templates,
}: {
  documents: DocumentRow[];
  clients: Client[];
  cases: CaseItem[];
  templates: Template[];
}) {
  const [open, setOpen] = React.useState(false);
  const [templateOpen, setTemplateOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(templates[0] ?? null);
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    type: "PDF",
    clientId: "",
    caseId: "",
  });
  const [file, setFile] = React.useState<File | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let url = "";
    if (file) {
      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: uploadForm });
      const data = await res.json();
      url = data.url || data.key;
      setUploading(false);
    }
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.type);
    if (url) formData.append("url", url);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    await createDocument(formData);
    setLoading(false);
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
          <Button size="sm" className="mt-3" onClick={() => setTemplateOpen(true)}>פתח תבנית</Button>
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

      <DataTable data={documents} columns={columns} filterPlaceholder="חיפוש לפי שם מסמך" />

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
            קובץ
            <input
              type="file"
              className="mt-2 block w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
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
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? "מעלה..." : loading ? "שומר..." : "שמור"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>

      <Modal open={templateOpen} onClose={() => setTemplateOpen(false)} title="תבניות">
        <div className="space-y-3">
          <label className="text-xs uppercase text-steel/70">
            בחר תבנית
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={selectedTemplate?.id}
              onChange={(e) =>
                setSelectedTemplate(templates.find((tpl) => tpl.id === e.target.value) ?? null)
              }
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>
          </label>
          <div className="rounded-xl border border-steel/10 bg-white/80 p-3 text-xs text-steel/70">
            {selectedTemplate?.body ?? "אין תבנית זמינה"}
          </div>
        </div>
      </Modal>
    </div>
  );
}
