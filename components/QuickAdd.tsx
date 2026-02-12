"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Combobox } from "@/components/ui/combobox";
import { createQuickAdd } from "@/app/quick-add/actions";

const quickAddSchema = z.object({
  type: z.enum(["note", "task", "payment", "document"]),
  title: z.string().min(2, "נדרש תיאור קצר"),
  amount: z.string().optional(),
});

type QuickAddValues = z.infer<typeof quickAddSchema>;

export function QuickAdd({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QuickAddValues>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: { type: "note", title: "" },
  });

  const type = watch("type");

  React.useEffect(() => {
    register("type");
    register("amount");
  }, [register]);

  const onSubmit = async (values: QuickAddValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", values.type);
    formData.append("title", values.title);
    if (values.amount) formData.append("amount", values.amount);
    await createQuickAdd(formData);
    reset();
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <div className="relative">
      <Button id="quick-add-trigger" size="sm" onClick={() => onOpenChange(!open)}>
        הוספה מהירה
      </Button>
      {open ? (
        <div className="absolute left-0 top-12 z-50 w-80 rounded-2xl border border-steel/10 bg-white p-4 shadow-soft">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <Combobox
              label="סוג"
              items={[
                { value: "note", label: "פתק" },
                { value: "task", label: "משימה" },
                { value: "payment", label: "תשלום" },
                { value: "document", label: "מסמך" },
              ]}
              value={watch("type")}
              onChange={(value) => setValue("type", value as QuickAddValues["type"])}
            />
            <Input label="תיאור" placeholder="מה נוסיף?" {...register("title")} />
            {errors.title ? (
              <span className="text-xs text-red-600">{errors.title.message}</span>
            ) : null}
            {type === "payment" ? (
              <CurrencyInput
                label="סכום"
                placeholder="₪"
                value={watch("amount") ?? ""}
                onValueChange={(next) => {
                  setValue("amount", next);
                }}
              />
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-xs text-steel/70">⌘/Ctrl + J</span>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  ביטול
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "שומר..." : "שמור"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
