"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickAdd } from "@/components/QuickAdd";
import clsx from "clsx";

const navItems = [
  { href: "/app", label: "היום" },
  { href: "/app/clients", label: "לקוחות" },
  { href: "/app/cases", label: "תיקים" },
  { href: "/app/tasks", label: "משימות" },
  { href: "/app/calendar", label: "יומן" },
  { href: "/app/documents", label: "מסמכים" },
  { href: "/app/templates", label: "תבניות" },
  { href: "/app/invoices", label: "חשבוניות" },
  { href: "/app/billing", label: "מנוי" },
  { href: "/app/communications", label: "תקשורת" },
  { href: "/app/help", label: "עזרה" },
  { href: "/app/settings", label: "הגדרות" },
];

type Summary = { dueToday: number; unpaid: number };

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = React.useState("");
  const [navOpen, setNavOpen] = React.useState(false);
  const [notifyOpen, setNotifyOpen] = React.useState(false);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [summary, setSummary] = React.useState<Summary>({ dueToday: 0, unpaid: 0 });

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const input = document.getElementById("global-search");
        if (input instanceof HTMLInputElement) {
          input.focus();
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        const trigger = document.getElementById("quick-add-trigger");
        if (trigger instanceof HTMLButtonElement) {
          trigger.click();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/summary");
        if (!res.ok) return;
        const data = (await res.json()) as Summary;
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSummary();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand via-white to-mint font-body text-ink">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[260px_1fr]">
        {navOpen ? (
          <button
            type="button"
            aria-label="סגירת תפריט"
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}
        <aside
          className={clsx(
            "z-50 border-l border-steel/10 bg-white/90 p-6",
            "fixed inset-0 translate-x-full transition lg:static lg:translate-x-0",
            "lg:inset-y-0 lg:right-0 lg:w-72",
            navOpen ? "translate-x-0" : ""
          )}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ink">LawFlow</h1>
                <p className="text-xs text-steel/70">ניהול משרד חכם ורגוע</p>
              </div>
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setNavOpen(false)}>
                סגור
              </Button>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-xl px-4 py-2 text-sm transition",
                  pathname === item.href
                    ? "bg-ink text-white shadow-soft"
                    : "text-ink"
                )}
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex flex-1 flex-col">
          <header className="flex flex-col gap-4 border-b border-steel/10 bg-white/70 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setNavOpen(true)}
                >
                  תפריט
                </Button>
                <span className="text-xs text-steel/70 lg:hidden">LawFlow</span>
              </div>
              <div className="relative flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setNotifyOpen((prev) => !prev);
                    setQuickAddOpen(false);
                  }}
                >
                  התראות ({summary.dueToday + summary.unpaid})
                </Button>
                {notifyOpen ? (
                  <div className="absolute left-0 top-12 z-40 w-64 rounded-2xl border border-steel/10 bg-white p-4 shadow-soft">
                    <p className="text-sm font-semibold text-ink">תזכורות מהירות</p>
                    <div className="mt-2 space-y-2 text-xs text-steel/80">
                      <div>משימות להיום: {summary.dueToday}</div>
                      <div>חשבוניות פתוחות: {summary.unpaid}</div>
                    </div>
                  </div>
                ) : null}
                <QuickAdd
                  open={quickAddOpen}
                  onOpenChange={(next) => {
                    setQuickAddOpen(next);
                    if (next) setNotifyOpen(false);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Input
                id="global-search"
                label="חיפוש גלובלי"
                placeholder="חיפוש לקוח, תיק, מסמך..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full sm:w-80"
              />
              <span className="text-xs text-steel/70">⌘/Ctrl + K</span>
            </div>
          </header>
          <div className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">{children}</div>
        </main>
      </div>
      <div className="lg:hidden" />
    </div>
  );
}
