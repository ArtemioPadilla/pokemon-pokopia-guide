import type { APIRoute } from 'astro';

/**
 * Spanish PWA manifest, served alongside the English one that
 * @vite-pwa/astro generates from astro.config.mjs (dist/manifest.webmanifest).
 *
 * @vite-pwa/astro only generates a single manifest from its `manifest`
 * option, so a second, hand-authored one is the lowest-complexity way to
 * give Spanish visitors an install prompt with a Spanish name/short_name/
 * description/lang instead of the English one — see BaseLayout.astro,
 * which picks between the two by the page's `lang` prop.
 *
 * Field-for-field this mirrors astro.config.mjs's English manifest (same
 * icons, theme/background color, and overall `scope` so the installed app
 * covers the whole site — including the language switcher — not just
 * /es/). `id` and `start_url` point at the Spanish homepage specifically,
 * so installing from an /es/ page both shows the Spanish name AND opens
 * back into /es/ next time, rather than dropping a Spanish-named app icon
 * that still launches into English.
 */

export const prerender = true;

const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
};

const SCOPE = (() => {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base : `${base}/`;
})();

const manifest = {
  id: `${SCOPE}es/`,
  name: 'Pokémon Pokopia — Guía Pokopia',
  short_name: 'Guía Pokopia',
  description:
    'Guía y tracker offline no oficial de Pokémon Pokopia: la Pokédex Pokopia, recetas de fabricación, hitos de Nivel de Entorno y referencia para construir tu paraíso.',
  lang: 'es',
  theme_color: '#f4fbef',
  background_color: '#f4fbef',
  display: 'standalone',
  start_url: `${SCOPE}es/`,
  scope: SCOPE,
  icons: [
    { src: withBase('/icons/pwa-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: withBase('/icons/pwa-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
    {
      src: withBase('/icons/pwa-maskable-512.png'),
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
