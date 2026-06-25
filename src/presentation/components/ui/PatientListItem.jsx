// src/presentation/components/ui/PatientListItem.jsx
import { StatusToggle } from "./StatusToggle";

const SPECIES_ICON = { Perro: "🐶", Gato: "🐱", Ave: "🐦", Roedor: "🐹", Reptil: "🦎", Otro: "🐾" };

export function PatientListItem({ patient, onChangeStatus, onViewHistory }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm-cream text-xl">
          {SPECIES_ICON[patient.species] || "🐾"}
        </div>
        <div>
          <p className="font-semibold text-text-dark">
            {patient.name} — {patient.breed}
          </p>
          <p className="text-xs text-text-muted">
            Dueño: {patient.ownerName} · Última consulta: {patient.lastVisit || "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusToggle status={patient.status} onChange={(status) => onChangeStatus?.(patient.id, status)} />
        <button
          onClick={() => onViewHistory?.(patient.id)}
          className="rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
        >
          Ver historial
        </button>
      </div>
    </div>
  );
}
