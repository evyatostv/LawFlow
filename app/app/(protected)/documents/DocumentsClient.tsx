"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { updateSortPreference } from "@/app/app/(protected)/preferences/actions";
import { Modal } from "@/components/Modal";
import { createDocument } from "@/app/app/(protected)/documents/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

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
  {
    accessorKey: "name",
    header: "מסמך",
    cell: ({ row }: any) => (
      <a className="font-semibold text-ink" href={`/app/documents/${row.original.id}`}>
        {row.original.name}
      </a>
    ),
  },
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
  initialSorting,
}: {
  documents: DocumentRow[];
  clients: Client[];
  cases: CaseItem[];
  templates: Template[];
  initialSorting: { id: string; desc: boolean }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [templateOpen, setTemplateOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(templates[0] ?? null);
  const [templateClientId, setTemplateClientId] = React.useState("");
  const [templateCaseId, setTemplateCaseId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
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
    setError("");
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
    const res = await createDocument(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בהעלאת מסמך");
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

      <DataTable
        data={documents}
        columns={columns}
        filterPlaceholder="חיפוש לפי שם מסמך"
        initialSorting={initialSorting}
        onSortingPersist={(sorting) => updateSortPreference("documents", sorting)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="מסמך חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="שם מסמך" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Combobox
            label="סוג"
            items={[
              { value: "PDF", label: "PDF" },
              { value: "IMAGE", label: "Image" },
              { value: "DOCX", label: "DOCX" },
            ]}
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
          />
          <label className="text-xs uppercase text-steel/70">
            קובץ
            <input
              type="file"
              className="mt-2 block w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
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
            <Button type="submit" disabled={loading || uploading}>
              {uploading ? "מעלה..." : loading ? "שומר..." : "שמור"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>

      <Modal open={templateOpen} onClose={() => setTemplateOpen(false)} title="תבניות">
        <div className="space-y-4">
          <Combobox
            label="בחר תבנית"
            items={templates.map((tpl) => ({ value: tpl.id, label: tpl.name }))}
            value={selectedTemplate?.id ?? ""}
            onChange={(value) =>
              setSelectedTemplate(templates.find((tpl) => tpl.id === value) ?? null)
            }
          />
          <Combobox
            label="לקוח לתצוגה מקדימה"
            placeholder="חיפוש לקוח"
            items={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={templateClientId}
            onChange={setTemplateClientId}
          />
          <Combobox
            label="תיק לתצוגה מקדימה"
            placeholder="חיפוש תיק"
            items={cases.map((caseItem) => ({ value: caseItem.id, label: caseItem.caseNumber }))}
            value={templateCaseId}
            onChange={setTemplateCaseId}
          />
          <div className="rounded-xl border border-steel/10 bg-white/80 p-3 text-xs text-steel/70">
            {selectedTemplate?.body ?? "אין תבנית זמינה"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={!selectedTemplate}
              onClick={() => {
                if (!selectedTemplate) return;
                const params = new URLSearchParams();
                params.set("templateId", selectedTemplate.id);
                if (templateClientId) params.set("clientId", templateClientId);
                if (templateCaseId) params.set("caseId", templateCaseId);
                window.open(`/templates/preview?${params.toString()}`, "_blank");
              }}
            >
              תצוגה מקדימה
            </Button>
            <Button
              size="sm"
              disabled={!selectedTemplate}
              onClick={() => {
                if (!selectedTemplate) return;
                const params = new URLSearchParams();
                params.set("templateId", selectedTemplate.id);
                if (templateClientId) params.set("clientId", templateClientId);
                if (templateCaseId) params.set("caseId", templateCaseId);
                params.set("export", "1");
                window.open(`/templates/preview?${params.toString()}`, "_blank");
              }}
            >
              ייצוא ל-PDF
            </Button>
          </div>
        </div>
      </Modal>
      <MobileActionBar label="העלה מסמך" onClick={() => setOpen(true)} />
    </div>
  );
}
