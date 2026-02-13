"use client";

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setMessage("פרטים שגויים או שהאימייל עדיין לא אומת");
      setLoading(false);
      return;
    }
    window.location.href = "/choose-plan";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">כניסה לחשבון</h2>
        <p className="text-sm text-steel/70">הזינו אימייל וסיסמה כדי להמשיך.</p>

        <form onSubmit={handleLogin} className="mt-6 grid gap-4">
          <Input label="אימייל" placeholder="you@law.co.il" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="סיסמה" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {message ? <p className="text-xs text-red-600">{message}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? "נכנסים..." : "כניסה"}
            </Button>
            <Link href="/signup">
              <Button variant="ghost">פתיחת חשבון חדש</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
