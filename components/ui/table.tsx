import * as React from "react";
import clsx from "clsx";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={clsx("w-full text-right text-sm", className)} {...props} />
  );
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx("bg-steel/5 text-xs uppercase text-steel", className)} {...props} />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx("divide-y divide-steel/10", className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx("hover:bg-sand/50", className)} {...props} />;
}

export function TableHeader({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={clsx("px-3 py-3 text-right font-semibold", className)} {...props} />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx("px-3 py-3 text-ink", className)} {...props} />;
}
