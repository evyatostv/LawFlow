const faqs = [
  {
    q: "האם חייבים לחבר תשלום מיד?",
    a: "לא. ניתן להתחיל עם ניסיון של 7 ימים ולחבר אמצעי תשלום בכל שלב.",
  },
  {
    q: "מה קורה בסיום הניסיון?",
    a: "אם אין חיוב מוצלח, המנוי מסומן כפג תוקף ותתבקשו לחבר תשלום בעמוד החיוב.",
  },
  {
    q: "אפשר לשנות תוכנית?",
    a: "כן, ניתן לעדכן תוכנית בכל רגע דרך עמוד החיוב בתוך המערכת.",
  },
  {
    q: "האם יש תמיכה בעברית?",
    a: "כן, המערכת נבנתה במיוחד למשרדים בישראל כולל תמיכה מלאה ב-RTL.",
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-ink">שאלות נפוצות</h1>
        <p className="text-steel/80">הנה כמה תשובות מהירות על תהליך ההרשמה והחיוב.</p>
      </div>
      <div className="grid gap-4">
        {faqs.map((item) => (
          <div key={item.q} className="rounded-2xl border border-steel/10 bg-white/80 p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-ink">{item.q}</h2>
            <p className="mt-2 text-sm text-steel/80">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
