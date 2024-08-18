/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Synonym-Regular", "Poppins", "sans-serif"],
        synonym: ["Synonym-Regular", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "accent": "#f7d081",
        "light-gray": "#e5e8e3",//"#d4d9d0",
        "dark-green": "#06615b",
        "beige": "#fffdf7",
        "dark-gray": "#747873",
        "light-green":"#b7c7a7",
        "light-accent" :"#fcf3e1"
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};