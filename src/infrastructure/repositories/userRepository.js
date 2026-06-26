// src/infrastructure/repositories/userRepository.js
import { httpClient } from "../api/httpClient";

export const userRepository = {
  list: () => httpClient.get("/usuarios/listar.php").then((data) => data.users),
  create: (payload) => httpClient.post("/usuarios/crear.php", payload),
  remove: (id) => httpClient.delete(`/usuarios/eliminar.php?id=${id}`),
  changePassword: (payload) => httpClient.post("/usuarios/cambiar_password.php", payload),
};
