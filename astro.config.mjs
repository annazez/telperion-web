// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],
  
  // Tailwind 4 se dává sem, do Vite pluginů
  vite: {
    plugins: [tailwindcss()],
  },
});
