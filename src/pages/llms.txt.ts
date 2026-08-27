import type { APIRoute } from 'astro';
import { SITE, REPO_URL } from '@/lib/site-meta';

/**
 * /llms.txt — agent-first index (llmstxt.org). Keep this in sync as routes
 * grow; an agent reads this before crawling anything else.
 */
export const GET: APIRoute = () => {
  const body = `# ${SITE.name}

> ${SITE.description}

Unofficial fan project. Source: ${REPO_URL} (${SITE.license}). Agent/contributor
context: ${REPO_URL}/blob/main/CLAUDE.md

## Pages (English, default — Spanish mirror under /es/)

- [Home](/): paradise-building basics and your progress summary
- [Areas](/areas/): the 5 base areas + the Expansion Pass area, one write-up each
- [Pokédex](/pokedex/): checklist tracker for the curated Pokopia Pokédex subset
- [Recipes](/recipes/): crafting recipe reference (materials + unlock method)
- [Collectibles](/collectibles/): checklist tracker for Ancient Artifacts, Human Records, and the Highlight Reel
- [Milestones](/milestones/): Environment Level progression reference
- [Beyond Day One](/endgame/): Cloud Islands, Dream Islands, Link Play, and the Expansion Pass
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
