import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  integrations: [icon({
    // Ajoutez l'ensemble d'icônes "mdi"
    iconSets: ['mdi'],
  })],
});

