// src/presentation/components/ui/TimeSlot.jsx

export function TimeSlot({ time, isTaken, isSelected, onClick }) {
  return (
    <button
      type="button"
      disabled={isTaken}
      onClick={() => onClick(time)}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors
        ${isTaken ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed" : ""}
        ${!isTaken && isSelected ? "border-primary bg-primary text-white" : ""}
        ${!isTaken && !isSelected ? "border-border bg-white text-text-dark hover:border-primary-light" : ""}
      `}
    >
      {time}
    </button>
  );
}
