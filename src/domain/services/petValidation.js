// src/domain/services/petValidation.js

export function validatePetForm({ name, species, breed, weight }) {
  const errors = {
    name: !name?.trim() ? "El nombre es obligatorio." : null,
    species: !species ? "Selecciona una especie." : null,
    breed: !breed?.trim() ? "La raza es obligatoria." : null,
    weight: weight && Number(weight) <= 0 ? "El peso debe ser mayor a 0." : null,
  };
  const isValid = Object.values(errors).every((e) => e === null);
  return { isValid, errors };
}
