"use client";

import * as React from "react";
import Link from "next/link";
import { registerAccount } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    const res = await registerAccount(formData);
    if (!res.ok) {
      setStatus("error");
      setMessage(res.message ?? "שגיאה בהרשמה");
      return;
    }
    setStatus("success");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">פתיחת חשבון חדש</h2>
        <p className="text-sm text-steel/70">השלב הראשון הוא יצירת חשבון ואימות האימייל.</p>

        {status === "success" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            נשלח אליך אימייל לאימות. לאחר האימות תופנה לבחירת תוכנית.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Input label="אימייל" placeholder="you@law.co.il" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="שם משתמש" placeholder="lawyer" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input
            label="סיסמה"
            type="password"
            placeholder="לפחות 8 תווים"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message ? <p className="text-xs text-red-600">{message}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={status === "loading" || !email || !username || !password}>
              {status === "loading" ? "יוצרים חשבון..." : "הרשמה"}
            </Button>
            <Link href="/login">
              <Button variant="ghost">יש לכם חשבון? התחברות</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
