// src/presentation/components/ui/TextField.jsx

export function TextField({ label, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-wide text-text-dark">
        {label}
      </label>
      <input
        {...inputProps}
        className={`rounded-xl border bg-warm-cream px-4 py-3 text-sm text-text-dark
          placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-light
          ${error ? "border-red-400" : "border-border"}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
