"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppData } from "@/components/AppDataProvider";

const settingsSchema = z.object({
  firmName: z.string().min(2),
  vatNumber: z.string().min(5),
  invoicePrefix: z.string().min(2),
  enableAllocationNumber: z.boolean(),
  allocationThreshold: z.coerce.number().min(0),
  notificationRules: z.string().min(2),
  backupSchedule: z.string().min(2),
  sessionTimeoutMinutes: z.coerce.number().min(5),
  language: z.enum(["he", "en"]),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { resetData } = useAppData();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firmName: "כהן ושות'",
      vatNumber: "515123456",
      invoicePrefix: "INV-",
      enableAllocationNumber: true,
      allocationThreshold: 5000,
      notificationRules: "תזכורת 24 שעות לפני",
      backupSchedule: "יומי 02:00",
      sessionTimeoutMinutes: 30,
      language: "he",
    },
  });

  const onSubmit = (values: SettingsValues) => {
    console.log("Settings", values);
    alert("ההגדרות נשמרו (דמו)");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">הגדרות</h2>
        <p className="text-sm text-steel/70">פרופיל משרד, חיובים, התראות וגיבויים</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-ink">פרופיל משרד</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="שם משרד" {...register("firmName")} />
            <Input label="מספר עוסק" {...register("vatNumber")} />
          </div>
          {errors.firmName ? <p className="mt-2 text-xs text-red-600">{errors.firmName.message}</p> : null}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">הגדרות חשבונית</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="קידומת חשבונית" {...register("invoicePrefix")} />
            <Input label="סף מס' הקצאה B2B" type="number" {...register("allocationThreshold")} />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4" {...register("enableAllocationNumber")} />
            הפעל שדה מס' הקצאה לחשבוניות B2B מעל הסף
          </label>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">התראות וגיבויים</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="כללי התראות" {...register("notificationRules")} />
            <Input label="תזמון גיבוי" {...register("backupSchedule")} />
            <Input label="timeout (דקות)" type="number" {...register("sessionTimeoutMinutes")} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">שפה והעדפות</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="text-xs uppercase text-steel/70">
              שפה
              <select
                className="mt-2 h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm"
                {...register("language")}
              >
                <option value="he">עברית (RTL)</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">שמור הגדרות</Button>
          <Button type="button" variant="ghost" onClick={() => alert("בוטל (דמו)")}>בטל</Button>
          <Button type="button" variant="secondary" onClick={() => resetData()}>
            איפוס נתונים לדמו
          </Button>
        </div>
      </form>
    </div>
  );
}
