"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Combobox } from "@/components/ui/combobox";
import { Modal } from "@/components/Modal";
import { createEvent } from "@/app/app/(protected)/calendar/actions";
import { formatDateTime } from "@/lib/format";
import { updateSortPreference } from "@/app/app/(protected)/preferences/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

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
  {
    accessorKey: "title",
    header: "אירוע",
    cell: ({ row }: any) => (
      <a className="font-semibold text-ink" href={`/app/calendar/${row.original.id}`}>
        {row.original.title}
      </a>
    ),
  },
  {
    accessorKey: "startAt",
    header: "התחלה",
    cell: ({ row }: any) => formatDateTime(row.original.startAt),
  },
  {
    accessorKey: "endAt",
    header: "סיום",
    cell: ({ row }: any) => formatDateTime(row.original.endAt),
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
  recentLocations,
  initialSorting,
}: {
  events: EventItem[];
  clients: Client[];
  cases: CaseItem[];
  recentLocations: string[];
  initialSorting: { id: string; desc: boolean }[];
}) {
  const [view, setView] = React.useState<"day" | "week">("day");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
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
    setError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("startAt", form.startAt);
    formData.append("endAt", form.endAt);
    formData.append("type", form.type);
    formData.append("location", form.location);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    const res = await createEvent(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה ביצירת אירוע");
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
                  {formatDateTime(eventItem.startAt)}
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

      <DataTable
        data={events}
        columns={columns}
        filterPlaceholder="חיפוש לפי אירוע או מיקום"
        initialSorting={initialSorting}
        onSortingPersist={(sorting) => updateSortPreference("events", sorting)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="אירוע חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <DateTimePicker label="התחלה" value={form.startAt} onChange={(value) => setForm({ ...form, startAt: value })} />
          <DateTimePicker label="סיום" value={form.endAt} onChange={(value) => setForm({ ...form, endAt: value })} />
          <Combobox
            label="מיקום"
            placeholder="התחל להקליד..."
            items={recentLocations.map((loc) => ({ value: loc, label: loc }))}
            value={form.location}
            onChange={(value) => setForm({ ...form, location: value })}
            allowCustomValue
          />
          <Combobox
            label="סוג"
            items={[
              { value: "HEARING", label: "דיון" },
              { value: "MEETING", label: "פגישה" },
            ]}
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
          />
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
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="אירוע חדש" onClick={() => setOpen(true)} />
    </div>
  );
}
