// src/domain/services/medicalRecordValidation.js

export function validateMedicalRecordForm({ patientId, description }) {
  const errors = {
    patientId: !patientId ? "Selecciona un paciente." : null,
    description: !description?.trim() ? "La descripción / diagnóstico es obligatoria." : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
