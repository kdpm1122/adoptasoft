// src/domain/entities/MedicalRecord.js

export const RECORD_TYPES = {
  VACCINE: "vacuna",
  DIAGNOSIS: "diagnostico",
  CHECKUP: "control",
};

export class MedicalRecord {
  constructor({ id, petId, type, title, doctor, date, nextDate, detail }) {
    this.id = id;
    this.petId = petId;
    this.type = type;
    this.title = title;
    this.doctor = doctor;
    this.date = date;
    this.nextDate = nextDate;
    this.detail = detail;
  }
}
