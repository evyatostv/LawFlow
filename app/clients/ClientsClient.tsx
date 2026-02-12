"use client";

import * as React from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { createClient } from "@/app/clients/actions";
import { downloadCsv } from "@/lib/csv";
import { updateSortPreference } from "@/app/preferences/actions";
import { formatCurrency } from "@/lib/format";
import { MobileActionBar } from "@/components/MobileActionBar";

type Client = {
  id: string;
  name: string;
  israeliId: string;
  phone: string;
  email: string;
  address: string;
  tags: string[];
  balance: number;
};

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
    accessorKey: "name",
    header: "שם לקוח",
    cell: ({ row }: any) => (
      <Link className="font-semibold text-ink" href={"/clients/" + row.original.id}>
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "israeliId",
    header: 'ת"ז',
  },
  {
    accessorKey: "phone",
    header: "טלפון",
  },
  {
    accessorKey: "email",
    header: "אימייל",
  },
  {
    accessorKey: "balance",
    header: "יתרה",
    cell: ({ row }: any) => `₪${formatCurrency(row.original.balance)}`,
  },
  {
    id: "tags",
    header: "תגיות",
    cell: ({ row }: any) => (
      <div className="flex flex-wrap gap-2">
        {row.original.tags.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    ),
  },
];

export default function ClientsClient({
  clients,
  initialSorting,
}: {
  clients: Client[];
  initialSorting: { id: string; desc: boolean }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    israeliId: "",
    phone: "",
    email: "",
    address: "",
    tags: "",
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("israeliId", form.israeliId);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("address", form.address);
    formData.append("tags", form.tags);
    const res = await createClient(formData);
    if (!res.ok) {
      setError(res.message ?? "שגיאה בשמירת לקוח");
      setLoading(false);
      return;
    }
    setOpen(false);
    setLoading(false);
    setForm({ name: "", israeliId: "", phone: "", email: "", address: "", tags: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">לקוחות</h2>
          <p className="text-sm text-steel/70">ניהול לקוחות עם פילוח מהיר</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>הוסף לקוח</Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>כל הלקוחות</Badge>
            <Badge>יתרה פתוחה</Badge>
            <Badge>פעילות השבוע</Badge>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              downloadCsv("clients.csv", clients.map((client) => ({
                name: client.name,
                israeliId: client.israeliId,
                phone: client.phone,
                email: client.email,
                balance: client.balance,
              })))
            }
          >
            ייצוא CSV
          </Button>
        </div>
      </Card>

      <DataTable
        data={clients}
        columns={columns}
        filterPlaceholder={'חיפוש לפי שם, טלפון, ת"ז'}
        initialSorting={initialSorting}
        onSortingPersist={(sorting) => updateSortPreference("clients", sorting)}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="לקוח חדש">
        <form className="space-y-3" onSubmit={onSubmit}>
          <Input label="שם" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label='ת"ז' value={form.israeliId} onChange={(e) => setForm({ ...form, israeliId: e.target.value })} />
          <Input label="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="אימייל" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="כתובת" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="תגיות (מופרדות בפסיק)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? "שומר..." : "שמור"}</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>בטל</Button>
          </div>
        </form>
      </Modal>
      <MobileActionBar label="הוסף לקוח" onClick={() => setOpen(true)} />
    </div>
  );
}
