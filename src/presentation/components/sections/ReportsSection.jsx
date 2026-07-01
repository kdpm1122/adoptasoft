// src/presentation/components/sections/ReportsSection.jsx

const STATUS_COLORS = {
  Pendiente: "bg-yellow-400",
  Confirmada: "bg-green-500",
  Atendida: "bg-blue-500",
  Cancelada: "bg-gray-400",
  Rechazada: "bg-red-400",
};

function BarRow({ label, count, max, colorClass }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs font-semibold text-text-dark">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-warm-cream">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold text-text-muted">{count}</span>
    </div>
  );
}

export function ReportsSection({ pets = [], appointments = [], vets = [] }) {
  const totalPets = pets.length;
  const activePets = pets.filter((p) => p.status === "Activo").length;
  const totalAppointments = appointments.length;

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const appointmentsThisMonth = appointments.filter((a) => String(a.date).startsWith(monthKey)).length;

  const statusCounts = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  const speciesCounts = pets.reduce((acc, p) => {
    acc[p.species] = (acc[p.species] || 0) + 1;
    return acc;
  }, {});
  const maxSpeciesCount = Math.max(1, ...Object.values(speciesCounts));

  const vetCounts = appointments.reduce((acc, a) => {
    const key = a.vetName || "Sin asignar";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const maxVetCount = Math.max(1, ...Object.values(vetCounts));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">📊 Reportes Globales</h1>
        <p className="text-text-muted">Estadísticas generales del sistema</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border-t-4 border-t-primary bg-white px-4 py-6 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-primary">{totalPets}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Mascotas Totales</p>
        </div>
        <div className="rounded-xl border-t-4 border-t-green-500 bg-white px-4 py-6 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-green-600">{activePets}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Mascotas Activas</p>
        </div>
        <div className="rounded-xl border-t-4 border-t-blue-500 bg-white px-4 py-6 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-blue-600">{totalAppointments}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Citas Totales</p>
        </div>
        <div className="rounded-xl border-t-4 border-t-yellow-400 bg-white px-4 py-6 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-yellow-500">{appointmentsThisMonth}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Citas Este Mes</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-text-dark">Citas por Estado</h2>
        <div className="flex flex-col gap-3">
          {Object.keys(STATUS_COLORS).map((status) => (
            <BarRow
              key={status}
              label={status}
              count={statusCounts[status] || 0}
              max={maxStatusCount}
              colorClass={STATUS_COLORS[status]}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-text-dark">Mascotas por Especie</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(speciesCounts).length === 0 && (
              <p className="text-xs text-text-muted">Sin datos todavía.</p>
            )}
            {Object.entries(speciesCounts).map(([species, count]) => (
              <BarRow key={species} label={species} count={count} max={maxSpeciesCount} colorClass="bg-primary" />
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-text-dark">Citas por Veterinario</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(vetCounts).length === 0 && (
              <p className="text-xs text-text-muted">Sin datos todavía.</p>
            )}
            {Object.entries(vetCounts).map(([vetName, count]) => (
              <BarRow key={vetName} label={vetName} count={count} max={maxVetCount} colorClass="bg-primary" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
