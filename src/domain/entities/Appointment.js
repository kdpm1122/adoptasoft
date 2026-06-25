// src/domain/entities/Appointment.js

export const APPOINTMENT_STATUS = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  REJECTED: "Rechazada",
};

export const CONSULTATION_TYPES = ["Consulta General", "Vacunación", "Control", "Urgencia", "Cirugía"];

export class Appointment {
  constructor({ id, petId, petName, vetId, vetName, type, date, time, reason, status = APPOINTMENT_STATUS.PENDING }) {
    this.id = id;
    this.petId = petId;
    this.petName = petName;
    this.vetId = vetId;
    this.vetName = vetName;
    this.type = type;
    this.date = date;
    this.time = time;
    this.reason = reason;
    this.status = status;
  }
}
