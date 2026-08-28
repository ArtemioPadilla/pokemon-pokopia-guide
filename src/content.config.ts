import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Every content entity ships in both locales as sibling files under
// src/content/en/ and src/content/es/ (never a `locale` field per entry —
// the directory IS the locale). This factory keeps that pairing DRY.
// `schema` is typed via the same `z` re-exported by astro:content (not the
// top-level `zod` package) — Astro vendors its own zod instance, and a type
// pulled from a separate `zod` import structurally mismatches it.
function localizedJson<Schema extends z.ZodType>(name: string, schema: Schema) {
  return {
    [`${name}_en`]: defineCollection({ loader: file(`src/content/en/${name}.json`), schema }),
    [`${name}_es`]: defineCollection({ loader: file(`src/content/es/${name}.json`), schema }),
  };
}

// --- Golden rules / quick tips (analog of RE4's `rules`) -----------------
const rulesSchema = z.object({
  title: z.string(),
  body: z.string(),
  order: z.number(),
});

// --- Areas: the 5 base areas + 1 Expansion Pass area, each a former Kanto
// city reclaimed from ruin. This is the light "walkthrough" layer (analog
// of RE4's `chapters`) — Pokopia has no linear chapter/boss structure, so
// each entry is one area's markdown write-up (story hook, what unlocks
// there, Professor Tangrowth's tasks) rather than a numbered story beat. ---
const areaPillSchema = z.object({
  type: z.enum(['quest', 'craft', 'pokemon', 'info']),
  label: z.string(),
});
const areasSchema = z.object({
  title: z.string(),
  formerCity: z.string(),
  kind: z.enum(['base', 'expansion']),
  order: z.number(),
  pills: z.array(areaPillSchema),
});

// --- Pokopia Pokédex: the PRIMARY completionist checklist (analog of RE4's
// `medallions`). `pokopiaNumber` is only set for entries whose in-game
// Pokopia-Dex number was confirmed from source material (Bulbapedia's
// numbered listing) — it is intentionally optional rather than guessed for
// every entry, so a missing value here is honest, not a bug. `basinNumber`
// is the SEPARATE numbering from the Expansion Pass's own "Bubbly Basin
// Pokédex" (Bulbapedia's `List of Pokémon by Pokédex (Basin) number in
// Pokémon Pokopia`, fetched in full — all 50 rows) — a species can have
// either, both, or neither; never conflate the two into `pokopiaNumber`,
// since they're genuinely different in-game lists. `nationalNumber`,
// `name`, `types`, and `generation` are standard, independently-verifiable
// Pokémon facts and are always present. `x`/`y` (0-100, percent of the
// area's schematic map viewBox) are set ONLY alongside a sourced `habitat`
// description precise enough to place a pin — most entries have neither, and
// that's the honest state, not a gap to paper over with a guessed position. -
const pokedexSchema = z.object({
  nationalNumber: z.number(),
  pokopiaNumber: z.number().optional(),
  basinNumber: z.number().optional(),
  name: z.string(),
  types: z.array(z.string()).min(1).max(2),
  generation: z.number().min(1).max(9),
  area: z.string().optional(),
  habitat: z.string().optional(),
  note: z.string().optional(),
  x: z.number().min(0).max(100).optional(),
  y: z.number().min(0).max(100).optional(),
});

// --- Collectibles: the SECOND checklist tracker (analog of RE4's
// `treasures`) — Pokopia's three completionist collection systems:
// Ancient Artifacts (lost relics), Human Records (environmental lore), and
// the Highlight Reel (in-game photography challenges). `x`/`y` mirror the
// Pokédex fields above and are set only for entries whose `area` is a real,
// confirmed area name (not one of the honest "not specified"/"not
// area-specific" placeholder strings) — see the map note on the
// Collectibles page for what that leaves unplaced. -------------------------
const collectiblesSchema = z.object({
  category: z.enum(['artifact', 'record', 'photo']),
  name: z.string(),
  area: z.string(),
  note: z.string().optional(),
  x: z.number().min(0).max(100).optional(),
  y: z.number().min(0).max(100).optional(),
});

// --- Crafting recipes: reference table (analog of RE4's `weapons`/`gems`).
// A curated cross-section of the 600+ in-game recipes, not exhaustive.
// `materials` is structured (name + numeric quantity) rather than bare
// "3x Glass" strings so RecipesPage can render a compact visual quantity
// comparison per recipe instead of a flat joined string. ------------------
const recipeMaterialSchema = z.object({
  name: z.string(),
  quantity: z.number().min(1),
});
const recipesSchema = z.object({
  name: z.string(),
  category: z.enum(['furniture', 'buildings', 'utilities', 'outdoor', 'blocks', 'misc']),
  materials: z.array(recipeMaterialSchema).min(1),
  unlockMethod: z.string(),
  order: z.number(),
});

// --- Environment Level milestones: quick reference (analog of RE4's
// `bosses`) — what each Environment Level gates and Professor Tangrowth's
// role at that stage. -------------------------------------------------------
const milestonesSchema = z.object({
  level: z.number(),
  title: z.string(),
  requirement: z.string(),
  unlocks: z.string(),
  order: z.number(),
});

// --- Endgame / extended systems: analog of RE4's `postgame` — Pokopia has
// no "New Game+" in the linear-game sense, but it does have a distinct set
// of systems that open up once the base 5 areas are established (Cloud
// Islands, Dream Islands, Link Play, the Expansion Pass). ------------------
const endgameSchema = z.union([
  z.object({ kind: z.literal('feature'), name: z.string(), body: z.string(), order: z.number() }),
  z.object({
    kind: z.literal('expansion'),
    name: z.string(),
    body: z.string(),
    requirement: z.string().optional(),
    order: z.number(),
  }),
]);

export const collections = {
  ...localizedJson('rules', rulesSchema),
  ...localizedJson('pokedex', pokedexSchema),
  ...localizedJson('collectibles', collectiblesSchema),
  ...localizedJson('recipes', recipesSchema),
  ...localizedJson('milestones', milestonesSchema),
  ...localizedJson('endgame', endgameSchema),
  areas_en: defineCollection({
    loader: glob({ pattern: '*.md', base: 'src/content/en/areas' }),
    schema: areasSchema,
  }),
  areas_es: defineCollection({
    loader: glob({ pattern: '*.md', base: 'src/content/es/areas' }),
    schema: areasSchema,
  }),
};
