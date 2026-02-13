import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginStatic() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">כניסה לחשבון</h2>
        <p className="text-sm text-steel/70">התחברות זמינה בגרסה המארחת בשרת.</p>
        <div className="mt-6 rounded-2xl border border-steel/10 bg-white/80 p-4 text-sm text-steel/80">
          גרסה זו היא הדגמה סטטית בלבד. כדי להתחבר, עברו לגרסה בענן.
        </div>
        <div className="mt-6">
          <Link href="/">
            <Button variant="ghost">חזרה לדף הבית</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
