import * as React from "react";
import { Button } from "@/components/ui/button";

export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; onClick?: () => void };
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {action ? (
        <Button size="sm" variant="ghost" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
