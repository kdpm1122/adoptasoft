// src/infrastructure/repositories/vetRepository.js
import { httpClient } from "../api/httpClient";

export const vetRepository = {
  list: () => httpClient.get("/veterinarios/listar").then((data) => data.vets),
  create: (payload) => httpClient.post("/veterinarios/crear", payload),
  update: (id, payload) => httpClient.put(`/veterinarios/actualizar?id=${id}`, payload),
};
