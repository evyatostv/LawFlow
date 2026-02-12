"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { updateClient, deleteClient } from "@/app/clients/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type ClientWithRelations = {
  id: string;
  name: string;
  israeliId: string;
  phone: string;
  email: string;
  address: string;
  tags: string[];
  balance: number;
  notes: { id: string; body: string; createdAt: Date }[];
  tasks: { id: string; title: string; dueDate: Date }[];
  payments: { id: string; amount: number; createdAt: Date }[];
  documents: { id: string; name: string; updatedAt: Date }[];
  cases: { id: string; caseNumber: string; court: string }[];
  invoices: { id: string; status: string }[];
};

export default function ClientDetailClient({ client }: { client: ClientWithRelations }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: client.name,
    israeliId: client.israeliId,
    phone: client.phone,
    email: client.email,
    address: client.address,
    tags: client.tags.join(", "),
  });

  const saveClient = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", client.id);
    formData.append("name", form.name);
    formData.append("israeliId", form.israeliId);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("address", form.address);
    formData.append("tags", form.tags);
    const res = await updateClient(formData);
    if (!res.ok) setError(res.message ?? "שגיאה בעדכון");
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveClient();
  };

  const onDelete = async () => {
    setLoading(true);
    const res = await deleteClient(client.id);
    if (!res.ok) {
      setError(res.message ?? "שגיאה במחיקה");
      setLoading(false);
      return;
    }
    router.push("/clients");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">{client.name}</h2>
          <p className="text-sm text-steel/70">כרטיס לקוח</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Card>
          <h3 className="text-sm font-semibold text-ink">פרטי לקוח</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input label="שם" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label='ת"ז' value={form.israeliId} onChange={(e) => setForm({ ...form, israeliId: e.target.value })} />
            <Input label="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="אימייל" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="כתובת" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input label="תגיות" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={onDelete} disabled={loading}>
              מחק לקוח
            </Button>
          </div>
        </Card>
      </form>

      <Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-steel/70">יתרה</p>
            <p className="text-sm font-semibold text-ink">₪{formatCurrency(client.balance)}</p>
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <p className="text-xs text-steel/70">כתובת</p>
            <p className="text-sm font-semibold text-ink">{client.address}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionHeader title="ציר זמן" />
          <div className="space-y-3 text-sm">
            {client.notes.map((note) => (
              <div key={note.id} className="rounded-xl bg-white/70 p-3">
                <p>{note.body}</p>
                <p className="text-xs text-steel/70">{note.createdAt.toISOString().slice(0, 16).replace("T", " ")}</p>
              </div>
            ))}
            {client.tasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-white/70 p-3">
                <p>משימה: {task.title}</p>
                <p className="text-xs text-steel/70">יעד: {task.dueDate.toISOString().slice(0, 10)}</p>
              </div>
            ))}
            {client.payments.map((payment) => (
              <div key={payment.id} className="rounded-xl bg-white/70 p-3">
                <p>תשלום: ₪{formatCurrency(payment.amount)}</p>
                <p className="text-xs text-steel/70">{payment.createdAt.toISOString().slice(0, 10)}</p>
              </div>
            ))}
            {client.documents.map((doc) => (
              <div key={doc.id} className="rounded-xl bg-white/70 p-3">
                <p>מסמך: {doc.name}</p>
                <p className="text-xs text-steel/70">עודכן: {doc.updatedAt.toISOString().slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="תיקים פעילים" />
          <div className="space-y-3">
            {client.cases.map((caseItem) => (
              <div key={caseItem.id} className="rounded-xl border border-steel/10 bg-white/70 p-3 text-sm">
                <p className="font-semibold">{caseItem.caseNumber}</p>
                <p className="text-xs text-steel/70">{caseItem.court}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-sand/80 p-3 text-xs text-steel/70">
            תשלומים פתוחים: {client.invoices.filter((invoice) => invoice.status !== "PAID").length}
          </div>
        </Card>
      </div>
      <MobileActionBar label={loading ? "שומר..." : "שמור לקוח"} onClick={saveClient} disabled={loading} />
    </div>
  );
}
