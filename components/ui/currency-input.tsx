import * as React from "react";
import clsx from "clsx";

type CurrencyInputProps = {
  label?: string;
  value: string;
  onValueChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
};

function formatCurrencyInput(value: string) {
  if (!value) return "";
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return "";
  const parts = cleaned.split(".");
  const integer = parts[0] ? String(parseInt(parts[0], 10)) : "0";
  const decimals = parts[1] ? parts[1].slice(0, 2) : "";
  const withCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimals ? `${withCommas}.${decimals}` : withCommas;
}

function sanitizeCurrencyInput(value: string) {
  if (!value) return "";
  const cleaned = value.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  const integer = parts[0] ?? "";
  const decimals = parts[1] ? parts[1].slice(0, 2) : "";
  return decimals ? `${integer}.${decimals}` : integer;
}

export function CurrencyInput({
  label,
  value,
  onValueChange,
  placeholder,
  className,
  id,
  name,
  disabled,
}: CurrencyInputProps) {
  const inputId = id ?? React.useId();
  const displayValue = formatCurrencyInput(value);

  return (
    <label className="flex flex-col gap-2 text-sm text-ink" htmlFor={inputId}>
      {label ? <span className="text-xs uppercase tracking-wide text-steel/70">{label}</span> : null}
      <input
        id={inputId}
        name={name}
        disabled={disabled}
        inputMode="decimal"
        placeholder={placeholder}
        className={clsx(
          "h-10 rounded-lg border border-steel/15 bg-white/80 px-3 text-sm text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun",
          className
        )}
        value={displayValue}
        onChange={(event) => {
          const next = sanitizeCurrencyInput(event.target.value);
          onValueChange(next);
        }}
      />
    </label>
  );
}

export function parseCurrency(value: string) {
  if (!value) return 0;
  const normalized = value.replace(/[^\d.]/g, "");
  const num = Number(normalized);
  return Number.isNaN(num) ? 0 : num;
}
