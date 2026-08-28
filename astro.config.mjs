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
  // The account's Pages sites are served from its custom domain, not
  // <user>.github.io — confirmed via `gh api .../pages` returning
  // html_url: "http://artemiop.com/pokemon-pokopia-guide/".
  site: 'https://artemiop.com',
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
        // 'webmanifest' so both the English (this file, below) and Spanish
        // (src/pages/manifest.es.webmanifest.ts) manifests are themselves
        // available offline, not just the pages that link to them.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2,webmanifest}'],
        // A dedicated, locale-neutral offline page — NOT the homepage.
        // navigateFallback is a single static path (generateSW can't branch
        // on the current locale at runtime), so pointing it at SCOPE would
        // always bounce an offline visitor to the English homepage
        // regardless of whether they were reading an /es/ page. offline/
        // greets in both languages and links into each locale's real
        // homepage instead of guessing one. See src/pages/offline.astro.
        navigateFallback: `${SCOPE}offline/`,
      },
      experimental: { directoryAndTrailingSlashHandler: true },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
