import * as React from "react";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? React.useId();
  return (
    <label className="flex flex-col gap-2 text-sm text-ink" htmlFor={inputId}>
      {label ? <span className="text-xs uppercase tracking-wide text-steel/70">{label}</span> : null}
      <input
        id={inputId}
        className={clsx(
          "h-10 rounded-lg border border-steel/15 bg-white/80 px-3 text-sm text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun",
          className
        )}
        {...props}
      />
    </label>
  );
}
