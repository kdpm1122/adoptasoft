// src/infrastructure/api/httpClient.js
// Cliente HTTP centralizado. Cambiar de fetch a axios solo afecta este archivo.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("adoptasoft_token");

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Error ${response.status}`);
  }

  return response.json();
}

export const httpClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};
