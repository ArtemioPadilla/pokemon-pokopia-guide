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
rigor. What's still open is called out per-item below.

- **Pokédex: 162 of 300 species** (up from 117 — session 3 added 45 brand
  new entries, all 50 species from Bulbapedia's `List of Pokémon by
Pokédex (Basin) number in Pokémon Pokopia`, fetched in full). That page
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
  actual source rather than reasoning from a plausible guess. The
  remaining **32 base-dex entries still have no `pokopiaNumber`** for the
  same honest reason as before. `pokopiaNumber` itself is unchanged at
  **80 of the (original) 117** — session 3 didn't revisit already-checked
  numbers. `habitat` is now confirmed for **81 of 162** entries (up from
  3): the 76 species that got `pokopiaNumber` in session 2 but no habitat
  yet were fetched individually from Serebii's per-species Pokopia pages
  (`pokemonpokopia/pokedex/<name>.shtml`, which lists exact habitat
  structure name(s), rarity, and which of the 6 base areas + Cloud Island
  each species appears in) — 76 of 77 succeeded; Wooper's page 404s under
  every slug tried and was left as an honest gap rather than guessed. Two
  more (Corsola, Shellder) got habitat text straight from the area
  markdown's existing sourced claim about their shared Bubbly Basin
  habitat. `area` was deliberately left unset on the 76 (most are
  confirmed in all 6 base areas at once, so no single area is accurate;
  a handful confirmed in only 2 areas — e.g. Pikachu in Palette Town +
  Cloud Island — still don't reduce to one, so `habitat`'s text notes the
  narrower area list instead of forcing the `area` field).
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
  imprecise web-search summary, corrected here against the real page),
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

If you're picking this project back up next: 138 of the 300 base-dex
species still don't exist as entries at all (162 do, including the 45 new
Bubbly Basin ones) — session 3 didn't attempt wholesale new-species
expansion beyond the Basin dex pull, since that needs Pokopia-specific
confirmation per species (not just "this Pokémon exists," which is
trivially true for all 300+ real Pokémon) and the remaining ones are
scattered rather than conveniently listed the way the Basin dex was. The
32 still-gap base-dex entries (no `pokopiaNumber`, not Basin-exclusive
either) are the next most tractable target if a similarly authoritative
numbered source turns up. Wooper's missing habitat and the Bubbly Basin
species still lacking habitat (all but Corsola/Shellder among the 45) are
smaller, well-scoped remaining gaps in the data already in the repo.

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
