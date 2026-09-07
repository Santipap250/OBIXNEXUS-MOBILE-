/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obix: {
          bg: "#050b14",
          panel: "#0a1220",
        },
      },
    },
  },
  plugins: [],
};
