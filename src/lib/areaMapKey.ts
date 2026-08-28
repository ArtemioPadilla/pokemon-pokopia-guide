/**
 * Maps an area's localized `title` (as stored verbatim on Pokédex/
 * Collectibles `area` fields — see content.config.ts) to the stable,
 * locale-independent key `AreaMapBackground` uses to pick a background.
 * Areas without any art (real or hand-authored) fall back to a generic
 * placeholder (see `AreaMapBackground`'s `default` case) rather than
 * crashing — safe if a future entry gets `x`/`y` before its area gets one.
 *
 * All 6 areas are mapped now (session 3 added real in-game map/screenshot
 * art for Rocky Ridges, Sparkling Skylands, Palette Town, and Bubbly Basin
 * — see AreaMapBackground.tsx for which areas got a REAL asset vs. which
 * keep the earlier hand-drawn SVG because no real overview map/screenshot
 * of the whole area could be sourced; CLAUDE.md's "Coverage TODO" has the
 * full explanation).
 */
export const AREA_MAP_KEY_BY_TITLE: Record<string, string> = {
  'Withered Wasteland': 'withered-wasteland',
  'Yermo Marchito': 'withered-wasteland',
  'Bleak Beach': 'bleak-beach',
  'Playa Sombría': 'bleak-beach',
  'Rocky Ridges': 'rocky-ridges',
  'Crestas Rocosas': 'rocky-ridges',
  'Sparkling Skylands': 'sparkling-skylands',
  'Palette Town': 'palette-town',
  'Bubbly Basin': 'bubbly-basin',
};

export function getAreaMapKey(areaTitle: string): string {
  return AREA_MAP_KEY_BY_TITLE[areaTitle] ?? 'unknown';
}
