import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingHome() {
  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel/70">LawFlow</p>
          <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            ניהול משרד משפטי אחד שמרגיש כמו צוות מלא
          </h1>
          <p className="text-lg text-steel/80">
            סביבת עבודה אחת שמרכזת תיקים, מסמכים וחשבונות, עם זרימה ברורה משלב ההרשמה ועד לניהול מנויים וחיובים.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup">
              <Button size="lg">התחילו ניסיון חינם</Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" size="lg">לראות את היכולות</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-steel/70">
            <span>אימות אימייל מאובטח</span>
            <span>חיבור תשלום בלחיצה</span>
            <span>גישה מיידית לכלי המשרד</span>
          </div>
        </div>
        <div className="rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">מה קורה אחרי ההרשמה?</h2>
          <ol className="mt-4 grid gap-4 text-sm text-steel/80">
            <li>1. יצירת חשבון עם אימייל, שם משתמש וסיסמה.</li>
            <li>2. אימות אימייל ואישור הבטחת גישה.</li>
            <li>3. בחירת תוכנית עם ניסיון של 7 ימים.</li>
            <li>4. כניסה מיידית למערכת תחת מנוי פעיל.</li>
          </ol>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "שליטה מלאה בתיקים",
            body: "תמונה אחת של כל התיקים, המשימות והדיונים." 
          },
          {
            title: "הפקת מסמכים חכמה",
            body: "תבניות, מסמכים חתומים, ושליחה מאובטחת ללקוחות." 
          },
          {
            title: "הנהלה פיננסית נקייה",
            body: "חשבוניות, קבלות ומעקב תשלומים במקום אחד." 
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-steel/10 bg-white/70 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-steel/80">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
