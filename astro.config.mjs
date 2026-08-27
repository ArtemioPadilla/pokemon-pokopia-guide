import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

// GitHub *project* pages serve at `<domain>/<repo>/`, so the deploy workflow
// sets ASTRO_BASE=/pokemon-pokopia-guide. Local dev leaves it unset → '/'.
const BASE = process.env.ASTRO_BASE || '/';
// Public-asset prefix that respects BASE — used for the manifest icon paths.
const asset = (p) => `${BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
// start_url/scope/id must end in '/' — GitHub Pages 301-redirects the
// no-slash form, adding a hop every time the installed app launches.
const SCOPE = BASE.endsWith('/') ? BASE : `${BASE}/`;

export default defineConfig({
  site: 'https://artemiopadilla.github.io',
  base: BASE,
  // English is the source language for this guide; Spanish lives under /es/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      manifest: {
        id: SCOPE,
        name: 'Pokémon Pokopia — Paradise Guide',
        short_name: 'Pokopia Guide',
        description:
          'Offline companion guide and tracker for Pokémon Pokopia: the Pokopia Pokédex, crafting recipes, Environment Level milestones, and paradise-building reference.',
        lang: 'en',
        theme_color: '#f4fbef',
        background_color: '#f4fbef',
        display: 'standalone',
        start_url: SCOPE,
        scope: SCOPE,
        icons: [
          { src: asset('icons/pwa-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: asset('icons/pwa-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: asset('icons/pwa-maskable-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
        navigateFallback: SCOPE,
      },
      experimental: { directoryAndTrailingSlashHandler: true },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
