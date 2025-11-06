/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: { card: "0 10px 25px -10px rgba(0,0,0,0.2)" }
    },
  },
  plugins: [],
};

