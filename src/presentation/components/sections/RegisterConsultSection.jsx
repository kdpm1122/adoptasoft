// src/presentation/components/sections/RegisterConsultSection.jsx
import { RegisterConsultForm } from "../forms/RegisterConsultForm";
import { MedicalHistorySection } from "./MedicalHistorySection";

export function RegisterConsultSection({
  patients,
  selectedPatientId,
  onPatientChange,
  records,
  onSave,
  onCancel,
  onExportPdf,
  onExportWord,
}) {
  const selectedPatient = patients.find((p) => String(p.id) === String(selectedPatientId));
  const patientRecords = records.filter((r) => String(r.petId) === String(selectedPatientId));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-1 text-lg font-bold text-text-dark">📋 Registrar Consulta</h2>
        <p className="mb-4 text-sm text-text-muted">Diagnóstico, vacunas y tratamientos</p>
        <RegisterConsultForm
          patients={patients}
          selectedPatientId={selectedPatientId}
          onPatientChange={onPatientChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>

      {selectedPatient ? (
        <MedicalHistorySection
          petName={`${selectedPatient.name} — ${selectedPatient.breed}`}
          records={patientRecords}
          onExportPdf={() => onExportPdf?.(selectedPatient)}
          onExportWord={() => onExportWord?.(selectedPatient)}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-white px-4 py-10 text-center">
          <p className="text-sm font-semibold tracking-wide text-text-muted">
            HISTORIAL CLÍNICO — SELECCIONA UN PACIENTE
          </p>
        </div>
      )}
    </div>
  );
}
