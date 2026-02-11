import * as React from "react";
import clsx from "clsx";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-steel/20 bg-white/70 px-3 py-1 text-xs font-medium text-ink",
        className
      )}
      {...props}
    />
  );
}
