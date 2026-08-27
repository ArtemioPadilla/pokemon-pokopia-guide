import { useStore } from '@nanostores/react';
import { collectiblesStore } from '@/stores/checklist';
import ProgressBar from './ProgressBar';
import ChecklistItem from './ChecklistItem';

interface CollectibleItem {
  id: string;
  category: string;
  name: string;
  area: string;
  note?: string;
}

interface Props {
  items: CollectibleItem[];
  progressLabel: string;
  categoryLabels: Record<string, string>;
}

export default function CollectiblesChecklist({ items, progressLabel, categoryLabels }: Props) {
  const checked = useStore(collectiblesStore.$checked);
  const done = items.filter((i) => checked.has(i.id)).length;

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div>
      <ProgressBar done={done} total={items.length} label={progressLabel} />
      {categories.map((cat) => (
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
      ))}
    </div>
  );
}
