// src/infrastructure/repositories/petRepository.js
import { httpClient } from "../api/httpClient";

export const petRepository = {
  list: (ownerId) => {
    const query = ownerId ? `?propietario=${ownerId}` : "";
    return httpClient.get(`/mascotas/listar.php${query}`).then((data) => data.pets);
  },
  create: (payload) => httpClient.post("/mascotas/crear.php", payload),
  update: (id, payload) => httpClient.put(`/mascotas/actualizar.php?id=${id}`, payload),
  remove: (id) => httpClient.delete(`/mascotas/eliminar.php?id=${id}`),
};
