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
  supersedes the original "83" estimate), Human Records (154 individually
  confirmed documents as of session 4 — the earlier "126" figure was
  itself an unreliable estimate that doesn't appear anywhere on the
  current Game8 source page and has been dropped, see "Coverage TODO"
  below), and the Highlight Reel (44 photo challenges confirmed via
  Game8 as of session 3) — the second completionist checklist, playing
  the role RE4's
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
further; a fifth pass (session 5) discovered a third Pokédex system
(Event) and exhaustively confirmed a real source wall on Artifact
locations and 30 gap Pokédex entries; a sixth pass (session 6, see
"Sources consulted — session 6" below) found 2 new Human Records via a
previously-unchecked Bulbapedia page, and removed those same 30 gap
Pokédex entries after determining they were never actually sourced and
are contradicted by a dedicated third-party "missing Pokémon" source.
What's still open is called out per-item below.

- **Pokédex: 352 entries** (382 as of session 5, -30 in session 6 — see
  below; up from 162 originally), of which **300 carry a
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

  Of the **32 base-dex "gap" entries** (no `pokopiaNumber`, not
  Basin-exclusive), session 5 resolved **2**: Sableye and Feebas turned
  out to belong to a **third, previously-undocumented Pokopia dex
  system** — see "Pokédex — session 5 (Event Pokédex discovery)" below.
  The other **30 were removed entirely in session 6** after an audit of
  their *legitimacy*, not just their numbering — see "Pokédex — session 6
  (the 30 gap entries removed)" below for the full account. Short version:
  these 30 (Krabby, Chikorita, Togepi, Slugma, Treecko, Turtwig, Chimchar,
  Tepig, Oshawott, Sewaddle, Deerling, Joltik, Chespin, Fennekin, Bunnelby,
  Skiddo, Litten, Pikipek, Yungoos, Mudbray, Comfey, Grookey, Sobble,
  Wooloo, Applin, Fuecoco, Quaxly, Lechonk, Tarountula, Nymble) were added
  in session 1's original scaffold as bare stubs (`id`/`nationalNumber`/
  `name`/`types`/`generation` only, no `habitat`, `note`, or citation of
  any kind) — before this repo's sourcing discipline existed. Session 6
  found they have **zero support anywhere**: not in any of the 4
  independent full-catalog dex sources session 5 already exhausted, not in
  this repo's own sourced area-walkthrough content (checked fresh this
  session, zero name matches), and a dedicated third-party "missing
  Pokémon" article (TheGamer) explicitly confirms at least 15 of the 30
  (Togepi, Applin, and 13 starter-line species) as **not** in the game.
  Given a guess that was never actually sourced, once contradicted rather
  than just unconfirmed, is exactly the kind of entry this repo's
  "honest gap over guessed value" rule says to remove, all 30 were deleted
  from both locales' `pokedex.json` rather than kept as placeholders. The
  **50 Basin-exclusive entries** (`basinNumber`, no `pokopiaNumber`) are
  unchanged — Basin coverage wasn't revisited beyond a quick sanity check
  that the existing 50 still matches Bulbapedia's Basin list structurally.
  `habitat` is confirmed for **301 of 352** entries (the 220 session-4
  entries plus the 81 already confirmed as of session 3) — the removal of
  30 always-habitat-less entries in session 6 raised the *proportion* with
  `habitat` even though the raw numerator didn't change. Session 3's
  original context on the Basin dex and the 76-species Serebii habitat
  pass is preserved below for provenance.

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
- **Collectibles: 287 total** (up from 188 as of session 3; 26 originally)
  — **89 of 89 known Artifacts** (up from 8 of an estimated 83; Game8's
  own Large + Small Lost Relic lists turned out to total 86, not 83 — the
  "83" figure was itself an imprecise web-search summary, corrected here
  against the real page). Naming/materials/rarity for all 89 come
  straight from Game8, but **`area` is still unset ("Not specified in
  available sources") for all 89 — checked again in session 5, still a
  genuine source wall.** Session 4 flagged `serebii.net/pokemonpokopia/
  lostrelics.shtml` as a promising next target; session 5 fetched it as
  raw HTML and found it has the exact same structural gap as Game8's
  page — its "List of Lost Relic Items" table has only three columns
  (Picture / Name / Description), no location field at all, confirmed by
  the string "location" not appearing anywhere in the page's raw HTML.
  Session 5 also checked all 6 of Serebii's per-area location pages
  (`locations/<slug>.shtml`) for any incidental relic-location mention —
  none of the 6 mention "relic" even once — and confirmed pokopiawiki.com,
  pokopiamap.com, and pokopiadex.com all 404 on every guessed
  lost-relics/artifacts URL path. Unlike Human Records, where Serebii
  turned out to have data Game8 lacked, no source found so far tracks
  *where* a Lost Relic is found — only what it is. This is now a
  well-documented dead end, not an unexplored lead.
  **156 Human Records** (154 as of session 4, +2 from session 6's
  Bulbapedia find — see "Human Records — session 4" below for the full
  story of the 55→154 jump and why this file's old "126 total" estimate
  has been dropped rather than kept as a target, and "Human Records —
  session 6" below for the +2), and **44 Highlight Reel photos** (up from 8; Game8's list numbers 44
  entries as of session 3, still not confirmed as the game's true total,
  and not revisited in session 4). One existing entry got a genuine
  correction in passing back in session 3: "Dear Douglas"'s `area` went
  from the honest placeholder "not yet located in sources" to the real
  confirmed "Dream Island" once Game8's page listed it.
- **Human Records — session 4:** re-checked Game8's records page (still
  marked "work in progress," last-updated banner reads March 13, 2026)
  and found it has genuinely grown since session 3: 64 individually named
  documents now (up from whatever it had when session 3 pulled 55), of
  which 18 are still marked "Currently under investigation!" (Game8 knows
  the document exists but not its map location). Diffing that fresh pull
  against the collection surfaced **9 new records** Game8 hadn't listed
  before. Far more significantly, Serebii.net turned out to have its own
  Human Records page (`/pokemonpokopia/humanrecords.shtml`) that neither
  this file nor any prior session had checked — **163 rows** (153 after
  merging a handful of literal row-duplicates in Serebii's own table),
  every single one with a confirmed location, including a `reward` column
  Game8 doesn't have. Diffed against the collection with an
  accent/punctuation/case-insensitive normalizer (to correctly treat
  "Kenan's Diary" / "Kenan's diary" as the same record instead of a false
  new find), Serebii alone accounted for **98 genuinely new** records once
  two Serebii-side typos were caught and folded back into existing
  entries instead of added as duplicates ("Perculiar pattern" → the
  already-present "Peculiar pattern"; "Gym Leader Montly (July Issue)" →
  the already-present "...Monthly..."). One more new record ("Post from
  July 30, 6:00 p.m.") came from the raw Game8 diff and wasn't present in
  Serebii under a normalizer-matchable name. Final count: 55 pre-existing
  - 98 from Serebii + 1 from Game8 = **154 total records**. Serebii's data
    was also used to **resolve all 13
    previously-`"Not specified in available sources"` entries** left over
    from session 3's Game8-only pull (e.g. "Celadon Department Store
    Reopens" → Sparkling Skylands, "Peculiar pattern" → Dream Island) — so
    **0 of the 154 records now have an unresolved `area`**, a first for
    this collection type. pokopiamap.com's `/human-records` URL returned
    200 but is a soft-404 (the site's homepage nav, no records content) —
    checked and ruled out rather than silently skipped. pokopiawiki.com has
    no records page at all (`/records`, `/human-records`,
    `/guides/human-records` all 404). Given Serebii's page alone yielded
    154 individually verified, located records — well above this file's
    old "126" estimate, which never appeared anywhere in Game8's actual
    page text and was likely an imprecise web-search artifact from an
    earlier session — **that "126" figure is retired**; there's no evidence
    it was ever the game's true total, and 154 is itself just "confirmed so
    far," not a ceiling. `x`/`y` map pins were not attempted for the new
    154 total (neither Game8 nor Serebii gives schematic-map coordinates,
    only named areas), matching the pre-existing convention for most
    Records entries.
- **Pokédex — session 5 (Event Pokédex discovery + the 32 gap entries):**
  tasked with re-checking the 32 unnumbered "gap" entries against sources
  not yet tried for this specific question. Serebii.net's per-species
  Pokopia pages (`pokemonpokopia/pokedex/<name>.shtml`) turned out to embed
  a site-wide `<select>` jump-menu listing **every** entry across **all
  three** of the game's in-game Pokédex tabs, in order — a fact this repo
  hadn't previously used, since prior sessions only pulled Bulbapedia's own
  numbered tables. Fetching that dropdown from any one species page
  (`sableye.shtml`'s copy was used) surfaced a **third, previously
  undocumented numbering system**: Serebii's own `eventpokedex.shtml`
  confirms the game has a dedicated "PokéDex (Event)" tab — "a second
  Pokédex which can be tabbed between which keeps track of all Pokémon
  that are obtained only via Special Events" — with its own 7-entry
  `No.` column (Hoppip #1, Skiploom #2, Jumpluff #3, **Sableye #4**,
  Jirachi #5, **Feebas #6**, Milotic #7). Two of the 32 gap species —
  Sableye and Feebas — are on that list, so the schema gained a new
  optional `eventNumber` field (parallel to `basinNumber`, never
  conflated with either other numbering) and both entries were updated.
  Corroborated independently by pokopiadex.com's own `/pokedex/event`
  page (same 7 names, same order) and pokopiamap.com (its `/pokedex/
event-5` page is Jirachi, matching Serebii's Event #5, and it has
  standalone event pages for `sableye-event` and
  `fetch-scales-for-feebas`). One genuine cross-source discrepancy:
  pokopiawiki.com's own embedded dataset (the same RSC-chunk extraction
  method from session 4) lists only 6 Event entries, `E-001`–`E-006`,
  **omitting Jirachi** — which shifts Feebas to `E-005` there instead of
  Serebii's `#006`. Sableye is unaffected (`E-004` either way, since the
  omission happens after it in list order). Feebas's entry keeps
  Serebii's number with a `note` documenting the discrepancy rather than
  silently picking one, per this repo's "honest gap over guessed value"
  rule applied to a numbering *conflict*, not just a numbering *absence*.

  The remaining **30 of 32** gap species (Krabby, Chikorita, Togepi,
  Slugma, Treecko, Turtwig, Chimchar, Tepig, Oshawott, Sewaddle,
  Deerling, Joltik, Chespin, Fennekin, Bunnelby, Skiddo, Litten, Pikipek,
  Yungoos, Mudbray, Comfey, Grookey, Sobble, Wooloo, Applin, Fuecoco,
  Quaxly, Lechonk, Tarountula, Nymble) got a genuine, multi-source
  attempt and stayed unresolved: none has an individual Serebii Pokopia
  page (all 30 return HTTP 404 under the standard slug), none appears
  anywhere in Serebii's own 367-row cross-dex dropdown (all 300 main +
  7 Event + ~50 Basin entries, checked programmatically, not by eye),
  none appears in pokopiawiki.com's full 363-entry embedded dataset (the
  same dataset already used for habitat in session 4, re-checked here for
  a dex number instead), and none appears anywhere in pokopiadex.com's
  main Pokédex page, its `/pokedex/dlc` (Basin) page, or its
  `/pokedex/event` page, nor in pokopiamap.com's main Pokédex page. Six
  independent checks across four sites, zero hits — this reads as a real
  source wall for these 30, not an unexplored lead. `x`/`y` map-pin
  placement for the 220 species session 4 added remains a smaller,
  separate, well-scoped gap (unchanged this session).

- **Milestones**: Environment Level is a **per-area** stat (confirmed by
  Serebii — "environment level in each area"), not a single global 1–10
  scale. The milestones list mixes area-level-gated and Pokédex-count-gated
  unlocks and says so explicitly per entry — don't conflate the two axes.
  Not revisited this session.

If you're picking this project back up next: the base 300-entry Pokopia
Pokédex is **fully numbered** (300/300 `pokopiaNumber` slots filled) and
every one of those 300 has a `habitat`. Of the original 32 unnumbered
"gap" entries, 2 (Sableye, Feebas) turned out to belong to a third,
previously-undocumented in-game "Event Pokédex" and now carry
`eventNumber` — see "Pokédex — session 5" above for the full story,
including a genuine cross-source discrepancy on Feebas's exact number
that's documented in its `note` rather than silently resolved. The other
**30 were removed in session 6**, not left as a gap — see "Pokédex —
session 6" above. Session 5's six independent checks across four sites
had already found zero trace of them in any of the game's three Pokédex
systems; session 6 went further and checked whether they were confirmed
to be *in the game at all* (as opposed to just unnumbered), and found the
opposite: zero mentions in this repo's own sourced walkthrough content,
plus a dedicated TheGamer "missing Pokémon" article that explicitly names
Togepi and Applin as absent and states only 6 non-Kanto starters (Torchic,
Piplup, Rowlet, Froakie, Scorbunny, Sprigatito — none of which were among
the 30) made it into the game at all. That combination — no original
sourcing, an exhaustive negative search, and explicit third-party
contradiction — crossed the line from "unresolved gap" to "shaky addition
that should be removed," per this repo's own "honest gap over guessed
value" rule. If a genuinely new source ever turns up naming any of these
30 as confirmed-in-Pokopia, re-add it with that citation rather than
assuming session 6 was wrong to remove it. Wooper's still-missing habitat
(its Serebii page 404s under every slug tried, per session 3) is a
smaller, separate gap. `x`/`y` map-pin placement for the 220 species
session 4 added is also still open: none of them have a pin, since
neither Bulbapedia's table nor pokopiawiki.com's dataset gives
schematic-map coordinates, only a named-area list.

On Human Records specifically (session 4 + 6): 156 individually verified
records is a strong number, but "still growing" is the honest framing,
not "complete" — Game8's page is still explicitly marked
work-in-progress, Serebii's own page doesn't claim to be exhaustive
either, and Bulbapedia's own `Human Records` / `Human Records (Basin)`
pages (checked for the first time in session 6, see below) contributed 2
more previously-unlisted entries on top of Game8 and Serebii.

On Artifacts specifically (session 5): the `serebii.net/pokemonpokopia/
lostrelics.shtml` lead flagged at the end of session 4 was checked and
turned out to be a dead end — see the Collectibles bullet above for the
full account. All 89 Artifacts still have `area: "Not specified in
available sources"`; every source this guide has ever tried for
Artifacts (Game8, Serebii, pokopiawiki, pokopiamap, pokopiadex) has now
been checked and none tracks Lost Relic locations. Unless a genuinely new
source surfaces, this is complete as far as this guide's sourcing can
take it — an honest, permanent gap rather than a to-do.

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

### Sources consulted — session 4 (Human Records)

Game8.co's Human Records page (archive 584648, re-fetched — still marked
work-in-progress, last-updated banner March 13, 2026), fetched as raw
HTML and parsed by pairing each record's name row with its following
location/status row (`<tr rowspan="2">` structure) — 64 records, 46 with
a confirmed location and 18 marked "Currently under investigation!".
Serebii.net's `/pokemonpokopia/humanrecords.shtml`, fetched as raw HTML
and parsed as a single flat table with inline category-header rows
("Newspaper", "Diary Entries", "Magazines", "Notes", "Letters", "Papers",
"Photos", "Treasure Maps") — 163 rows, deduplicated to 153 unique records
by name after merging a handful of literal repeat rows (a "Perculiar
pattern" Dream Island photo repeated identically 10 times, which reads as
one repeatable collectible rather than 10 distinct ones, and one
"Comfy Living (Vol. 11)" row split across two near-identical rows). Every
Serebii row had a non-empty location, unlike Game8's page. Diffed against
both the existing collection and each other using an accent/case/
punctuation-insensitive name normalizer, with a manual `difflib`
close-match pass afterward specifically to catch same-record spelling
variants a strict normalizer would miss (this is how the "Perculiar
pattern"/"Peculiar pattern" and "Gym Leader Montly"/"...Monthly..."
Serebii-side typos were caught and folded into existing entries instead
of being added as false-new duplicates). pokopiamap.com's `/human-records`
URL was checked and found to be a soft-404 (returns the site's generic
homepage nav, not records content) — ruled out rather than silently
skipped. pokopiawiki.com has no records page under any guessed path
(`/records`, `/human-records`, `/guides/human-records`, `/collectibles`,
`/artifacts` — all 404).
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

### Sources consulted — session 5 (Artifact locations + the 32 gap Pokédex entries)

**Artifacts:** `serebii.net/pokemonpokopia/lostrelics.shtml`, fetched as
raw HTML (not a summarizing fetch). Its "List of Lost Relic Items" table
has exactly three columns — Picture, Name, Description — confirmed by
checking the raw markup directly and by the string "location" not
appearing anywhere in the page. Also checked, all raw HTML: Serebii's 6
per-area location pages (`pokemonpokopia/locations/<slug>.shtml`) — each
one does have a "Treasure Found in Area" table linking to the generic
`items/largelostrelic.shtml` / `items/smalllostrelic.shtml` category
pages, but that link is identical and undifferentiated across all 6
areas (unlike the dolls/fossils on the same table, which do vary by
area), so it gives no per-item or per-area signal for any of the 89
individually-named relics — a dead end in substance even though "relic"
isn't literally absent from those pages. Also checked: `pokopiawiki.com`,
`pokopiamap.com`, and `pokopiadex.com` on every guessed
lost-relics/artifacts URL path (all 404).

**The 32 gap Pokédex entries:** Serebii.net's per-species Pokopia pages
(`pokemonpokopia/pokedex/<name>.shtml`), fetched individually for all 32
— 30 returned 404, Sableye and Feebas returned 200. Those two pages'
embedded site-wide jump-menu (`<SELECT NAME="SelectURL">`, present on
every species page) was parsed in full (367 `<option>` rows) and turned
out to enumerate all three of the game's Pokédex tabs back-to-back: the
main 300-entry dex, a 7-entry "Event" dex, and the 50-entry Basin dex —
confirmed against `eventpokedex.shtml` itself, which spells out that the
game has a dedicated Event Pokédex tab. The same 367-row parse was used
to confirm none of the other 30 gap species appear under any of the
three systems (zero regex hits by name, not just an eyeball check).
Cross-checked against pokopiawiki.com's `/pokedex` page (same RSC-chunk
extraction method as session 4 — `initialPokemon` JSON, 363 entries this
time including 6 `E-`-prefixed Event entries), pokopiadex.com's
`/pokedex`, `/pokedex/dlc`, and `/pokedex/event` pages (fetched as raw
HTML, `aria-label` attributes parsed for per-card species names), and
pokopiamap.com's `/sitemap.xml` (a genuine XML sitemap, unlike
pokopiadex.com's, which 404s under that path) plus its `/pokedex` page —
all four sources agree on the Event dex's 7-species membership and
confirm zero of the other 30 species appear anywhere in any of these
sites' Pokopia coverage.

### Sources consulted — session 6 (Bulbapedia Human Records + the 30 gap Pokédex entries' legitimacy)

**Human Records — session 6:** Bulbapedia turned out to have its own
`Human_Records` and `Human_Records_(Basin)` pages — a lead no prior
session had checked (all four prior Human Records passes went to Game8
and/or Serebii only). Fetched both, then re-fetched both as raw wikitext
(`action=raw`) for the two ambiguous cases below rather than trusting a
single summarizing fetch. 121 entries on the main page + 34 on the Basin
page = 155 distinct names, diffed against the existing 154-record
collection with the same accent/case/punctuation-insensitive normalizer
used in session 4. 8 near-misses came back on the first pass; 6 were
confirmed via `difflib` fuzzy-matching to be the same records the
collection already had under a slightly different spelling (Bulbapedia
itself has typos/variants like "Artificial Hot Spring**s** Now Open!" vs.
the collection's "...Spring Now Open!", "Ophthalmology" vs. "Opthalmology",
"Career Monthly (Vol. 11)" vs. "(Vol. 111)", "Bird Pokémon Monthly" vs.
"...Montly", "Poké Week (Issue 122)" vs. "PokéWeek..." — a spacing
difference — and "Kanto Monthly" vs. "Kanto Montly") — these were treated
as the same record, not added. The remaining 2 — **"Comfy Living
(Vol. 30)"** (Bubbly Basin, reward "Mermaid outfit" per Bulbapedia) and
**"PokéWeek (Issue 46)"** (Dream Island) — were confirmed as genuinely
distinct via the raw wikitext (the collection already has Comfy Living
Vol. 2/11/36/866 and PokéWeek Issues 37/122/146, so a 5th/4th volume/issue
number is plausible, not a likely typo of an existing one) and added as
`col-rec-155`/`col-rec-156`, area `Bubbly Basin` / `Dream Island -
Starmie` (matching the existing convention for other Basin-DLC records
that are physically found in Dream Island, e.g. the pre-existing
PokéWeek #37/#146). New total: **156 Human Records**, still an honest
"confirmed so far," not a claimed ceiling — same framing as session 4.

**The 30 remaining gap Pokédex entries — a legitimacy audit, not a
numbering search:** session 5 had already confirmed these 30 don't appear
in any of 4 independent dex-enumeration sources; session 6's task was
different — verify each species is genuinely confirmed to be *in Pokopia
at all*, since all 30 were originally added in session 1's initial
scaffold commit (`030ee42`) as bare stub entries (`id`/`nationalNumber`/
`name`/`types`/`generation` only — no `habitat`, `note`, `area`, or
citation of any kind, confirmed by inspecting that commit directly) before
this repo's sourcing discipline existed. Checked and found:
(1) `grep -rniE` for all 30 names against every file in
`src/content/{es,en}/areas/*.md` — **zero matches**, so no area-walkthrough
mention (the assumed original justification) actually exists in this
repo's own sourced content. (2) A targeted web search surfaced
`thegamer.com/pokemon-pokopia-missing-starters-complete-pokedex/` ("These
Pokemon Are Still Missing From Pokemon Pokopia," Kaitlyn Peterson, Mar 26
2026) — a dedicated article about species absent from the game, a *type*
of source not tried in session 5. Fetched and cross-verified with a
verbatim-quote pass: it explicitly names **Togepi** ("Togepi's absence
hasn't gone unnoticed") and **Applin** as confirmed missing, and states
"Beyond the Kanto starters, the only others that made the cut were
Torchic, Piplup, Rowlet, Froakie, Scorbunny, and Sprigatito" — an
exhaustive list of the non-Kanto starters that *are* in the game, which by
construction excludes the 13 starter-line species on the gap list
(Chikorita, Treecko, Turtwig, Chimchar, Tepig, Oshawott, Chespin, Fennekin,
Litten, Grookey, Sobble, Fuecoco, Quaxly) — Grookey additionally shows up
in the article's own comment section as a reader-named "not in the game
yet" example. That's 15 of the 30 explicitly contradicted by name or by
exhaustive-list construction. (3) One contradictory source was found and
discounted, but not lightly: `pokopia.center`'s "complete Pokédex" listicle
names 10 of these 30 as present (Togepi, Chikorita, Treecko, Turtwig,
Chimchar, Oshawott, Fennekin, Wooloo, Fuecoco, Quaxly), with specific-
sounding detail per species (e.g. "Togepi requires a Fairy habitat that
many players build") — a real, non-trivial contradiction, not just an
absence of data. It's discounted anyway because it gives no dex numbers at
all, cites no source of its own, and its own disclaimer identifies it as an
"independent, unofficial fan site" — weighed against four independently-
fetched structured sources (Bulbapedia's 3 official dex tables, Serebii's
per-species 404s, pokopiawiki.com's live embedded dataset) plus TheGamer's
dedicated investigative piece, all agreeing the other way. It directly
conflicts with Bulbapedia's
authoritative 300-row numbered table (already fetched in full in session 4
and used as this repo's ground truth for `pokopiaNumber`) and with
Serebii's site-wide 367-row dex dropdown (session 5) — both of which
would show these species if they were really in the main dex. Given zero
supporting evidence across every structured source this repo trusts,
explicit contradiction for half the list from a dedicated third-party
"missing Pokémon" piece, and the entries' own complete lack of original
sourcing since session 1, all **30 were removed** from both locales'
`pokedex.json` rather than kept as unresolved placeholders — see the
Pokédex bullet above for the reasoning tied to this repo's "honest gap
over guessed value" rule.

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
