"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createEvent } from "@/app/calendar/actions";

type EventItem = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  type: string;
  location?: string | null;
};

type Client = { id: string; name: string };

type CaseItem = { id: string; caseNumber: string };

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
  { accessorKey: "title", header: "אירוע" },
  {
    accessorKey: "startAt",
    header: "התחלה",
    cell: ({ row }: any) => new Date(row.original.startAt).toISOString().slice(0, 16).replace("T", " "),
  },
  {
    accessorKey: "endAt",
    header: "סיום",
    cell: ({ row }: any) => new Date(row.original.endAt).toISOString().slice(0, 16).replace("T", " "),
  },
  {
    accessorKey: "type",
    header: "סוג",
    cell: ({ row }: any) => <Badge>{row.original.type}</Badge>,
  },
  { accessorKey: "location", header: "מיקום" },
];

export default function CalendarClient({
  events,
  clients,
  cases,
}: {
  events: EventItem[];
  clients: Client[];
  cases: CaseItem[];
}) {
  const [view, setView] = React.useState<"day" | "week">("day");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date().toISOString().slice(0, 16),
    type: "MEETING",
    location: "",
    clientId: "",
    caseId: "",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("startAt", form.startAt);
    formData.append("endAt", form.endAt);
    formData.append("type", form.type);
    formData.append("location", form.location);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    await createEvent(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">יומן</h2>
          <p className="text-sm text-steel/70">דיונים ופגישות בחתך יום ושבוע</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={view === "day" ? "primary" : "ghost"} onClick={() => setView("day")}>
            יום
          </Button>
          <Button size="sm" variant={view === "week" ? "primary" : "ghost"} onClick={() => setView("week")}>
            שבוע
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
            אירוע חדש
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-steel/10 bg-white/80 p-4">
          <p className="text-sm font-semibold">תצוגת {view === "day" ? "יום" : "שבוע"}</p>
          <div className="mt-3 space-y-3 text-sm">
            {events.map((eventItem) => (
              <div key={eventItem.id} className="flex items-center justify-between rounded-xl bg-white/70 p-3">
                <div>
                  <p className="font-semibold">{eventItem.title}</p>
                  <p className="text-xs text-steel/70">{eventItem.location}</p>
                </div>
                <span className="text-xs text-steel/70">
                  {new Date(eventItem.startAt).toISOString().slice(0, 16).replace("T", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-steel/10 bg-sand/70 p-4 text-sm">
          <p className="font-semibold text-ink">תזכורות</p>
          <ul className="mt-2 space-y-2 text-steel/80">
            <li>תזכורת אוטומטית 24 שעות לפני דיון</li>
            <li>שליחת הודעת WhatsApp ללקוח לפני פגישה</li>
            <li>התראה מסכמת בסוף היום</li>
          </ul>
        </div>
      </div>

      <DataTable data={events} columns={columns} filterPlaceholder="חיפוש לפי אירוע או מיקום" />

      <Modal open={open} onClose={() => setOpen(false)} title="אירוע חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="התחלה" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          <Input label="סיום" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          <Input label="מיקום" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            סוג
            <select
              className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="HEARING">דיון</option>
              <option value="MEETING">פגישה</option>
            </select>
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
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
