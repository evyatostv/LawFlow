import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailStatic() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0">
      <Card>
        <h2 className="text-2xl font-semibold text-ink">אימות אימייל</h2>
        <p className="mt-3 text-sm text-steel/70">אימות אימייל זמין בגרסה המארחת בשרת.</p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="ghost">חזרה לדף הבית</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
