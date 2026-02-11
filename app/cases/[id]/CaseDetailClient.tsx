"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { SectionHeader } from "@/components/SectionHeader";
import { createNote } from "@/app/notes/actions";
import { createTask } from "@/app/tasks/actions";
import { createEvent } from "@/app/calendar/actions";
import { createInvoice } from "@/app/billing/actions";
import { createDocument } from "@/app/documents/actions";

type CaseDetail = {
  id: string;
  caseNumber: string;
  court: string;
  opposingParty: string;
  status: string;
  clientId: string;
  tasks: { id: string; title: string; dueDate: Date }[];
  events: { id: string; title: string; startAt: Date }[];
  documents: { id: string; name: string; type: string }[];
  notes: { id: string; body: string; createdAt: Date }[];
  invoices: { id: string; status: string }[];
};

export default function CaseDetailClient({ caseItem }: { caseItem: CaseDetail }) {
  const [modal, setModal] = React.useState<
    null | "note" | "task" | "event" | "invoice" | "document"
  >(null);
  const [loading, setLoading] = React.useState(false);
  const [noteBody, setNoteBody] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [invoiceTotal, setInvoiceTotal] = React.useState("");
  const [docName, setDocName] = React.useState("");

  const submit = async (handler: () => Promise<void>) => {
    setLoading(true);
    await handler();
    setLoading(false);
    setModal(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
            <p className="text-xs text-steel/70">פעולות מהירות</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setModal("note")}>הוסף פתק</Button>
              <Button size="sm" variant="secondary" onClick={() => setModal("task")}>משימה</Button>
              <Button size="sm" variant="ghost" onClick={() => setModal("event")}>אירוע</Button>
              <Button size="sm" variant="secondary" onClick={() => setModal("invoice")}>חשבונית</Button>
              <Button size="sm" variant="ghost" onClick={() => setModal("document")}>העלאת מסמך</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionHeader title="ציר זמן" />
          <div className="space-y-3 text-sm">
            {caseItem.notes.map((note) => (
              <div key={note.id} className="rounded-xl bg-white/70 p-3">
                <p>{note.body}</p>
                <p className="text-xs text-steel/70">{note.createdAt.toISOString().slice(0, 16).replace("T", " ")}</p>
              </div>
            ))}
            {caseItem.tasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-white/70 p-3">
                <p>משימה: {task.title}</p>
                <p className="text-xs text-steel/70">עד {task.dueDate.toISOString().slice(0, 10)}</p>
              </div>
            ))}
            {caseItem.events.map((eventItem) => (
              <div key={eventItem.id} className="rounded-xl bg-white/70 p-3">
                <p>אירוע: {eventItem.title}</p>
                <p className="text-xs text-steel/70">{eventItem.startAt.toISOString().slice(0, 16).replace("T", " ")}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="מסמכים מקושרים" />
          <div className="space-y-3">
            {caseItem.documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-steel/10 bg-white/70 p-3 text-sm">
                <p className="font-semibold">{doc.name}</p>
                <p className="text-xs text-steel/70">{doc.type}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-mint/70 p-3 text-xs text-steel">
            חשבוניות פתוחות: {caseItem.invoices.filter((invoice) => invoice.status !== "PAID").length}
          </div>
        </Card>
      </div>

      <Modal open={modal === "note"} onClose={() => setModal(null)} title="פתק חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("body", noteBody);
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createNote(formData));
            setNoteBody("");
          }}
        >
          <Input label="תוכן" value={noteBody} onChange={(e) => setNoteBody(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
        </form>
      </Modal>

      <Modal open={modal === "task"} onClose={() => setModal(null)} title="משימה חדשה">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("title", taskTitle);
            formData.append("dueDate", new Date().toISOString().slice(0, 10));
            formData.append("priority", "MEDIUM");
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createTask(formData));
            setTaskTitle("");
          }}
        >
          <Input label="כותרת" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
        </form>
      </Modal>

      <Modal open={modal === "event"} onClose={() => setModal(null)} title="אירוע חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("title", eventTitle);
            formData.append("startAt", new Date().toISOString());
            formData.append("endAt", new Date().toISOString());
            formData.append("type", "HEARING");
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createEvent(formData));
            setEventTitle("");
          }}
        >
          <Input label="כותרת" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
        </form>
      </Modal>

      <Modal open={modal === "invoice"} onClose={() => setModal(null)} title="חשבונית חדשה">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("number", `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
            formData.append("clientId", caseItem.clientId);
            formData.append("caseId", caseItem.id);
            formData.append("total", invoiceTotal || "0");
            formData.append("status", "UNPAID");
            formData.append("dueDate", new Date().toISOString().slice(0, 10));
            submit(() => createInvoice(formData));
            setInvoiceTotal("");
          }}
        >
          <Input label="סכום" type="number" value={invoiceTotal} onChange={(e) => setInvoiceTotal(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
        </form>
      </Modal>

      <Modal open={modal === "document"} onClose={() => setModal(null)} title="מסמך חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("name", docName);
            formData.append("type", "PDF");
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createDocument(formData));
            setDocName("");
          }}
        >
          <Input label="שם מסמך" value={docName} onChange={(e) => setDocName(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
        </form>
      </Modal>
    </div>
  );
}
