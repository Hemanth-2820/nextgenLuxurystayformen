/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#D4AF37',
          600: '#AA8C2C',
        },
        dark: {
          900: '#1A1A1A',
          800: '#2A2A2A',
        }
      }
    },
  },
  plugins: [],
}
