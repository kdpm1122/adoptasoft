// src/domain/services/vetValidation.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateVetForm({ name, email, specialty, clinic }) {
  const errors = {
    name: !name?.trim() ? "El nombre es obligatorio." : null,
    email: !email?.trim()
      ? "El correo es obligatorio."
      : !EMAIL_REGEX.test(email)
      ? "El correo no es válido."
      : null,
    specialty: !specialty ? "Selecciona una especialidad." : null,
    clinic: !clinic?.trim() ? "La clínica es obligatoria." : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
