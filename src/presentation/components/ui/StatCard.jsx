// src/presentation/components/ui/StatCard.jsx

const ACCENTS = {
  orange: "border-t-primary text-primary",
  yellow: "border-t-yellow-400 text-yellow-500",
  green: "border-t-green-500 text-green-600",
  blue: "border-t-blue-500 text-blue-600",
};

export function StatCard({ value, label, accent = "orange" }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border-t-4 bg-white px-4 py-6 shadow-sm ${ACCENTS[accent]}`}>
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
    </div>
  );
}
