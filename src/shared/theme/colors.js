// src/shared/theme/colors.js
// Fuente única de verdad para colores. Estos valores deben coincidir
// con tailwind.config.js. Úsalo cuando necesites el color en JS puro
// (ej. gráficas, SVGs dinámicos, estilos inline).

export const colors = {
  primary: {
    light: "#F2A65A",
    base: "#D9711A",
    dark: "#B85A0F",
  },
  warm: {
    bg: "#FBE8D3",
    cream: "#FDF6ED",
  },
  text: {
    dark: "#2B2018",
    muted: "#8C7B6B",
  },
  border: "#E8D5BC",
  white: "#FFFFFF",
};

// Roles de usuario, usados en selector de perfil del login
export const USER_ROLES = {
  OWNER: "dueño",
  VET: "veterinario",
  ADMIN: "admin",
};
