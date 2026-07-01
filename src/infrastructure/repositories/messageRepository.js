// src/infrastructure/repositories/messageRepository.js
import { httpClient } from "../api/httpClient";

export const messageRepository = {
  conversations: () =>
    httpClient.get("/mensajes/conversaciones").then((data) => data.conversations),

  list: (contactId) =>
    httpClient.get(`/mensajes/listar?con=${contactId}`).then((data) => data.messages),

  send: (receptorId, mensaje) =>
    httpClient.post("/mensajes/enviar", { receptorId, mensaje }),
};
