"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickAdd } from "@/components/QuickAdd";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "היום" },
  { href: "/clients", label: "לקוחות" },
  { href: "/cases", label: "תיקים" },
  { href: "/tasks", label: "משימות" },
  { href: "/calendar", label: "יומן" },
  { href: "/documents", label: "מסמכים" },
  { href: "/billing", label: "חיובים" },
  { href: "/communications", label: "תקשורת" },
  { href: "/settings", label: "הגדרות" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = React.useState("");
  const [navOpen, setNavOpen] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand via-white to-mint font-body text-ink">
      <div className="flex min-h-screen flex-col lg:grid lg:grid-cols-[260px_1fr]">
        {navOpen ? (
          <button
            type="button"
            aria-label="סגירת תפריט"
            className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        ) : null}
        <aside
          className={clsx(
            "z-30 border-l border-steel/10 bg-white/70 p-6",
            "fixed inset-y-0 right-0 w-72 translate-x-full transition lg:static lg:translate-x-0",
            navOpen ? "translate-x-0" : ""
          )}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink">LawFlow</h1>
            <p className="text-xs text-steel/70">ניהול משרד חכם ורגוע</p>
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
                    : "text-ink hover:bg-sand/70"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-steel/10 bg-white/80 p-4 text-xs text-steel/80">
            <p className="mb-2 font-semibold text-ink">אבטחה</p>
            <ul className="space-y-1">
              <li>2FA פעיל</li>
              <li>הצפנה במנוחה</li>
              <li>גיבוי יומי אוטומטי</li>
              <li>Audit Log בפעולה</li>
              <li>תפקיד יחיד: משתמש סולו</li>
            </ul>
          </div>
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
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  התראות (2)
                </Button>
                <QuickAdd />
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
          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
