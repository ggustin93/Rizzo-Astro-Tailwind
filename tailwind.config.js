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
        'travailleur': '#068D9D',
        'employeur': '#53599A',
        'accent': '#FFCC33',
        'light-accent' :"#fcf3e1",
        'light-gray': '#F5F5F5',
        'dark-gray': '#333333',
        'light-blue': '#c2dae0',
        'beige': '#faf5f0',
        'light-travailleur': '#91bfc4',
        'light-employeur':'#9397c7' //'#FDFCFB'
        /*"light-gray": "#fdfcfb",//"#d4d9d0",
        "dark-green": "#06615b",
        "dark-gray": "#747873",
        "light-green":"#b7c7a7",
        */
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};