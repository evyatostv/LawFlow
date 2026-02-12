import * as React from "react";
import clsx from "clsx";

type PickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  pickerType?: "date" | "time" | "datetime-local";
};

export function DateTimePicker({
  label,
  value,
  onChange,
  pickerType = "datetime-local",
  className,
  id,
  ...props
}: PickerProps) {
  const inputId = id ?? React.useId();
  const ref = React.useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    const input = ref.current;
    if (!input) return;
    const anyInput = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof anyInput.showPicker === "function") {
      try {
        anyInput.showPicker();
        return;
      } catch {
        input.focus();
        return;
      }
    }
    input.focus();
  };

  return (
    <label className="flex flex-col gap-2 text-sm text-ink" htmlFor={inputId}>
      {label ? <span className="text-xs uppercase tracking-wide text-steel/70">{label}</span> : null}
      <input
        ref={ref}
        id={inputId}
        type={pickerType}
        className={clsx(
          "h-10 rounded-lg border border-steel/15 bg-white/80 px-3 text-sm text-ink",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun",
          className
        )}
        value={value}
        onClick={openPicker}
        onFocus={openPicker}
        onKeyDown={(event) => {
          if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();
          }
        }}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </label>
  );
}

export function DatePicker(props: Omit<PickerProps, "pickerType">) {
  return <DateTimePicker {...props} pickerType="date" />;
}

export function TimePicker(props: Omit<PickerProps, "pickerType">) {
  return <DateTimePicker {...props} pickerType="time" />;
}
