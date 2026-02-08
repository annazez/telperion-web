// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // React zůstává v integracích
  integrations: [react(), icon()],
  
  // Tailwind 4 se dává sem, do Vite pluginů
  vite: {
    plugins: [tailwindcss()],
  },
});