// src/presentation/components/ui/StatusBadge.jsx

const STYLES = {
  Activo: "bg-green-100 text-green-700",
  Confirmada: "bg-green-100 text-green-700",
  Pendiente: "bg-yellow-100 text-yellow-700",
  Rechazado: "bg-red-100 text-red-600",
  Rechazada: "bg-red-100 text-red-600",
};

export function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
