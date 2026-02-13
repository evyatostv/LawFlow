import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "מסכי עבודה ממוקדים",
    body: "כל צוות רואה את המידע הרלוונטי לו בלי להסיט את הפוקוס מהמשימות.",
  },
  {
    title: "אוטומציות חכמות",
    body: "תזכורות, מעקבים וניהול דדליינים שמחובר ללוח השנה.",
  },
  {
    title: "מסמכים מאובטחים",
    body: "ניהול גרסאות ושיתוף מסמכים עם בקרות גישה מתקדמות.",
  },
  {
    title: "חיובים ומנויים",
    body: "שקיפות מלאה בתהליך החיוב, כולל ניסיונות חינם וחיובים אוטומטיים.",
  },
  {
    title: "לוחות בקרה מותאמים",
    body: "התאימו את המערכת להרגלי העבודה של המשרד.",
  },
  {
    title: "גישה מכל מקום",
    body: "מובייל ראשון, עם ניווט ברור ותצוגה מלאה במסכים קטנים.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-ink">יכולות שמרגישות כמו צוות תומך</h1>
        <p className="text-steel/80">
          LawFlow מרכזת תהליכים, מסמכים וחיובים, כך שהמשרד נשאר ממוקד בעבודה מול לקוחות.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-steel/10 bg-white/80 p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">{feature.title}</h2>
            <p className="mt-2 text-sm text-steel/80">{feature.body}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-steel/10 bg-white/80 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">רוצים להתחיל?</h2>
            <p className="text-sm text-steel/80">הרשמו לניסיון של 7 ימים ולבחירת תוכנית שמתאימה לכם.</p>
          </div>
          <Link href="/signup">
            <Button>התחלת ניסיון חינם</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
