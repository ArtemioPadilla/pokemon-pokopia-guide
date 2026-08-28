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
partial and every gap is marked in the content itself, not hidden. A second
pass (session 2, see "Sources consulted — session 2" below) closed two of
the biggest gaps flagged by session 1; what's still open is called out
per-item below.

- **Pokédex: 117 of 300 species** (unchanged — this pass didn't add new
  species entries, only filled in the number field on existing ones).
  `pokopiaNumber` is now confirmed for **80 of the 117** entries (up from
  31), sourced from Bulbapedia's `List of Pokémon by Pokédex number in
Pokémon Pokopia` — fetched in full (all 300 rows) and cross-verified
  against independent, non-wiki sources at multiple points across the
  range (Serebii's per-species Pokopia pages, pokopiawiki.com,
  pokopiamap.com, pokopiadex.com, VideoGamesChronicle, Game8) before being
  applied, including an exact match against the 31 numbers session 1 had
  already verified. The remaining **37 entries have no `pokopiaNumber`**
  because their National Dex number does not appear anywhere in that
  300-row list — whether they're absent from the base Pokopia Dex
  entirely, or (a handful, e.g. Popplio, Krabby, Buizel, Feebas) belong to
  the Expansion Pass's separate 50-entry `List of Pokémon by Pokédex
(Basin) number` instead, was not run down this session; either way, a
  guessed number would be worse than the honest gap, so none was added.
  One pre-existing data bug was fixed in passing: the entry with
  `nationalNumber: 921` was labeled "Wiglett," but 921 is Pawmi's real
  National Dex number, not Wiglett's (960) — corrected to 960 in both
  locales; it has no `pokopiaNumber` either way since 960 isn't in the
  base-300 list. `habitat` was intentionally left untouched this pass —
  the brief scoped this session to the number field, and adding habitat
  text without the same cross-verification rigor risked exactly the kind
  of unverified-but-plausible content this guide avoids. It's still set
  only for Bulbasaur, Timburr, and Hitmonchan.
- **Areas: all 6 now have real, sourced content beyond a one-line stub.**
  Withered Wasteland's walkthrough (session 1, Bulbapedia Part 2) was the
  quality bar; Bleak Beach, Rocky Ridges, Sparkling Skylands, and Palette
  Town now each have an opening-quest section (named quest, Professor
  Tangrowth's role or confirmed absence, recruited Pokémon, and habitats/
  materials) sourced from Bulbapedia's `Walkthrough:Pokémon Pokopia` Parts
  8–26, cross-referenced against Nintendo Life, GameRant, GameSpot, and
  Vandal's guides for quest names and details Bulbapedia's summary didn't
  spell out (e.g. Mosslax/Peakychu, Chef Dente, Tinkmaster). Bubbly Basin
  (the Expansion Pass area) went from "requires Dive from a befriended
  Pokémon" to a sourced access sequence (Manaphy teaches Dive; Popplio
  must accompany you through the gate) plus its first confirmed Pokémon
  (Corsola, Shellder, Staryu, Horsea) and scale (50 species / 36 habitats),
  via Bulbapedia's `Bubbly Basin (DLC)` page, Nintendo Life, and GameSpot.
  Every area page still ends with an explicit "Still unconfirmed" note
  instead of a blanket "TODO" — none of the 5 has its full Pokémon roster
  or its own Environment Level milestone table verified yet, and Bubbly
  Basin in particular still needs the other ~46 of its 50 species mapped
  to habitats.
- **Area map imagery: real, sourced in-game art now used for 4 of 6 areas.**
  Session 3 replaced the hand-drawn SVG schematics with real imagery
  wherever a genuine, usable source asset could be found (the site owner
  explicitly accepted the copyright tradeoff of hosting real game imagery —
  see `src/components/islands/AreaMapBackground.tsx`'s file header for the
  full reasoning). **Rocky Ridges** and **Sparkling Skylands** use the
  actual in-game overworld map screenshot from each area's Bulbapedia
  location infobox (`File:Rocky_Ridges_map_Pokopia.png` /
  `File:Sparkling_Skylands_Map_Pokopia.png`, downloaded from
  `archives.bulbagarden.net` and re-encoded to WebP) — a genuine top-down
  layout, confirmed via the "Location" infobox field (Bulbapedia's standard
  place for an in-game region-map capture, not fan art). Rocky Ridges'
  existing collectibles pins (`col-rec-08`, `col-rec-09`) were repositioned
  onto real walkable terrain in that image. **Palette Town** and **Bubbly
  Basin** use a real Serebii.net gameplay screenshot (`serebii.net/
pokemonpokopia/locations/<slug>.jpg`) as a decorative hero image on their
  area detail page — neither has an in-game overview map available
  anywhere this guide could find, and neither has any pinned Pokédex/
  Collectibles entry yet, so the screenshot makes no locational claim.
  **Withered Wasteland** and **Bleak Beach** keep the hand-drawn SVG: both
  have real, sourced pins, but the only real imagery found for them was
  narrow, UI-cluttered gameplay screenshots centered on the player
  character — swapping one of those in behind multiple pins at different
  in-world spots would have been _less_ honest than the schematic, since a
  single narrow shot can't show where those spots are relative to each
  other. Bulbapedia's location infobox for these two only has the
  pre-Pokopia classic Kanto region map (Fuchsia/Vermilion City), which is
  the wrong game entirely and wasn't used. All 6 areas are now mapped in
  `src/lib/areaMapKey.ts`, so image swap-ins for the remaining two are a
  drop-in once/if a real overview map turns up for them.
- **Recipes: 17 of 600+**, unchanged this session — all individually
  sourced (Serebii's crafting page + Bulbapedia's recipe list) rather than
  a representative-but-invented sample.
- **Collectibles: 26 of 83 Artifacts / 126 Records / an unknown total of
  Highlight Reel photos**, unchanged this session — all real, named items
  from Game8's guides, not placeholder names. Several `area` values
  honestly read "not specified in available sources" or "not yet located"
  rather than guessing.
- **Milestones**: Environment Level is a **per-area** stat (confirmed by
  Serebii — "environment level in each area"), not a single global 1–10
  scale. The milestones list mixes area-level-gated and Pokédex-count-gated
  unlocks and says so explicitly per entry — don't conflate the two axes.
  Not revisited this session.

If you're picking this project back up next: the Bubbly Basin-specific
Pokédex list (`List of Pokémon by Pokédex (Basin) number in Pokémon
Pokopia` on Bulbapedia) is the natural next pull — it would both fill in
Bubbly Basin's remaining species/habitat gap and possibly explain some of
the 37 still-unnumbered base-dex entries. After that, `habitat` for the 49
newly-numbered species (this session deliberately didn't touch it) is the
next-highest-value gap.

### Sources consulted — session 1

Bulbapedia (`Pokémon Pokopia`, `Professor Tangrowth`, `Ditto (Pokopia)`,
`List of Pokémon by Pokopia Pokédex number`, `List of recipes in Pokémon
Pokopia`, `Walkthrough:Pokémon Pokopia/Part 2`), Serebii.net
(`/pokemonpokopia/crafting.shtml`), Game8.co (Pokédex hub, Ancient
Artifacts list, Human Records list, Highlight Reel list), Nintendo Life
(review), RPGFan (review), IGN (review, via search summary).

### Sources consulted — session 2 (Pokédex 32–300 + the 5 stub areas)

**Pokédex numbers:** Bulbapedia's `List of Pokémon by Pokédex number in
Pokémon Pokopia` (primary source, fetched in full: all 300 rows).
Cross-checks: Serebii.net's per-species Pokopia pages (`Timburr` →
Pokopia #65), pokopiawiki.com and pokopia.gamertw.com (`Sprigatito` →
#263), pokopiadex.com (`Aerodactyl` → #271, via its own URL slug),
VideoGamesChronicle (`Lugia` → #297), and Game8/Serebii/pokopiawiki/
pokopiamap/pokopia.gamertw agreeing on `Gholdengo` → #206, `Farigiraf` →
#230, and `Beldum` → #245.

**The 5 areas:** Bulbapedia's `Walkthrough:Pokémon Pokopia` index and
Parts 8 (Rocky Ridges), 12 (Bleak Beach), 18 (Sparkling Skylands), and 26
(Palette Town); Bulbapedia's `Bubbly Basin (DLC)` page. Supplementary
quest/NPC detail (via search snippets — direct fetch was blocked by
robots/403 on some of these): Nintendo Life's "Brighten Things Up"
(Bleak Beach/Mosslax), "Time To Party" (Rocky Ridges/Chef Dente), and
"Rebuild The Huge Building" (Sparkling Skylands/Tinkmaster) guides;
GameRant (Mosslax/Peakychu quest steps); GameSpot ("Time to Party" mood
mechanics, Tinkmaster/Mewtwo, Bubbly Basin's new Pokémon list); Game8
(Chef Dente's identity as a Greedent); VideoGamesChronicle and Nintendo
Life (Manaphy teaches Dive, Popplio required for the Bubbly Basin gate).

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
