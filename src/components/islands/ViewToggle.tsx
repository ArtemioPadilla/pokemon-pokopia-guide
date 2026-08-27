export type ChecklistView = 'list' | 'map';

interface Props {
  view: ChecklistView;
  onChange: (view: ChecklistView) => void;
  listLabel: string;
  mapLabel: string;
  groupLabel: string;
}

/** Shared List/Map segmented toggle for PokedexChecklist and
 * CollectiblesChecklist — purely local UI state in the parent, both views
 * read the same underlying `items` array and the same store. */
export default function ViewToggle({ view, onChange, listLabel, mapLabel, groupLabel }: Props) {
  const btn = (active: boolean) =>
    `rounded-full px-3 py-1.5 font-mono text-xs transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="mb-4 inline-flex gap-1 rounded-full border border-border bg-muted p-1"
    >
      <button
        type="button"
        aria-pressed={view === 'list'}
        onClick={() => onChange('list')}
        className={btn(view === 'list')}
      >
        {listLabel}
      </button>
      <button
        type="button"
        aria-pressed={view === 'map'}
        onClick={() => onChange('map')}
        className={btn(view === 'map')}
      >
        {mapLabel}
      </button>
    </div>
  );
}
