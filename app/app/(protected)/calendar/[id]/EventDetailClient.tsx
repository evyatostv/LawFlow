"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { updateEvent, deleteEvent } from "@/app/app/(protected)/calendar/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type Client = { id: string; name: string };
type CaseItem = { id: string; caseNumber: string };

type EventDetail = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  type: string;
  location?: string | null;
  clientId?: string | null;
  caseId?: string | null;
};

export default function EventDetailClient({
  event,
  clients,
  cases,
}: {
  event: EventDetail;
  clients: Client[];
  cases: CaseItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    title: event.title,
    startAt: event.startAt.toISOString().slice(0, 16),
    endAt: event.endAt.toISOString().slice(0, 16),
    type: event.type,
    location: event.location ?? "",
    clientId: event.clientId ?? "",
    caseId: event.caseId ?? "",
  });

  const saveEvent = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("id", event.id);
    formData.append("title", form.title);
    formData.append("startAt", form.startAt);
    formData.append("endAt", form.endAt);
    formData.append("type", form.type);
    formData.append("location", form.location);
    if (form.clientId) formData.append("clientId", form.clientId);
    if (form.caseId) formData.append("caseId", form.caseId);
    const res = await updateEvent(formData);
    if (!res.ok) setError(res.message ?? "שגיאה בעדכון");
    setLoading(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEvent();
  };

  const onDelete = async () => {
    setLoading(true);
    await deleteEvent(event.id);
    router.push("/app/calendar");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">עריכת אירוע</h2>
        <p className="text-sm text-steel/70">עדכון פרטי דיון או פגישה</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label="כותרת" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <DateTimePicker label="התחלה" value={form.startAt} onChange={(value) => setForm({ ...form, startAt: value })} />
        <DateTimePicker label="סיום" value={form.endAt} onChange={(value) => setForm({ ...form, endAt: value })} />
        <Combobox
          label="סוג"
          items={[
            { value: "HEARING", label: "דיון" },
            { value: "MEETING", label: "פגישה" },
          ]}
          value={form.type}
          onChange={(value) => setForm({ ...form, type: value })}
        />
        <Input label="מיקום" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
            מחק אירוע
          </Button>
        </div>
      </form>
      <MobileActionBar label={loading ? "שומר..." : "שמור אירוע"} onClick={saveEvent} disabled={loading} />
    </div>
  );
}
