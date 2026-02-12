"use client";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import * as React from "react";

export const dynamic = "force-dynamic";

const faqs = [
  {
    title: "איך מפיקים חשבונית עם מס' הקצאה?",
    body: "בהגדרות חשבונית ניתן להפעיל שדה מס' הקצאה ולהגדיר סף B2B. בעת יצירת חשבונית, המערכת תדרוש את המספר כאשר הסכום עובר את הסף.",
  },
  {
    title: "איך מייצאים מסמכים ל-PDF?",
    body: "פתחו תבנית במסמכים, בחרו לקוח/תיק לתצוגה מקדימה והשתמשו ב'ייצוא ל‑PDF'.",
  },
  {
    title: "מה הדרך המהירה ליצירת משימה?",
    body: "השתמשו בהוספה מהירה או בכפתור יצירת משימה במסך משימות. ניתן להגדיר התראות וחזרות.",
  },
  {
    title: "איך מתבצע גיבוי?",
    body: "גיבוי מתוזמן לפי מדיניות האבטחה. ניתן לצפות בהגדרות הגיבוי באזור אבטחה.",
  },
  {
    title: "איפה נמצאות הגדרות אבטחה?",
    body: "כל בקרות האבטחה נמצאות בלשונית הגדרות תחת סעיף אבטחה בלבד.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = React.useState("");
  const filtered = faqs.filter((faq) => {
    const haystack = `${faq.title} ${faq.body}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">עזרה ומדריכים</h2>
        <p className="text-sm text-steel/70">מדריכים קצרים, שאלות נפוצות ותמיכה בתהליכי עבודה</p>
      </div>

      <Input label="חיפוש בעזרה" placeholder="חפש נושא..." value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold text-ink">חשבוניות ותשלומים</p>
          <p className="text-xs text-steel/70">הנפקת חשבונית, קבלות, מספור ומע״מ</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink">מסמכים ותבניות</p>
          <p className="text-xs text-steel/70">תבניות חוזים, משתנים ויצוא ל‑PDF</p>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink">משימות ויומן</p>
          <p className="text-xs text-steel/70">תזכורות, דיונים, ומיקומים אחרונים</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-ink">וידאו קצר: הנפקת חשבונית</p>
          <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-steel/30 text-xs text-steel/70">
            placeholder
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-ink">וידאו קצר: תבניות והסכמים</p>
          <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-steel/30 text-xs text-steel/70">
            placeholder
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold text-ink">שאלות נפוצות</p>
        <div className="mt-4 space-y-3">
          {filtered.map((faq) => (
            <div key={faq.title} className="rounded-xl border border-steel/10 bg-white/80 p-3">
              <p className="text-sm font-semibold">{faq.title}</p>
              <p className="text-xs text-steel/70">{faq.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-ink">אבטחה וגיבויים</p>
        <p className="text-xs text-steel/70">
          בקרות האבטחה והגיבוי מנוהלות במסך הגדרות תחת סעיף אבטחה. שם ניתן לראות timeout,
          מדיניות גיבוי, והיסטוריית Audit Log.
        </p>
      </Card>
    </div>
  );
}
