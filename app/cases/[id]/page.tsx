import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/SectionHeader";
import { cases, tasks, documents, notes, events, invoices } from "@/lib/data";

export const dynamic = "force-static";

export function generateStaticParams() {
  return cases.map((caseItem) => ({ id: caseItem.id }));
}

export default function CasePage({ params }: { params: { id: string } }) {
  const caseItem = cases.find((item) => item.id === params.id);
  if (!caseItem) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">{caseItem.caseNumber}</h2>
          <p className="text-sm text-steel/70">{caseItem.court}</p>
        </div>
        <Badge>{caseItem.status}</Badge>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
          <div>
            <p className="text-xs text-steel/70">צד נגדי</p>
            <p className="font-semibold">{caseItem.opposingParty}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">מועדים קרובים</p>
            <p>{caseItem.deadlines.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">דיונים</p>
            <p>{caseItem.hearings.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs text-steel/70">פעולות מהירות</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm">הוסף פתק</Button>
              <Button size="sm" variant="secondary">משימה</Button>
              <Button size="sm" variant="ghost">אירוע</Button>
              <Button size="sm" variant="secondary">חשבונית</Button>
              <Button size="sm" variant="ghost">העלאת מסמך</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
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
                <p className="text-xs text-steel/70">עד {task.dueDate}</p>
              </div>
            ))}
            {events.map((event) => (
              <div key={event.id} className="rounded-xl bg-white/70 p-3">
                <p>אירוע: {event.title}</p>
                <p className="text-xs text-steel/70">{event.startAt}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="מסמכים מקושרים" />
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-steel/10 bg-white/70 p-3 text-sm">
                <p className="font-semibold">{doc.name}</p>
                <p className="text-xs text-steel/70">{doc.type}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-mint/70 p-3 text-xs text-steel">
            חשבוניות פתוחות: {invoices.filter((invoice) => invoice.status !== "PAID").length}
          </div>
        </Card>
      </div>
    </div>
  );
}
