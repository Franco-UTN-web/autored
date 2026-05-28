/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        autoblue: 'var(--color-autoblue)',
        autored: 'var(--color-autored)',
      }
    },
  },
  plugins: [],
}