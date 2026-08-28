import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { pokedexStore } from '@/stores/checklist';
import ProgressBar from './ProgressBar';
import ChecklistItem from './ChecklistItem';
import ViewToggle, { type ChecklistView } from './ViewToggle';
import AreaMap, { type AreaMapPin } from './AreaMap';
import { typeBadgeClass } from '@/lib/pokemonTypes';

interface PokedexItem {
  id: string;
  nationalNumber: number;
  pokopiaNumber?: number;
  basinNumber?: number;
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
  genLabel: string;
  habitatUnknownLabel: string;
  listLabel?: string;
  mapLabel?: string;
  viewGroupLabel?: string;
  mapNote?: string;
  checkedSuffix?: string;
  uncheckedSuffix?: string;
}

export default function PokedexChecklist({
  items,
  progressLabel,
  genLabel,
  habitatUnknownLabel,
  listLabel = 'List',
  mapLabel = 'Map',
  viewGroupLabel = 'View',
  mapNote = '',
  checkedSuffix = 'checked off the list',
  uncheckedSuffix = 'not yet checked off',
}: Props) {
  const checked = useStore(pokedexStore.$checked);
  const [view, setView] = useState<ChecklistView>('list');
  const done = items.filter((i) => checked.has(i.id)).length;

  const gens = [...new Set(items.map((i) => i.generation))].sort((a, b) => a - b);

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
    <div>
      <ProgressBar done={done} total={items.length} label={progressLabel} />
      <ViewToggle
        view={view}
        onChange={setView}
        listLabel={listLabel}
        mapLabel={mapLabel}
        groupLabel={viewGroupLabel}
      />
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
        gens.map((gen) => (
          <div key={gen} className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-wide text-muted-foreground">
              {genLabel} {gen}
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items
                .filter((i) => i.generation === gen)
                .map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <ChecklistItem
                      key={item.id}
                      checked={isChecked}
                      onToggle={() => pokedexStore.toggle(item.id)}
                    >
                      <span className="mr-1.5 font-mono text-xs text-primary">
                        #{String(item.nationalNumber).padStart(3, '0')}
                        {item.pokopiaNumber ? ` · Pokopia #${item.pokopiaNumber}` : ''}
                        {item.basinNumber ? ` · Basin #${item.basinNumber}` : ''}
                      </span>
                      {item.name}
                      <span className="ml-1.5 inline-flex gap-1 align-middle">
                        {item.types.map((t) => (
                          <span
                            key={t}
                            className={`rounded-full border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${typeBadgeClass(t)}`}
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.habitat ?? habitatUnknownLabel}
                      </span>
                    </ChecklistItem>
                  );
                })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
