// src/domain/services/userValidation.js
import { ROLES } from "../entities/User";

export function validateNewUserForm({ fullName, email, role, password }) {
  const errors = {
    fullName: !fullName?.trim() ? "El nombre completo es obligatorio." : null,
    email: !email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Ingresa un correo electrónico válido." : null,
    role: !role || !Object.values(ROLES).includes(role) ? "Selecciona un rol." : null,
    password: !password?.trim() ? "La contraseña es obligatoria." : password.length < 6 ? "Mínimo 6 caracteres." : null,
    phone: null,
    document: null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}

export function validateChangePasswordForm({ currentPassword, newPassword, confirmPassword }) {
  const errors = {
    currentPassword: !currentPassword?.trim() ? "Ingresa tu contraseña actual." : null,
    newPassword: !newPassword?.trim() ? "Ingresa la nueva contraseña." : newPassword.length < 6 ? "Mínimo 6 caracteres." : null,
    confirmPassword: !confirmPassword?.trim() ? "Confirma la nueva contraseña." : confirmPassword !== newPassword ? "Las contraseñas no coinciden." : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
