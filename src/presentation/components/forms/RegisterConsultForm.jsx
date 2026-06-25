// src/presentation/components/forms/RegisterConsultForm.jsx
import { useState } from "react";
import { validateMedicalRecordForm } from "../../../domain/services/medicalRecordValidation";
import { RECORD_TYPES } from "../../../domain/entities/MedicalRecord";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

const TYPE_OPTIONS = [
  { value: RECORD_TYPES.DIAGNOSIS, label: "Diagnóstico" },
  { value: RECORD_TYPES.VACCINE, label: "Vacuna" },
  { value: RECORD_TYPES.CHECKUP, label: "Control" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function initialForm(patientId = "") {
  return {
    patientId: patientId ? String(patientId) : "",
    type: RECORD_TYPES.DIAGNOSIS,
    date: today(),
    description: "",
    weight: "",
    treatment: "",
    nextDate: "",
  };
}

export function RegisterConsultForm({ patients, selectedPatientId, onPatientChange, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialForm(selectedPatientId));
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "patientId") onPatientChange?.(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateMedicalRecordForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;
    onSave?.(formData);
    setFormData(initialForm(formData.patientId));
  }

  function handleCancel() {
    setFormData(initialForm(selectedPatientId));
    setErrors({});
    onCancel?.();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-text-dark">📝 Nueva Entrada de Historial</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">PACIENTE *</label>
          <select
            value={formData.patientId}
            onChange={(e) => setField("patientId", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.breed}
              </option>
            ))}
          </select>
          {errors.patientId && <span className="text-xs text-red-500">{errors.patientId}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">TIPO DE REGISTRO</label>
          <select
            value={formData.type}
            onChange={(e) => setField("type", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <TextField label="FECHA" type="date" value={formData.date} onChange={(e) => setField("date", e.target.value)} />

        <div className="md:col-span-2">
          <TextField
            label="DESCRIPCIÓN / DIAGNÓSTICO *"
            placeholder="Descripción detallada..."
            value={formData.description}
            onChange={(e) => setField("description", e.target.value)}
            error={errors.description}
          />
        </div>

        <TextField
          label="PESO ACTUAL (KG)"
          type="number"
          step="0.1"
          placeholder="12.5"
          value={formData.weight}
          onChange={(e) => setField("weight", e.target.value)}
        />

        <div className="md:col-span-2">
          <TextField
            label="MEDICAMENTO / TRATAMIENTO"
            placeholder="Medicamento, dosis, duración..."
            value={formData.treatment}
            onChange={(e) => setField("treatment", e.target.value)}
          />
        </div>

        <TextField
          label="PRÓXIMA CITA"
          type="date"
          value={formData.nextDate}
          onChange={(e) => setField("nextDate", e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button type="submit">💾 Guardar Registro</Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
