"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">כניסה מאובטחת</h2>
        <p className="text-sm text-steel/70">שלב 1: אימייל וסיסמה</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input label="אימייל" placeholder="you@law.co.il" />
          <Input label="סיסמה" type="password" placeholder="••••••" />
        </div>
        <div className="mt-6">
          <p className="text-sm text-steel/70">שלב 2: אימות דו-שלבי</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            <Input label="קוד חד פעמי" placeholder="123456" />
            <Input label="קוד גיבוי" placeholder="ABCD-EFGH" />
          </div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button>כניסה</Button>
          <Button variant="ghost">שלח קוד חדש</Button>
        </div>
      </Card>
    </div>
  );
}
