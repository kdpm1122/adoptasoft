// src/presentation/components/sections/MedicalHistorySection.jsx
import { MedicalRecordItem } from "../ui/MedicalRecordItem";

export function MedicalHistorySection({ petName, records, onExportPdf, onExportWord, onShare }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-dark">📋 Historial Médico</h2>
          <p className="text-sm text-text-muted">{petName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onExportPdf} className="rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10">
            📄 Exportar PDF
          </button>
          <button onClick={onExportWord} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-dark hover:bg-warm-cream">
            📝 Exportar Word
          </button>
          <button onClick={onShare} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-dark hover:bg-warm-cream">
            📤 Compartir
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {records.map((r) => (
          <MedicalRecordItem key={r.id} record={r} />
        ))}
      </div>
    </div>
  );
}
