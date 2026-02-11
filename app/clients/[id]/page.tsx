import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { clients, cases, tasks, documents, invoices, notes, payments } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return clients.map((client) => ({ id: client.id }));
}

export default function ClientPage({ params }: { params: { id: string } }) {
  const client = clients.find((item) => item.id === params.id);
  if (!client) {
    notFound();
  }

  const clientCases = cases.filter((item) => item.clientId === client.id);

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

      <Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-steel/70">ת"ז</p>
            <p className="text-sm font-semibold text-ink">{client.israeliId}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">טלפון</p>
            <p className="text-sm font-semibold text-ink">{client.phone}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">אימייל</p>
            <p className="text-sm font-semibold text-ink">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">יתרה</p>
            <p className="text-sm font-semibold text-ink">₪{client.balance.toLocaleString("he-IL")}</p>
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
            {notes.map((note) => (
              <div key={note.id} className="rounded-xl bg-white/70 p-3">
                <p>{note.body}</p>
                <p className="text-xs text-steel/70">{note.timestamp}</p>
              </div>
            ))}
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-white/70 p-3">
                <p>משימה: {task.title}</p>
                <p className="text-xs text-steel/70">יעד: {task.dueDate}</p>
              </div>
            ))}
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-xl bg-white/70 p-3">
                <p>תשלום: ₪{payment.amount.toLocaleString("he-IL")}</p>
                <p className="text-xs text-steel/70">{payment.date}</p>
              </div>
            ))}
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl bg-white/70 p-3">
                <p>מסמך: {doc.name}</p>
                <p className="text-xs text-steel/70">עודכן: {doc.updatedAt}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="תיקים פעילים" />
          <div className="space-y-3">
            {clientCases.map((caseItem) => (
              <div key={caseItem.id} className="rounded-xl border border-steel/10 bg-white/70 p-3 text-sm">
                <p className="font-semibold">{caseItem.caseNumber}</p>
                <p className="text-xs text-steel/70">{caseItem.court}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-sand/80 p-3 text-xs text-steel/70">
            תשלומים פתוחים: {invoices.length}
          </div>
        </Card>
      </div>
    </div>
  );
}
