import * as React from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export function MobileActionBar({
  label,
  onClick,
  variant = "primary",
  disabled,
}: {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <div className={clsx("fixed bottom-0 left-0 right-0 z-40 bg-white/95 p-3 shadow-soft md:hidden")}>
      <Button className="h-12 w-full text-base" variant={variant} onClick={onClick} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}
