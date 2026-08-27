// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AreaMap, { type AreaMapPin } from './AreaMap';

const pins: AreaMapPin[] = [
  { id: 'poke-001', x: 32, y: 58, label: 'Bulbasaur — Straw Bed', category: 'pokemon' },
  {
    id: 'col-rec-01',
    x: 20,
    y: 70,
    label: 'Road Closure Announcement — Newspaper',
    category: 'record',
  },
];

describe('AreaMap', () => {
  it('renders a decorative, aria-hidden background and a button pin per item', () => {
    const { container } = render(
      <AreaMap
        areaTitle="Withered Wasteland"
        pins={pins}
        checked={new Set()}
        onToggle={vi.fn()}
        checkedSuffix="checked off the list"
        uncheckedSuffix="not yet checked off"
      />,
    );

    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(pins.length);
  });

  it('gives every pin an aria-label combining its location text and checked state', () => {
    render(
      <AreaMap
        areaTitle="Withered Wasteland"
        pins={pins}
        checked={new Set(['poke-001'])}
        onToggle={vi.fn()}
        checkedSuffix="checked off the list"
        uncheckedSuffix="not yet checked off"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Bulbasaur — Straw Bed — checked off the list' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', {
        name: 'Road Closure Announcement — Newspaper — not yet checked off',
      }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it("clicking a pin calls onToggle with that pin's id — the same id the list checkbox uses", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <AreaMap
        areaTitle="Withered Wasteland"
        pins={pins}
        checked={new Set()}
        onToggle={onToggle}
        checkedSuffix="checked off the list"
        uncheckedSuffix="not yet checked off"
      />,
    );

    await user.click(screen.getByRole('button', { name: /Bulbasaur/ }));
    expect(onToggle).toHaveBeenCalledWith('poke-001');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('falls back to a generic background for an area with no bespoke illustration', () => {
    const { container } = render(
      <AreaMap
        areaTitle="Some Unmapped Area"
        pins={[]}
        checked={new Set()}
        onToggle={vi.fn()}
        checkedSuffix="checked off the list"
        uncheckedSuffix="not yet checked off"
      />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
