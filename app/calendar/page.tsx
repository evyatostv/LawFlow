"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { events, Event } from "@/lib/data";

const columns: ColumnDef<Event>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  { accessorKey: "title", header: "אירוע" },
  { accessorKey: "startAt", header: "התחלה" },
  { accessorKey: "endAt", header: "סיום" },
  {
    accessorKey: "type",
    header: "סוג",
    cell: ({ row }) => <Badge>{row.original.type}</Badge>,
  },
  { accessorKey: "location", header: "מיקום" },
];

export default function CalendarPage() {
  const [view, setView] = React.useState<"day" | "week">("day");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">יומן</h2>
          <p className="text-sm text-steel/70">דיונים ופגישות בחתך יום ושבוע</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={view === "day" ? "primary" : "ghost"} onClick={() => setView("day")}>
            יום
          </Button>
          <Button size="sm" variant={view === "week" ? "primary" : "ghost"} onClick={() => setView("week")}>
            שבוע
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-steel/10 bg-white/80 p-4">
          <p className="text-sm font-semibold">תצוגת {view === "day" ? "יום" : "שבוע"}</p>
          <div className="mt-3 space-y-3 text-sm">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-xl bg-white/70 p-3">
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-xs text-steel/70">{event.location}</p>
                </div>
                <span className="text-xs text-steel/70">{event.startAt}</span>
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
    </div>
  );
}
