import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { collectiblesStore } from '@/stores/checklist';
import ProgressBar from './ProgressBar';
import ChecklistItem from './ChecklistItem';
import ViewToggle, { type ChecklistView } from './ViewToggle';
import AreaMap, { type AreaMapPin } from './AreaMap';

interface CollectibleItem {
  id: string;
  category: string;
  name: string;
  area: string;
  note?: string;
  x?: number;
  y?: number;
}

interface Props {
  items: CollectibleItem[];
  progressLabel: string;
  categoryLabels: Record<string, string>;
  listLabel?: string;
  mapLabel?: string;
  viewGroupLabel?: string;
  mapNote?: string;
  checkedSuffix?: string;
  uncheckedSuffix?: string;
}

const PIN_CATEGORIES = new Set(['artifact', 'record', 'photo']);

export default function CollectiblesChecklist({
  items,
  progressLabel,
  categoryLabels,
  listLabel = 'List',
  mapLabel = 'Map',
  viewGroupLabel = 'View',
  mapNote = '',
  checkedSuffix = 'checked off the list',
  uncheckedSuffix = 'not yet checked off',
}: Props) {
  const checked = useStore(collectiblesStore.$checked);
  const [view, setView] = useState<ChecklistView>('list');
  const done = items.filter((i) => checked.has(i.id)).length;

  const categories = [...new Set(items.map((i) => i.category))];

  // Same `items` array as the list view, filtered to entries whose `area` is
  // a real, confirmed location (not one of the "not specified"/"not
  // area-specific" placeholder strings) AND has a pin position.
  const byArea = new Map<string, AreaMapPin[]>();
  for (const item of items) {
    if (item.x === undefined || item.y === undefined) continue;
    if (!PIN_CATEGORIES.has(item.category)) continue;
    const pin: AreaMapPin = {
      id: item.id,
      x: item.x,
      y: item.y,
      label: item.note ? `${item.name} — ${item.note}` : item.name,
      category: item.category as AreaMapPin['category'],
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
              onToggle={collectiblesStore.toggle}
              checkedSuffix={checkedSuffix}
              uncheckedSuffix={uncheckedSuffix}
            />
          ))}
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-wide text-muted-foreground">
              {categoryLabels[cat] ?? cat}
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {items
                .filter((i) => i.category === cat)
                .map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <ChecklistItem
                      key={item.id}
                      checked={isChecked}
                      onToggle={() => collectiblesStore.toggle(item.id)}
                    >
                      {item.name}
                      <span className="ml-1.5 text-xs text-muted-foreground">— {item.area}</span>
                      {item.note ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {item.note}
                        </span>
                      ) : null}
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
