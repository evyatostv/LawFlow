"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker, DateTimePicker } from "@/components/ui/date-time-picker";
import { Modal } from "@/components/Modal";
import { SectionHeader } from "@/components/SectionHeader";
import { createNote } from "@/app/app/(protected)/notes/actions";
import { createTask } from "@/app/app/(protected)/tasks/actions";
import { createEvent } from "@/app/app/(protected)/calendar/actions";
import { createInvoice } from "@/app/app/(protected)/receivables/actions";
import { createDocument } from "@/app/app/(protected)/documents/actions";
import { updateCase, deleteCase } from "@/app/app/(protected)/cases/actions";
import { Combobox } from "@/components/ui/combobox";
import { MobileActionBar } from "@/components/MobileActionBar";

type CaseDetail = {
  id: string;
  caseNumber: string;
  court: string;
  opposingParty: string;
  status: string;
  description?: string | null;
  clientId: string;
  tasks: { id: string; title: string; dueDate: Date }[];
  events: { id: string; title: string; startAt: Date }[];
  documents: { id: string; name: string; type: string }[];
  notes: { id: string; body: string; createdAt: Date }[];
  invoices: { id: string; status: string }[];
};

type Client = { id: string; name: string };

export default function CaseDetailClient({ caseItem, clients }: { caseItem: CaseDetail; clients: Client[] }) {
  const [modal, setModal] = React.useState<
    null | "note" | "task" | "event" | "invoice" | "document"
  >(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");
  const [eventTitle, setEventTitle] = React.useState("");
  const [invoiceTotal, setInvoiceTotal] = React.useState("");
  const [docName, setDocName] = React.useState("");
  const [taskDueDate, setTaskDueDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [eventStart, setEventStart] = React.useState(new Date().toISOString().slice(0, 16));
  const [eventEnd, setEventEnd] = React.useState(new Date().toISOString().slice(0, 16));
  const [caseForm, setCaseForm] = React.useState({
    caseNumber: caseItem.caseNumber,
    court: caseItem.court,
    opposingParty: caseItem.opposingParty,
    status: caseItem.status,
    description: caseItem.description ?? "",
    clientId: caseItem.clientId,
  });

  const submit = async (handler: () => Promise<unknown>) => {
    setLoading(true);
    await handler();
    setLoading(false);
    setModal(null);
  };

  const onUpdateCase = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", caseItem.id);
    formData.append("caseNumber", caseForm.caseNumber);
    formData.append("court", caseForm.court);
    formData.append("opposingParty", caseForm.opposingParty);
    formData.append("status", caseForm.status);
    formData.append("clientId", caseForm.clientId);
    if (caseForm.description) formData.append("description", caseForm.description);
    const res = await updateCase(formData);
    if (!res.ok) setError(res.message ?? "שגיאה בעדכון");
    setLoading(false);
  };

  const onDeleteCase = async () => {
    setLoading(true);
    const res = await deleteCase(caseItem.id);
    if (!res.ok) {
      setError(res.message ?? "שגיאה במחיקה");
      setLoading(false);
      return;
    }
    window.location.href = "/app/cases";
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
        <form
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateCase();
          }}
        >
          <Input label="מספר תיק" value={caseForm.caseNumber} onChange={(e) => setCaseForm({ ...caseForm, caseNumber: e.target.value })} />
          <Input label="בית משפט" value={caseForm.court} onChange={(e) => setCaseForm({ ...caseForm, court: e.target.value })} />
          <Input label="צד נגדי" value={caseForm.opposingParty} onChange={(e) => setCaseForm({ ...caseForm, opposingParty: e.target.value })} />
          <Combobox
            label="סטטוס"
            items={[
              { value: "OPEN", label: "פתוח" },
              { value: "PENDING", label: "ממתין" },
              { value: "CLOSED", label: "סגור" },
            ]}
            value={caseForm.status}
            onChange={(value) => setCaseForm({ ...caseForm, status: value })}
          />
          <Combobox
            label="לקוח"
            items={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={caseForm.clientId}
            onChange={(value) => setCaseForm({ ...caseForm, clientId: value })}
          />
          <Input label="תיאור" value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={onDeleteCase} disabled={loading}>
              מחק תיק
            </Button>
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
        </form>
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
            formData.append("dueDate", taskDueDate);
            formData.append("priority", "MEDIUM");
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createTask(formData));
            setTaskTitle("");
            setTaskDueDate(new Date().toISOString().slice(0, 10));
          }}
        >
          <Input label="כותרת" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <DatePicker label="תאריך יעד" value={taskDueDate} onChange={setTaskDueDate} />
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
            formData.append("startAt", eventStart);
            formData.append("endAt", eventEnd);
            formData.append("type", "HEARING");
            formData.append("caseId", caseItem.id);
            formData.append("clientId", caseItem.clientId);
            submit(() => createEvent(formData));
            setEventTitle("");
            setEventStart(new Date().toISOString().slice(0, 16));
            setEventEnd(new Date().toISOString().slice(0, 16));
          }}
        >
          <Input label="כותרת" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
          <DateTimePicker label="התחלה" value={eventStart} onChange={setEventStart} />
          <DateTimePicker label="סיום" value={eventEnd} onChange={setEventEnd} />
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
          <CurrencyInput label="סכום" value={invoiceTotal} onValueChange={(value) => setInvoiceTotal(value)} />
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
      <MobileActionBar label={loading ? "שומר..." : "שמור תיק"} onClick={onUpdateCase} disabled={loading} />
    </div>
  );
}
