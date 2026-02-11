"use client";

import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppData } from "@/components/AppDataProvider";
import * as React from "react";

export default function CaseDetailClient() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const {
    cases,
    tasks,
    documents,
    notes,
    events,
    invoices,
    addNote,
    addTask,
    addEvent,
    addInvoice,
    addDocument,
  } = useAppData();
  const caseItem = cases.find((item) => item.id === id);

  const [modal, setModal] = React.useState<
    null | "note" | "task" | "event" | "invoice" | "document"
  >(null);

  const [noteBody, setNoteBody] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [invoiceTotal, setInvoiceTotal] = React.useState("");
  const [docName, setDocName] = React.useState("");

  if (!caseItem) {
    return <div className="text-sm text-steel/70">תיק לא נמצא.</div>;
  }

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
            {events.map((eventItem) => (
              <div key={eventItem.id} className="rounded-xl bg-white/70 p-3">
                <p>אירוע: {eventItem.title}</p>
                <p className="text-xs text-steel/70">{eventItem.startAt}</p>
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

      <Modal open={modal === "note"} onClose={() => setModal(null)} title="פתק חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addNote({ body: noteBody, timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") });
            setNoteBody("");
            setModal(null);
          }}
        >
          <Input label="תוכן" value={noteBody} onChange={(e) => setNoteBody(e.target.value)} />
          <Button type="submit">שמור</Button>
        </form>
      </Modal>

      <Modal open={modal === "task"} onClose={() => setModal(null)} title="משימה חדשה">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addTask({
              title: taskTitle,
              dueDate: new Date().toISOString().slice(0, 10),
              priority: "MEDIUM",
              caseId: caseItem.id,
            });
            setTaskTitle("");
            setModal(null);
          }}
        >
          <Input label="כותרת" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <Button type="submit">שמור</Button>
        </form>
      </Modal>

      <Modal open={modal === "event"} onClose={() => setModal(null)} title="אירוע חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addEvent({
              title: eventTitle,
              startAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              endAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              type: "HEARING",
              caseId: caseItem.id,
            });
            setEventTitle("");
            setModal(null);
          }}
        >
          <Input label="כותרת" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
          <Button type="submit">שמור</Button>
        </form>
      </Modal>

      <Modal open={modal === "invoice"} onClose={() => setModal(null)} title="חשבונית חדשה">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addInvoice({
              number: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
              clientId: caseItem.clientId,
              total: Number(invoiceTotal) || 0,
              status: "UNPAID",
              dueDate: new Date().toISOString().slice(0, 10),
            });
            setInvoiceTotal("");
            setModal(null);
          }}
        >
          <Input label="סכום" type="number" value={invoiceTotal} onChange={(e) => setInvoiceTotal(e.target.value)} />
          <Button type="submit">שמור</Button>
        </form>
      </Modal>

      <Modal open={modal === "document"} onClose={() => setModal(null)} title="מסמך חדש">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            addDocument({
              name: docName,
              type: "PDF",
              caseId: caseItem.id,
              updatedAt: new Date().toISOString().slice(0, 10),
            });
            setDocName("");
            setModal(null);
          }}
        >
          <Input label="שם מסמך" value={docName} onChange={(e) => setDocName(e.target.value)} />
          <Button type="submit">שמור</Button>
        </form>
      </Modal>
    </div>
  );
}
