import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlights = [
  "אימות אימייל עם טוקן חד-פעמי",
  "הפרדת נתונים בין לקוחות ומנויים",
  "יומני Audit לכל פעולת משתמש",
  "מודל הרשאות מבוסס מנוי וסטטוס",
];

export default function SecurityPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink">אבטחה מובנית בכל שכבה</h1>
        <p className="text-steel/80">
          אנו משקיעים באבטחה כדי שהצוות יוכל לעבוד בראש שקט, עם בקרה מלאה על גישה ונתונים.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">מה בפנים?</h2>
          <ul className="mt-4 grid gap-3 text-sm text-steel/80">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-ink">מדיניות תשלום בטוחה</h2>
          <p className="mt-3 text-sm text-steel/80">
            מערכת החיוב משתמשת בספק תשלומים חיצוני. ניתן לחבר אמצעי תשלום בכל שלב של הניסיון.
          </p>
          <Link href="/signup" className="mt-6 inline-flex">
            <Button>לצאת לדרך</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
