import type { CollectionEntry } from 'astro:content';

// The pill `type` union content.config.ts already enforces — reused here so
// PILL_STYLE can't silently miss a case (a typo'd key used to fall through
// to `undefined` in the class list with no compile error).
export type PillType = CollectionEntry<'areas_en'>['data']['pills'][number]['type'];

// Theme-aware pill colors (see the --pill-quest/--pill-craft tokens and
// their light-mode contrast rationale in global.css). pokemon/info reuse
// existing semantic tokens.
export const PILL_STYLE: Record<PillType, string> = {
  quest: 'text-pill-quest border-pill-quest/40',
  craft: 'text-pill-craft border-pill-craft/40',
  pokemon: 'text-primary border-primary/40',
  info: 'text-muted-foreground border-border',
};
