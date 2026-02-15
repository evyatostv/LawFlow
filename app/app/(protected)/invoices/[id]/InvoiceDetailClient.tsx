"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-time-picker";
import { Combobox } from "@/components/ui/combobox";
import { updateInvoice, deleteInvoice } from "@/app/app/(protected)/receivables/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type Client = { id: string; name: string };
type CaseItem = { id: string; caseNumber: string };

type InvoiceDetail = {
  id: string;
  number: string;
  clientId: string;
  caseId?: string | null;
  status: "PAID" | "UNPAID" | "PARTIAL";
  dueDate: Date;
  total: number;
  allocationNumber?: string | null;
  lines: { description: string }[];
};

export default function InvoiceDetailClient({
  invoice,
  clients,
  cases,
  allocationRequired,
}: {
  invoice: InvoiceDetail;
  clients: Client[];
  cases: CaseItem[];
  allocationRequired: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    clientId: invoice.clientId,
    caseId: invoice.caseId ?? "",
    status: invoice.status,
    dueDate: invoice.dueDate.toISOString().slice(0, 10),
    total: String(invoice.total),
    allocationNumber: invoice.allocationNumber ?? "",
    description: invoice.lines[0]?.description ?? "",
  });

  const saveInvoice = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", invoice.id);
    formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    formData.append("status", form.status);
    formData.append("dueDate", form.dueDate);
    formData.append("total", form.total);
    formData.append("description", form.description);
    if (form.allocationNumber) formData.append("allocationNumber", form.allocationNumber);
    const res = await updateInvoice(formData);
    if (!res.ok) setError(res.message ?? "שגיאה בעדכון");
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveInvoice();
  };

  const onDelete = async () => {
    setLoading(true);
    const res = await deleteInvoice(invoice.id);
    if (!res.ok) {
      setError(res.message ?? "שגיאה במחיקה");
      setLoading(false);
      return;
    }
    router.push("/app/receivables");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">חשבונית {invoice.number}</h2>
          <p className="text-sm text-steel/70">עריכה והפקת PDF</p>
        </div>
        <Button variant="secondary" onClick={() => window.open(`/app/invoices/${invoice.id}/print`, "_blank")}>
          פתיחת PDF
        </Button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Combobox
          label="לקוח"
          items={clients.map((client) => ({ value: client.id, label: client.name }))}
          value={form.clientId}
          onChange={(value) => setForm({ ...form, clientId: value })}
        />
        <Combobox
          label="תיק"
          items={[{ value: "", label: "לא משויך" }, ...cases.map((caseItem) => ({ value: caseItem.id, label: caseItem.caseNumber }))]}
          value={form.caseId}
          onChange={(value) => setForm({ ...form, caseId: value })}
        />
        <Input label="תיאור שירות" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <CurrencyInput label="סכום" value={form.total} onValueChange={(value) => setForm({ ...form, total: value })} />
        <DatePicker label="תאריך יעד" value={form.dueDate} onChange={(value) => setForm({ ...form, dueDate: value })} />
        <Combobox
          label="סטטוס"
          items={[
            { value: "PAID", label: "משולם" },
            { value: "UNPAID", label: "לא משולם" },
            { value: "PARTIAL", label: "חלקי" },
          ]}
          value={form.status}
          onChange={(value) => setForm({ ...form, status: value as InvoiceDetail["status"] })}
        />
        {allocationRequired ? (
          <Input label="מס' הקצאה" value={form.allocationNumber} onChange={(e) => setForm({ ...form, allocationNumber: e.target.value })} />
        ) : null}
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
          <Button type="button" variant="ghost" onClick={onDelete} disabled={loading}>
            מחק חשבונית
          </Button>
        </div>
      </form>
      <MobileActionBar label={loading ? "שומר..." : "שמור חשבונית"} onClick={saveInvoice} disabled={loading} />
    </div>
  );
}
