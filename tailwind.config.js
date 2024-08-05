/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}", // Chemins vers vos fichiers
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                logo: ["Dancing Script", "cursive"], // Ajout de la police pour le logo
            },
            colors: {
                accent: "#edca82",
                "light-gray": "#e1e2d4",
                "dark-green": "#06615b",
            },
        },
    },
    plugins: [],
};