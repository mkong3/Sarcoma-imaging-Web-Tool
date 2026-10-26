import type { Option } from "@/data/inputOptions";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2";

interface RadioFieldProps<T extends string> {
  name: string;
  legend: string;
  hint?: string;
  options: readonly Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}

export function RadioField<T extends string>({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  columns = 3,
}: RadioFieldProps<T>) {
  const hintId = hint ? `${name}-hint` : undefined;
  const grid = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];
  return (
    <fieldset className="space-y-2" aria-describedby={hintId}>
      <legend className="text-sm font-semibold text-slate-900">{legend}</legend>
      {hint && (
        <p id={hintId} className="text-sm text-slate-600">
          {hint}
        </p>
      )}
      <div className={`grid gap-2 ${grid}`}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-700 has-[:focus-visible]:ring-offset-2 ${
                checked ? "border-sky-700 bg-sky-50" : "border-slate-300 bg-white hover:border-slate-400"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-4 w-4 accent-sky-700 focus:outline-none"
              />
              <span>
                <span className="font-medium text-slate-900">{option.label}</span>
                {option.hint && <span className="block text-xs text-slate-600">{option.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  hint?: string;
  options: readonly Option<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
}

export function SelectField<T extends string>({ id, label, hint, options, value, onChange }: SelectFieldProps<T>) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-slate-600">
          {hint}
        </p>
      )}
      <select
        id={id}
        value={value ?? ""}
        aria-describedby={hintId}
        onChange={(e) => {
          const next = options.find((o) => o.value === e.target.value);
          onChange(next?.value);
        }}
        className={`block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 ${focusRing}`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface DateFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string | undefined;
  max?: string;
  error?: string;
  onChange: (value: string | undefined) => void;
}

export function DateField({ id, label, hint, value, max, error, onChange }: DateFieldProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ");
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-slate-600">
          {hint}
        </p>
      )}
      <input
        id={id}
        type="date"
        value={value ?? ""}
        max={max}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={`block w-full max-w-xs rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 ${
          error ? "border-amber-700" : "border-slate-300"
        } ${focusRing}`}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
}

export const buttonStyles = {
  primary: `inline-flex items-center justify-center rounded-lg bg-sky-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-400 ${focusRing}`,
  secondary: `inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 ${focusRing}`,
} as const;
