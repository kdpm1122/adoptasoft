/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#F2A65A",
          DEFAULT: "#D9711A",
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
        border: {
          DEFAULT: "#E8D5BC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 14px 0 rgba(217, 113, 26, 0.25)",
      },
    },
  },
  plugins: [],
};
