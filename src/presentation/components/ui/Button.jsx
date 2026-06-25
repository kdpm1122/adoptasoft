// src/presentation/components/ui/Button.jsx

export function Button({ children, variant = "primary", isLoading, ...props }) {
  const base = "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-soft",
    secondary: "border border-border bg-warm-cream text-text-dark hover:border-primary-light",
  };

  return (
    <button {...props} disabled={isLoading || props.disabled} className={`${base} ${variants[variant]}`}>
      {isLoading ? "Cargando..." : children}
    </button>
  );
}
