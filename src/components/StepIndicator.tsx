interface StepIndicatorProps {
  steps: readonly string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="no-print">
      <ol className="flex flex-wrap gap-2 text-sm">
        {steps.map((label, index) => {
          const state = index < current ? "done" : index === current ? "current" : "upcoming";
          return (
            <li
              key={label}
              aria-current={state === "current" ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                state === "current"
                  ? "border-sky-800 bg-sky-800 text-white"
                  : state === "done"
                    ? "border-sky-200 bg-sky-50 text-sky-900"
                    : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span aria-hidden="true" className="font-semibold">
                {index + 1}
              </span>
              <span>
                {label}
                {state === "done" && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
