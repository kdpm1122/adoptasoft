// src/presentation/components/ui/RoleCard.jsx

export function RoleCard({ icon, label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-2 rounded-xl border px-4 py-5 transition-all
        ${isSelected
          ? "border-primary bg-warm-cream shadow-soft"
          : "border-border bg-warm-cream hover:border-primary-light"
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-semibold tracking-wide text-text-dark">
        {label}
      </span>
    </button>
  );
}
