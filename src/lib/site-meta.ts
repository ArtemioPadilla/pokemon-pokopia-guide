/**
 * Single source of this site's machine-readable identity (llms.txt,
 * default meta description, FeedbackFAB-less footer credit).
 */
export const SITE = {
  name: 'Pokopia Guide',
  description:
    'Unofficial offline companion guide and tracker for Pokémon Pokopia: the Pokopia Pokédex, crafting recipes, collectibles, Environment Level milestones, and area-by-area reference.',
  repoSlug:
    (import.meta.env.PUBLIC_REPO_SLUG as string | undefined) ??
    'ArtemioPadilla/pokemon-pokopia-guide',
  license: 'MIT',
} as const;

export const REPO_URL = `https://github.com/${SITE.repoSlug}`;
