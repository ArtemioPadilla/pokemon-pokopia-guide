import AreaMapBackground from './AreaMapBackground';
import { getAreaMapKey } from '@/lib/areaMapKey';

export interface AreaMapPin {
  id: string;
  x: number;
  y: number;
  /** Full accessible description of the item ITSELF (name + location detail),
   * matching what the equivalent list-view checkbox's accessible name says —
   * checked state is appended separately so callers don't have to know
   * which state string applies. */
  label: string;
  category: 'pokemon' | 'artifact' | 'record' | 'photo';
}

interface Props {
  areaTitle: string;
  pins: AreaMapPin[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  checkedSuffix: string;
  uncheckedSuffix: string;
}

// Category → color token + shape, so a pin reads as "what kind of thing is
// this" without relying on color alone (WCAG: color is never the only
// differentiator — shape carries the same information for anyone who can't
// distinguish the hues).
const CATEGORY_COLOR: Record<AreaMapPin['category'], string> = {
  pokemon: 'var(--primary)',
  artifact: 'var(--chart-3)',
  record: 'var(--chart-2)',
  photo: 'var(--chart-5)',
};
const CATEGORY_SHAPE: Record<AreaMapPin['category'], string> = {
  pokemon: 'rounded-full',
  artifact: 'rounded-[3px] rotate-45',
  record: 'rounded-[3px]',
  photo: 'rounded-full ring-2 ring-inset ring-[color:var(--card)]',
};

/**
 * One area's schematic map: the hand-authored SVG background plus
 * absolutely-positioned pin buttons at each pinned item's x/y percentage.
 * Pins read AND write the exact same checklist store the list-view
 * checkboxes use (`checked`/`onToggle` are passed straight through from the
 * caller's `pokedexStore`/`collectiblesStore` — no separate state here), so
 * toggling a pin and toggling the matching checkbox are the same action.
 */
export default function AreaMap({
  areaTitle,
  pins,
  checked,
  onToggle,
  checkedSuffix,
  uncheckedSuffix,
}: Props) {
  const areaKey = getAreaMapKey(areaTitle);

  return (
    <div className="panel mb-6 p-4" style={{ ['--panel-accent' as string]: 'var(--primary)' }}>
      <h3 className="mb-3 font-display text-sm font-bold text-foreground">{areaTitle}</h3>
      <div
        className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
        style={{ aspectRatio: '16 / 11' }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <AreaMapBackground areaKey={areaKey} />
        </svg>
        {pins.map((pin) => {
          const isChecked = checked.has(pin.id);
          const color = CATEGORY_COLOR[pin.category];
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => onToggle(pin.id)}
              aria-pressed={isChecked}
              aria-label={`${pin.label} — ${isChecked ? checkedSuffix : uncheckedSuffix}`}
              title={pin.label}
              className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 shadow-sm transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${CATEGORY_SHAPE[pin.category]}`}
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                borderColor: color,
                backgroundColor: isChecked ? color : 'var(--card)',
              }}
            >
              {isChecked ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className={`h-3 w-3 ${pin.category === 'artifact' ? '-rotate-45' : ''}`}
                >
                  <path
                    d="M3 8.5 L6.5 12 L13 4"
                    fill="none"
                    stroke="var(--card)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
