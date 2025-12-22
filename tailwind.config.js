/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          purple: '#6B46C1',
          dark: '#1E1B4B',
          light: '#A78BFA',
        },
      },
    },
  },
  plugins: [],
}

