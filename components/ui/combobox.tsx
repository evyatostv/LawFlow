import * as React from "react";
import clsx from "clsx";

type ComboboxItem = {
  value: string;
  label: string;
  keywords?: string;
};

type ComboboxProps = {
  label?: string;
  placeholder?: string;
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  allowCustomValue?: boolean;
  className?: string;
  id?: string;
  disabled?: boolean;
};

export function Combobox({
  label,
  placeholder,
  items,
  value,
  onChange,
  allowCustomValue,
  className,
  id,
  disabled,
}: ComboboxProps) {
  const inputId = id ?? React.useId();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const selected = items.find((item) => item.value === value);
  const inputValue = allowCustomValue ? value : selected?.label ?? query;

  const filtered = items.filter((item) => {
    const haystack = `${item.label} ${item.keywords ?? ""}`.toLowerCase();
    const needle = (allowCustomValue ? value : query).toLowerCase();
    return haystack.includes(needle);
  });

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    if (open) {
      setHighlighted(0);
    }
  }, [open, value]);

  return (
    <label className="flex flex-col gap-2 text-sm text-ink" htmlFor={inputId}>
      {label ? <span className="text-xs uppercase tracking-wide text-steel/70">{label}</span> : null}
      <div ref={containerRef} className="relative">
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            "h-10 w-full rounded-lg border border-steel/15 bg-white/80 px-3 text-sm text-ink",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun",
            className
          )}
          value={inputValue}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            if (allowCustomValue) {
              onChange(event.target.value);
            } else {
              setQuery(event.target.value);
            }
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (!open) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlighted((prev) => Math.max(prev - 1, 0));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const item = filtered[highlighted];
              if (item) {
                onChange(item.value);
                setOpen(false);
                setQuery("");
              }
            }
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        {open ? (
          <div
            id={`${inputId}-listbox`}
            role="listbox"
            className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-steel/10 bg-white shadow-soft"
          >
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-steel/70">אין התאמות</div>
            ) : (
              filtered.map((item, index) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={value === item.value}
                  key={item.value}
                  className={clsx(
                    "flex w-full items-center justify-between px-3 py-2 text-right text-sm",
                    index === highlighted ? "bg-sand/70" : ""
                  )}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span>{item.label}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    </label>
  );
}
