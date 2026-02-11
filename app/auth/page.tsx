"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendOtp } from "@/app/auth/actions";

export default function AuthPage() {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState<"email" | "code">("email");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("email", email);
    const res = await sendOtp(formData);
    if (res.ok) {
      setStep("code");
    } else {
      setMessage(res.message ?? "שגיאה בשליחה");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const res = await signIn("credentials", {
      email,
      code,
      redirect: false,
    });
    if (res?.error) {
      setMessage("קוד לא תקין");
      setLoading(false);
      return;
    }
    window.location.href = "/";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">כניסה מאובטחת</h2>
        <p className="text-sm text-steel/70">אימות בדוא"ל עם קוד חד פעמי</p>

        <div className="mt-4 grid gap-4">
          <Input label="אימייל" placeholder="you@law.co.il" value={email} onChange={(e) => setEmail(e.target.value)} />
          {step === "code" ? (
            <Input label="קוד חד פעמי" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
          ) : null}
        </div>

        {message ? <p className="mt-3 text-xs text-red-600">{message}</p> : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {step === "email" ? (
            <Button onClick={handleSend} disabled={loading || !email}>
              שלח קוד
            </Button>
          ) : (
            <Button onClick={handleLogin} disabled={loading || !code}>
              כניסה
            </Button>
          )}
          <Button variant="ghost" onClick={() => setStep("email")}>
            ערוך אימייל
          </Button>
        </div>
      </Card>
    </div>
  );
}
