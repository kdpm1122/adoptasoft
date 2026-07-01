// src/infrastructure/repositories/petRepository.js
import { httpClient } from "../api/httpClient";

export const petRepository = {
  list: (ownerId) => {
    const query = ownerId ? `?propietario=${ownerId}` : "";
    return httpClient.get(`/mascotas/listar${query}`).then((data) => data.pets);
  },
  create: (payload) => httpClient.post("/mascotas/crear", payload),
  update: (id, payload) => httpClient.put(`/mascotas/actualizar?id=${id}`, payload),
  remove: (id) => httpClient.delete(`/mascotas/eliminar?id=${id}`),
};
