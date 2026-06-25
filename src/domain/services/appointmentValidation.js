// src/domain/services/appointmentValidation.js

export function validateAppointmentForm({ petId, date, time }) {
  const errors = {
    petId: !petId ? "Selecciona una mascota." : null,
    date: !date ? "Selecciona una fecha." : null,
    time: !time ? "Selecciona un turno disponible." : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
