/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#faf9f6',
        'navy': '#2C4A6B',
        'blue-accent': '#6C94B8',
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      }
    },
  },
  plugins: [],
}
