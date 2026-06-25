// src/infrastructure/repositories/appointmentRepository.js
import { httpClient } from "../api/httpClient";

export const appointmentRepository = {
  list: (petId) => {
    const query = petId ? `?mascota=${petId}` : "";
    return httpClient.get(`/citas/listar.php${query}`).then((data) => data.appointments);
  },
  create: (payload) => httpClient.post("/citas/crear.php", payload),
  update: (id, payload) => httpClient.put(`/citas/actualizar.php?id=${id}`, payload),
  remove: (id) => httpClient.delete(`/citas/eliminar.php?id=${id}`),
};
