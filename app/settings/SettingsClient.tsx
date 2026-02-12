"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Combobox } from "@/components/ui/combobox";
import { updateSettings } from "@/app/settings/actions";

const settingsSchema = z.object({
  firmName: z.string().min(2),
  vatNumber: z.string().min(5),
  firmAddress: z.string().optional(),
  firmPhone: z.string().optional(),
  firmEmail: z.string().optional(),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  invoicePrefix: z.string().min(2),
  invoiceNumberResetYearly: z.boolean(),
  enableAllocationNumber: z.boolean(),
  allocationThreshold: z.coerce.number().min(0),
  notificationRules: z.string().min(2),
  backupSchedule: z.string().min(2),
  sessionTimeoutMinutes: z.coerce.number().min(5),
  invoiceFooter: z.string().optional(),
  language: z.enum(["he", "en"]),
  adminEmail: z.string().email().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsClient({
  initial,
  auditLogs,
  adminEmailEnv,
}: {
  initial: SettingsValues;
  auditLogs: { id: string; action: string; actor: string; createdAt: Date }[];
  adminEmailEnv: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });

  const onSubmit = async (values: SettingsValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    await updateSettings(formData);
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
            <Input label="כתובת" {...register("firmAddress")} />
            <Input label="טלפון" {...register("firmPhone")} />
            <Input label="אימייל" {...register("firmEmail")} />
          </div>
          {errors.firmName ? <p className="mt-2 text-xs text-red-600">{errors.firmName.message}</p> : null}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">הגדרות חשבונית</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="קידומת חשבונית" {...register("invoicePrefix")} />
            <Controller
              control={control}
              name="allocationThreshold"
              render={({ field }) => (
                <CurrencyInput
                  label="סף מס' הקצאה B2B"
                  value={String(field.value ?? "")}
                  onValueChange={(value) => field.onChange(value === "" ? 0 : Number(value))}
                />
              )}
            />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4" {...register("enableAllocationNumber")} />
            הפעל שדה מס' הקצאה לחשבוניות B2B מעל הסף
          </label>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">כללי מספור</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" className="h-4 w-4" {...register("invoiceNumberResetYearly")} />
              איפוס מונה בתחילת שנה
            </label>
            <Input label="דוגמת פורמט" value={`LF-${new Date().getFullYear()}-000001`} readOnly />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">תבניות ומיתוג</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="קישור ללוגו" {...register("logoUrl")} />
            <Input label="קישור לחתימה" {...register("signatureUrl")} />
          </div>
          <Input className="mt-4" label="פוטר חשבונית" {...register("invoiceFooter")} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">התראות</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="כללי התראות" {...register("notificationRules")} />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">גיבויים</h3>
          <div className="mt-4 text-sm text-steel/70">
            גיבוי אוטומטי נשמר לפי מדיניות האבטחה. ניתן לנהל לוחות זמנים באזור האבטחה.
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">אבטחה</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Input label="אימייל מנהל (ENV)" value={adminEmailEnv} readOnly />
            <Input label="אימייל מנהל (ניתן להגדרה)" {...register("adminEmail")} />
            <Input label="Timeout (דקות)" type="number" {...register("sessionTimeoutMinutes")} />
            <Input label="תזמון גיבוי" {...register("backupSchedule")} />
          </div>
          <div className="mt-4 rounded-xl border border-steel/10 bg-white/80 p-3 text-xs text-steel/70">
            <p className="font-semibold text-ink">Audit Log אחרון</p>
            <ul className="mt-2 space-y-1">
              {auditLogs.map((log) => (
                <li key={log.id}>
                  {new Date(log.createdAt).toISOString().slice(0, 16).replace("T", " ")} · {log.action} · {log.actor}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-ink">שפה והעדפות</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <Combobox
                  label="שפה"
                  items={[
                    { value: "he", label: "עברית (RTL)" },
                    { value: "en", label: "English" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "שומר..." : "שמור הגדרות"}</Button>
          <Button type="button" variant="ghost">בטל</Button>
        </div>
      </form>
    </div>
  );
}
