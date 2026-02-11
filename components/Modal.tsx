"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="סגירה"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative z-10 w-full max-w-lg rounded-2xl border border-steel/10 bg-white p-6 shadow-soft",
          "max-h-[90vh] overflow-y-auto"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            סגור
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
