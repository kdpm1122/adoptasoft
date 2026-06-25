// src/infrastructure/repositories/vetRepository.js
import { httpClient } from "../api/httpClient";

export const vetRepository = {
  list: () => httpClient.get("/veterinarios/listar.php").then((data) => data.vets),
  create: (payload) => httpClient.post("/veterinarios/crear.php", payload),
  update: (id, payload) => httpClient.put(`/veterinarios/actualizar.php?id=${id}`, payload),
};
