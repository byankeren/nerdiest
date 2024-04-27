/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "primary": ["Poppins", "sans-serif"],
      },
      colors: {
        'primary': '#151515'
      }
    }
  },
  plugins: []
};