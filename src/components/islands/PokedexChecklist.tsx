import { useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { pokedexStore } from '@/stores/checklist';
import ProgressBar from './ProgressBar';
import ViewToggle, { type ChecklistView } from './ViewToggle';
import AreaMap, { type AreaMapPin } from './AreaMap';
import PokedexTile from './PokedexTile';
import { typeBadgeClass } from '@/lib/pokemonTypes';

interface PokedexItem {
  id: string;
  nationalNumber: number;
  pokopiaNumber?: number;
  basinNumber?: number;
  eventNumber?: number;
  name: string;
  types: string[];
  generation: number;
  area?: string;
  habitat?: string;
  x?: number;
  y?: number;
}

interface Props {
  items: PokedexItem[];
  progressLabel: string;
  deviceTitle?: string;
  genLabel: string;
  habitatUnknownLabel: string;
  listLabel?: string;
  mapLabel?: string;
  viewGroupLabel?: string;
  mapNote?: string;
  checkedSuffix?: string;
  uncheckedSuffix?: string;
  searchPlaceholder?: string;
  hoverHintLabel?: string;
}

function numberLabel(item: PokedexItem): string {
  const parts = [`#${String(item.nationalNumber).padStart(3, '0')}`];
  if (item.pokopiaNumber) parts.push(`P${item.pokopiaNumber}`);
  else if (item.basinNumber) parts.push(`B${item.basinNumber}`);
  else if (item.eventNumber) parts.push(`E${item.eventNumber}`);
  return parts.join(' · ');
}

export default function PokedexChecklist({
  items,
  progressLabel,
  deviceTitle = 'Pokédex',
  genLabel,
  habitatUnknownLabel,
  listLabel = 'List',
  mapLabel = 'Map',
  viewGroupLabel = 'View',
  mapNote = '',
  checkedSuffix = 'checked off the list',
  uncheckedSuffix = 'not yet checked off',
  searchPlaceholder = 'Search…',
  hoverHintLabel = 'Hover or focus an entry to see details',
}: Props) {
  const checked = useStore(pokedexStore.$checked);
  const [view, setView] = useState<ChecklistView>('list');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const done = items.filter((i) => checked.has(i.id)).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  const gens = [...new Set(filtered.map((i) => i.generation))].sort((a, b) => a - b);
  const activeItem = items.find((i) => i.id === activeId) ?? null;

  // Items with a sourced area AND a confirmed pin position — the same
  // `items` array the list view uses, just filtered to what's placeable.
  // Grouped by area so each area gets its own schematic map panel.
  const byArea = new Map<string, AreaMapPin[]>();
  for (const item of items) {
    if (!item.area || item.x === undefined || item.y === undefined) continue;
    const pin: AreaMapPin = {
      id: item.id,
      x: item.x,
      y: item.y,
      label: `${item.name} — ${item.habitat ?? habitatUnknownLabel}`,
      category: 'pokemon',
    };
    const list = byArea.get(item.area);
    if (list) list.push(pin);
    else byArea.set(item.area, [pin]);
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-destructive/70 bg-card shadow-sm">
      {/* Device top bar — a small nod to the game's own Pokédex device chrome
          (colored status dots, rounded red frame) without pretending to be
          a pixel-perfect recreation of it. */}
      <div className="flex items-center gap-2 bg-destructive/90 px-4 py-2.5">
        <span className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive-foreground/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <span className="font-display text-sm font-semibold tracking-wide text-destructive-foreground">
          {deviceTitle}
        </span>
      </div>

      <div className="p-4">
        <ProgressBar done={done} total={items.length} label={progressLabel} />
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <ViewToggle
            view={view}
            onChange={setView}
            listLabel={listLabel}
            mapLabel={mapLabel}
            groupLabel={viewGroupLabel}
          />
          {view === 'list' && (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="min-w-[160px] flex-1 rounded-full border border-border bg-muted px-3 py-1.5 font-mono text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          )}
        </div>

        {view === 'map' ? (
          <div>
            <p className="mb-4 text-xs text-muted-foreground">{mapNote}</p>
            {[...byArea.entries()].map(([area, pins]) => (
              <AreaMap
                key={area}
                areaTitle={area}
                pins={pins}
                checked={checked}
                onToggle={pokedexStore.toggle}
                checkedSuffix={checkedSuffix}
                uncheckedSuffix={uncheckedSuffix}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Detail readout — shows the hovered/focused entry's full info,
                same role the game device's "selected species" panel plays,
                instead of cramming name/habitat/types into every tile. */}
            <div className="mb-4 min-h-[3.25rem] rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
              {activeItem ? (
                <>
                  <span className="mr-2 font-mono text-xs text-primary">
                    {numberLabel(activeItem)}
                  </span>
                  <span className="font-semibold">{activeItem.name}</span>
                  <span className="ml-2 inline-flex gap-1 align-middle">
                    {activeItem.types.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${typeBadgeClass(t)}`}
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {activeItem.habitat ?? habitatUnknownLabel}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">{hoverHintLabel}</span>
              )}
            </div>

            {gens.map((gen) => (
              <div key={gen} className="mb-6">
                <h2 className="mb-2 font-display text-sm font-semibold tracking-wide text-muted-foreground">
                  {genLabel} {gen}
                </h2>
                <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                  {filtered
                    .filter((i) => i.generation === gen)
                    .map((item) => (
                      <span
                        key={item.id}
                        onMouseEnter={() => setActiveId(item.id)}
                        onMouseLeave={() => setActiveId((cur) => (cur === item.id ? null : cur))}
                        onFocus={() => setActiveId(item.id)}
                        onBlur={() => setActiveId((cur) => (cur === item.id ? null : cur))}
                      >
                        <PokedexTile
                          checked={checked.has(item.id)}
                          onToggle={() => pokedexStore.toggle(item.id)}
                          name={item.name}
                          nationalNumber={item.nationalNumber}
                          numberLabel={numberLabel(item)}
                          types={item.types}
                        />
                      </span>
                    ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
