import { useStore } from '@nanostores/react';
import { pokedexStore } from '@/stores/checklist';
import ProgressBar from './ProgressBar';
import ChecklistItem from './ChecklistItem';

interface PokedexItem {
  id: string;
  nationalNumber: number;
  pokopiaNumber?: number;
  name: string;
  types: string[];
  generation: number;
  habitat?: string;
}

interface Props {
  items: PokedexItem[];
  progressLabel: string;
  genLabel: string;
  habitatUnknownLabel: string;
}

export default function PokedexChecklist({
  items,
  progressLabel,
  genLabel,
  habitatUnknownLabel,
}: Props) {
  const checked = useStore(pokedexStore.$checked);
  const done = items.filter((i) => checked.has(i.id)).length;

  const gens = [...new Set(items.map((i) => i.generation))].sort((a, b) => a - b);

  return (
    <div>
      <ProgressBar done={done} total={items.length} label={progressLabel} />
      {gens.map((gen) => (
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
                    </span>
                    {item.name}
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      ({item.types.join('/')})
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {item.habitat ?? habitatUnknownLabel}
                    </span>
                  </ChecklistItem>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}
