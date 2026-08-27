/**
 * Maps an area's localized `title` (as stored verbatim on Pokédex/
 * Collectibles `area` fields — see content.config.ts) to the stable,
 * locale-independent key `AreaMapBackground` uses to pick a schematic
 * illustration. Areas without hand-authored art fall back to a generic
 * background (see `AreaMapBackground`'s `default` case) rather than
 * crashing — safe if a future entry gets `x`/`y` before its area gets one.
 *
 * Only areas with at least one sourced, pinnable location currently appear
 * here — see CLAUDE.md's "Coverage TODO" for why the other 3 areas have no
 * located entries yet.
 */
export const AREA_MAP_KEY_BY_TITLE: Record<string, string> = {
  'Withered Wasteland': 'withered-wasteland',
  'Yermo Marchito': 'withered-wasteland',
  'Bleak Beach': 'bleak-beach',
  'Playa Sombría': 'bleak-beach',
  'Rocky Ridges': 'rocky-ridges',
  'Crestas Rocosas': 'rocky-ridges',
};

export function getAreaMapKey(areaTitle: string): string {
  return AREA_MAP_KEY_BY_TITLE[areaTitle] ?? 'unknown';
}
