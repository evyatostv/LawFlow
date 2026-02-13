"use client";

import * as React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "בית" },
  { href: "/features", label: "יכולות" },
  { href: "/security", label: "אבטחה" },
  { href: "/pricing", label: "תמחור" },
  { href: "/faq", label: "שאלות" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(24,39,80,0.08),_transparent_55%),linear-gradient(135deg,#fdf9f3,#f5fbff_55%,#f7f3ff)] text-ink">
      <header className="sticky top-0 z-40 border-b border-steel/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold text-ink">LawFlow</Link>
          <nav className="hidden items-center gap-6 text-sm text-steel/80 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/login">
              <Button variant="ghost" size="sm">התחברות</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">הרשמה</Button>
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-steel/20 px-3 py-2 text-sm lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="תפריט"
          >
            תפריט
          </button>
        </div>
        <div
          className={clsx(
            "lg:hidden",
            open ? "max-h-96" : "max-h-0 overflow-hidden"
          )}
        >
          <div className="flex flex-col gap-4 px-4 pb-4 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full">התחברות</Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full">הרשמה</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</main>
      <footer className="border-t border-steel/10 bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-steel/70 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <p>LawFlow · ניהול משרד משפטי בסביבה מאובטחת</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/security" className="hover:text-ink">אבטחה</Link>
            <Link href="/pricing" className="hover:text-ink">תמחור</Link>
            <Link href="/faq" className="hover:text-ink">שאלות נפוצות</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
