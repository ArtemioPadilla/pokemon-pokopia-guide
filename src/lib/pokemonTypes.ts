// Content stores each Pokémon's `types` in-language (English in
// src/content/en/pokedex.json, Spanish in src/content/es/pokedex.json) since
// that's how the game itself presents them per locale — this file maps
// either spelling to one canonical key so the badge component and its color
// tokens (--type-* in global.css) don't need to duplicate per locale.
const TYPE_KEY: Record<string, string> = {
  // English
  normal: 'normal', fire: 'fire', water: 'water', electric: 'electric', grass: 'grass',
  ice: 'ice', fighting: 'fighting', poison: 'poison', ground: 'ground', flying: 'flying',
  psychic: 'psychic', bug: 'bug', rock: 'rock', ghost: 'ghost', dragon: 'dragon',
  dark: 'dark', steel: 'steel', fairy: 'fairy',
  // Español
  fuego: 'fire', agua: 'water', eléctrico: 'electric', planta: 'grass',
  hielo: 'ice', lucha: 'fighting', veneno: 'poison', tierra: 'ground', volador: 'flying',
  psíquico: 'psychic', bicho: 'bug', roca: 'rock', fantasma: 'ghost', dragón: 'dragon',
  siniestro: 'dark', acero: 'steel', hada: 'fairy',
};

// Fully literal class strings per type — Tailwind's build-time scanner only
// picks up class names it can see verbatim in source, so this must NOT be
// built via string interpolation (`text-type-${key}` is invisible to it and
// silently generates no CSS).
const TYPE_BADGE_CLASS: Record<string, string> = {
  normal: 'text-type-normal border-type-normal/40 bg-type-normal/10',
  fire: 'text-type-fire border-type-fire/40 bg-type-fire/10',
  water: 'text-type-water border-type-water/40 bg-type-water/10',
  electric: 'text-type-electric border-type-electric/40 bg-type-electric/10',
  grass: 'text-type-grass border-type-grass/40 bg-type-grass/10',
  ice: 'text-type-ice border-type-ice/40 bg-type-ice/10',
  fighting: 'text-type-fighting border-type-fighting/40 bg-type-fighting/10',
  poison: 'text-type-poison border-type-poison/40 bg-type-poison/10',
  ground: 'text-type-ground border-type-ground/40 bg-type-ground/10',
  flying: 'text-type-flying border-type-flying/40 bg-type-flying/10',
  psychic: 'text-type-psychic border-type-psychic/40 bg-type-psychic/10',
  bug: 'text-type-bug border-type-bug/40 bg-type-bug/10',
  rock: 'text-type-rock border-type-rock/40 bg-type-rock/10',
  ghost: 'text-type-ghost border-type-ghost/40 bg-type-ghost/10',
  dragon: 'text-type-dragon border-type-dragon/40 bg-type-dragon/10',
  dark: 'text-type-dark border-type-dark/40 bg-type-dark/10',
  steel: 'text-type-steel border-type-steel/40 bg-type-steel/10',
  fairy: 'text-type-fairy border-type-fairy/40 bg-type-fairy/10',
};

const FALLBACK_CLASS = 'text-muted-foreground border-border bg-muted/40';

/** Tailwind classes for a type badge — background tint + matching text/border, same pattern as PILL_STYLE. */
export function typeBadgeClass(typeName: string): string {
  const key = TYPE_KEY[typeName.toLowerCase()];
  return key ? TYPE_BADGE_CLASS[key] : FALLBACK_CLASS;
}

/** The raw `--type-*` custom-property name for a type, for callers that need
 * an inline-style color (e.g. a small swatch dot) rather than a Tailwind
 * class — inline styles aren't subject to the static-scanning limitation
 * above, so this is safe to build dynamically. */
export function typeColorVar(typeName: string): string {
  const key = TYPE_KEY[typeName.toLowerCase()];
  return key ? `--type-${key}` : '--muted-foreground';
}
