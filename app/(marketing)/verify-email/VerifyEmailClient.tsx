"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmailClient() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");

  React.useEffect(() => {
    const run = async () => {
      if (!email || !token) {
        setStatus("error");
        return;
      }
      const res = await signIn("email-verify", { email, token, redirect: false });
      if (res?.error) {
        setStatus("error");
        return;
      }
      setStatus("success");
      window.location.href = "/choose-plan";
    };
    run();
  }, [email, token]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">אימות אימייל</h2>
        {status === "loading" ? (
          <p className="mt-3 text-sm text-steel/70">מאמתים את האימייל שלך...</p>
        ) : null}
        {status === "error" ? (
          <div className="mt-4 space-y-3 text-sm text-red-600">
            <p>לא הצלחנו לאמת את האימייל. ייתכן שהקישור פג תוקף.</p>
            <Link href="/login">
              <Button variant="ghost">חזרה להתחברות</Button>
            </Link>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
