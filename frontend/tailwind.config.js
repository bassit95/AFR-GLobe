/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Ajoute cette ligne
        playball: ["'Playball'", "cursive"],
      },
    },
  },
  plugins: [],
};
