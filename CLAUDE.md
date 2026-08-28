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
- **880+ crafting recipes** (883 confirmed via Serebii's full crafting
  list as of session 3 — the original "600+" was a conservative estimate)
  across 6 categories (furniture, buildings, utilities, outdoor, blocks,
  misc) built from ~70 base materials — the natural analog of RE4's
  weapons/gems reference tables.
- **Three named collection systems** — Ancient Artifacts (86 relics: 40
  Large + 46 Small Lost Relics, confirmed via Game8 as of session 3;
  supersedes the original "83" estimate), Human Records (126 documents,
  per Game8 — session 3 individually confirmed 55 of these), and the
  Highlight Reel (44 photo challenges confirmed via Game8 as of session 3) — the second completionist checklist, playing the role RE4's
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
partial and every gap is marked in the content itself, not hidden. A
second pass (session 2) closed two of the biggest gaps flagged by session
1; a third pass (session 3, see "Sources consulted — session 3" below)
pushed Pokédex/recipes/collectibles coverage much further using the same
rigor; a fourth pass (session 4, see "Sources consulted — session 4"
below) closed the base Pokédex numbering gap and pushed Human Records
further. What's still open is called out per-item below.

- **Pokédex: 382 entries** (up from 162), of which **300 carry a
  `pokopiaNumber`** — every slot in Bulbapedia's `List of Pokémon by
Pokédex number in Pokémon Pokopia` (the base 300-entry dex) is now
  filled, up from 80/117 at the end of session 3. Session 4 re-fetched
  that list fresh (never trust memory) as raw HTML, parsed via
  `pandas.read_html` (308 rows: 300 unique `pokopiaNumber` slots plus 8
  extra rows for variant forms sharing a number with a base form — e.g.
  Tangrowth/Tangrowth Professor, Pikachu/Pikachu Pale, Shellos West
  Sea/East Sea — matching the existing precedent set by the already-in-
  collection Tangrowth/Pikachu/Snorlax entries), then diffed it against
  the collection by `nationalNumber`. That diff surfaced an important
  correction to the old "138 missing" estimate in this file: only **80**
  of the pre-session-4 162 entries actually matched a row in the real
  300-row table — the other 82 (50 Basin-exclusive + 32 no-number "gap"
  entries) don't appear in it at all, so the true main-dex gap was **220
  species, not 138**. All 220 were added. Types and generation came
  straight from the same Bulbapedia table (generation derived from each
  species' standard national-dex range, e.g. 810–905 → Gen 8); **all 220
  also got `habitat`** (not bare-number-only) from a second source —
  pokopiawiki.com/pokedex embeds a complete per-species dataset (`ideal
habitat` category + confirmed area list) in a Next.js RSC data chunk
  covering every one of the 300 main-dex slots, extracted programmatically
  rather than through a summarizing fetch. This source's reliability was
  spot-checked against lore already independently documented in this file
  before session 4 ever touched it — its data for Pokopia number 79 names
  "Peakychu" and for 108 names "Mosslax" (both already referenced in the
  Rocky Ridges/Bleak Beach walkthrough sections above), and for 192 names
  "Greedent Cook" (matching this file's existing "Chef Dente" callout) —
  three independent hits, which is why it was trusted for bulk habitat
  data rather than re-verified per species. `area` was deliberately left
  unset on all 220 new entries, same convention as session 3's habitat
  pass: `habitat`'s text lists the confirmed area(s) instead. Five of the
  220 (Shellos, Gastrodon, Tatsugiri, Toxtricity, plus the pre-existing
  Tangrowth/Pikachu/Snorlax) share their Pokopia number with an alternate
  form documented in a `note`, e.g. Tatsugiri's Curly/Droopy/Stretchy
  forms. Three keep an unusual full name because Bulbapedia's table lists
  no separate plain-species row at that number: Smeargle Decorator (#119),
  Greedent Cook (#192), Tinkaton Supervisor (#270) — these read as
  genuinely named job-styled Pokémon unique to Pokopia, not a parsing
  artifact. Number 182, "Stereo Rotom," is a distinct in-game Rotom form
  with non-standard Electric/Normal typing (not the usual Electric/Ghost)
  — confirmed independently by both Bulbapedia and pokopiawiki, so kept
  as-is rather than "corrected" to plain Rotom typing.

  The **32 base-dex "gap" entries** (no `pokopiaNumber`, not
  Basin-exclusive) are **unchanged** — none of them appear in the
  re-fetched 300-row table either, so they remain an honest, unresolved
  gap; whatever originally justified adding them (an area-walkthrough
  mention, most likely) doesn't include a dex number. The **50
  Basin-exclusive entries** (`basinNumber`, no `pokopiaNumber`) are also
  unchanged this session — Basin coverage wasn't revisited beyond a
  quick sanity check that the existing 50 still matches Bulbapedia's
  Basin list structurally. `habitat` is now confirmed for **301 of 382**
  entries (up from 81/162) — the 220 new entries plus the 81 already
  confirmed as of session 3. Session 3's original context on the Basin
  dex and the 76-species Serebii habitat pass is preserved below for
  provenance.

- **Pokédex (session 3 context, preserved):** session 3 added 45 brand
  new entries, all 50 species from Bulbapedia's `List of Pokémon by
Pokédex (Basin) number in Pokémon Pokopia`, fetched in full. That page
  is a genuinely separate numbering system from the base 300-entry
  Pokopia Pokédex (confirmed by its own intro line: "the Pokémon in this
  Pokédex are found within Bubbly Basin"), so it got its own schema field,
  `basinNumber` — never conflated with `pokopiaNumber`. Cross-referencing
  it against the 37 base-dex entries with no `pokopiaNumber` resolved
  **5 of them** (Totodile, Mudkip, Buizel, Popplio, Wiglett — each now has
  `basinNumber` + `area: "Bubbly Basin"` instead of a bare gap). Session
  1's speculation that Krabby and Feebas were also Basin-exclusive turned
  out to be **wrong** once the real list was fetched — neither appears in
  it — a good example of why this guide's culture insists on fetching the
  actual source rather than reasoning from a plausible guess. `habitat`
  was confirmed for 81 of 162 entries at the time (see the Serebii
  per-species pull described in "Sources consulted — session 3" below).
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
- **Recipes: 880 of 600+** (up from 17 — the "600+" estimate itself was
  conservative; Serebii's crafting page alone lists 883 rows across its 7
  categories once fully parsed). Session 3 fetched that page's raw HTML
  directly (not through a summarizing fetch — the page is far too long for
  reliable AI summarization) and parsed all category tables (Furniture,
  Misc., Outdoor, Utilities, Buildings, Blocks, Other) programmatically;
  Serebii's own "Other" category was folded into this schema's `misc`
  since the two ~600-recipe schemas don't otherwise line up 1:1. 3 rows
  with no listed materials were dropped rather than guessed. In passing,
  this pass also **corrected the original 17 recipes** against the same
  live fetch — several had drifted from Serebii's current numbers (e.g.
  Storage Box's unlock changed from "Register 7 Pokémon" to "Register 6";
  Luxury Chair's materials and unlock method were both off) — likely
  either a session 1 transcription slip or the source page being revised
  since (a patches/updates page exists on Serebii, consistent with a
  balance patch). Materials and unlock-method text were translated to
  Spanish programmatically from a ~70-term material dictionary and a
  template matcher for the small number of recurring unlock-method
  patterns (`Register N Pokémon`, `Shop – Area Lv. N`, `Daily Shop
Special`, etc.) — recipe _names_ stay English in both locales, matching
  the existing convention already used for the first 17.
- **Collectibles: 188 total** (up from 26) — **89 of 89 known Artifacts**
  (up from 8 of an estimated 83; Game8's own Large + Small Lost Relic
  lists turned out to total 86, not 83 — the "83" figure was itself an
  imprecise web-search summary, corrected here against the real page).
  Naming/materials/rarity for all 89 come straight from Game8, but
  **`area` is unset ("Not specified in available sources") for all 89 —
  Game8's Lost Relic lists don't give a location field at all**, unlike
  Records below where it's only some entries. Worth a dedicated pass if
  another source turns up with Artifact locations.
  **55 Human Records** (up from 10; Game8's own records page is marked
  "work in progress" and doesn't give a location for every entry, so
  several intentionally still read "Not specified in available sources"),
  and **44 Highlight Reel photos** (up from 8; Game8's list numbers 44
  entries as of this session, still not confirmed as the game's true
  total). All new entries are real, individually named items fetched
  directly from Game8's list pages (`584647`/`586921`/`588466` for
  Artifacts, `584648` for Records, `586026` for Highlight Reel) via raw
  HTML parsing, same reasoning as the recipes pull above. One existing
  entry got a genuine correction in passing: "Dear Douglas"'s `area` went
  from the honest placeholder "not yet located in sources" to the real
  confirmed "Dream Island" once Game8's page listed it.
- **Milestones**: Environment Level is a **per-area** stat (confirmed by
  Serebii — "environment level in each area"), not a single global 1–10
  scale. The milestones list mixes area-level-gated and Pokédex-count-gated
  unlocks and says so explicitly per entry — don't conflate the two axes.
  Not revisited this session.

If you're picking this project back up next: the base 300-entry Pokopia
Pokédex is now **fully numbered** (300/300 `pokopiaNumber` slots filled)
and every one of those 300 has a `habitat`, so the next Pokédex gap isn't
"missing species" anymore — it's the **32 still-unnumbered "gap" entries**
(no `pokopiaNumber`, not Basin-exclusive either; unchanged since session 3,
still not found in either Bulbapedia numbered list) and Wooper's still-
missing habitat (its Serebii page 404s under every slug tried, per session
3). A dedicated pass on those 32 — perhaps starting from whatever
originally justified adding them without a number — is the next most
tractable target. `x`/`y` map-pin placement for the 220 species session 4
added is a smaller, well-scoped remaining gap: none of them have a pin,
since neither Bulbapedia's table nor pokopiawiki.com's dataset gives
schematic-map coordinates, only a named-area list.

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

### Sources consulted — session 3 (Basin dex, habitat, recipes, collectibles)

**Basin Pokédex:** Bulbapedia's `List of Pokémon by Pokédex (Basin) number
in Pokémon Pokopia`, fetched in full (all 50 rows, including the two
gender-dimorphic entries — Frillish and Jellicent — whose `rowspan`
table markup needed a second parsing pass after the first pass silently
dropped both due to an attribute-order mismatch; caught by checking the
parsed count against the page's own numbering before trusting it).

**Habitat:** Serebii.net's per-species Pokopia Pokédex pages
(`pokemonpokopia/pokedex/<name>.shtml`), fetched individually for all 77
species that had `pokopiaNumber` but no `habitat` (76 succeeded, Wooper
404s under every slug tried). One entry (Ivysaur) was spot-checked against
the raw HTML directly to confirm the fetch tool was transcribing real page
content rather than paraphrasing. Corsola/Shellder's Bubbly Basin habitat
text reuses this guide's own already-sourced area-page claim rather than
a new fetch.

**Recipes:** Serebii.net's `/pokemonpokopia/crafting.shtml`, fetched as
raw HTML (not through a summarizing fetch, which cannot reliably
transcribe a page this long) and parsed programmatically by category
section. Cross-checked the resulting data against the pre-existing 17
recipes already in the repo, which is how the Storage Box / Luxury Chair /
Plain Table / Berry Table / Plain Sofa / Antique Sofa drift from session
1's numbers was caught.

**Collectibles:** Game8.co's Small Lost Relics list (archive 586921),
Large Lost Relics list (588466), Human Records locations (584648), and
Highlight Reel list (586026) — all fetched as raw HTML and parsed
programmatically (Game8's tables are large and paginated in practice;
a summarizing fetch could not be trusted to enumerate every row).

### Sources consulted — session 4 (base Pokédex completion)

**Base Pokédex numbering:** Bulbapedia's `List of Pokémon by Pokédex
number in Pokémon Pokopia`, re-fetched fresh this session (never trusted
from memory/prior sessions) as raw HTML and parsed with
`pandas.read_html` — 308 rows, which is 300 unique `pokopiaNumber` slots
plus 8 rows for alternate forms sharing a slot with a base form (verified
by checking the parsed row count and duplicate-number list against the
page's own numbering, same discipline as session 3's Frillish/Jellicent
catch). Diffed against the collection by `nationalNumber`, which is what
surfaced the corrected gap size (220, not the previously-recorded 138 —
see the Pokédex bullet above for the full explanation).

**Habitat + area confirmation for the 220 additions:** pokopiawiki.com's
`/pokedex` page, which server-renders a complete per-species dataset
(`ideal_habitat` category + confirmed area list + classification) inside
a Next.js RSC data chunk (`self.__next_f.push([1,"..."])` in the raw
HTML) — extracted by concatenating those chunks, unescaping the JS string,
and parsing the embedded `initialPokemon` JSON array directly (363
entries: all 300 main-dex slots + 47 Basin-prefixed + 6 "E-"-prefixed).
Matched to Bulbapedia's 220 missing species by numeric id (=
`pokopiaNumber`); every one of the 220 had a match, so all 220 got
`habitat`, not just a bare number. This source's reliability was
cross-checked against lore already independently documented in this file
by earlier sessions, before session 4 ever fetched it: pokopiawiki's data
for Pokopia number 79 names "Peakychu" and for 108 names "Mosslax" (both
already cited in the Rocky Ridges/Bleak Beach walkthrough content above,
sourced back in session 2 from Nintendo Life/GameRant), and for 192 names
"Greedent Cook" (matching this file's pre-existing "Chef Dente" callout,
also session 2) — three independent hits on facts this session didn't
already know, which is why the dataset was trusted in bulk rather than
re-verified species-by-species.

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
