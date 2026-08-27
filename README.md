# Pokopia Guide

An unofficial, offline-first companion guide and progress tracker for
**Pokémon Pokopia** (Game Freak + Koei Tecmo, Nintendo Switch 2, 2026) —
built with [Astro](https://astro.build), React islands, and Tailwind CSS v4.

- The Pokopia Pokédex, as a checklist tracker
- A crafting recipe reference
- Ancient Artifacts / Human Records / Highlight Reel, as a checklist tracker
- Environment Level milestones
- Area-by-area reference (5 base areas + the Expansion Pass area)
- Full English/Spanish i18n, installable as a PWA, works offline

See [`CLAUDE.md`](./CLAUDE.md) for the content model, source list, and a
coverage TODO — this guide curates a well-researched subset rather than
claiming exhaustive coverage of a game that shipped ~5 months before this
guide was written.

Fan-made and unofficial. Pokémon and Pokopia are trademarks of Nintendo,
Game Freak, and Koei Tecmo.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check + tsc + vitest + build
```
