"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/components/AppDataProvider";

const quickAddSchema = z.object({
  type: z.enum(["note", "task", "payment", "document"]),
  title: z.string().min(2, "נדרש תיאור קצר"),
  amount: z.string().optional(),
});

type QuickAddValues = z.infer<typeof quickAddSchema>;

export function QuickAdd() {
  const [open, setOpen] = React.useState(false);
  const { addTask, addNote, addPayment, addDocument } = useAppData();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<QuickAddValues>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: { type: "note", title: "" },
  });

  const type = watch("type");

  const onSubmit = (values: QuickAddValues) => {
    if (values.type === "task") {
      addTask({
        title: values.title,
        dueDate: new Date().toISOString().slice(0, 10),
        priority: "MEDIUM",
        repeat: undefined,
      });
    }
    if (values.type === "note") {
      addNote({
        body: values.title,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      });
    }
    if (values.type === "payment") {
      addPayment({
        amount: Number(values.amount ?? 0),
        method: "אשראי",
        status: "PARTIAL",
        date: new Date().toISOString().slice(0, 10),
      });
    }
    if (values.type === "document") {
      addDocument({
        name: values.title,
        type: "PDF",
        clientId: undefined,
        caseId: undefined,
        updatedAt: new Date().toISOString().slice(0, 10),
      });
    }
    reset();
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button id="quick-add-trigger" size="sm" onClick={() => setOpen((v) => !v)}>
        הוספה מהירה
      </Button>
      {open ? (
        <div className="absolute left-0 top-12 z-10 w-80 rounded-2xl border border-steel/10 bg-white p-4 shadow-soft">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <label className="text-xs uppercase text-steel/70">סוג</label>
            <select
              className="h-10 rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
              {...register("type")}
            >
              <option value="note">פתק</option>
              <option value="task">משימה</option>
              <option value="payment">תשלום</option>
              <option value="document">מסמך</option>
            </select>
            <Input label="תיאור" placeholder="מה נוסיף?" {...register("title")} />
            {errors.title ? (
              <span className="text-xs text-red-600">{errors.title.message}</span>
            ) : null}
            {type === "payment" ? (
              <Input label="סכום" placeholder="₪" {...register("amount")} />
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-xs text-steel/70">⌘/Ctrl + J</span>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  ביטול
                </Button>
                <Button type="submit" size="sm">
                  שמור
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
