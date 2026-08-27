# Pokopia Guide — agent context

An offline-first PWA companion guide for **Pokémon Pokopia** (Game Freak +
Koei Tecmo, Nintendo Switch 2, released March 5 2026). Sibling project to
`resident-evil-4-guide`, `wind-waker-hd-guide`, and `ocarina-of-time-guide`
in this GitHub account — same technical architecture, deliberately
different content model (see below) because Pokopia is a sandbox/life-sim,
not a linear dungeons-and-bosses action game.

Scaffolded by hand, replicating the structure the sibling repos got from
`create-inceptor-app` (the Inceptor template at
`github.com/ArtemioPadilla/inceptor`) — running the generator directly
wasn't practical in this session, so the lean-scaffold result (Astro 5 +
Tailwind v4 + React islands + Nano Stores + `@vite-pwa/astro`, no
`@radix-ui/*` / `framer-motion` / `@tremor/react`) was reproduced file by
file from `resident-evil-4-guide` as the technical reference.

## Content model — why it looks like this, not like RE4/Zelda

Pokopia has no chapters, medallions, or bosses. What it actually has,
confirmed from Bulbapedia, Serebii, Game8, Nintendo Life, RPGFan, and IGN's
review coverage (see "Sources" below):

- **5 base areas + 1 Expansion Pass area**, each a ruined former Kanto city
  Ditto restores (Withered Wasteland/Fuchsia City, Bleak Beach/Vermilion
  City, Rocky Ridges/Pewter City, Sparkling Skylands/Saffron City districts,
  Palette Town/no former city, and the Expansion Pass's Bubbly
  Basin/Cerulean City). No fixed chapter order gates them — Environment
  Level, tracked **per area**, is the closest thing to a progression axis.
- **A 300-species Pokopia Pokédex** with its own numbering (distinct from
  the National Dex) — the game's own "attract, don't catch" mechanic makes
  this the natural completionist checklist, the same role RE4's 15
  medallions play.
- **600+ crafting recipes** across 6 categories (furniture, buildings,
  utilities, outdoor, blocks, misc) built from ~40 base materials — the
  natural analog of RE4's weapons/gems reference tables.
- **Three named collection systems** — Ancient Artifacts (83 relics),
  Human Records (126 documents), and the Highlight Reel (photo
  challenges) — the second completionist checklist, playing the role RE4's
  treasures do.
- **Professor Tangrowth's guidance and Environment Level milestones** —
  a light reference (not a walkthrough) of what's confirmed to unlock at
  specific levels/counts, standing in for RE4's boss reference.
- **Systems beyond the first paradise** — Cloud Islands, Dream Islands,
  Link Play, and the Expansion Pass — the analog of RE4's postgame section.

### Collection mapping (→ RE4's shape, for the cheat-sheet-minded)

| This repo (`src/content.config.ts`) | RE4 analog                 | Why                                                                                       |
| ----------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| `rules`                             | `rules`                    | Same shape: quick tips, `{title, body, order}`                                            |
| `areas` (glob markdown)             | `chapters` (glob markdown) | Light walkthrough layer — but per-**area**, not per-chapter, because Pokopia isn't linear |
| `pokedex`                           | `medallions`               | PRIMARY checklist tracker                                                                 |
| `collectibles`                      | `treasures`                | SECOND checklist tracker (3 categories instead of combinable/loose)                       |
| `recipes`                           | `weapons`/`gems`           | Reference table, not a tracker (700+ recipes is too much to check off)                    |
| `milestones`                        | `bosses`                   | Quick reference, not a boss list — Environment Level unlock examples                      |
| `endgame`                           | `postgame`                 | Discriminated union: `feature` (ongoing system) vs `expansion` (Expansion Pass)           |

No `buy-order` or `survival` analog: Pokopia has no shop-order optimization
or Ashley/shooting-gallery equivalent verified in sources, so those were
not invented.

## Coverage TODO — read before assuming completeness

This is a ~5-month-old game with thin, scattered source material compared
to a 20-year-old classic. Per the task brief's explicit guidance
("prioritize accuracy over exhaustiveness"), coverage is deliberately
partial and every gap is marked in the content itself, not hidden:

- **Pokédex: 117 of 300 species**, not all 300. Species #1–31's
  `pokopiaNumber` (in-game Pokopia-Dex number) is directly sourced from
  Bulbapedia's numbered listing. Species without a `pokopiaNumber` use only
  independently-verifiable National Dex facts (species/types/generation) —
  their exact in-game Pokopia number was not available from any source
  fetched this session. `habitat` is set only for the handful of species
  (Bulbasaur, Timburr, Hitmonchan) whose habitat is confirmed in the Part 2
  walkthrough; every other entry's habitat renders the honest
  "not yet verified" label instead of a fabricated guess.
- **Areas: Withered Wasteland has a detailed, sourced walkthrough section
  (Part 2 of Bulbapedia's walkthrough series). The other 5 areas are
  stubs** — confirmed facts only (former city, one or two sourced details),
  each explicitly marked "TODO" for anyone extending this guide with
  better sources.
- **Recipes: 17 of 600+**, all individually sourced (Serebii's crafting
  page + Bulbapedia's recipe list) rather than a representative-but-invented
  sample.
- **Collectibles: 26 of 83 Artifacts / 126 Records / an unknown total of
  Highlight Reel photos** — all real, named items from Game8's guides, not
  placeholder names. Several `area` values honestly read "not specified in
  available sources" or "not yet located" rather than guessing.
- **Milestones**: Environment Level is a **per-area** stat (confirmed by
  Serebii — "environment level in each area"), not a single global 1–10
  scale. The milestones list mixes area-level-gated and Pokédex-count-gated
  unlocks and says so explicitly per entry — don't conflate the two axes.

If you're picking this project back up: search for "Pokémon Pokopia
Pokédex complete list" and "Pokémon Pokopia walkthrough Bleak Beach /
Rocky Ridges / Sparkling Skylands" first — those are the two biggest gaps.

### Sources consulted this session

Bulbapedia (`Pokémon Pokopia`, `Professor Tangrowth`, `Ditto (Pokopia)`,
`List of Pokémon by Pokopia Pokédex number`, `List of recipes in Pokémon
Pokopia`, `Walkthrough:Pokémon Pokopia/Part 2`), Serebii.net
(`/pokemonpokopia/crafting.shtml`), Game8.co (Pokédex hub, Ancient
Artifacts list, Human Records list, Highlight Reel list), Nintendo Life
(review), RPGFan (review), IGN (review, via search summary).

## Design & a11y

Distinct visual identity from the sibling guides on purpose: bright,
toy-like, garden/paradise-coded (grass green + sky blue + sunny amber on a
soft mint-cream ground; a deep twilight-teal night sky in dark mode) —
Baloo 2 (rounded chunky display) + Quicksand (rounded body) + JetBrains
Mono (labels), all self-hosted via `@fontsource-variable/*` so the service
worker precaches them. The signature glyph is `.sprout` (a small CSS-only
growing-leaf shape), playing the role RE4's `.flame` and the Zelda guides'
equivalent motifs play.

Every token pair in `src/styles/global.css` was verified with a standalone
OKLCH→sRGB WCAG contrast script (no deps — manual OKLab/LMS matrix +
sRGB EOTF, checked against the WCAG 2 relative-luminance formula) rather
than eyeballed. Text pairs clear ≥4.5:1 in both themes (several ≥8:1); the
focus ring (`--ring`, reused as `--primary`) clears ≥5:1. Decorative panel
borders intentionally stay soft (~2:1) — they're not the sole means of
conveying state (the focus ring and text contrast are), matching the
sibling repos' treatment of their own borders.

## Trackers

`pokedexStore` and `collectiblesStore` (`src/stores/checklist.ts`) are the
two persisted checklists — same generic `createChecklistStore()` factory,
same dirty-flag hydration-race fix as the sibling repos (a toggle right
after page load must not be silently reverted by a slower IndexedDB
hydration read that resolves afterward). `$currentArea` is the equivalent
of RE4's `$currentChapter`. All three persist via `idb-keyval`, client-side
only, no backend.

## Conventions

Conventional Commits, never push directly to `main`, every PR should pass
`npm run check`. Never import `@radix-ui/*` / `framer-motion` /
`@tremor/react`. Nano Stores for cross-island state (never React Context
across islands). `@/*` → `./src/*`.

## Commands

| Command         | What it does                                                                         |
| --------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`   | local dev server                                                                     |
| `npm run build` | production build (set `ASTRO_BASE=/pokemon-pokopia-guide` to match the Pages deploy) |
| `npm run check` | astro check + tsc --noEmit + vitest + build, all must pass                           |
| `npm test`      | vitest only                                                                          |
