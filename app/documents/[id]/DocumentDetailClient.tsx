"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { updateDocument, deleteDocument } from "@/app/documents/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type Client = { id: string; name: string };
type CaseItem = { id: string; caseNumber: string };

type DocumentDetail = {
  id: string;
  name: string;
  type: string;
  url?: string | null;
  clientId?: string | null;
  caseId?: string | null;
};

export default function DocumentDetailClient({
  document,
  clients,
  cases,
}: {
  document: DocumentDetail;
  clients: Client[];
  cases: CaseItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: document.name,
    type: document.type,
    url: document.url ?? "",
    clientId: document.clientId ?? "",
    caseId: document.caseId ?? "",
  });

  const saveDocument = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", document.id);
    formData.append("name", form.name);
    formData.append("type", form.type);
    if (form.url) formData.append("url", form.url);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    const res = await updateDocument(formData);
    if (!res.ok) setError(res.message ?? "שגיאה בעדכון");
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDocument();
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteDocument(document.id);
    router.push("/documents");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">מסמך: {document.name}</h2>
          <p className="text-sm text-steel/70">עריכת פרטי מסמך</p>
        </div>
        {document.url ? (
          <Button variant="secondary" onClick={() => window.open(document.url ?? "", "_blank")}>
            פתיחת קובץ
          </Button>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
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
        <Input label="קישור לקובץ" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <Combobox
          label="לקוח"
          placeholder="חיפוש לקוח"
          items={[{ value: "", label: "לא משויך" }, ...clients.map((client) => ({ value: client.id, label: client.name }))]}
          value={form.clientId}
          onChange={(value) => setForm({ ...form, clientId: value })}
        />
        <Combobox
          label="תיק"
          placeholder="חיפוש תיק"
          items={[{ value: "", label: "לא משויך" }, ...cases.map((caseItem) => ({ value: caseItem.id, label: caseItem.caseNumber }))]}
          value={form.caseId}
          onChange={(value) => setForm({ ...form, caseId: value })}
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
          <Button type="button" variant="ghost" onClick={onDelete} disabled={loading}>
            מחק מסמך
          </Button>
        </div>
      </form>
      <MobileActionBar label={loading ? "שומר..." : "שמור מסמך"} onClick={saveDocument} disabled={loading} />
    </div>
  );
}
