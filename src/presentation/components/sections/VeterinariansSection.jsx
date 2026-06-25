// src/presentation/components/sections/VeterinariansSection.jsx
import { RegisterVetForm } from "../forms/RegisterVetForm";
import { VetListItem } from "../ui/VetListItem";

export function VeterinariansSection({ vets, onCreateVet }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-text-dark">🩺 Veterinarios</h2>
        <p className="text-sm text-text-muted">Gestión de especialistas del sistema</p>
      </div>

      <RegisterVetForm onCreate={onCreateVet} />

      <p className="mb-2 mt-6 text-xs font-semibold tracking-wide text-text-muted">VETERINARIOS ACTIVOS</p>
      <div className="flex flex-col gap-3">
        {vets.map((vet) => (
          <VetListItem key={vet.id} vet={vet} />
        ))}
      </div>
    </div>
  );
}
