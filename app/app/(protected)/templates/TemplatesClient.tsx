"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createTemplate } from "@/app/app/(protected)/templates/actions";
import { MobileActionBar } from "@/components/MobileActionBar";

type Template = { id: string; name: string; category: string; body: string };

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
  { accessorKey: "name", header: "שם תבנית" },
  { accessorKey: "category", header: "קטגוריה" },
];

export default function TemplatesClient({ templates }: { templates: Template[] }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ name: "", category: "", body: "" });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("body", form.body);
    const res = await createTemplate(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בשמירת תבנית");
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
          <h2 className="text-2xl font-semibold text-ink">תבניות</h2>
          <p className="text-sm text-steel/70">ניהול תבניות מסמכים</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>תבנית חדשה</Button>
      </div>

      <DataTable data={templates} columns={columns} filterPlaceholder="חיפוש לפי שם" />

      <Modal open={open} onClose={() => setOpen(false)} title="תבנית חדשה">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="שם" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="קטגוריה" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <label className="text-xs uppercase text-steel/70">
            גוף HTML
            <textarea
              className="mt-2 h-40 w-full rounded-lg border border-steel/15 bg-white/80 p-3 text-sm"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="תבנית חדשה" onClick={() => setOpen(true)} />
    </div>
  );
}
