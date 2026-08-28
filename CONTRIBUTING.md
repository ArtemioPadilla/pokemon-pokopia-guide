# Contributing to the Pokopia Guide

Thanks for considering a contribution! This is a small fan-made project, so
there's no formal process — just a few conventions that keep the guide
accurate and both locales in sync.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:4321
```

Requires Node 22+. `npm run build` produces a production build; set
`ASTRO_BASE=/pokemon-pokopia-guide` to match how the site is actually
deployed (GitHub Pages, project site) if you need to check built output
locally.

## Where content lives

All game data is in `src/content/`, split into parallel `en/` and `es/`
trees:

```
src/content/
  en/  pokedex.json  recipes.json  collectibles.json  milestones.json  endgame.json  rules.json  areas/*.md
  es/  (same files, same shape, Spanish content)
```

Every entry needs a matching counterpart in the other locale, same `id` /
filename, same fields — the site renders whichever locale the visitor is
on, and a missing counterpart means a broken page in that language.
`src/content.config.ts` has the Zod schemas that define what each
collection's fields mean. `CLAUDE.md` documents the content model in more
depth (why the collections are shaped the way they are) and, importantly,
tracks known coverage gaps — check there before assuming something is
"missing" rather than "not yet added."

## Reporting a content correction

The fastest way to flag something wrong (a bad Pokopia-Dex number, a typo,
a mistranslation, a recipe with the wrong materials) is the **"Report an
issue"** button in the corner of the live site — it pre-fills a GitHub
issue with the page you were on and relevant diagnostics, so you don't have
to write it up from scratch. You're also welcome to
[open an issue](https://github.com/ArtemioPadilla/pokemon-pokopia-guide/issues/new/choose)
or a PR directly.

## Opening a content-correction PR

- **Cite a source.** Bulbapedia, Serebii, Game8, or an in-game screenshot —
  anything that lets someone else verify the change. Unsourced "I'm pretty
  sure" edits are hard to merge for a wiki-style guide like this one.
- **Keep `en/` and `es/` in sync.** If you fix something in one locale,
  make the equivalent fix in the other (or say explicitly in the PR that
  only one locale needed the change, and why).
- **Don't invent to fill gaps.** If a field isn't verifiable from a source,
  leave it out or use the existing "not yet verified" convention rather
  than guessing — see the Coverage TODO in `CLAUDE.md` for the standard
  this repo holds itself to.
- **Run `npm run check` before opening the PR.** It runs `astro check`,
  `tsc --noEmit`, the Vitest suite (including the content-shape tests),
  and a production build — all four must pass.

Small, well-sourced PRs are very welcome. For anything bigger (a new
content collection, a design change), opening an issue first to talk
through the approach saves everyone rework.
