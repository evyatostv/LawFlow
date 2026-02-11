import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/SectionHeader";
import { getClients, getEvents, getInvoices, getTasks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [clients, events, invoices, tasks] = await Promise.all([
    getClients(),
    getEvents(),
    getInvoices(),
    getTasks(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-semibold text-ink">שלום, עו״ד</h2>
        <p className="text-sm text-steel/70">סקירה של היום במשרד</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>דיונים היום</CardTitle>
            <Badge>{events.length}</Badge>
          </CardHeader>
          <CardContent>
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between text-sm">
                <span>{event.title}</span>
                <span className="text-steel/70">
                  {event.startAt.toISOString().slice(11, 16)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>משימות דחופות</CardTitle>
            <Badge>{tasks.filter((task) => task.priority === "HIGH" || task.priority === "URGENT").length}</Badge>
          </CardHeader>
          <CardContent>
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between text-sm">
                <span>{task.title}</span>
                <span className="text-steel/70">{task.dueDate.toISOString().slice(0, 10)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>מעקב פתוח</CardTitle>
            <Badge>3</Badge>
          </CardHeader>
          <CardContent>
            <p>קדם משפט מול מנורה</p>
            <p>בקשת ארכה מול עיריה</p>
            <p>קבלת חתימה על הסכם</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>חשבוניות פתוחות</CardTitle>
            <Badge>{invoices.filter((invoice) => invoice.status !== "PAID").length}</Badge>
          </CardHeader>
          <CardContent>
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between text-sm">
                <span>{invoice.number}</span>
                <span className="text-steel/70">₪{invoice.total.toLocaleString("he-IL")}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <SectionHeader title="פעילות לקוחות אחרונה" />
          <div className="space-y-3">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{client.name}</p>
                  <p className="text-xs text-steel/70">עודכן לאחרונה היום</p>
                </div>
                <span className="text-sm text-ink">יתרה ₪{client.balance.toLocaleString("he-IL")}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="תשלומים שלא נסגרו" />
          <div className="space-y-3 text-sm">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between">
                <span>{invoice.number}</span>
                <span className="text-steel/70">{invoice.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-mint/70 p-3 text-xs text-steel">
            טיפ: אפשר להגדיר התראות תשלום אוטומטיות מהגדרות.
          </div>
        </Card>
      </div>
    </div>
  );
}
