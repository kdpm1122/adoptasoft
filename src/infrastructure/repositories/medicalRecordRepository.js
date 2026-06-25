// src/infrastructure/repositories/medicalRecordRepository.js
import { httpClient } from "../api/httpClient";

export const medicalRecordRepository = {
  list: (petId) => httpClient.get(`/historial/listar.php?mascota=${petId}`).then((data) => data.records),
  create: (payload) => httpClient.post("/historial/crear.php", payload),
};
