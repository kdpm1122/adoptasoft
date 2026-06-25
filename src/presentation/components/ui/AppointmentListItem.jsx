// src/presentation/components/ui/AppointmentListItem.jsx
import { StatusBadge } from "./StatusBadge";

export function AppointmentListItem({ appointment }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">📅</span>
        <div>
          <p className="font-semibold text-text-dark">
            {appointment.petName} — {appointment.type}
          </p>
          <p className="text-xs text-text-muted">
            {appointment.vetName} · {appointment.date} · {appointment.time}
          </p>
        </div>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}
