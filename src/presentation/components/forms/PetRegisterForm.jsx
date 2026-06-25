// src/presentation/components/forms/PetRegisterForm.jsx
import { useState } from "react";
import { validatePetForm } from "../../../domain/services/petValidation";
import { SPECIES_OPTIONS, SEX_OPTIONS } from "../../../domain/entities/Pet";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

const initialForm = { name: "", species: "", breed: "", age: "", weight: "", sex: "" };

export function PetRegisterForm({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validatePetForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;
    onCreate?.(formData);
    setFormData(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-text-dark">+ Registrar Nueva Mascota</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField
          label="NOMBRE *"
          placeholder="Ej: Luna"
          value={formData.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">ESPECIE *</label>
          <select
            value={formData.species}
            onChange={(e) => setField("species", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="">Seleccionar</option>
            {SPECIES_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.species && <span className="text-xs text-red-500">{errors.species}</span>}
        </div>

        <TextField
          label="RAZA *"
          placeholder="Ej: Labrador"
          value={formData.breed}
          onChange={(e) => setField("breed", e.target.value)}
          error={errors.breed}
        />

        <TextField
          label="EDAD"
          placeholder="Ej: 2 años"
          value={formData.age}
          onChange={(e) => setField("age", e.target.value)}
        />

        <TextField
          label="PESO (KG)"
          placeholder="12.5"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={(e) => setField("weight", e.target.value)}
          error={errors.weight}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">SEXO</label>
          <select
            value={formData.sex}
            onChange={(e) => setField("sex", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="">—</option>
            {SEX_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Button type="submit">🐾 Guardar Mascota</Button>
      </div>
    </form>
  );
}
