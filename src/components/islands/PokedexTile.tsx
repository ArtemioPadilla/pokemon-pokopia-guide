import { withBase } from '@/lib/href';
import { typeColorVar } from '@/lib/pokemonTypes';

interface Props {
  checked: boolean;
  onToggle: () => void;
  name: string;
  nationalNumber: number;
  numberLabel: string;
  types: string[];
}

/** One Pokédex grid tile: silhouette until registered, full color once
 * checked off — mirrors the reveal pattern of the game's own device UI
 * (grayscale unknown-species icon → colored sprite once seen) instead of
 * a plain text checklist row. */
export default function PokedexTile({
  checked,
  onToggle,
  name,
  nationalNumber,
  numberLabel,
  types,
}: Props) {
  return (
    <li>
      <label
        className={`group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border p-1 transition-colors ${
          checked
            ? 'border-primary/70 bg-primary/10'
            : 'border-border bg-card hover:border-primary/50'
        }`}
        title={name}
      >
        <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
        <img
          src={withBase(`/sprites/${nationalNumber}.png`)}
          alt=""
          loading="lazy"
          width={96}
          height={96}
          className={`h-3/5 w-3/5 object-contain transition-[filter,opacity] duration-200 ${
            checked ? 'opacity-100' : 'opacity-90 brightness-0 contrast-200 dark:invert'
          }`}
        />
        <span className="sr-only">{name}</span>
        <span className="font-mono text-[8px] leading-none text-muted-foreground sm:text-[9px]">
          {numberLabel}
        </span>
        {types.length > 0 && (
          <span className="absolute right-1 top-1 flex gap-0.5">
            {types.slice(0, 2).map((t) => (
              <span
                key={t}
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full ring-1 ring-card"
                style={{ background: `var(${typeColorVar(t)})` }}
              />
            ))}
          </span>
        )}
        {checked && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
          >
            ✓
          </span>
        )}
      </label>
    </li>
  );
}
