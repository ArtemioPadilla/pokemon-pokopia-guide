import { useStore } from '@nanostores/react';
import { $currentArea, setCurrentArea } from '@/stores/checklist';

interface Props {
  areaId: string;
  label: string;
  currentLabel: string;
}

export default function SetCurrentAreaButton({ areaId, label, currentLabel }: Props) {
  const current = useStore($currentArea);
  const isCurrent = current === areaId;

  return (
    <button
      type="button"
      onClick={() => {
        if (!isCurrent) setCurrentArea(areaId);
      }}
      // aria-disabled (not the `disabled` attribute): "current area" is
      // persistent state, not a momentarily-inert control, and `disabled`
      // removes the button from the tab order and drops keyboard focus to
      // <body> the instant it's set — right after the user just activated
      // it. aria-disabled keeps it focusable; the click handler no-ops instead.
      aria-disabled={isCurrent}
      className="rounded-full border border-primary/50 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary/10 aria-disabled:cursor-default aria-disabled:bg-primary/10"
    >
      {isCurrent ? currentLabel : label}
    </button>
  );
}
