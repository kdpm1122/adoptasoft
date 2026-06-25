// src/presentation/components/forms/RegisterVetForm.jsx
import { useState } from "react";
import { validateVetForm } from "../../../domain/services/vetValidation";
import { SPECIALTY_OPTIONS, SCHEDULE_OPTIONS } from "../../../domain/entities/Veterinarian";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";

const initialForm = {
  name: "",
  email: "",
  specialty: SPECIALTY_OPTIONS[0],
  clinic: "",
  medicalLicense: "",
  scheduleStart: "8:00 a.m.",
  scheduleEnd: "5:00 p.m.",
};

export function RegisterVetForm({ onCreate }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateVetForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;
    onCreate?.(formData);
    setFormData(initialForm);
  }

  function handleCancel() {
    setFormData(initialForm);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-text-dark">+ Registrar Veterinario</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextField
          label="NOMBRE"
          placeholder="Dr. Nombre"
          value={formData.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />

        <TextField
          label="EMAIL"
          type="email"
          placeholder="dr.nombre@clinica.com"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
          error={errors.email}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">ESPECIALIDAD</label>
          <select
            value={formData.specialty}
            onChange={(e) => setField("specialty", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            {SPECIALTY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.specialty && <span className="text-xs text-red-500">{errors.specialty}</span>}
        </div>

        <TextField
          label="CLÍNICA"
          placeholder="Nombre de la clínica"
          value={formData.clinic}
          onChange={(e) => setField("clinic", e.target.value)}
          error={errors.clinic}
        />

        <TextField
          label="REGISTRO MÉDICO"
          placeholder="RM 00000"
          value={formData.medicalLicense}
          onChange={(e) => setField("medicalLicense", e.target.value)}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">HORARIO INICIO</label>
          <select
            value={formData.scheduleStart}
            onChange={(e) => setField("scheduleStart", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            {SCHEDULE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide text-text-dark">HORARIO FIN</label>
          <select
            value={formData.scheduleEnd}
            onChange={(e) => setField("scheduleEnd", e.target.value)}
            className="rounded-xl border border-border bg-warm-cream px-4 py-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            {SCHEDULE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button type="submit">💾 Registrar Veterinario</Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
