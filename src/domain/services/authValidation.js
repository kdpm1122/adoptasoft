// src/domain/services/authValidation.js
// Reglas de negocio puras para validar el formulario de login.
// No conoce React, ni HTTP, ni nada de infraestructura.

export function validateEmail(value) {
  if (!value || value.trim() === "") {
    return "El correo o número de celular es obligatorio.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\s-]{7,15}$/;
  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return "Ingresa un correo electrónico o número de celular válido.";
  }
  return null;
}

export function validatePassword(value) {
  if (!value || value.trim() === "") {
    return "La contraseña es obligatoria.";
  }
  if (value.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return null;
}

export function validateRole(role) {
  if (!role) {
    return "Selecciona tu perfil para continuar.";
  }
  return null;
}

export function validateLoginForm({ email, password, role }) {
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    role: validateRole(role),
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
