// src/presentation/components/ui/PetListItem.jsx
import { StatusBadge } from "./StatusBadge";

const SPECIES_ICON = { Perro: "🐶", Gato: "🐱", Ave: "🐦", Roedor: "🐹", Reptil: "🦎", Otro: "🐾" };

export function PetListItem({ pet }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warm-cream text-xl">
          {SPECIES_ICON[pet.species] || "🐾"}
        </div>
        <div>
          <p className="font-semibold text-text-dark">{pet.name}</p>
          <p className="text-xs text-text-muted">{pet.summaryLine ? pet.summaryLine() : `${pet.breed}`}</p>
        </div>
      </div>
      <StatusBadge status={pet.status} />
    </div>
  );
}
