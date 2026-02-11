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
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-l border-steel/10 bg-white/70 p-6">
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
        <main className="flex flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-steel/10 bg-white/70 px-8 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="global-search"
                label="חיפוש גלובלי"
                placeholder="חיפוש לקוח, תיק, מסמך..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-80"
              />
              <span className="text-xs text-steel/70">⌘/Ctrl + K</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                התראות (2)
              </Button>
              <QuickAdd />
            </div>
          </header>
          <div className="flex-1 px-8 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
