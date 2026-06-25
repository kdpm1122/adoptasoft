// src/domain/services/userValidation.js
import { ROLES } from "../entities/User";

export function validateNewUserForm({ fullName, email, role, phone, document }) {
  const errors = {
    fullName: !fullName?.trim() ? "El nombre completo es obligatorio." : null,
    email:
      !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Ingresa un correo electrónico válido."
        : null,
    role: !role || !Object.values(ROLES).includes(role) ? "Selecciona un rol." : null,
    phone: null,
    document: null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
