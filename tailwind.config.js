/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Heebo'", "'Assistant'", "ui-sans-serif", "system-ui"],
        body: ["'Assistant'", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#0d1b2a",
        steel: "#1b263b",
        sand: "#f4f1de",
        mint: "#d8f3dc",
        sun: "#f6bd60",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(13, 27, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
