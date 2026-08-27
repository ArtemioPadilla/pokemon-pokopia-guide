import { useStore } from '@nanostores/react';
import {
  pokedexStore,
  collectiblesStore,
  $currentArea,
  setCurrentArea,
  resetCurrentArea,
} from '@/stores/checklist';
import ProgressBar from './ProgressBar';

interface AreaOption {
  id: string;
  title: string;
}

interface Props {
  totalPokedex: number;
  totalCollectibles: number;
  areas: AreaOption[];
  pokedexLabel: string;
  collectiblesLabel: string;
  areaLabel: string;
  resetLabel: string;
  resetConfirmMessage: string;
}

export default function HomeProgress({
  totalPokedex,
  totalCollectibles,
  areas,
  pokedexLabel,
  collectiblesLabel,
  areaLabel,
  resetLabel,
  resetConfirmMessage,
}: Props) {
  const pokedexChecked = useStore(pokedexStore.$checked);
  const collectiblesChecked = useStore(collectiblesStore.$checked);
  const current = useStore($currentArea);

  function handleReset() {
    if (!window.confirm(resetConfirmMessage)) return;
    pokedexStore.reset();
    collectiblesStore.reset();
    resetCurrentArea();
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {pokedexLabel}
          </p>
          <ProgressBar done={pokedexChecked.size} total={totalPokedex} label={pokedexLabel} />
        </div>
        <div>
          <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {collectiblesLabel}
          </p>
          <ProgressBar
            done={collectiblesChecked.size}
            total={totalCollectibles}
            label={collectiblesLabel}
          />
        </div>
      </div>
      <div className="mt-1">
        <label
          htmlFor="current-area"
          className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted-foreground"
        >
          {areaLabel}
        </label>
        <select
          id="current-area"
          value={current ?? ''}
          onChange={(e) => setCurrentArea(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="" disabled>
            —
          </option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={handleReset}
        className="mt-4 font-mono text-xs text-muted-foreground underline decoration-dotted transition-colors hover:text-destructive"
      >
        {resetLabel}
      </button>
    </div>
  );
}
